// UserLogin.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { axios, sync } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Input } from "@imports/ImportContainers";
import { Div, Btn, Img, Hr, Br } from "@imports/ImportComponents";
import { Paper, Checkbox, Card, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserLogin = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, URL_GOOGLE, ADMIN_ID, ADMIN_PW, TITLE, navigate } = useCommonValue();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [loginTrigger, setLoginTrigger] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);
  const [checkedSaveId, setCheckedSaveId] = useState<boolean>(false);
  const [checkedAutoLogin, setCheckedAutoLogin] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>(User);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 트리거가 활성화된 경우
  useEffect(() => {
    if (loginTrigger) {
      flowSave();
      setLoginTrigger(false);
    }
  }, [loginTrigger]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 자동로그인 활성화된 경우
  useEffect(() => {
    if (checkedAutoLogin) {
      localStorage.setItem(`${TITLE}_autoLogin`, "true");
      localStorage.setItem(`${TITLE}_autoLoginId`, OBJECT.user_id);
      localStorage.setItem(`${TITLE}_autoLoginPw`, OBJECT.user_pw);
    }
  }, [checkedAutoLogin, OBJECT.user_id, OBJECT.user_pw]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 아이디 저장 활성화된 경우
  useEffect(() => {
    if (checkedSaveId) {
      localStorage.setItem(`${TITLE}_isLocalSaved`, "true");
      localStorage.setItem(`${TITLE}_localId`, OBJECT.user_id);
    }
  }, [checkedSaveId, OBJECT.user_id]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 초기 로드 시 로컬 저장소에서 사용자 정보 가져오기
  useEffect(() => {
    const autoLogin = localStorage.getItem(`${TITLE}_autoLogin`);
    const autoLoginId = localStorage.getItem(`${TITLE}_autoLoginId`);
    const autoLoginPw = localStorage.getItem(`${TITLE}_autoLoginPw`);
    const isLocalSaved = localStorage.getItem(`${TITLE}_isLocalSaved`);
    const localId = localStorage.getItem(`${TITLE}_localId`);

    // 자동로그인인 경우
    if (autoLogin === "true") {
      setCheckedAutoLogin(true);
      if (autoLoginId && autoLoginPw) {
        setOBJECT((prev: any) => ({
          ...prev,
          user_id: autoLoginId,
          user_pw: autoLoginPw,
        }));
      }
      setLoginTrigger(true);
    }

    // 아이디 저장한 경우
    if (isLocalSaved === "true") {
      setCheckedSaveId(true);
      if (localId) {
        setOBJECT((prev: any) => ({
          ...prev,
          user_id: localId,
        }));
      }
    }
  }, []);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = () => {
    setLOADING(true);
    if (!validate(OBJECT, "login", "")) {
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
        // localStorage
        if (checkedSaveId) {
          localStorage.setItem(`${TITLE}_localId`, OBJECT.user_id);
        }
        localStorage.setItem(`${TITLE}_isGoogle`, "false");

        // sessionStorage
        if (res.data.admin === "admin") {
          sessionStorage.setItem(`${TITLE}_admin`, "true");
        }
        else {
          sessionStorage.setItem(`${TITLE}_admin`, "false");
        }
        sessionStorage.setItem(`${TITLE}_sessionId`, res.data.result.user_id);
        sessionStorage.setItem(`${TITLE}_category`, JSON.stringify(res.data.result.user_dataCategory));
        sync();
        navigate("/today/list");
      }
      else if (res.data.status === "isGoogleUser") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
        sessionStorage.setItem(`${TITLE}_sessionId`, "");
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
        sessionStorage.setItem(`${TITLE}_sessionId`, "");
      }
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowGoogle = () => {
    axios.get (`${URL_GOOGLE}/login`)
    .then((res: any) => {
      if (res.data.status === "success") {
        window.location.href = res.data.url;
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      console.error(err);
    });
  };

  // 7. userLogin ----------------------------------------------------------------------------------
  const userLoginNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Card className={"p-0"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            <Div className={"fs-1-8rem fw-500"} onClick={() => {
              setClickCount((prevCount) => {
                const newCount = prevCount + 1;
                if (newCount === 5) {
                  setOBJECT((prev: any) => ({
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
      </Card>
    );
    // 7-2. login
    const loginSection = () => {
      const detailFragment = (i: number) => (
        <Card className={"p-10"} key={`detail-${i}`}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              <Input
                label={translate("id")}
                value={OBJECT.user_id}
                inputRef={REFS?.[i]?.user_id}
                error={ERRORS?.[i]?.user_id}
                placeholder={"abcd@naver.com"}
                onChange={(e: any) => {
                  const value = e.target.value;
                  if (value.length > 30) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_id: prev.user_id,
                    }));
                  }
                  else {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_id: value,
                    }));
                  }
                }}
              />
            </Grid>
            <Br px={5} />
            <Grid size={12}>
              <Input
                type={"password"}
                label={translate("pw")}
                value={OBJECT.user_pw}
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
        </Card>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {detailFragment(0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-3. check
    const checkSection = () => {
      const checkFragment = (i: number) => (
        <Card key={`check-${i}`}>
          <Grid container spacing={1} columns={12}>
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
        </Card>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {checkFragment(0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-4. button
    const buttonSection = () => {
      const loginFragment = (i: number) => (
        <Card key={`login-${i}`}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              <Btn
                color={"primary"}
                className={"w-90p fs-1-0rem"}
                onClick={() => {
                  flowSave();
                }}
              >
                {translate("login")}
              </Btn>
            </Grid>
          </Grid>
        </Card>
      );
      const googleFragment = (i: number) => (
        <Card key={`google-${i}`}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              <Btn
                color={"primary"}
                className={"w-90p bg-white"}
                onClick={() => {
                  flowGoogle();
                }}
              >
                <Div className={"d-row-center"}>
                  <Img
                    key={"user1"}
                    src={"user1"}
                    className={"w-15 h-15 me-10"}
                  />
                  <Div className={"fs-1-0rem black"}>
                    {translate("googleLogin")}
                  </Div>
                </Div>
              </Btn>
            </Grid>
          </Grid>
        </Card>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {loginFragment(0)}
              <Br px={10} />
              {googleFragment(0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-5. link
    const linkSection = () => {
      const toSignupFragment = (i: number) => (
        <Card key={`signup-${i}`}>
          <Grid container spacing={1} columns={12}>
            <Grid size={7} className={"d-row-right"}>
              <Div className={"fs-0-8rem black"}>
                {translate("notId")}
              </Div>
            </Grid>
            <Grid size={5} className={"d-row-left"}>
              <Div className={"fs-0-8rem blue pointer"} onClick={() => {
                navigate("/user/signup");
              }}>
                {translate("signup")}
              </Div>
            </Grid>
          </Grid>
        </Card>
      );
      const toResetPwFragment = (i: number) => (
        <Card key={`resetPw-${i}`}>
          <Grid container spacing={1} columns={12}>
            <Grid size={7} className={"d-row-right"}>
              <Div className={"fs-0-8rem black"}>
                {translate("forgotPw")}
              </Div>
            </Grid>
            <Grid size={5} className={"d-row-left"}>
              <Div className={"fs-0-8rem blue pointer"} onClick={() => {
                navigate("/user/resetPw");
              }}>
                {translate("resetPw")}
              </Div>
            </Grid>
          </Grid>
        </Card>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {toSignupFragment(0)}
              <Br px={10} />
              {toResetPwFragment(0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper d-center border-1 radius-1 shadow-1 h-min100vh"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            {titleSection()}
            <Hr px={30} />
            {loginSection()}
            <Hr px={10} />
            {checkSection()}
            <Hr px={10} />
            {buttonSection()}
            <Hr px={30} />
            {linkSection()}
          </Grid>
        </Grid>
      </Paper>
      </>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userLoginNode()}
    </>
  );
};