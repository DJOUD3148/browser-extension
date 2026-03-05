/**
 * Get the current Unix timestamp in seconds.
 * @returns {number} Current time as Unix timestamp (seconds since epoch)
 */
const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

export default getCurrentTimestamp;
