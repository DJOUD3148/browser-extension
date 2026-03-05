export const CLIENT_ID = "stealthsurf-proxy-extension";

export const MSG = {
	PROXY_CONNECT: "PROXY_CONNECT",
	PROXY_DISCONNECT: "PROXY_DISCONNECT",
	PROXY_STATUS: "PROXY_STATUS",
	AUTH_LOGIN: "AUTH_LOGIN",
	AUTH_GET_TOKENS: "AUTH_GET_TOKENS",
	AUTH_SET_TOKENS: "AUTH_SET_TOKENS",
	AUTH_CLEAR: "AUTH_CLEAR",
	AUTH_REFRESH: "AUTH_REFRESH",
	AUTH_FIREFOX_CODE: "AUTH_FIREFOX_CODE",
	UPDATE_PROXY_SETTINGS: "UPDATE_PROXY_SETTINGS",
	UPDATE_BADGE: "UPDATE_BADGE",
};

export const STORAGE_KEYS = {
	ACCESS_TOKEN: "access_token",
	REFRESH_TOKEN: "refresh_token",
	PROXY_STATE: "proxy_state",
	CONNECTED_CONFIG: "connected_config",
	PROXY_LIST_CACHE: "proxy_list_cache",
	PROXY_LIST_CACHE_TIME: "proxy_list_cache_time",
	PROXY_ALL_TRAFFIC: "proxy_all_traffic",
	SPLIT_TUNNEL_MODE: "split_tunnel_mode",
	SPLIT_TUNNEL_DOMAINS: "split_tunnel_domains",
	OAUTH_CODE_VERIFIER: "oauth_code_verifier",
	OAUTH_REDIRECT_URI: "oauth_redirect_uri",
	UPDATE_CHECK_CACHE: "update_check_cache",
};

export const CACHE_TTL_MS = 5 * 60 * 1000;
