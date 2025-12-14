// adminService.ts

import fs from "node:fs";
import path from "node:path";
import dotenv from 'dotenv';
import { fileURLToPath } from "node:url";
import * as repository from "@repositories/admin/AdminRepository";
dotenv.config();

// 0. curEnv ---------------------------------------------------------------------------------------
export const curEnv = async () => {
	let finalResult: unknown = null;
	let statusResult: string = ``;

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const indexFile = path.join(__dirname, `../../../index.ts`);

	const regex = /\/\/\s*const\s*db\s*=\s*process.env.DB_NAME/;
	const data = fs.readFileSync(indexFile, `utf8`);
	const result = data.match(regex);
	const env = (!result || result === undefined) ? `DEVELOPMENT` : `PRODUCTION`;

	finalResult = {
		env: env,
	};

	statusResult = !finalResult ? `fail` : `success`;

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 1. appInfo --------------------------------------------------------------------------------------
export const appInfo = async () => {
	let finalResult: any = null;
	let statusResult: string = ``;

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const envData = fs.readFileSync(path.join(__dirname, `../../../.env`), `utf8`);
	const markdownData = fs.readFileSync(path.join(__dirname, `../../../changelog.md`), `utf8`);

	const versionRegex = /(\s*)(\d+\.\d+\.\d+)(\s*)/g;
	const dateRegex = /-\s*(\d{4}-\d{2}-\d{2})\s*\((\d{2}:\d{2}:\d{2})\)/g;
	const licenseRegex = /LICENSE=(.*)/;

	const versionMatches = [...markdownData.matchAll(versionRegex)];
	const dateMatches = [...markdownData.matchAll(dateRegex)];
	const licenseMatch = envData.match(licenseRegex);

	const lastVersion = versionMatches.length > 0 ? versionMatches.at(-1)[2] : ``;
	const lastDateMatch = dateMatches.length > 0 ? dateMatches.at(-1) : null;
	const lastDateTime = lastDateMatch ? `${lastDateMatch[1]}_${lastDateMatch[2]}` : ``;
	const lastLicense = licenseMatch ? licenseMatch[1] : ``;

	finalResult = {
		version: lastVersion,
		date: lastDateTime,
		license: lastLicense,
	};

	statusResult = !finalResult ? `fail` : `success`;

	return {
		status: statusResult,
		result: finalResult,
	};
};

// 2. userCount ------------------------------------------------------------------------------------
export const userCount = async (
) => {
	// result 변수 선언
	let findResult: any = null;
	let finalResult: any = null;
	let statusResult: string = ``;

	findResult = await repository.userCount();

	if (!findResult || findResult.length <= 0) {
		finalResult = [];
		statusResult = `fail`;
	}
	else {
		finalResult = findResult;
		statusResult = `success`;
	}

	return {
		status: statusResult,
		result: finalResult,
	};
};
