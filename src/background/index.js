import { initAuthManager } from "./authManager";
import { handleMessage } from "./messageHandler";
import { initProxyManager } from "./proxyManager";

let initPromise = null;

const ensureInit = () => {
	if (!initPromise) {
		initPromise = Promise.all([initAuthManager(), initProxyManager()]).catch(
			(err) => {
				console.error("Init failed:", err);
				initPromise = null;
				throw err;
			},
		);
	}
	return initPromise;
};

ensureInit();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	ensureInit()
		.then(() => handleMessage(message, sender, sendResponse))
		.catch((err) => sendResponse({ error: err.message }));
	return true;
});
