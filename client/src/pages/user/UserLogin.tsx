// UserLogin.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useTranslate, useTimeZone } from "@imports/ImportHooks";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Input, Div, Btn, Img, Hr } from "@imports/ImportComponents";
import { Paper, Checkbox, Card, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserLogin = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useTranslate();
  const {
    navigate, URL_OBJECT, URL_GOOGLE, ADMIN_ID, ADMIN_PW, TITLE,
  } = useCommonValue();
  const {
    ERRORS, REFS, validate
  } = useValidateUser();

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
  const flowSave = async () => {
    setLOADING(true);
    if (!validate(OBJECT)) {
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
        sessionStorage.setItem(`${TITLE}_category`, JSON.stringify(res.data.result.dataCategory));
        sync();
        navigate("/today/list");
      }
      else if (res.data.status === "isGoogleUser") {
        alert(translate(res.data.msg));
        sessionStorage.setItem(`${TITLE}_sessionId`, "");
      }
      else {
        alert(translate(res.data.msg));
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
  const flowGoogle = async () => {
    axios.get(`${URL_GOOGLE}/login`)
    .then((res: any) => {
      if (res.data.status === "success") {
        window.location.href = res.data.url;
      }
      else {
        alert(translate(res.data.msg));
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
      <Div
        className={"d-center fs-2-0rem p-0"}
        onClick={() => {
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
        }}
      >
        {translate("login")}
      </Div>
    );
    // 7-2. card
    const detailSection = () => {
      const detailFragment = (i: number) => (
        <Card className={"p-10 mb-n20"} key={i}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Input
                label={translate("id")}
                value={OBJECT.user_id}
                inputRef={REFS.current[i]?.user_id}
                error={ERRORS[i]?.user_id}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_id: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                type={"password"}
                label={translate("pw")}
                value={OBJECT.user_pw}
                inputRef={REFS.current[i]?.user_pw}
                error={ERRORS[i]?.user_pw}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_pw: e.target.value,
                  }));
                }}
              />
            </Grid>
            <Grid size={6} className={"d-right"}>
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
            <Grid size={6} className={"d-left"}>
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
        detailFragment(0)
      );
    };
    // 7-3. button
    const buttonSection = () => (
      <Btn
        color={"primary"}
        className={"w-100p fs-1-0rem"}
        onClick={() => {
          flowSave();
        }}
      >
        {translate("login")}
      </Btn>
    );
    // 7-4. google
    const googleSection = () => (
      <Btn
        color={"primary"}
        className={"w-100p fs-1-0rem bg-white black"}
        onClick={() => {
          flowGoogle();
        }}
      >
        <Img
        	key={"user1"}
        	src={"user1"}
        	className={"w-15 h-15 me-10"}
        />
        {translate("googleLogin")}
      </Btn>
    );
    // 7-5. toSignup
    const toSignupSection = () => (
      <Div className={"d-center fs-0-8rem"}>
        {translate("notId")}
        <Div className={"d-center blue pointer ms-10"} onClick={() => {
          navigate("/user/signup");
        }}>
          {translate("signup")}
        </Div>
      </Div>
    );
    // 7-6. toResetPw
    const toResetPwSection = () => (
      <Div className={"d-center fs-0-8rem"}>
        {translate("forgotPw")}
        <Div className={"d-center blue pointer ms-10"} onClick={() => {
          navigate("/user/resetPw");
        }}>
          {translate("resetPw")}
        </Div>
      </Div>
    );
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper d-center radius border h-min100vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {titleSection()}
          </Grid>
          <Hr px={10} />
          <Grid size={12}>
            {detailSection()}
          </Grid>
          <Hr px={10} />
          <Grid size={12}>
            {buttonSection()}
          </Grid>
          <Grid size={12}>
            {googleSection()}
          </Grid>
          <Hr px={10} />
          <Grid size={12}>
            {toSignupSection()}
          </Grid>
          <Grid size={12}>
            {toResetPwSection()}
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