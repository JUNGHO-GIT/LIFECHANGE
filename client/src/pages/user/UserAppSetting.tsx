/**
 * @file UserAppSetting.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, memo } from "@exportReacts";
import { useCommonValue } from "@exportHooks";
import { useStoreLanguage, useStoreConfirm } from "@exportStores";
import { axios } from "@exportLibs";
import { setLocal } from "@exportScripts";
import { PopUp } from "@exportContainers";
import { Icons, Div, Br, Paper, Grid } from "@exportComponents";
import { TableContainer, Table, TableBody, TableRow, TableCell } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const UserAppSetting = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const { navigate, isAdmin, localLang, URL_USER } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setCONFIRM } = useStoreConfirm();

  // 2-2. useState -------------------------------------------------------------------------------
  const [ lang, setLang ] = useState<string | undefined>(localLang);

  // 4-1. handle -------------------------------------------------------------------------------------
  // - 서버 토큼 세대를 갱싱해 보관 중이던 액세스 토큼까지 무효화한 뒤 로컬 자객을 지움
  // - 서버 호출 실패는 로그아웃 자신을 말지 않음 (로컬 정리는 finally 에서 항상 수행)
  const handleLogout = () => {
    void axios.post(`${URL_USER}/logout`, {})
    .catch((error: any) => {
      console.error(error);
    })
    .finally(() => {
      setLocal(`setting`, `id`, ``, {
        autoLogin: `false`,
        autoLoginId: ``,
        autoLoginToken: ``,
        isGoogle: `false`,
      });
      sessionStorage.clear();
      void navigate(`/user/login`);
    });
  };

  // 4-2. handle -------------------------------------------------------------------------------------
  const handleChangeLanguage = (langStr: string) => {
    setLang(langStr);
    setLocal(`setting`, `locale`, `lang`, langStr);
    window.location.reload();
  };

  // 4-3. handle -------------------------------------------------------------------------------------
  const handleClearStorage = async () => {
    const confirmResult: Promise<unknown> = new Promise((resolve) => {
      setCONFIRM({
        open: true,
        msg: translate(`clearStorage`),
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
      <Grid container={true} spacing={0} className={`radius-2 border-light-1 shadow-0`}>
        <Grid size={12}>
          <TableContainer>
            <Table>
              <TableBody className={`table-tbody`}>
                {/** detail * */}
                <TableRow
                  className={`pointer`}
                  onClick={() => {
                    void navigate(`/user/detail`);
                  }}
                >
                  <TableCell className={`w-90vw p-15px`}>
                    {translate(`userInformation`)}
                  </TableCell>
                  <TableCell className={`w-10vw p-15px`}>
                    <Icons
                      name={`ChevronRight`}
                      isIconButton={false}
                      className={`w-16px h-16px`}
                    />
                  </TableCell>
                </TableRow>
                {/** category * */}
                <TableRow
                  className={`pointer`}
                  onClick={() => {
                    void navigate(`/user/category`);
                  }}
                >
                  <TableCell className={`w-90vw p-15px`}>
                    {translate(`category`)}
                  </TableCell>
                  <TableCell className={`w-10vw p-15px`}>
                    <Icons
                      name={`ChevronRight`}
                      isIconButton={false}
                      className={`w-16px h-16px`}
                    />
                  </TableCell>
                </TableRow>
                {/** dashboard * */}
                <TableRow
                  className={`${isAdmin !== `true` ? `d-none` : ``} pointer`}
                  onClick={() => {
                    void navigate(`/admin/dashboard`);
                  }}
                >
                  <TableCell className={`w-90vw p-15px`}>
                    {translate(`dashboard`)}
                  </TableCell>
                  <TableCell className={`w-10vw p-15px`}>
                    <Icons
                      name={`ChevronRight`}
                      isIconButton={false}
                      className={`w-16px h-16px`}
                    />
                  </TableCell>
                </TableRow>
                {/** language * */}
                <PopUp
                  type={`innerCenter`}
                  position={`center`}
                  direction={`center`}
                  contents={(
                    <Div className={`d-col-left p-5px`}>
                      <Div
                        className={`d-row-center pointer`}
                        onClick={() => {
                          handleChangeLanguage(`en`);
                        }}
                      >
                        <Icons
                          key={`flag2`}
                          name={`flag2`}
                          isIconButton={false}
                          className={`w-24px h-24px hover mr-15px`}
                        />
                        <Div className={lang === `en` ? `fw-700` : ``}>
                          {`English`}
                        </Div>
                        <Icons
                          key={`Check`}
                          name={`Check`}
                          isIconButton={false}
                          className={`w-16px h-16px black ${lang === `en` ? `` : `d-none`}`}
                        />
                      </Div>
                      <Br m={20} />
                      <Div
                        className={`d-center pointer`}
                        onClick={() => {
                          handleChangeLanguage(`ko`);
                        }}
                      >
                        <Icons
                          key={`flag1`}
                          name={`flag1`}
                          isIconButton={false}
                          className={`w-24px h-24px hover mr-15px`}
                        />
                        <Div className={lang === `ko` ? `fw-700` : ``}>
                          {`한국어`}
                        </Div>
                        <Icons
                          key={`Check`}
                          name={`Check`}
                          isIconButton={false}
                          className={`w-16px h-16px black ${lang === `ko` ? `` : `d-none`}`}
                        />
                      </Div>
                    </Div>
                  )}
                  children={(popTrigger: any) => (
                    <TableRow
                      className={`pointer`}
                      onClick={(e: any) => {
                        popTrigger.openPopup(e.currentTarget);
                      }}
                    >
                      <TableCell className={`w-90vw p-15px`}>
                        {translate(`language`)}
                      </TableCell>
                      <TableCell className={`w-10vw p-15px`}>
                        <Icons
                          key={`ChevronRight`}
                          name={`ChevronRight`}
                          isIconButton={false}
                          className={`w-16px h-16px`}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                />
                {/** app info * */}
                <TableRow
                  className={`pointer`}
                  onClick={() => {
                    void navigate(`/user/appInfo`);
                  }}
                >
                  <TableCell className={`w-90vw p-15px`}>
                    {translate(`appInfo`)}
                  </TableCell>
                  <TableCell className={`w-10vw p-15px`}>
                    <Icons
                      name={`ChevronRight`}
                      isIconButton={false}
                      className={`w-16px h-16px`}
                    />
                  </TableCell>
                </TableRow>
                {/** privacy * */}
                <TableRow
                  className={`pointer`}
                  onClick={() => {
                    void navigate(`/auth/privacy`);
                  }}
                >
                  <TableCell className={`w-90vw p-15px`}>
                    {translate(`privacy`)}
                  </TableCell>
                  <TableCell className={`w-10vw p-15px`}>
                    <Icons
                      name={`ChevronRight`}
                      isIconButton={false}
                      className={`w-16px h-16px`}
                    />
                  </TableCell>
                </TableRow>
                {/** clear storage * */}
                <TableRow
                  className={`${isAdmin !== `true` ? `d-none` : ``} pointer`}
                  onClick={() => {
                    void handleClearStorage();
                  }}
                >
                  <TableCell className={`w-90vw p-15px`}>
                    {translate(`clearStorage`)}
                  </TableCell>
                  <TableCell className={`w-10vw p-15px`}>
                    <Icons
                      name={`ChevronRight`}
                      isIconButton={false}
                      className={`w-16px h-16px`}
                    />
                  </TableCell>
                </TableRow>
                {/** logout * */}
                <TableRow
                  className={`pointer`}
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  <TableCell className={`w-90vw p-15px`}>
                    {translate(`logout`)}
                  </TableCell>
                  <TableCell className={`w-10vw p-15px`}>
                    <Icons
                      name={`ChevronRight`}
                      isIconButton={false}
                      className={`w-16px h-16px`}
                    />
                  </TableCell>
                </TableRow>
                {/** delete * */}
                <TableRow
                  className={`pointer`}
                  onClick={() => {
                    void navigate(`/user/delete`);
                  }}
                >
                  <TableCell className={`w-90vw p-15px text-danger`}>
                    {translate(`userDelete`)}
                  </TableCell>
                  <TableCell className={`w-10vw p-15px`}>
                    <Icons
                      name={`ChevronRight`}
                      isIconButton={false}
                      className={`w-16px h-16px`}
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
      <Paper className={`content-wrapper d-center radius-2 border-light-1 h-min-90vh`}>
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
