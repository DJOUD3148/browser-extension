import { NETWORK } from "../api.instance";

/** @returns {Promise<import("axios").AxiosResponse>} List of user configs */
export const getConfigs = () => NETWORK.get("configs");

/**
 * @param {number} id - Config ID
 * @returns {Promise<import("axios").AxiosResponse>} proxy subconfig details
 */
export const getSubconfig = (id) => NETWORK.get(`configs/${id}/subconfig`);

/**
 * @param {number} id - Config ID
 * @param {{ protocol: string }} data - Subconfig parameters
 * @returns {Promise<import("axios").AxiosResponse>} Created subconfig with connection_url
 */
export const createSubconfig = (id, data) =>
	NETWORK.post(`configs/${id}/subconfig`, data);

/**
 * @param {number} id - Config ID
 * @returns {Promise<import("axios").AxiosResponse>} Deletion result
 */
export const deleteSubconfig = (id) =>
	NETWORK.delete(`configs/${id}/subconfig`);

/**
 * @param {number} id - Config ID
 * @param {{ location_id: string, protocol: string }} body - New settings
 * @returns {Promise<import("axios").AxiosResponse>} Updated config
 */
export const changeLocation = (id, body) =>
	NETWORK.patch(`configs/${id}/settings`, body);
