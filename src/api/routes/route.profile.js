import { NETWORK } from "../api.instance";

/** @returns {Promise<import("axios").AxiosResponse>} User profile data */
export const getProfile = () => NETWORK.get("profile");
