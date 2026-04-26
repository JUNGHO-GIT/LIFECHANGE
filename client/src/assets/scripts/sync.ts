/**
 * @file sync.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { axios, moment } from "@exportLibs";
import { getLocal, getSession, setSession } from "@exportScripts";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const sync = async (extra?: string) => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const URL: string = import.meta.env.VITE_APP_SERVER_URL ?? ``;
	const SUBFIX: string = import.meta.env.VITE_APP_USER ?? ``;
	const URL_OBJECT: string = URL + SUBFIX;
	const sessionId: any = getSession(`setting`, `id`, `sessionId`);
	const localTimeZone: any = getLocal(`setting`, `locale`, `timeZone`);

	// 2-2. useState ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const DATE = {
		dateType: `day`,
		dateStart: moment()
			.tz(localTimeZone as string)
			.format(`YYYY-MM-DD`),
		dateEnd: moment()
			.tz(localTimeZone as string)
			.format(`YYYY-MM-DD`),
		monthStart: moment()
			.tz(localTimeZone as string)
			.startOf(`month`)
			.format(`YYYY-MM-DD`),
		monthEnd: moment()
			.tz(localTimeZone as string)
			.endOf(`month`)
			.format(`YYYY-MM-DD`),
	};
	const params = {
		user_id: sessionId as string,
		DATE: DATE,
	};

	// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	if (extra) {
		const [resExtra] = await Promise.all([
			axios.get(`${URL_OBJECT}/sync/${extra}`, {
				params: params,
			}),
		]);
		setSession(`setting`, `sync`, ``, {
			[extra]: resExtra.data.result,
		});
	}

	// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	else {
		const [
			resCategory,
			resPercent,
			resScale,
			resNutrition,
			resFavorite,
			resProperty,
		] = await Promise.all([
			axios.get(`${URL_OBJECT}/sync/category`, {
				params: params,
			}),
			axios.get(`${URL_OBJECT}/sync/percent`, {
				params: params,
			}),
			axios.get(`${URL_OBJECT}/sync/scale`, {
				params: params,
			}),
			axios.get(`${URL_OBJECT}/sync/nutrition`, {
				params: params,
			}),
			axios.get(`${URL_OBJECT}/sync/favorite`, {
				params: params,
			}),
			axios.get(`${URL_OBJECT}/sync/property`, {
				params: params,
			}),
		]);
		setSession(`setting`, `sync`, ``, {
			category: resCategory.data.result,
			percent: resPercent.data.result,
			scale: resScale.data.result,
			nutrition: resNutrition.data.result,
			favorite: resFavorite.data.result,
			property: resProperty.data.result,
		});
	}
};
