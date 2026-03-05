import { useRecoilState } from "recoil";
import {
	createSubconfig,
	deleteSubconfig,
	getSubconfig,
} from "../../api/routes/route.configs";
import {
	createPaidOptionConfigSubconfig,
	deletePaidOptionConfigSubconfig,
	getPaidOptionConfigSubconfig,
} from "../../api/routes/route.paid-options";
import { MSG } from "../../shared/constants";
import parseConnectionUrl from "../../shared/parseConnectionUrl";
import { getProxyState } from "../state/selectors";

const PROXY_PROTOCOL = "http";

/**
 * Hook for managing proxy connection lifecycle.
 * Handles connecting, disconnecting, and restoring proxy state via the background service worker.
 * @returns {{ proxyState: object, connect: (config: object) => Promise<object>, disconnect: () => Promise<void>, restoreStatus: () => Promise<void> }}
 */
const useProxyConnection = () => {
	const [proxyState, setProxyState] = useRecoilState(getProxyState);

	/**
	 * Fetch the existing proxy subconfig for a config.
	 * @param {{ id: number, source: string, optionId?: number }} config
	 * @returns {Promise<import("axios").AxiosResponse|null>}
	 */
	const fetchSubconfig = async (config) => {
		if (config.source === "config") {
			return getSubconfig(config.id);
		}

		if (config.source === "paid_option") {
			return getPaidOptionConfigSubconfig(config.optionId, config.id);
		}

		return null;
	};

	/**
	 * Delete the existing subconfig for a config.
	 * @param {{ id: number, source: string, optionId?: number }} config
	 */
	const removeSubconfig = async (config) => {
		if (config.source === "config") {
			return deleteSubconfig(config.id);
		}

		if (config.source === "paid_option") {
			return deletePaidOptionConfigSubconfig(config.optionId, config.id);
		}

		return null;
	};

	/**
	 * Create a new proxy subconfig for a config.
	 * @param {{ id: number, source: string, optionId?: number }} config
	 * @returns {Promise<import("axios").AxiosResponse|null>}
	 */
	const createNewSubconfig = async (config) => {
		if (config.source === "config") {
			return createSubconfig(config.id, { protocol: PROXY_PROTOCOL });
		}

		if (config.source === "paid_option") {
			return createPaidOptionConfigSubconfig(config.optionId, config.id, {
				protocol: PROXY_PROTOCOL,
			});
		}

		return null;
	};

	/**
	 * Ensure a proxy connection URL exists for the config.
	 * Creates a subconfig if needed, replaces if wrong protocol.
	 * @param {object} config - Normalized proxy item
	 * @returns {Promise<string|null>} Connection URL or null on failure
	 */
	const ensureProxy = async (config) => {
		if (config.source === "cloud") {
			return config.proxyUrl ?? null;
		}

		const subRes = await fetchSubconfig(config);

		if (subRes?.data?.status && subRes.data.data) {
			const existing = subRes.data.data;

			if (existing.protocol === PROXY_PROTOCOL) {
				return existing.connection_url ?? null;
			}

			try {
				await removeSubconfig(config);
			} catch (err) {
				console.error("Failed to remove subconfig:", err);
			}
		}

		const createRes = await createNewSubconfig(config);

		if (createRes?.data?.status) {
			return createRes.data.data?.connection_url ?? null;
		}

		return null;
	};

	/**
	 * Connect to a proxy config. Auto-creates subconfig if needed.
	 * @param {object} config - Normalized proxy item from useProxyList
	 * @returns {Promise<{ success: boolean }>}
	 */
	const connect = async (config) => {
		const connectionUrl = await ensureProxy(config);

		if (!connectionUrl) {
			throw new Error("Не удалось получить прокси");
		}

		const credentials = parseConnectionUrl(connectionUrl);

		if (!credentials.host || !credentials.port)
			throw new Error("Invalid connection URL");

		const response = await chrome.runtime.sendMessage({
			type: MSG.PROXY_CONNECT,
			credentials: { ...credentials, protocol: config.protocol || "http" },
			configMeta: {
				id: config.id,
				title: config.title,
				source: config.source,
				locationId: config.locationId,
				locationTitle: config.locationTitle,
				locationCode: config.locationCode,
				optionId: config.optionId,
				serverId: config.serverId,
			},
		});

		if (!response?.success) {
			throw new Error(response?.error || "Не удалось подключиться");
		}

		setProxyState((prev) => ({
			...prev,
			connected: true,
			credentials,
			connectedConfigId: config.id,
			connectedConfigTitle: config.title,
			connectedSource: config.source,
			connectedLocationId: config.locationId,
		}));

		return response;
	};

	/**
	 * Disconnect from the current proxy.
	 */
	const disconnect = async () => {
		await chrome.runtime.sendMessage({ type: MSG.PROXY_DISCONNECT });

		setProxyState((prev) => ({
			...prev,
			connected: false,
			credentials: null,
			connectedConfigId: null,
			connectedConfigTitle: null,
			connectedSource: null,
			connectedLocationId: null,
		}));
	};

	/**
	 * Restore proxy state from the background service worker.
	 * Called on popup open to sync UI with actual connection state.
	 */
	const restoreStatus = async () => {
		const status = await chrome.runtime.sendMessage({
			type: MSG.PROXY_STATUS,
		});

		if (status?.connected && status.configMeta) {
			setProxyState((prev) => ({
				...prev,
				connected: true,
				connectedConfigId: status.configMeta.id,
				connectedConfigTitle: status.configMeta.title,
				connectedSource: status.configMeta.source,
				connectedLocationId: status.configMeta.locationId,
			}));
		} else {
			setProxyState((prev) => ({
				...prev,
				connected: false,
				connectedConfigId: null,
				connectedConfigTitle: null,
				connectedSource: null,
				connectedLocationId: null,
			}));
		}
	};

	return { proxyState, connect, disconnect, restoreStatus };
};

export default useProxyConnection;
