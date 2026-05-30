/**
 * @file BottomNav.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Img, Paper } from "@exportComponents";
import { useCommonDate as usCmmnDt, useCommonValue as usCmmnVal, useStorageLocal as usStrgLcl } from "@exportHooks";
import { BottomNavigation as BttmNav, BottomNavigationAction as BttmNavActn } from "@exportMuis";
import { memo, useEffect } from "@exportReacts";
import { getLocal } from "@exportScripts";
import { useStoreLanguage as usStrLang } from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const BottomNav = memo(() => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { navigate, firstStr } = usCmmnVal();
	const { getDayFmt } = usCmmnDt();
	const { translate } = usStrLang();

	// 2-1. useStorageLocal ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const [selectedTab, stSelTb] = usStrgLcl(`tabs`, `bottom`, ``, {
		exercise: false,
		food: false,
		calendar: false,
		money: false,
		sleep: false,
	});

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		stSelTb((prev: any) => {
			const updatedTabs: any = Object.keys(prev).reduce<any>((acc, key) => {
				acc[key] = key === firstStr;
				return acc;
			}, {});
			return updatedTabs;
		});
	}, [firstStr]);

	// 4. handle ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const hndClBtNv = (value: string) => {
		// top selected 값 가져오기
		const getItem: any = getLocal(`tabs`, `top`, ``);
		const selectedTop: any = getItem[value];
		const url: string =
			value === `calendar` ? `/${value}/list` : `/${value}/${selectedTop}/list`;
		void navigate(url, {
			state: {
				dateType: ``,
				dateStart: getDayFmt(),
				dateEnd: getDayFmt(),
			},
		});
	};

	// 7. bottomNav ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const bttmNvNd = () => {
		// 7-1. tabsSection
		const tabsSection = () => (
			<BttmNav
				showLabels={true}
				value={Object.keys(selectedTab).find(
					(key) => selectedTab[key as keyof typeof selectedTab],
				)}
				className={`w-100p`}
			>
				<BttmNavActn
					label={translate(`exercise`)}
					value={`exercise`}
					icon={
						<Img
							max={20}
							hover={true}
							shadow={false}
							radius={false}
							src={`exercise1.webp`}
						/>
					}
					onClick={() => {
						hndClBtNv(`exercise`);
					}}
				/>
				<BttmNavActn
					label={translate(`food`)}
					value={`food`}
					icon={
						<Img
							max={20}
							hover={true}
							shadow={false}
							radius={false}
							src={`food1.webp`}
						/>
					}
					onClick={() => {
						hndClBtNv(`food`);
					}}
				/>
				<BttmNavActn
					label={translate(`calendar`)}
					value={`calendar`}
					icon={
						<Img
							max={20}
							hover={true}
							shadow={false}
							radius={false}
							src={`calendar1.webp`}
						/>
					}
					onClick={() => {
						hndClBtNv(`calendar`);
					}}
				/>
				<BttmNavActn
					label={translate(`money`)}
					value={`money`}
					icon={
						<Img
							max={20}
							hover={true}
							shadow={false}
							radius={false}
							src={`money1.webp`}
						/>
					}
					onClick={() => {
						hndClBtNv(`money`);
					}}
				/>
				<BttmNavActn
					label={translate(`sleep`)}
					value={`sleep`}
					icon={
						<Img
							max={20}
							hover={true}
							shadow={false}
							radius={false}
							src={`sleep1.webp`}
						/>
					}
					onClick={() => {
						hndClBtNv(`sleep`);
					}}
				/>
			</BttmNav>
		);

		// 7-2. return
		return (
			<Paper
				className={`layout-wrapper p-sticky bottom-0vh h-8vh radius-2 border-1 shadow-1`}
			>
				{tabsSection()}
			</Paper>
		);
	};

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return <>{bttmNvNd()}</>;
});
