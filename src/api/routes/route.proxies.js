import { NETWORK } from "../api.instance";

/**
 * @param {number} serverId - Cloud server ID
 * @returns {Promise<import("axios").AxiosResponse>} List of proxies for the server
 */
export const getCloudServerProxies = (serverId) =>
	NETWORK.get(`cloud-servers/${serverId}/proxies`);

/**
 * @param {number} serverId - Cloud server ID
 * @param {{ protocol: string }} data - Proxy parameters
 * @returns {Promise<import("axios").AxiosResponse>} Created proxy with connection_url
 */
export const createCloudServerProxy = (serverId, data) =>
	NETWORK.post(`cloud-servers/${serverId}/proxies`, data);
