import React from "react";

/**
 * Get a colored ping label for display.
 * Thresholds: ≤100ms green, ≤200ms orange, >200ms red.
 * @param {number|null} ping - Ping in milliseconds
 * @returns {JSX.Element|null} Colored span element or null
 */
const getPingLabel = (ping) => {
	if (ping == null) return null;

	const className =
		ping <= 100
			? "ext-text--positive"
			: ping <= 200
				? "ext-text--warning"
				: "ext-text--negative";

	return <span className={className}>{ping} мс</span>;
};

export default getPingLabel;
