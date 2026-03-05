import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getConfigs as getConfigsApi } from "../../api/routes/route.configs";
import { getCloudServers as getCloudServersApi } from "../../api/routes/route.cloud-servers";
import { getLocations as getLocationsApi } from "../../api/routes/route.locations";
import { getPaidOptions as getPaidOptionsApi } from "../../api/routes/route.paid-options";
import { getProfile as getProfileApi } from "../../api/routes/route.profile";
import { getCloudServerProxies } from "../../api/routes/route.proxies";
import {
	getCloudServers,
	getConfigs,
	getLocations,
	getPaidOptions,
	getProfileData,
} from "../state/selectors";

/**
 * Hook for loading all API resources in parallel on popup open.
 * Fetches configs, paid options, cloud servers (with proxies), locations, and profile.
 * Retries once on failure without disrupting an active proxy connection.
 * @returns {{ loading: boolean, error: string|null, reload: () => Promise<void> }}
 */
const useLoadResources = () => {
	const [configs, setConfigs] = useRecoilState(getConfigs);

	const setPaidOptions = useSetRecoilState(getPaidOptions);

	const setCloudServers = useSetRecoilState(getCloudServers);

	const setLocations = useSetRecoilState(getLocations);

	const locationsData = useRecoilValue(getLocations);

	const setProfile = useSetRecoilState(getProfileData);

	const hasData = configs !== null && locationsData !== null;

	const [loading, setLoading] = useState(!hasData);

	const [error, setError] = useState(null);

	const fetchAll = async () => {
		const [configsRes, optionsRes, serversRes, locationsRes, profileRes] =
			await Promise.all([
				getConfigsApi(),
				getPaidOptionsApi(),
				getCloudServersApi(),
				getLocationsApi(),
				getProfileApi().catch(() => ({ data: { status: false } })),
			]);

		const locationsResult = locationsRes.data?.data ?? [];

		setLocations(locationsResult);
		setConfigs(configsRes.data?.data ?? []);
		setPaidOptions(optionsRes.data?.data ?? []);

		if (profileRes.data?.status) setProfile(profileRes.data.data);

		const serversData = serversRes.data?.data ?? [];

		const serversWithProxies = await Promise.all(
			serversData.map(async (server) => {
				try {
					const proxiesRes = await getCloudServerProxies(server.id);

					return {
						...server,
						proxies: proxiesRes.data?.data ?? [],
					};
				} catch {
					return { ...server, proxies: [] };
				}
			}),
		);

		setCloudServers(serversWithProxies);
	};

	const loadIdRef = useRef(0);

	const loadData = async () => {
		const currentId = ++loadIdRef.current;

		try {
			setError(null);
			setLoading(true);

			await fetchAll();
		} catch (err) {
			if (loadIdRef.current !== currentId) return;

			console.error("Failed to load resources:", err);

			try {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				await fetchAll();
			} catch (retryErr) {
				if (loadIdRef.current !== currentId) return;

				console.error("Retry failed:", retryErr);
				setError(retryErr.message ?? "Ошибка загрузки");
			}
		} finally {
			if (loadIdRef.current === currentId) setLoading(false);
		}
	};

	useEffect(() => {
		if (hasData) return;

		loadData();
	}, []);

	return { loading, error, reload: loadData };
};

export default useLoadResources;
