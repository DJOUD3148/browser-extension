import { NETWORK } from "../api.instance";

/** @returns {Promise<import("axios").AxiosResponse>} List of available server locations */
export const getLocations = () => NETWORK.get("locations");
