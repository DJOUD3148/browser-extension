import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import crx3 from "crx3";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = resolve(ROOT, "dist");
const RELEASE = resolve(ROOT, "release");
const KEY_PATH = resolve(ROOT, "key.pem");

const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
const version = pkg.version;

if (!existsSync(RELEASE)) mkdirSync(RELEASE, { recursive: true });

const buildZip = (browser) => {
	const dir = resolve(DIST, browser);

	if (!existsSync(dir)) {
		console.error(
			`dist/${browser}/ not found — run "npm run build:${browser}" first`,
		);
		process.exit(1);
	}

	const zipName = `stealthsurf-${browser}-v${version}.zip`;
	const zipPath = resolve(RELEASE, zipName);

	if (existsSync(zipPath)) unlinkSync(zipPath);

	execSync(`cd "${dir}" && zip -r "${zipPath}" .`, { stdio: "inherit" });
	console.log(`  ZIP: release/${zipName}`);
};

const buildXpi = () => {
	const dir = resolve(DIST, "firefox");

	if (!existsSync(dir)) {
		console.error(
			"dist/firefox/ not found — run 'npm run build:firefox' first",
		);
		process.exit(1);
	}

	const xpiName = `stealthsurf-firefox-v${version}.xpi`;
	const xpiPath = resolve(RELEASE, xpiName);

	if (existsSync(xpiPath)) unlinkSync(xpiPath);

	execSync(`cd "${dir}" && zip -r "${xpiPath}" .`, { stdio: "inherit" });
	console.log(`  XPI: release/${xpiName}`);
};

const buildCrx = async () => {
	const dir = resolve(DIST, "chrome");

	if (!existsSync(dir)) {
		console.error("dist/chrome/ not found — run 'npm run build:chrome' first");
		process.exit(1);
	}

	if (!existsSync(KEY_PATH)) {
		console.log("  Generating new private key (key.pem)...");
		execSync(`openssl genrsa -out "${KEY_PATH}" 2048`, { stdio: "inherit" });
		console.log(
			"  IMPORTANT: Save key.pem securely! Losing it means losing your extension ID.",
		);
	}

	const crxName = `stealthsurf-chrome-v${version}.crx`;
	const crxPath = resolve(RELEASE, crxName);

	await crx3([dir], {
		keyPath: KEY_PATH,
		crxPath,
	});

	console.log(`  CRX: release/${crxName}`);
};

const target = process.argv[2];

console.log(`\nPacking StealthSurf VPN v${version}...\n`);

if (target === "zip" || target === "all") {
	console.log("[Chrome ZIP]");
	buildZip("chrome");
	console.log("[Firefox ZIP]");
	buildZip("firefox");
}

if (target === "xpi" || target === "all") {
	console.log("[Firefox XPI]");
	buildXpi();
}

if (target === "crx" || target === "all") {
	console.log("[Chrome CRX]");
	await buildCrx();
}

if (!target || !["zip", "crx", "xpi", "all"].includes(target)) {
	console.log("Usage: node scripts/pack.mjs <zip|crx|xpi|all>");
	console.log("  zip  — Create ZIP archives for Chrome and Firefox");
	console.log("  xpi  — Create XPI for Firefox (for self-hosted distribution)");
	console.log(
		"  crx  — Create signed CRX for Chrome (generates key.pem if missing)",
	);
	console.log("  all  — Create ZIP, XPI, and CRX");
	process.exit(1);
}

console.log("\nDone!\n");
