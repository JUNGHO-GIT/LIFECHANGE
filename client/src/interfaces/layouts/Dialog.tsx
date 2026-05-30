/**
 * @file Dialog.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Div, Icons } from "@exportComponents";
import { useCommonDate as usCmmnDt, useCommonValue as usCmmnVal } from "@exportHooks";
import {
	Backdrop,
	SpeedDial,
	SpeedDialAction as SpdDlActn,
	SpeedDialIcon as SpdDlIcn,
} from "@exportMuis";
import { memo, type React, useState } from "@exportReacts";
import { useStoreLanguage as usStrLang } from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
declare interface DialogProps {
	COUNT?: any;
	setCOUNT?: any;
	OBJECT?: any;
	setOBJECT?: any;
	LOCKED?: string;
	setLOCKED?: React.Dispatch<React.SetStateAction<string>>;
	setIsExpanded?: any;
}

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const Dialog = memo(
	({
		COUNT,
		setCOUNT,
		OBJECT,
		setOBJECT,
		LOCKED,
		setLOCKED,
		setIsExpanded: stIsExpn,
	}: DialogProps) => {
		// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
		const { PATH, navigate, toDetail, localIsoCode } = usCmmnVal();
		const { isGoalList, isFindList, isFavoriteList: isFavLst } = usCmmnVal();
		const { isList, isDetail, isCalendar } = usCmmnVal();
		const { getDayFmt, getWeekStartFmt: gtWkStrtFmt, getWeekEndFmt: gtWkEndFmt } = usCmmnDt();
		const { translate } = usStrLang();

		// 2-2. useState ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
		const [open, setOpen] = useState(false);

		// 7. dialog ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
		const dialogNode = () => {
			// 1. goal
			const lstGlSec = () => (
				<Div className={`d-flex`}>
					<Backdrop
						open={open}
						style={{ zIndex: 550 }}
						onClick={() => {
							setOpen(false);
						}}
					/>
					<SpeedDial
						ariaLabel={`speedDial`}
						direction={`up`}
						open={open}
						style={{ zIndex: 600 }}
						className={`p-fixed bottom-18vh right-6vw ml-5px z-600`}
						icon={<SpdDlIcn />}
						FabProps={{
							size: `small`,
							component: `div`,
						}}
						onClick={() => {
							setOpen(!open);
						}}
					>
						<SpdDlActn
							key={translate(`save`)}
							tooltipTitle={translate(`save`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`Pencil`}
									name={`Pencil`}
									className={`w-25px h-25px`}
								/>
							}
							onClick={() => {
								void navigate(toDetail, {
									state: {
										dateType: `week`,
										dateStart: gtWkStrtFmt(),
										dateEnd: gtWkEndFmt(),
									},
								});
							}}
						/>
						<SpdDlActn
							key={translate(`openAll`)}
							tooltipTitle={translate(`openAll`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`ChevronDown`}
									name={`ChevronDown`}
									className={`w-25px h-25px`}
								/>
							}
							onClick={() => {
								stIsExpn(() =>
									Array.from({ length: COUNT?.totalCnt as number }).map(
										(_: any) => ({
											expanded: true,
										}),
									),
								);
								window.scrollTo(0, 0);
							}}
						/>
						<SpdDlActn
							key={translate(`closeAll`)}
							tooltipTitle={translate(`closeAll`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`ChevronUp`}
									name={`ChevronUp`}
									className={`w-25px h-25px`}
								/>
							}
							onClick={() => {
								stIsExpn(() =>
									Array.from({ length: COUNT?.totalCnt as number }).map(
										(_: any) => ({
											expanded: false,
										}),
									),
								);
								window.scrollTo(0, 0);
							}}
						/>
					</SpeedDial>
				</Div>
			);
			// 1. record
			const lstRecSec = () => (
				<Div className={`d-flex`}>
					<Backdrop
						open={open}
						style={{ zIndex: 550 }}
						onClick={() => {
							setOpen(false);
						}}
					/>
					<SpeedDial
						ariaLabel={`speedDial`}
						direction={`up`}
						open={open}
						style={{ zIndex: 600 }}
						className={`p-fixed bottom-18vh right-6vw ml-5px z-600`}
						icon={<SpdDlIcn />}
						FabProps={{
							size: `small`,
							component: `div`,
						}}
						onClick={() => {
							setOpen(!open);
						}}
					>
						<SpdDlActn
							key={translate(`save`)}
							tooltipTitle={translate(`save`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`Pencil`}
									name={`Pencil`}
									className={`w-25px h-25px`}
								/>
							}
							onClick={() => {
								void navigate(toDetail, {
									state: {
										dateType: `day`,
										dateStart: getDayFmt(),
										dateEnd: getDayFmt(),
									},
								});
							}}
						/>
						<SpdDlActn
							key={translate(`openAll`)}
							tooltipTitle={translate(`openAll`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`ChevronDown`}
									name={`ChevronDown`}
									className={`w-25px h-25px`}
								/>
							}
							onClick={() => {
								stIsExpn(() =>
									Array.from({ length: COUNT?.totalCnt as number }).map(
										(_: any) => ({
											expanded: true,
										}),
									),
								);
								window.scrollTo(0, 0);
							}}
						/>
						<SpdDlActn
							key={translate(`closeAll`)}
							tooltipTitle={translate(`closeAll`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`ChevronUp`}
									name={`ChevronUp`}
									className={`w-25px h-25px`}
								/>
							}
							onClick={() => {
								stIsExpn(() =>
									Array.from({ length: COUNT?.totalCnt as number }).map(
										(_: any) => ({
											expanded: false,
										}),
									),
								);
								window.scrollTo(0, 0);
							}}
						/>
					</SpeedDial>
				</Div>
			);
			// 3. find
			const findSection = () => (
				<Div className={`d-flex`}>
					<Backdrop
						open={open}
						style={{ zIndex: 550 }}
						onClick={() => {
							setOpen(false);
						}}
					/>
					<SpeedDial
						ariaLabel={`speedDial`}
						direction={`up`}
						open={open}
						className={`p-fixed bottom-18vh right-6vw ml-5px z-600`}
						icon={<SpdDlIcn />}
						FabProps={{
							size: `small`,
							component: `div`,
						}}
						onClick={() => {
							setOpen(!open);
						}}
					>
						{PATH.includes(`/favorite/list`) ? (
							<SpdDlActn
								key={translate(`search`)}
								tooltipTitle={translate(`search`)}
								className={open ? `` : `d-none`}
								icon={
									<Icons
										key={`Search`}
										name={`Search`}
										className={`w-23px h-23px`}
									/>
								}
								onClick={() => {
									void navigate(`/food/find/list`);
								}}
							/>
						) : (
							<SpdDlActn
								key={translate(`favorite`)}
								tooltipTitle={translate(`favorite`)}
								className={open ? `` : `d-none`}
								icon={
									<Icons
										key={`Star`}
										name={`Star`}
										fill={`gold`}
										className={`w-23px h-23px`}
									/>
								}
								onClick={() => {
									void navigate(`/food/favorite/list`);
								}}
							/>
						)}
						<SpdDlActn
							key={translate(`save`)}
							tooltipTitle={translate(`save`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`Pencil`}
									name={`Pencil`}
									className={`w-25px h-25px`}
								/>
							}
							onClick={() => {
								void navigate(toDetail, {
									state: {
										dateType: isGoalList ? `` : `day`,
										dateStart: getDayFmt(),
										dateEnd: getDayFmt(),
									},
								});
							}}
						/>
						<SpdDlActn
							key={translate(`openAll`)}
							tooltipTitle={translate(`openAll`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`ChevronDown`}
									name={`ChevronDown`}
									className={`w-25px h-25px`}
								/>
							}
							onClick={() => {
								stIsExpn(() =>
									Array.from({ length: COUNT?.totalCnt as number }).map(
										(_: any) => ({
											expanded: true,
										}),
									),
								);
								window.scrollTo(0, 0);
							}}
						/>
						<SpdDlActn
							key={translate(`closeAll`)}
							tooltipTitle={translate(`closeAll`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`ChevronUp`}
									name={`ChevronUp`}
									className={`w-25px h-25px`}
								/>
							}
							onClick={() => {
								stIsExpn(() =>
									Array.from({ length: COUNT?.totalCnt as number }).map(
										(_: any) => ({
											expanded: false,
										}),
									),
								);
								window.scrollTo(0, 0);
							}}
						/>
						<SpdDlActn
							key={translate(`locale`)}
							tooltipTitle={translate(`locale`)}
							className={open ? `` : `d-none`}
							icon={<Div className={`fw-800 fs-0-8rem`}>{localIsoCode}</Div>}
						/>
					</SpeedDial>
				</Div>
			);
			// 4. detail
			const dtlSec = () => (
				<Div className={`d-flex`}>
					<Backdrop
						open={open}
						style={{ zIndex: 550 }}
						onClick={() => {
							setOpen(false);
						}}
					/>
					<SpeedDial
						ariaLabel={`speedDial`}
						direction={`up`}
						open={open}
						style={{ zIndex: 600 }}
						className={`p-fixed bottom-18vh right-6vw ml-5px z-600`}
						icon={<SpdDlIcn />}
						FabProps={{
							size: `small`,
							component: `div`,
						}}
						onClick={() => {
							setOpen(!open);
						}}
					>
						<SpdDlActn
							key={translate(`itemLock`)}
							tooltipTitle={translate(`itemLock`)}
							className={open ? `` : `d-none`}
							icon={
								LOCKED === `locked` ? (
									<Icons
										key={`UnLock`}
										name={`UnLock`}
										className={`w-25px h-25px`}
									/>
								) : (
									<Icons
										key={`Lock`}
										name={`Lock`}
										className={`w-25px h-25px`}
									/>
								)
							}
							onClick={() => {
								if (setLOCKED) {
									if (LOCKED === `locked`) {
										setLOCKED(`unlocked`);
									} else {
										setLOCKED(`locked`);
									}
								}
							}}
						/>
						<SpdDlActn
							key={translate(`closeAll`)}
							tooltipTitle={translate(`closeAll`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`X`}
									name={`X`}
									locked={LOCKED}
									className={`w-25px h-25px`}
								/>
							}
							onClick={(e) => {
								if (LOCKED === `locked`) {
									e.preventDefault();
									return;
								}
								if (setOBJECT) {
									setOBJECT((prev: any) => ({
										...prev,
										food_section: [],
										calendar_food_section: [],
									}));
								}
								if (setCOUNT) {
									setCOUNT((prev: any) => ({
										...prev,
										newSectionCnt: 0,
									}));
								}
							}}
						/>
					</SpeedDial>
				</Div>
			);
			// 5. calendar
			const clndDtlSec = () => (
				<Div className={`d-flex`}>
					<Backdrop
						open={open}
						style={{ zIndex: 550 }}
						onClick={() => {
							setOpen(false);
						}}
					/>
					<SpeedDial
						ariaLabel={`speedDial`}
						direction={`up`}
						open={open}
						style={{ zIndex: 600 }}
						className={`p-fixed bottom-18vh right-6vw ml-5px z-600`}
						icon={<SpdDlIcn />}
						FabProps={{
							size: `small`,
							component: `div`,
						}}
						onClick={() => {
							setOpen(!open);
						}}
					>
						<SpdDlActn
							key={translate(`itemLock`)}
							tooltipTitle={translate(`itemLock`)}
							className={open ? `` : `d-none`}
							icon={
								LOCKED === `locked` ? (
									<Icons
										key={`UnLock`}
										name={`UnLock`}
										className={`w-25px h-25px`}
									/>
								) : (
									<Icons
										key={`Lock`}
										name={`Lock`}
										className={`w-25px h-25px`}
									/>
								)
							}
							onClick={() => {
								if (setLOCKED) {
									if (LOCKED === `locked`) {
										setLOCKED(`unlocked`);
									} else {
										setLOCKED(`locked`);
									}
								}
							}}
						/>
						<SpdDlActn
							key={translate(`closeAll`)}
							tooltipTitle={translate(`closeAll`)}
							className={open ? `` : `d-none`}
							icon={
								<Icons
									key={`X`}
									name={`X`}
									locked={LOCKED}
									className={`w-25px h-25px`}
								/>
							}
							onClick={(e) => {
								if (LOCKED === `locked`) {
									e.preventDefault();
									return;
								}
								if (setOBJECT) {
									setOBJECT((prev: any) => ({
										...prev,
										calendar_exercise_section: [],
										calendar_food_section: [],
										calendar_money_section: [],
										calendar_sleep_section: [],
									}));
								}
								if (setCOUNT) {
									setCOUNT((prev: any) => ({
										...prev,
										newSectionCnt: 0,
									}));
								}
							}}
						/>
					</SpeedDial>
				</Div>
			);
			// 10. return
			return isGoalList
				? lstGlSec()
				: isFindList || isFavLst
					? findSection()
					: isList
						? lstRecSec()
						: isCalendar && isDetail
							? clndDtlSec()
							: isDetail
								? dtlSec()
								: null;
		};

		// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
		return <>{dialogNode()}</>;
	},
);
