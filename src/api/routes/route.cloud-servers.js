import { NETWORK } from "../api.instance";

/** @returns {Promise<import("axios").AxiosResponse>} List of user cloud servers */
export const getCloudServers = () => NETWORK.get("cloud-servers");
