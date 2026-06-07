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
  // 1. common ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
  const URL: string = import.meta.env.VITE_APP_SERVER_URL ?? ``;
  const SUBFIX: string = import.meta.env.VITE_APP_USER ?? ``;
  const URL_OBJECT: string = URL + SUBFIX;
  const sessionId: any = getSession(`setting`, `id`, `sessionId`);
  const localTimeZone: any = getLocal(`setting`, `locale`, `timeZone`);

  // 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
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

  // ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  if (extra) {
    const [resExtra] = await Promise.allSettled([
      axios.get(`${URL_OBJECT}/sync/${extra}`, {
        params: params,
      }),
    ]);
    // 성공분만 반영, 실패 도메인은 기록 후 기존 세션값 유지 ――――――――――――――――――――――――――――――――――――――――――――――
    if (resExtra.status === `fulfilled`) {
      setSession(`setting`, `sync`, ``, {
        [extra]: resExtra.value.data.result,
      });
    } else {
      console.error(`[sync] failed: ${extra}`, resExtra.reason);
    }
  }

  // ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  else {
    const [
      resCategory,
      resPercent,
      resScale,
      resNutrition,
      resFavorite,
      resProperty,
    ] = await Promise.allSettled([
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
    // 성공한 도메인만 부분 반영, 실패 도메인은 기록 후 기존 세션값 유지 ――――――――――――――――――――――――――――――――――――――-
    const settledEntries: [string, PromiseSettledResult<any>][] = [
      [`category`, resCategory],
      [`percent`, resPercent],
      [`scale`, resScale],
      [`nutrition`, resNutrition],
      [`favorite`, resFavorite],
      [`property`, resProperty],
    ];
    const syncPatch: Record<string, any> = {};
    settledEntries.forEach(([syncKey, settled]) => {
      if (settled.status === `fulfilled`) {
        syncPatch[syncKey] = settled.value.data.result;
      } else {
        console.error(`[sync] failed: ${syncKey}`, settled.reason);
      }
    });
    if (Object.keys(syncPatch).length > 0) {
      setSession(`setting`, `sync`, ``, syncPatch);
    }
  }
};
