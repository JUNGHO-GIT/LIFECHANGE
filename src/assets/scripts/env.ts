/**
 * @file env.ts
 * @description dotenv 로딩 유틸 (development/production 분리)
 * @author Jungho
 * @since 2025-12-27
 */

import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

type EnvMode = `DEVELOPMENT` | `PRODUCTION` | ``;

const normalizeMode = (raw = ``): EnvMode => {
	const v = String(raw || ``).trim().toUpperCase();
	return v === `DEVELOPMENT` || v === `DEV` ? `DEVELOPMENT`
		: v === `PRODUCTION` || v === `PROD` ? `PRODUCTION`
			: ``;
};

export const resolveDotenvPath = () => {
	const override = String(process.env.DOTENV_PATH ?? ``).trim();
	if (override) {
		const abs = path.isAbsolute(override) ? override : path.resolve(process.cwd(), override);
		if (fs.existsSync(abs)) {
			return abs;
		}
	}

	const mode = normalizeMode(process.env.NODE_ENV);
	const devPath: string = path.resolve(process.cwd(), `.env.development`);
	const prodPath: string = path.resolve(process.cwd(), `.env.production`);
	const hasDev: boolean = fs.existsSync(devPath);
	const hasProd: boolean = fs.existsSync(prodPath);

	const abs: string = mode === `PRODUCTION` ? prodPath
		: mode === `DEVELOPMENT` ? devPath
			: (!hasDev && hasProd) ? prodPath
				: devPath;
	if (!fs.existsSync(abs)) {
		throw new Error(`dotenv file not found: ${abs}`);
	}
	return abs;
};

let loaded: boolean = false;
export const loadEnv = () => {
	if (loaded) {
		return;
	}

	const dotenvPath: string = resolveDotenvPath();
	dotenv.config({ path: dotenvPath });
	loaded = true;
};
