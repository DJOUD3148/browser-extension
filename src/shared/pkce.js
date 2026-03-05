/**
 * Generate cryptographically random bytes.
 * @param {number} length - Number of random bytes
 * @returns {Uint8Array} Random byte array
 */
const generateRandomBytes = (length) => {
	const array = new Uint8Array(length);

	crypto.getRandomValues(array);

	return array;
};

/**
 * Encode a buffer as a URL-safe Base64 string (no padding).
 * @param {ArrayBuffer} buffer - Buffer to encode
 * @returns {string} Base64url-encoded string
 */
const base64UrlEncode = (buffer) =>
	btoa(String.fromCharCode(...new Uint8Array(buffer)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");

/**
 * Generate a PKCE code verifier (43-128 character random string).
 * @returns {string} Base64url-encoded code verifier
 */
export const generateCodeVerifier = () =>
	base64UrlEncode(generateRandomBytes(32));

/**
 * Generate a PKCE code challenge from a code verifier using SHA-256.
 * @param {string} verifier - Code verifier string
 * @returns {Promise<string>} Base64url-encoded SHA-256 hash
 */
export const generateCodeChallenge = async (verifier) => {
	const encoder = new TextEncoder();

	const data = encoder.encode(verifier);

	const digest = await crypto.subtle.digest("SHA-256", data);

	return base64UrlEncode(digest);
};
