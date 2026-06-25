/**
 * @file useLanguageSetting.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useCommonValue } from "@hooks/common/useCommonValue";
import { getCountryForTimezone } from "countries-and-timezones";
import { getAllInfoByISO } from "iso-country-currency";
import moment from "moment-timezone";
import { useEffect } from "@exportReacts";
import { setLocal } from "@exportScripts";

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const useLanguageSetting = () => {

  // 1. common ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const { localLang } = useCommonValue();

  // 2. useEffect ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  useEffect(() => {
    const syncLocale = (): void => {
    // ex. UTC
      const timeZone: string = moment.tz.guess();

    // ex. UTC
      const zoneName: string = moment.tz(timeZone).zoneName();

    // ex. US
      const isoCode: string = getCountryForTimezone(timeZone)?.id ?? ``;

    // ex. USD
      const currency: string = getAllInfoByISO(isoCode).currency;

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

    const idleId: number | null = typeof window.requestIdleCallback === `function`
      ? window.requestIdleCallback(syncLocale)
      : null;
    const timeoutId: ReturnType<typeof setTimeout> | null = idleId === null
      ? setTimeout(syncLocale, 0)
      : null;

    return () => {
      if (idleId !== null && typeof window.cancelIdleCallback === `function`) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [localLang]);
};
