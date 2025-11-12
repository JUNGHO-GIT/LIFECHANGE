// UserAppSetting.tsx

import { useState, memo } from "@exportReacts";
import { useCommonValue } from "@exportHooks";
import { useStoreLanguage, useStoreConfirm } from "@exportStores";
import { setLocal } from "@exportScripts";
import { PopUp } from "@exportContainers";
import { Icons, Img, Div, Br, Paper, Grid } from "@exportComponents";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const UserAppSetting = memo(() => {

	// 1. common ----------------------------------------------------------------------------------
  const { navigate, isAdmin, localLang } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setCONFIRM } = useStoreConfirm();

	// 2-2. useState -------------------------------------------------------------------------------
  const [lang, setLang] = useState<string | undefined>(localLang);

  // 4-1. handle -------------------------------------------------------------------------------------
  const handleLogout = () => {
	setLocal("setting", "id", "", {
      autoLogin: "false",
      autoLoginId: "",
      autoLoginPw: "",
    });
    sessionStorage.clear();
    navigate("/user/login");
  };

  // 4-2. handle -------------------------------------------------------------------------------------
  const handleChangeLanguage = (lang: string) => {
    setLang(lang);
	setLocal("setting", "locale", "lang", lang);
		window.location.reload();
	};

  // 4-3. handle -------------------------------------------------------------------------------------
  const handleClearStorage = async () => {
    const confirmResult = new Promise((resolve) => {
      setCONFIRM({
        open: true,
        msg: translate("clearStorage"),
      }, (confirmed: boolean) => {
        resolve(confirmed);
      });
    });
    if (await confirmResult) {
      localStorage.clear();
    }
  };

  // 7. userAppSetting ----------------------------------------------------------------------------
  const userAppSettingNode = () => {
    // 7-1. detail
    const detailSection = () => (
			<Grid container={true} spacing={0} className={"border-1 radius-2 shadow-0"}>
				<Grid size={12}>
					<TableContainer>
						<Table>
							<TableBody className={"table-tbody"}>
								{/** detail **/}
								<TableRow
									className={"pointer"}
									onClick={() => {
										navigate("/user/detail")
									}}
								>
									<TableCell className={"w-90vw p-15px"}>
										{translate("userInformation")}
									</TableCell>
									<TableCell className={"w-10vw p-15px"}>
										<Icons
											name={"ChevronRight"}
											className={"w-16px h-16px"}
										/>
									</TableCell>
								</TableRow>
								{/** category **/}
								<TableRow
									className={"pointer"}
									onClick={() => {
										navigate("/user/category")
									}}
								>
									<TableCell className={"w-90vw p-15px"}>
										{translate("category")}
									</TableCell>
									<TableCell className={"w-10vw p-15px"}>
										<Icons
											name={"ChevronRight"}
											className={"w-16px h-16px"}
										/>
									</TableCell>
								</TableRow>
								{/** dashboard **/}
								<TableRow
									className={`${isAdmin !== "true" ? "d-none" : ""} pointer`}
									onClick={() => {
										navigate("/admin/dashboard")
									}}
								>
									<TableCell className={"w-90vw p-15px"}>
										{translate("dashboard")}
									</TableCell>
									<TableCell className={"w-10vw p-15px"}>
										<Icons
											name={"ChevronRight"}
											className={"w-16px h-16px"}
										/>
									</TableCell>
								</TableRow>
								{/** language **/}
								<PopUp
									type={"innerCenter"}
									position={"center"}
									direction={"center"}
									contents={
										<Div className={"d-col-left p-5px"}>
											<Div
												className={"d-row-center pointer"}
												onClick={() => {
													handleChangeLanguage("en")
												}}
											>
												<Img
													max={24}
													hover={true}
													shadow={false}
													radius={false}
													src={"flag2.webp"}
													className={"mr-15px"}
												/>
												<Div className={`${lang === "en" ? "fw-700" : ""}`}>
													English
												</Div>
												<Icons
													key={"Check"}
													name={"Check"}
													className={`w-16px h-16px black ${lang === "en" ? "" : "d-none"}`}
												/>
											</Div>
											<Br m={20} />
											<Div
												className={"d-center pointer"}
												onClick={() => {
													handleChangeLanguage("ko")
												}}
											>
												<Img
													max={24}
													hover={true}
													shadow={false}
													radius={false}
													src={"flag1.webp"}
													className={"mr-15px"}
												/>
												<Div className={`${lang === "ko" ? "fw-700" : ""}`}>
													한국어
												</Div>
												<Icons
													key={"Check"}
													name={"Check"}
													className={`w-16px h-16px black ${lang === "ko" ? "" : "d-none"}`}
												/>
											</Div>
										</Div>
									}
									children={(popTrigger: any) => (
										<TableRow
											className={"pointer"}
											onClick={(e: any) => {
												popTrigger.openPopup(e.currentTarget)
											}}
										>
											<TableCell className={"w-90vw p-15px"}>
												{translate("language")}
											</TableCell>
											<TableCell className={"w-10vw p-15px"}>
												<Icons
													key={"ChevronRight"}
													name={"ChevronRight"}
													className={"w-16px h-16px"}
												/>
											</TableCell>
										</TableRow>
									)}
								/>
								{/** app info **/}
								<TableRow
									className={"pointer"}
									onClick={() => {
										navigate("/user/appInfo")
									}}
								>
									<TableCell className={"w-90vw p-15px"}>
										{translate("appInfo")}
									</TableCell>
									<TableCell className={"w-10vw p-15px"}>
										<Icons
											name={"ChevronRight"}
											className={"w-16px h-16px"}
										/>
									</TableCell>
								</TableRow>
								{/** privacy **/}
								<TableRow
									className={"pointer"}
									onClick={() => {
										navigate("/auth/privacy")
									}}
								>
									<TableCell className={"w-90vw p-15px"}>
										{translate("privacy")}
									</TableCell>
									<TableCell className={"w-10vw p-15px"}>
										<Icons
											name={"ChevronRight"}
											className={"w-16px h-16px"}
										/>
									</TableCell>
								</TableRow>
								{/** clear storage **/}
								<TableRow
									className={`${isAdmin !== "true" ? "d-none" : ""} pointer`}
									onClick={() => {
										handleClearStorage();
									}}
								>
									<TableCell className={"w-90vw p-15px"}>
										{translate("clearStorage")}
									</TableCell>
									<TableCell className={"w-10vw p-15px"}>
										<Icons
											name={"ChevronRight"}
											className={"w-16px h-16px"}
										/>
									</TableCell>
								</TableRow>
								{/** logout **/}
								<TableRow
									className={"pointer"}
									onClick={() => {
										handleLogout();
									}}
								>
									<TableCell className={"w-90vw p-15px"}>
										{translate("logout")}
									</TableCell>
									<TableCell className={"w-10vw p-15px"}>
										<Icons
											name={"ChevronRight"}
											className={"w-16px h-16px"}
										/>
									</TableCell>
								</TableRow>
								{/** delete **/}
								<TableRow
									className={"pointer"}
									onClick={() => {
										navigate("/user/delete")
									}}
								>
									<TableCell className={"w-90vw p-15px red"}>
										{translate("userDelete")}
									</TableCell>
									<TableCell className={"w-10vw p-15px"}>
										<Icons
											name={"ChevronRight"}
											className={"w-16px h-16px"}
										/>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
		);
    // 7-10. return
    return (
      <Paper className={"content-wrapper d-center border-1 radius-2 h-min-90vh"}>
        {detailSection()}
      </Paper>
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {userAppSettingNode()}
    </>
  );
});