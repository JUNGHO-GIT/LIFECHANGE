/**
 * @file useLanguageSetting.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useCommonValue } from "@hooks/common/useCommonValue";
import { getCountryForTimezone } from "countries-and-timezones";
import { getAllInfoByISO } from "iso-country-currency";
import { useEffect } from "@exportReacts";
import { setLocal } from "@exportScripts";

// -------------------------------------------------------------------------------------------------
export const useLanguageSetting = () => {

  // 1. common ----------------------------------------------------------------------------------
  const { localLang } = useCommonValue();

  // 2. useEffect ----------------------------------------------------------------------------------
  useEffect(() => {
    let cancelled: boolean = false;
    const syncLocale = async (): Promise<void> => {
    // ex. UTC
      const timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone || `UTC`;

      const { default: moment } = await import(`moment-timezone/builds/moment-timezone-with-data-10-year-range`);
      if (cancelled) {
        return;
      }

    // ex. UTC
      const zoneName: string = moment.tz(timeZone).zoneName();

    // ex. US
      const isoCode: string = getCountryForTimezone(timeZone)?.id ?? ``;

    // ex. USD (UTC 등 미매핑 타임존은 통화 조회가 throw 하므로 기본값으로 흡수함)
      const readCurrency = (): string => {
        if (isoCode === ``) {
          return `USD`;
        }
        try {
          return getAllInfoByISO(isoCode).currency;
        }
        catch {
          return `USD`;
        }
      };
      const currency: string = readCurrency();

    // 미국인 경우 lbs, 그 외에는 kg 설정
      const unit: string = isoCode === `US` ? `lbs` : `kg`;

    // ex. en
      const browserLang: string = navigator.language.includes(`-`) ? navigator.language.split(`-`)[0] : navigator.language;
      const lang: string = localLang ?? browserLang;

    // moment locale 정규화
      const momentLang: string = (lang || ``).toLowerCase().startsWith(`ko`) ? `ko` : `en`;

    // Set moment locale
      moment.locale(momentLang);

    // Save to local storage
      setLocal(`setting`, `locale`, ``, {
        timeZone: timeZone,
        lang: momentLang,
        zoneName: zoneName,
        isoCode: isoCode,
        currency: currency,
        unit: unit,
      });
    };

    // 로컬 동기화 실패는 화면 기능을 막지 않으므로 기록만 하고 unhandled rejection 을 만들지 않음
    const runSyncLocale = (): void => {
      syncLocale().catch((error: unknown) => {
        console.error(`[locale] 동기화 실패`, error);
      });
    };

    const idleId: number | null = typeof window.requestIdleCallback === `function`
      ? window.requestIdleCallback(() => {
        runSyncLocale();
      })
      : null;
    const timeoutId: ReturnType<typeof setTimeout> | null = idleId === null
      ? setTimeout(() => {
        runSyncLocale();
      }, 0)
      : null;

    return () => {
      cancelled = true;
      if (idleId !== null && typeof window.cancelIdleCallback === `function`) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [localLang]);
};
