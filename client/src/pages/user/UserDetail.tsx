/**
 * @file UserDetail.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Div, Grid, Hr, Img, Paper } from "@exportComponents";
import { Input } from "@exportContainers";
import { useCommonValue as usCmmnVal, useValidateUser as usValUsr } from "@exportHooks";
import { Footer } from "@exportLayouts";
import { axios } from "@exportLibs";
import { Avatar, Checkbox } from "@exportMuis";
import { memo, type React, useEffect, useRef, useState } from "@exportReacts";
import { User, type UserType } from "@exportSchemas";
import { handleNumberInput as hndlNmbrInpt, insertComma, sync } from "@exportScripts";
import {
	useStoreAlert as usStrAlrt,
	useStoreLanguage as usStrLang,
	useStoreLoading as usStrLoad,
} from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const UserDetail = memo(() => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { URL_OBJECT, navigate, sessionId, localCurrency: lclCrrn, localUnit } =
		usCmmnVal();
	const { translate } = usStrLang();
	const { setALERT } = usStrAlrt();
	const { setLOADING } = usStrLoad();
	const { ERRORS, REFS, validate } = usValUsr();

	// 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const [OBJECT, setOBJECT] = useState<UserType>(User);
	const [inclExcl, stInclExcl] =
		useState<boolean>(false);
	const [SEND, setSEND] = useState({
		id: ``,
		dateType: ``,
		dateStart: `0000-00-00`,
		dateEnd: `0000-00-00`,
	});

	// 2-3. useRef ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const objectRef: React.RefObject<UserType> = useRef(OBJECT);

	// 2-3. useEffect ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	useEffect(() => {
		OBJECT !== objectRef.current && (objectRef.current = OBJECT);
	}, [OBJECT]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		setLOADING(true);
		axios
			.get(`${URL_OBJECT}/detail`, {
				params: {
					user_id: sessionId,
				},
			})
			.then((res: any) => {
				setLOADING(false);
				setOBJECT(res.data.result ? res.data.result : {});
			})
			.catch((error: any) => {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(error.response.data.msg as string),
					severity: `error`,
				});
			})
			.finally(() => {
				setLOADING(false);
			});
	}, [URL_OBJECT, sessionId]);

	// 3. flow ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	async function flowSave() {
		setLOADING(true);
		if (!(await validate(objectRef.current, `detail`, ``))) {
			setLOADING(false);
			return;
		}
		axios({
			method: `put`,
			url: `${URL_OBJECT}/update`,
			data: {
				user_id: sessionId,
				OBJECT: OBJECT,
			},
		})
			.then((res: any) => {
				if (res.data.status === `success`) {
					setLOADING(false);
					setALERT({
						open: true,
						msg: translate(res.data.msg as string),
						severity: `success`,
					});
					void navigate(`/user/detail`);
					void sync();
				} else {
					setLOADING(false);
					setALERT({
						open: true,
						msg: translate(res.data.msg as string),
						severity: `error`,
					});
				}
			})
			.catch((error: any) => {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(error.response.data.msg as string),
					severity: `error`,
				});
				console.error(error);
			})
			.finally(() => {
				setLOADING(false);
			});
	}

	// 6. userDetail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const usrDtlNd = () => {
		// 7-1. image
		const imageSection = () => (
			<Grid container={true} spacing={1}>
				<Grid size={12} className={`d-center`}>
					<Avatar
						src={OBJECT?.user_image}
						alt={`user_image`}
						className={`w-150px h-150px`}
					/>
				</Grid>
			</Grid>
		);
		// 7-2. detail
		const dtlSec = () => (
			<Grid container={true} spacing={0}>
				{[OBJECT]?.map((item, i) => (
					<Grid
						container={true}
						spacing={2}
						className={`p-10px`}
						key={`detail-${i}`}
					>
						{/** 이메일 * */}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									readOnly={true}
									label={translate(`id`)}
									value={item?.user_id}
								/>
							</Grid>
						</Grid>

						{/** 등록일 * */}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									readOnly={true}
									label={translate(`regDt`)}
									value={item?.user_regDt.split(`T`)[0]}
								/>
							</Grid>
						</Grid>

						<Hr m={1} className={`bg-light`} />

						{/** 최초 몸무게 * */}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									label={translate(`initScale`)}
									value={insertComma(item.user_initScale ?? `0`)}
									inputRef={REFS?.[i]?.user_initScale}
									error={ERRORS?.[i]?.user_initScale}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`exercise5.webp`}
										/>
									}
									endadornment={localUnit}
									onChange={(e: any) => {
										const procdVal: string | null = hndlNmbrInpt(
											e.target.value,
											999,
											2,
										);
										!procdVal === null &&
											(() => {
												return;
											})();
										setOBJECT((prev: any) => ({
											...prev,
											user_initScale: procdVal,
										}));
									}}
								/>
							</Grid>
						</Grid>

						{/** 현재 몸무게 * */}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									readOnly={true}
									label={translate(`curScale`)}
									value={insertComma(item.user_curScale ?? `0`)}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`exercise5.webp`}
										/>
									}
									endadornment={localUnit}
								/>
							</Grid>
						</Grid>

						<Hr m={1} className={`bg-light`} />

						{/** 초기 평균 칼로리 섭취량 목표 * */}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									label={translate(`initAvgKcalIntake`)}
									value={insertComma(item.user_initAvgKcalIntake ?? `0`)}
									inputRef={REFS?.[i]?.user_initAvgKcalIntake}
									error={ERRORS?.[i]?.user_initAvgKcalIntake}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`food2.webp`}
										/>
									}
									endadornment={translate(`kc`)}
									onChange={(e: any) => {
										const procdVal: string | null = hndlNmbrInpt(
											e.target.value,
											9999,
										);
										!procdVal === null &&
											(() => {
												return;
											})();
										setOBJECT((prev: any) => ({
											...prev,
											user_initAvgKcalIntake: procdVal,
										}));
									}}
								/>
							</Grid>
						</Grid>

						{/** 현재 목표 칼로리 * */}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									readOnly={true}
									label={translate(`curAvgKcalIntake`)}
									value={insertComma(item.user_curAvgKcalIntake ?? `0`)}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`food2.webp`}
										/>
									}
									endadornment={translate(`kc`)}
								/>
							</Grid>
						</Grid>

						<Hr m={1} className={`bg-light`} />

						{/** 초기 자산 * */}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									label={translate(`initProperty`)}
									value={insertComma(item.user_initProperty ?? `0`)}
									inputRef={REFS?.[i]?.user_initProperty}
									error={ERRORS?.[i]?.user_initProperty}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`money2.webp`}
										/>
									}
									endadornment={lclCrrn}
									onChange={(e: any) => {
										const procdVal: string | null = hndlNmbrInpt(
											e.target.value,
											9_999_999_999,
										);
										!procdVal === null &&
											(() => {
												return;
											})();
										setOBJECT((prev: any) => ({
											...prev,
											user_initProperty: procdVal,
										}));
									}}
								/>
							</Grid>
						</Grid>

						{/** 현재 자산 * */}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									readOnly={true}
									label={translate(`curPropertyExclusion`)}
									value={
										inclExcl
											? insertComma(item.user_curPropertyAll ?? `0`)
											: insertComma(item.user_curPropertyExclusion ?? `0`)
									}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`money2.webp`}
										/>
									}
									endadornment={lclCrrn}
								/>
							</Grid>
						</Grid>

						{/** 포함 여부 * */}
						<Grid container={true} spacing={0}>
							<Grid size={12} className={`d-row-left`}>
								<Div className={`fs-0-7rem fw-500 dark ml-10px`}>
									{translate(`includingExclusions`)}
								</Div>
								<Checkbox
									size={`small`}
									className={`p-0px ml-5px`}
									checked={inclExcl}
									onChange={(e: any) => {
										stInclExcl(e.target.checked);
									}}
								/>
							</Grid>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
		// 7-10. return
		return (
			<Paper
				className={`content-wrapper radius-2 border-1 shadow-1 h-min-75vh`}
			>
				{imageSection()}
				<Hr m={40} />
				{dtlSec()}
			</Paper>
		);
	};

	// 9. footer ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const footerNode = () => (
		<Footer
			state={{
				SEND,
			}}
			setState={{
				setSEND,
			}}
			flow={{
				flowSave,
			}}
		/>
	);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return (
		<>
			{usrDtlNd()}
			{footerNode()}
		</>
	);
});
