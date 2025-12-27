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
	const v: string = String(raw || ``).trim().toUpperCase();
	return v === `DEVELOPMENT` || v === `DEV` ? `DEVELOPMENT`
		: v === `PRODUCTION` || v === `PROD` ? `PRODUCTION`
			: ``;
};

export const resolveDotenvPath = () => {
	const override: string = String(process.env.DOTENV_PATH ?? ``).trim();
	if (override) {
		const abs: string = path.isAbsolute(override) ? override : path.resolve(process.cwd(), override);
		if (fs.existsSync(abs)) {
			return abs;
		}
	}

	const globalMode: EnvMode = normalizeMode(process.env.GLOBAL_ENV) || normalizeMode(process.env.NODE_ENV);
	const devPath: string = path.resolve(process.cwd(), `.env.development`);
	const prodPath: string = path.resolve(process.cwd(), `.env.production`);
	const hasDev: boolean = fs.existsSync(devPath);
	const hasProd: boolean = fs.existsSync(prodPath);

	const abs: string = globalMode === `PRODUCTION` ? prodPath
		: globalMode === `DEVELOPMENT` ? devPath
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

	// 0. base .env 로딩 (GLOBAL_ENV 읽기 용도)
	// - GLOBAL_ENV를 기준으로 .env.development/.env.production 선택
	// - 기존 동작(NODE_ENV 기반)도 fallback으로 유지
	const basePath: string = path.resolve(process.cwd(), `.env`);
	const hasBase: boolean = fs.existsSync(basePath);
	hasBase && dotenv.config({ path: basePath, override: false });

	const dotenvPath: string = resolveDotenvPath();
	dotenv.config({ path: dotenvPath, override: true });

	const normalizedGlobal: EnvMode = normalizeMode(process.env.GLOBAL_ENV) || normalizeMode(process.env.NODE_ENV);
	normalizedGlobal && (process.env.NODE_ENV = normalizedGlobal);
	loaded = true;
};
