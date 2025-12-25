// Footer.tsx

import { useState, useEffect } from "@exportReacts";
import { useCommonValue } from "@exportHooks";
import { Paper } from "@exportComponents";
import { Buttons } from "./footer/Buttons";
import { ListFilter } from "./footer/ListFilter";
import { FindFilter } from "./footer/FindFilter";

// -------------------------------------------------------------------------------------------------
declare type FooterProps = {
	state: any;
	setState: any;
	flow?: any;
};

// -------------------------------------------------------------------------------------------------
export const Footer = (
	{ state, setState, flow }: FooterProps
) => {

	// 1. common -------------------------------------------------------------------------------------
	const { PATH } = useCommonValue();

	// 2-2. useState ---------------------------------------------------------------------------------
	const [typeName, setTypeName] = useState<string>(``);
	const [styleClass, setStyleClass] = useState<string>(``);

	// 2-3. useEffect --------------------------------------------------------------------------------
	useEffect(() => {
		const commonStr: string = `layout-wrapper p-sticky h-8vh border-1 radius-2 shadow-top-1`;

		PATH.includes(`/calendar/list`) ? (() => {
			setTypeName(``);
			setStyleClass(``);
		})()
		: PATH.includes(`/user/category`) || PATH.includes(`/user/detail`) ? (() => {
			setTypeName(`btn`);
			setStyleClass(`${commonStr} bottom-0vh`);
		})()
		: PATH.includes(`/food/find/list`) || PATH.includes(`/favorite/list`) ? (() => {
			setTypeName(`findFilter`);
			setStyleClass(`${commonStr} bottom-8vh`);
		})()
		: PATH.includes(`/goal/list`) || PATH.includes(`/list`) ? (() => {
			setTypeName(`listFilter`);
			setStyleClass(`${commonStr} bottom-8vh`);
		})()
		: PATH.includes(`/goal/detail`) || PATH.includes(`/detail`) ? (() => {
			setTypeName(`btn`);
			setStyleClass(`${commonStr} bottom-8vh`);
		})()
		: (() => {
			setTypeName(``);
			setStyleClass(``);
		})()
	}, [PATH]);

	// 7. footer -------------------------------------------------------------------------------------
	const footerNode = () => {
		// 1. btn
		const btnSection = () => (
			<Buttons
				state={state}
				flow={flow}
			/>
		);
		// 3. listFilter
		const listFilterSection = () => (
			<ListFilter
				state={state}
				setState={setState}
			/>
		);
		// 4. findFilter
		const findFilterSection = () => (
			<FindFilter
				state={state}
				setState={setState}
				flow={flow}
			/>
		);
		// 5. return
		return (
			<Paper className={`${styleClass} fadeIn`}>
				{typeName === `btn` && btnSection()}
				{typeName === `listFilter` && listFilterSection()}
				{typeName === `findFilter` && findFilterSection()}
			</Paper>
		);
	};

	// 10. return ------------------------------------------------------------------------------------
	return (
		<>
			{footerNode()}
		</>
	);
};
