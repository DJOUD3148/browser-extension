/**
 * Convert an ISO 3166-1 alpha-2 country code to its emoji flag.
 * @param {string} code - Two-letter country code (e.g. "US", "DE")
 * @returns {string} Emoji flag or globe emoji if code is invalid
 */
const countryCodeToEmoji = (code) => {
	if (!code || code.length !== 2) return "\u{1F310}";

	const upper = code.toUpperCase();

	return String.fromCodePoint(
		...Array.from(upper).map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
	);
};

export default countryCodeToEmoji;
