/**
 * @file Footer.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Paper } from "@exportComponents";
import { useCommonValue as usCmmnVal } from "@exportHooks";
import { memo, useEffect, useState } from "@exportReacts";
import { Buttons } from "./Buttons";
import { FindFilter } from "./FindFilter";
import { ListFilter } from "./ListFilter";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
declare interface FooterProps {
	state: any;
	setState: any;
	flow?: any;
}

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const Footer = memo(({ state, setState, flow }: FooterProps) => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { PATH } = usCmmnVal();

	// 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const [typeName, setTypeName] = useState<string>(``);
	const [styleClass, stStylClss] = useState<string>(``);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		const commonStr: string = `layout-wrapper p-sticky h-8vh radius-2 border-1 shadow-1 p-5px`;
		const isUser: boolean =
			PATH.includes(`/user/category`) || PATH.includes(`/user/detail`);
		const isFood: boolean =
			PATH.includes(`/food/find/list`) || PATH.includes(`/food/favorite/list`);
		const isList: boolean =
			PATH.includes(`/goal/list`) || PATH.includes(`/record/list`);
		const isDetail: boolean =
			PATH.includes(`/goal/detail`) || PATH.includes(`/record/detail`);
		const isClndDtl: boolean = PATH.includes(`/calendar/detail`);

		isUser &&
			(() => {
				setTypeName(`btn`);
				stStylClss(`${commonStr} bottom-0vh`);
			})();

		isFood &&
			(() => {
				setTypeName(`findFilter`);
				stStylClss(`${commonStr} bottom-8vh`);
			})();

		isList &&
			(() => {
				setTypeName(`listFilter`);
				stStylClss(`${commonStr} bottom-8vh`);
			})();

		isDetail &&
			(() => {
				setTypeName(`btn`);
				stStylClss(`${commonStr} bottom-8vh`);
			})();

		isClndDtl &&
			(() => {
				setTypeName(`btn`);
				stStylClss(`${commonStr} bottom-8vh`);
			})();
	}, [PATH]);

	// 9. footer ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const footerNode = () => {
		// 1. btn
		const btnSection = () => <Buttons state={state} flow={flow} />;
		// 3. listFilter
		const lstFltSec = () => (
			<ListFilter state={state} setState={setState} />
		);
		// 4. findFilter
		const fndFltSec = () => (
			<FindFilter state={state} setState={setState} flow={flow} />
		);
		// 5. return
		return (
			<Paper className={`${styleClass} fadeIn`}>
				{typeName === `btn` && btnSection()}
				{typeName === `listFilter` && lstFltSec()}
				{typeName === `findFilter` && fndFltSec()}
			</Paper>
		);
	};

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return <>{footerNode()}</>;
});
