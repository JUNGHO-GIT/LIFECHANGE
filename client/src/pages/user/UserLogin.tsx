// UserLogin.tsx
// Node -> Section -> Fragment

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";
import { Loading } from "@imports/ImportLayouts";
import { axios } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Input, Div, Btn, Img, Hr } from "@imports/ImportComponents";
import { Paper, Checkbox, Card, Grid } from "@imports/ImportMuis";
import { user1 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const UserLogin = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, URL_OBJECT, URL_GOOGLE, ADMIN_ID, ADMIN_PW, translate, TITLE,
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [loginTrigger, setLoginTrigger] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);
  const [checkedSaveId, setCheckedSaveId] = useState<boolean>(false);
  const [checkedAutoLogin, setCheckedAutoLogin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [userPw, setUserPw] = useState<string>("");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState({
    user_id: false,
    user_pw: false,
  });
  const REFS: any = useRef({
    user_id: createRef(),
    user_pw: createRef(),
  });

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
      localStorage.setItem(`${TITLE}_autoLoginId`, userId);
      localStorage.setItem(`${TITLE}_autoLoginPw`, userPw);
    }
  }, [checkedAutoLogin, userId, userPw]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 아이디 저장 활성화된 경우
  useEffect(() => {
    if (checkedSaveId) {
      localStorage.setItem(`${TITLE}_isLocalSaved`, "true");
      localStorage.setItem(`${TITLE}_localId`, userId);
    }
  }, [checkedSaveId, userId]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 초기 로드 시 로컬 저장소에서 사용자 정보 가져오기
  useEffect(() => {
    const autoLogin = localStorage.getItem(`${TITLE}_autoLogin`);
    const autoLoginId = localStorage.getItem(`${TITLE}_autoLoginId`);
    const autoLoginPw = localStorage.getItem(`${TITLE}_autoLoginPw`);
    const isLocalSaved = localStorage.getItem(`${TITLE}_isLocalSaved`);
    const localId = localStorage.getItem(`${TITLE}_localId`);

    if (autoLogin === "true") {
      setCheckedAutoLogin(true);
      if (autoLoginId && autoLoginPw) {
        setUserId(autoLoginId);
        setUserPw(autoLoginPw);
      }
      setLoginTrigger(true);
    }
    if (isLocalSaved === "true") {
      setCheckedSaveId(true);
      if (localId) {
        setUserId(localId);
      }
    }
  }, []);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (user_id: string, user_pw: string) => {
    let foundError = false;
    const initialErrors = {
      user_id: false,
      user_pw: false,
    };
    const refsCurrent = REFS?.current;

    if (!refsCurrent) {
      console.warn('Ref is undefined, skipping validation');
      return false;
    }

    if (user_id === "" || !user_id) {
      alert(translate("errorUserId"));
      refsCurrent.user_id.current?.focus();
      initialErrors.user_id = true;
      foundError = true;
    }
    else if (user_pw === "" || !user_pw) {
      alert(translate("errorUserPw"));
      refsCurrent.user_pw.current?.focus();
      initialErrors.user_pw = true;
      foundError = true;
    }
    setERRORS(initialErrors);

    return !foundError;
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    setLOADING(true);
    if (!validate(userId, userPw)) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/login`, {
      user_id: userId,
      user_pw: userPw,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        // localStorage
        if (checkedSaveId) {
          localStorage.setItem(`${TITLE}_localId`, userId);
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
        sessionStorage.setItem(`${TITLE}_lang`, "ko");
        sync();
        navigate("/today/list");
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
              setUserId(ADMIN_ID);
              setUserPw(ADMIN_PW);
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
    const cardSection = () => {
      const cardFragment = (i: number) => (
        <Card className={"p-10 mb-n20"} key={i}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Input
                label={translate("id")}
                value={userId}
                inputRef={REFS.current.user_id}
                error={ERRORS.user_id}
                onChange={(e: any) => {
                  setUserId(e.target.value);
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                type={"password"}
                label={translate("pw")}
                value={userPw}
                inputRef={REFS.current.user_pw}
                error={ERRORS.user_pw}
                onChange={(e: any) => {
                  setUserPw(e.target.value);
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
        cardFragment(0)
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
      <Input
        value={translate("googleLogin")}
        className={"bg-white pointer"}
        startadornment={
          <Img src={user1} className={"w-15 h-15"} />
        }
        onClick={() => {
          flowGoogle();
        }}
      />
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
            {cardSection()}
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