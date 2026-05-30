/**
 * @file useLanguageSetting.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useCommonValue as usCmmnVal } from "@exportHooks";
import { getAllInfoByISO as gtAllInfByIs, getCountryForTimezone as gtCntrFrTmzn, moment } from "@exportLibs";
import { useEffect } from "@exportReacts";
import { setLocal } from "@exportScripts";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const usLangSttn = () => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { localLang } = usCmmnVal();

	// 2. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	useEffect(() => {
		// ex. UTC
		const timeZone: string = moment.tz.guess();

		// ex. UTC
		const zoneName: string = moment.tz(timeZone).zoneName();

		// ex. US
		const isoCode: string = gtCntrFrTmzn(timeZone)?.id ?? ``;

		// ex. USD
		const currency: string = gtAllInfByIs(isoCode).currency;

		// 미국인 경우 lbs, 그 외에는 kg 설정
		const unit: string = isoCode === `US` ? `lbs` : `kg`;

		// ex. en
		const browserLang: string = navigator.language.includes(`-`)
			? navigator.language.split(`-`)[0]
			: navigator.language;
		const lang: string = localLang ?? browserLang;

		// moment locale 정규화
		const momentLang: string = (lang || ``).toLowerCase().startsWith(`ko`)
			? `ko`
			: `en`;

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
	}, [localLang]);
};
