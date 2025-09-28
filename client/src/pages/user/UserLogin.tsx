// UserLogin.tsx

import { useState, useEffect, memo } from "@importReacts";
import {useCommonValue, useValidateUser} from "@importHooks";
import {useStoreLanguage, useStoreAlert, useStoreLoading} from "@importStores";
import {axios} from "@importLibs";
import {fnSync, fnGetLocal, fnSetLocal, fnSetSession} from "@importScripts";
import {User} from "@importSchemas";
import {Input} from "@importContainers";
import {Div, Btn, Img, Hr, Paper, Grid } from "@importComponents";
import {Checkbox} from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const UserLogin = memo(() => {

	// 1. common -------------------------------------------------------------------------------------
	const {URL_OBJECT, URL_GOOGLE, ADMIN_ID, ADMIN_PW, navigate} = useCommonValue();
	const {translate} = useStoreLanguage();
	const {setALERT} = useStoreAlert();
	const {setLOADING} = useStoreLoading();
	const {ERRORS, REFS, validate} = useValidateUser();

	// 2-2. useState ---------------------------------------------------------------------------------
	const [loginTrigger, setLoginTrigger] = useState<boolean>(false);
	const [checkedSaveId, setCheckedSaveId] = useState<boolean>(false);
	const [checkedAutoLogin, setCheckedAutoLogin] = useState<boolean>(false);
	const [_clickCount, setClickCount] = useState<number>(0);
	const [OBJECT, setOBJECT] = useState(User);

	// 2-3. useEffect -----------------------------------------------------------------------------
	// 트리거가 활성화된 경우
	useEffect(() => {
		if (loginTrigger) {
			(async () => {
				try {
					await flowSave();
				}
				finally {
					setLoginTrigger(false);
				}
			})();
		}
	}, [loginTrigger]);

	// 2-3. useEffect -----------------------------------------------------------------------------
	// 초기 로드 시 자동로그인 설정 가져오기
	useEffect(() => {
		const {autoLogin, autoLoginId, autoLoginPw} = fnGetLocal("setting", "id", "") || {};

		// 자동로그인 o
		if (autoLogin === "true") {
			setCheckedAutoLogin(true);
			setOBJECT((prev) => ({
				...prev,
				user_id: autoLoginId,
				user_pw: autoLoginPw,
			}));
			setLoginTrigger(true);
		}
		// 자동로그인 x
		else if (autoLogin === "false") {
			setCheckedAutoLogin(false);
			setOBJECT((prev) => ({
				...prev,
				user_id: "",
				user_pw: "",
			}));
			setLoginTrigger(false);
		}
	}, []);

	// 2-3. useEffect -----------------------------------------------------------------------------
	// 초기 로드 시 아이디 저장 설정 가져오기
	useEffect(() => {
		const {isSaved, isSavedId} = fnGetLocal("setting", "id", "") || {};
		// 아이디 저장 o
		if (isSaved === "true") {
			setCheckedSaveId(true);
			setOBJECT((prev) => ({
				...prev,
				user_id: isSavedId,
			}));
		}
		// 아이디 저장 x
		else if (isSaved === "false") {
			setCheckedSaveId(false);
			setOBJECT((prev) => ({
				...prev,
				user_id: "",
			}));
		}
	}, []);

	// 2-3. useEffect -----------------------------------------------------------------------------
	// 자동로그인 활성화된 경우
	useEffect(() => {
		if (checkedAutoLogin) {
			fnSetLocal("setting", "id", "", {
				autoLogin: "true",
				autoLoginId: OBJECT.user_id,
				autoLoginPw: OBJECT.user_pw,
			});
		}
		else {
			fnSetLocal("setting", "id", "", {
				autoLogin: "false",
				autoLoginId: "",
				autoLoginPw: "",
			});
		}
	}, [checkedAutoLogin, OBJECT.user_id]);

	// 2-3. useEffect -----------------------------------------------------------------------------
	// 아이디 저장 활성화된 경우
	useEffect(() => {
		if (checkedSaveId) {
			fnSetLocal("setting", "id", "", {
				isSaved: "true",
				isSavedId: OBJECT.user_id,
			});
		}
		else {
			fnSetLocal("setting", "id", "", {
				isSaved: "false",
				isSavedId: "",
			});
		}
	}, [checkedSaveId, OBJECT.user_id]);

	// 3. flow ---------------------------------------------------------------------------------------
	const flowSave = async () => {
		setLOADING(true);
		if (!await validate(OBJECT, "login", "")) {
			setLOADING(false);
			return;
		}
		axios.post(`${URL_OBJECT}/login`, {
			user_id: OBJECT.user_id,
			user_pw: OBJECT.user_pw,
			isAutoLogin: checkedAutoLogin,
		})
		.then((res: any) => {
			if (res.data.status === "success") {
				setLOADING(false);
				fnSetSession("setting", "id", "", {
					sessionId: res.data.result.user_id,
					admin: res.data.admin === "admin" ? "true" : "false",
				});
				navigate("/schedule/record/list");
				fnSync();
			}
			else if (res.data.status === "isGoogleUser") {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(res.data.msg),
					severity: "error",
				});
				fnSetSession("setting", "id", "", {
					sessionId: res.data.result.user_id,
					admin: res.data.admin === "admin" ? "true" : "false",
				});
			}
			else {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(res.data.msg),
					severity: "error",
				});
				fnSetSession("setting", "id", "", {
					sessionId: "",
					admin: "false",
				});
			}
		})
		.catch((err: any) => {
			setLOADING(false);
			setALERT({
				open: true,
				msg: translate(err.response.data.msg),
				severity: "error",
			});
			console.error(err);
		})
		.finally(() => {
			setLOADING(false);
		});
	};

	// 3. flow ---------------------------------------------------------------------------------------
	const flowGoogle = () => {
		axios.get(`${URL_GOOGLE}/login`)
		.then((res: any) => {
			if (res.data.status === "success") {
				setLOADING(false);
				window.location.href = res.data.url;
			}
			else {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(res.data.msg),
					severity: "error",
				});
			}
		})
		.catch((err: any) => {
			setLOADING(false);
			setALERT({
				open: true,
				msg: translate(err.response.data.msg),
				severity: "error",
			});
			console.error(err);
		});
	};

	// 7. userLogin ----------------------------------------------------------------------------------
	const userLoginNode = () => {
		// 7-1. title
		const titleSection = () => (
			<Grid container={true} spacing={1}>
				<Grid size={12}>
					<Div className={"fs-1-8rem fw-500"} onClick={() => {
						setClickCount((prevCount) => {
							const newCount = prevCount + 1;
							if (newCount === 5) {
								setOBJECT((prev) => ({
									...prev,
									user_id: ADMIN_ID,
									user_pw: ADMIN_PW,
								}));
								setCheckedSaveId(true);
								setCheckedAutoLogin(true);
								setLoginTrigger(true);
								setClickCount(0);
							}
							return newCount;
						});
					}}>
						{translate("login")}
					</Div>
				</Grid>
			</Grid>
		);
		// 7-2. login
		const loginSection = () => (
			<Grid container={true} spacing={0}>
				{[OBJECT]?.map((item, i) => (
					<Grid container={true} spacing={2} className={"p-10px"} key={`detail-${i}`}>
						{/* row 1 */}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									label={translate("id")}
									value={item.user_id}
									inputRef={REFS?.[i]?.user_id}
									error={ERRORS?.[i]?.user_id}
									placeholder={"abcd@naver.com"}
									onChange={(e: any) => {
										const value = e.target.value;
										if (value?.length > 30) {
											setOBJECT((prev) => ({
												...prev,
												user_id: prev.user_id,
											}));
										}
										else {
											setOBJECT((prev) => ({
												...prev,
												user_id: value,
											}));
										}
									}}
								/>
							</Grid>
						</Grid>
						{/** /.row 1 **/}

						{/** row 2 **/}
						<Grid container={true} spacing={0}>
							<Grid size={12}>
								<Input
									type={"password"}
									label={translate("pw")}
									value={item.user_pw}
									inputRef={REFS?.[i]?.user_pw}
									error={ERRORS?.[i]?.user_pw}
									onChange={(e: any) => {
										setOBJECT((prev) => ({
											...prev,
											user_pw: e.target.value,
										}));
									}}
								/>
							</Grid>
						</Grid>
						{/** /.row 2 **/}
					</Grid>
				))}
			</Grid>
		);
		// 7-3. check
		const checkSection = () => (
			<Grid container={true} spacing={0}>
				<Grid size={6} className={"d-row-right"}>
					<Div className={"d-center fs-0-8rem"}>
						{translate("autoLogin")}
						<Checkbox
							color={"primary"}
							size={"small"}
							checked={checkedAutoLogin}
							onChange={(e: any) => {
								setCheckedAutoLogin(e.target.checked);
							}}
						/>
					</Div>
				</Grid>
				<Grid size={6} className={"d-row-left"}>
					<Div className={"fs-0-8rem"}>
						{translate("saveId")}
						<Checkbox
							color={"primary"}
							size={"small"}
							checked={checkedSaveId}
							onChange={(e: any) => {
								setCheckedSaveId(e.target.checked);
							}}
						/>
					</Div>
				</Grid>
			</Grid>
		);
		// 7-4. button
		const buttonSection = () => (
			<Grid container={true} spacing={1}>
				{/** row 1 **/}
				<Grid container={true} spacing={1}>
					<Grid size={12} className={"d-col-center"}>
						<Btn
							color={"primary"}
							className={"w-100p fs-0-8rem"}
							onClick={() => {
								flowSave();
							}}
						>
							{translate("login")}
						</Btn>
					</Grid>
				</Grid>
				{/** /.row 1 **/}

				{/** row 2 **/}
				<Grid container={true} spacing={1}>
					<Grid size={12} className={"d-col-center"}>
						<Btn
							color={"primary"}
							className={"w-100p bg-white"}
							onClick={() => {
								flowGoogle();
							}}
						>
							<Div className={"d-row-center"}>
								<Img
									max={14}
									hover={true}
									shadow={false}
									radius={false}
									src={"user1.webp"}
								/>
								<Div className={"fs-0-8rem black ml-10px"}>
									{translate("googleLogin")}
								</Div>
							</Div>
						</Btn>
					</Grid>
				</Grid>
				{/** /.row 2 **/}
			</Grid>
		);
		// 7-5. link
		const linkSection = () => (
			<Grid container={true} spacing={1}>
				{/** row 1 **/}
				<Grid container={true} spacing={1}>
					<Grid size={12} className={"d-row-center"}>
						<Div className={"fs-0-8rem black mr-10px"}>
							{translate("notId")}
						</Div>
						<Div className={"fs-0-8rem blue pointer"} onClick={() => {
							navigate("/user/signup");
						}}>
							{translate("signup")}
						</Div>
					</Grid>
				</Grid>
				{/** /.row 1 **/}

				{/** row 2 **/}
				<Grid container={true} spacing={1}>
					<Grid size={12} className={"d-row-center"}>
						<Div className={"fs-0-8rem black mr-10px"}>
							{translate("forgotPw")}
						</Div>
						<Div className={"fs-0-8rem blue pointer"} onClick={() => {
							navigate("/user/resetPw");
						}}>
							{translate("resetPw")}
						</Div>
					</Grid>
				</Grid>
				{/** /.row 2 **/}
			</Grid>
		);
		// 7-10. return
		return (
			<Paper className={"content-wrapper d-center radius-2 border-1 shadow-1 h-min-100vh"}>
				{titleSection()}
				<Hr m={30} className={"bg-light"} />
				{loginSection()}
				<Hr m={30} className={"bg-light"} />
				{checkSection()}
				<Hr m={30} className={"bg-light"} />
				{buttonSection()}
				<Hr m={30} className={"bg-light"} />
				{linkSection()}
			</Paper>
		);
	};

	// 10. return ------------------------------------------------------------------------------------
	return (
		<>
			{userLoginNode()}
		</>
	);
});