/**
 * @file UserLogin.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { React, useState, useEffect, useRef, memo } from "@exportReacts";
import { useCommonValue, useValidateUser } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { axios } from "@exportLibs";
import { sync, getLocal, setLocal, setSession } from "@exportScripts";
import { User, UserType } from "@exportSchemas";
import { Input } from "@exportContainers";
import { Icons, Div, Btn, Hr, Paper, Grid } from "@exportComponents";
import { Checkbox } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const UserLogin = memo(() => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, URL_GOOGLE, navigate } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();
  const { ERRORS, REFS, validate } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ OBJECT, setOBJECT ] = useState<UserType>(User);
  const [ checkedSaveId, setCheckedSaveId ] = useState<boolean>(false);
  const [ checkedAutoLogin, setCheckedAutoLogin ] = useState<boolean>(false);

  // 2-3. useRef --------------------------------------------------------------------------------
  const objectRef: React.RefObject<UserType> = useRef(OBJECT);

  // 2-3. useEffect ------------------------------------------------------------------------------
  useEffect(() => {
    OBJECT !== objectRef.current && (objectRef.current = OBJECT);
  }, [OBJECT]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  // 초기 로드 시 보관된 토큰으로 세션 복원 (평문 비밀번호 보관 방식을 대체함)
  useEffect(() => {
    const { autoLogin, autoLoginId, autoLoginToken } = getLocal(`setting`, `id`, ``) || {};

    // 자동로그인 미사용 또는 보관 토큰 부재
    if (autoLogin !== `true` || !autoLoginToken) {
      setCheckedAutoLogin(false);
      return;
    }

    setCheckedAutoLogin(true);
    setOBJECT((prev) => ({
      ...prev,
      user_id: autoLoginId ?? ``,
    }));
    setLOADING(true);
    axios.get(`${URL_OBJECT}/session`)
    .then((res: any) => {
      if (res.data.status === `success`) {
        setSession(`setting`, `id`, ``, {
          sessionId: res.data.result.user_id,
          admin: res.data.admin === `admin` ? `true` : `false`,
          token: autoLoginToken,
        });
        void navigate(`/calendar/list`);
        void sync();
      }
    })
    .catch(() => {
      // 토큰 만료·폐기는 인터셉터가 자격을 정리하므로 로그인 화면을 그대로 유지함
    })
    .finally(() => {
      setLOADING(false);
    });
  }, []);

  // 2-3. useEffect -----------------------------------------------------------------------------
  // 초기 로드 시 아이디 저장 설정 가져오기
  useEffect(() => {
    const { isSaved, isSavedId } = getLocal(`setting`, `id`, ``) || {};
    // 아이디 저장 o
    if (isSaved === `true`) {
      setCheckedSaveId(true);
      setOBJECT((prev) => ({
        ...prev,
        user_id: isSavedId,
      }));
    }
    // 아이디 저장 x
    else if (isSaved === `false`) {
      setCheckedSaveId(false);
      setOBJECT((prev) => ({
        ...prev,
        user_id: ``,
      }));
    }
  }, []);

  // 2-3. useEffect -----------------------------------------------------------------------------
  // 자동로그인 해제만 여기서 처리하고, 자격(토큰) 저장은 로그인 성공 시점에만 수행함
  useEffect(() => {
    if (!checkedAutoLogin) {
      setLocal(`setting`, `id`, ``, {
        autoLogin: `false`,
        autoLoginId: ``,
        autoLoginToken: ``,
      });
    }
  }, [checkedAutoLogin]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  // 아이디 저장 활성화된 경우
  useEffect(() => {
    if (checkedSaveId) {
      setLocal(`setting`, `id`, ``, {
        isSaved: `true`,
        isSavedId: OBJECT.user_id,
      });
    }
    else {
      setLocal(`setting`, `id`, ``, {
        isSaved: `false`,
        isSavedId: ``,
      });
    }
  }, [ checkedSaveId, OBJECT.user_id ]);

  // 3. flow ---------------------------------------------------------------------------------------
  async function flowSave() {
    setLOADING(true);
    if (!await validate(objectRef.current, `login`, ``)) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/login`, {
      user_id: objectRef.current.user_id,
      user_pw: objectRef.current.user_pw,
    })
    .then((res: any) => {
      if (res.data.status === `success`) {
        setLOADING(false);
        setSession(`setting`, `id`, ``, {
          sessionId: res.data.result.user_id,
          admin: res.data.admin === `admin` ? `true` : `false`,
          token: res.data.token ?? ``,
        });
        // 자동로그인 선택 시 평문 비밀번호 대신 액세스 토큰만 보관함
        setLocal(`setting`, `id`, ``, checkedAutoLogin ? {
          autoLogin: `true`,
          autoLoginId: res.data.result.user_id,
          autoLoginToken: res.data.token ?? ``,
        } : {
          autoLogin: `false`,
          autoLoginId: ``,
          autoLoginToken: ``,
        });
        void navigate(`/calendar/list`);
        void sync();
      }
      else if (res.data.status === `isGoogle`) {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `error`,
        });
        setSession(`setting`, `id`, ``, {
          sessionId: ``,
          admin: `false`,
        });
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `error`,
        });
        setSession(`setting`, `id`, ``, {
          sessionId: ``,
          admin: `false`,
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

  // 3. flow ---------------------------------------------------------------------------------------
  const flowGoogle = () => {
    axios.get(`${URL_GOOGLE}/login`)
    .then((res: any) => {
      if (res.data.status === `success`) {
        setLOADING(false);
        window.location.href = res.data.url;
      }
      else {
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
    });
  };

  // 7. userLogin ----------------------------------------------------------------------------------
  const userLoginNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Grid container={true} spacing={1}>
        <Grid size={12}>
          <Div className={`fs-1-8rem fw-500`}>
            {translate(`login`)}
          </Div>
        </Grid>
      </Grid>
    );
    // 7-2. login
    const loginSection = () => (
      <Grid container={true} spacing={0}>
        {[OBJECT]?.map((item, i) => (
          <Grid container={true} spacing={2} className={`p-10px`} key={`detail-${i}`}>
            {/* row 1 */}
            <Grid container={true} spacing={0}>
              <Grid size={12}>
                <Input
                  label={translate(`id`)}
                  value={item.user_id}
                  inputRef={REFS?.[i]?.user_id}
                  error={ERRORS?.[i]?.user_id}
                  placeholder={`email@example.com`}
                  onChange={(e: any) => {
                    const value: string = e.target.value;
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

            {/** row 2 * */}
            <Grid container={true} spacing={0}>
              <Grid size={12}>
                <Input
                  type={`password`}
                  label={translate(`pw`)}
                  value={item.user_pw}
                  inputRef={REFS?.[i]?.user_pw}
                  error={ERRORS?.[i]?.user_pw}
                  onChange={(e: any) => {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_pw: e.target.value,
                    }));
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
    // 7-3. check
    const checkSection = () => (
      <Grid container={true} spacing={0}>
        <Grid size={6} className={`d-row-right`}>
          <Div className={`d-center fs-0-8rem`}>
            <span className={`pointer`} onClick={() => setCheckedAutoLogin((prev) => !prev)}>
              {translate(`autoLogin`)}
            </span>
            <Checkbox
              color={`primary`}
              size={`small`}
              checked={checkedAutoLogin}
              slotProps={{ input: { "aria-label": translate(`autoLogin`) } }}
              onChange={(e: any) => {
                setCheckedAutoLogin(e.target.checked);
              }}
            />
          </Div>
        </Grid>
        <Grid size={6} className={`d-row-left`}>
          <Div className={`fs-0-8rem`}>
            <span className={`pointer`} onClick={() => setCheckedSaveId((prev) => !prev)}>
              {translate(`saveId`)}
            </span>
            <Checkbox
              color={`primary`}
              size={`small`}
              checked={checkedSaveId}
              slotProps={{ input: { "aria-label": translate(`saveId`) } }}
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
        {/** row 1 * */}
        <Grid container={true} spacing={1}>
          <Grid size={12} className={`d-col-center`}>
            <Btn
              color={`primary`}
              className={`w-100p fs-0-8rem`}
              onClick={() => {
                void flowSave();
              }}
            >
              {translate(`login`)}
            </Btn>
          </Grid>
        </Grid>

        {/** row 2 * */}
        <Grid container={true} spacing={1}>
          <Grid size={12} className={`d-col-center`}>
            <Btn
              color={`primary`}
              className={`w-100p bg-white`}
              onClick={() => {
                flowGoogle();
              }}
            >
              <Div className={`d-row-center`}>
                <Icons
                  key={`user1`}
                  name={`user1`}
                  isIconButton={false}
                  className={`w-18px h-18px hover`}
                />
                <Div className={`fs-0-8rem black ml-10px`}>
                  {translate(`googleLogin`)}
                </Div>
              </Div>
            </Btn>
          </Grid>
        </Grid>
      </Grid>
    );
    // 7-5. link
    const linkSection = () => (
      <Grid container={true} spacing={1}>
        {/** row 1 * */}
        <Grid container={true} spacing={1}>
          <Grid size={12} className={`d-row-center`}>
            <Div className={`fs-0-8rem black mr-10px`}>
              {translate(`notId`)}
            </Div>
            <Div
              className={`fs-0-8rem blue pointer`}
              onClick={() => {
                void navigate(`/user/signup`);
              }}
            >
              {translate(`signup`)}
            </Div>
          </Grid>
        </Grid>

        {/** row 2 * */}
        <Grid container={true} spacing={1}>
          <Grid size={12} className={`d-row-center`}>
            <Div className={`fs-0-8rem black mr-10px`}>
              {translate(`forgotPw`)}
            </Div>
            <Div
              className={`fs-0-8rem blue pointer`}
              onClick={() => {
                void navigate(`/user/resetPw`);
              }}
            >
              {translate(`resetPw`)}
            </Div>
          </Grid>
        </Grid>
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={`content-wrapper d-center radius-3 border-light-1 shadow-1 h-min-100vh`}>
        {titleSection()}
        <Hr m={30} className={`bg-light`} />
        {loginSection()}
        <Hr m={30} className={`bg-light`} />
        {checkSection()}
        <Hr m={30} className={`bg-light`} />
        {buttonSection()}
        <Hr m={30} className={`bg-light`} />
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
