import {
	connectChrome,
	disconnectChrome,
	getStatusChrome,
	reapplyChrome,
	restoreChrome,
} from "./proxyChrome";
import {
	connectFirefox,
	disconnectFirefox,
	getStatusFirefox,
	reapplyFirefox,
	restoreFirefox,
} from "./proxyFirefox";

const isFirefox =
	typeof globalThis.browser !== "undefined" &&
	typeof globalThis.browser?.proxy?.onRequest !== "undefined";

/**
 * Apply proxy settings using the appropriate browser API.
 * @param {{ host: string, port: string, user: string, pass: string }} credentials
 * @param {string} [badgeText] - Extension badge text
 */
export const connect = (credentials, badgeText) => {
	if (isFirefox) return connectFirefox(credentials, badgeText);
	return connectChrome(credentials, badgeText);
};

/**
 * Clear proxy settings and remove all listeners.
 */
export const disconnect = () => {
	if (isFirefox) return disconnectFirefox();
	return disconnectChrome();
};

/**
 * Get the current proxy connection state.
 * @returns {Promise<{ connected: boolean, host?: string, port?: string, user?: string, pass?: string }>}
 */
export const getStatus = () => {
	if (isFirefox) return getStatusFirefox();
	return getStatusChrome();
};

/**
 * Reapply proxy settings with current credentials (e.g. after split tunnel change).
 */
export const reapplyProxy = () => {
	if (isFirefox) return reapplyFirefox();
	return reapplyChrome();
};

/**
 * Update the extension badge text.
 * @param {string} text - Badge text (e.g. country code or empty string)
 */
export const updateBadge = (text) => {
	const api = isFirefox ? globalThis.browser?.browserAction : chrome.action;
	if (api?.setBadgeText) api.setBadgeText({ text: text || "" });
};

/**
 * Restore proxy connection from persisted state after service worker restart.
 */
export const initProxyManager = () => {
	if (isFirefox) return restoreFirefox();
	return restoreChrome();
};
