/**
 * @file AdminService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

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

	const __filename: string = fileURLToPath(import.meta.url);
	const __dirname: string = path.dirname(__filename);
	const indexFile: string = path.join(__dirname, `../../../index.ts`);

	const regex: RegExp = /\/\/\s*const\s*db\s*=\s*process.env.DB_NAME/;
	const data: string = fs.readFileSync(indexFile, `utf8`);
	const result: RegExpMatchArray | null = data.match(regex);
	const env: string = (!result || result === undefined) ? `PRODUCTION` : `DEVELOPMENT`;

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

	const __filename: string = fileURLToPath(import.meta.url);
	const __dirname: string = path.dirname(__filename);
	const packageData: string = fs.readFileSync(path.join(__dirname, `../../../package.json`), `utf8`);
	const markdownData: string = fs.readFileSync(path.join(__dirname, `../../../changelog.md`), `utf8`);

	const versionRegex: RegExp = /(\s*)(\d+\.\d+\.\d+)(\s*)/g;
	const dateRegex: RegExp = /-\s*(\d{4}-\d{2}-\d{2})\s*\((\d{2}:\d{2}:\d{2})\)/g;

	const versionMatches: RegExpExecArray[] = [...markdownData.matchAll(versionRegex)];
	const dateMatches: RegExpExecArray[] = [...markdownData.matchAll(dateRegex)];
	const packageJson: Record<string, any> = JSON.parse(packageData);

	const lastVersion: string = versionMatches.length > 0 ? versionMatches.at(-1)[2] : ``;
	const lastDateMatch: RegExpExecArray | null | undefined = dateMatches.length > 0 ? dateMatches.at(-1) : null;
	const lastDateTime: string = lastDateMatch ? `${lastDateMatch[1]}_${lastDateMatch[2]}` : ``;
	const lastLicense: string = packageJson.license ?? ``;

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
