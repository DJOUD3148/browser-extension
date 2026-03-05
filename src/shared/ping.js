/**
 * Measure a single round-trip time to a server via XHR.
 * Resolves with RTT in milliseconds when response headers arrive.
 * @param {string} url - Hostname to ping (e.g. "ping.example.com")
 * @param {number} [timeout=3000] - Request timeout in milliseconds
 * @returns {Promise<number>} Round-trip time in milliseconds
 */
const measureOnce = (url, timeout = 3000) =>
	new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		const method = url.includes("4vps") ? "OPTIONS" : "GET";
		xhr.open(method, `https://${url}/ping?t=${Date.now()}`, true);
		xhr.timeout = timeout;

		const t0 = performance.now();

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 2) {
				const rtt = Math.round(performance.now() - t0);
				xhr.abort();
				resolve(rtt);
			}
		};
		xhr.onerror = () => reject(new Error("Network error"));
		xhr.ontimeout = () => reject(new Error("Timeout"));
		xhr.send();
	});

/**
 * Measure the best (minimum) round-trip time to a server.
 * Performs 1 warmup request + N measured attempts, returns the minimum RTT.
 * @param {string} baseUrl - Hostname to ping (e.g. "ping.example.com")
 * @param {number} [attempts=3] - Number of measured attempts after warmup
 * @returns {Promise<number|null>} Minimum RTT in milliseconds, or null if all attempts failed
 */
export const measureBest = async (baseUrl, attempts = 3) => {
	const times = [];

	try {
		await measureOnce(baseUrl);
	} catch {}

	for (let i = 0; i < attempts; i++) {
		try {
			times.push(await measureOnce(baseUrl));
		} catch {}
	}

	return times.length ? Math.min(...times) : null;
};
