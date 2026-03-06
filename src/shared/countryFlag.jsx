import React from "react";

const flagModules = import.meta.glob("../assets/flags/*.webp", {
	eager: true,
	import: "default",
});

const flagMap = {};

for (const [path, url] of Object.entries(flagModules)) {
	const code = path.match(/\/([A-Z]{2})\.webp$/)?.[1];

	if (code) flagMap[code] = url;
}

const imgStyle = { objectFit: "contain", verticalAlign: "middle" };

const CountryFlag = ({ code, size = 24 }) => {
	if (!code) return <span style={{ fontSize: size }}>🌐</span>;

	const upper = code.toUpperCase();

	const src = flagMap[upper];

	if (!src) return <span style={{ fontSize: size }}>🌐</span>;

	return (
		<img src={src} alt={upper} width={size} height={size} style={imgStyle} />
	);
};

export default CountryFlag;
