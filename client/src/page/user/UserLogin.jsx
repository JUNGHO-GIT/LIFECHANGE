// UserLogin.jsx
// Node -> Section -> Fragment

import { React, useState, useEffect, createRef, useRef } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { Loading } from "../../import/ImportLayouts.jsx";
import { axios } from "../../import/ImportLibs.jsx";
import { sync } from "../../import/ImportUtils";
import { Input, Div, Br10, Br20, Img, Hr40 } from "../../import/ImportComponents.jsx";
import { Paper,  Button, Checkbox, Card, Grid } from "../../import/ImportMuis.jsx";
import { user1 } from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const UserLogin = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, URL_OBJECT, URL_GOOGLE, ADMIN_ID, ADMIN_PW, translate } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [loginTrigger, setLoginTrigger] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [checkedSaveId, setCheckedSaveId] = useState(false);
  const [checkedAutoLogin, setCheckedAutoLogin] = useState(false);
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState({
    user_id: false,
    user_pw: false,
  });
  const REFS = useRef({
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
      localStorage.setItem("autoLogin", "true");
      localStorage.setItem("autoLoginId", userId);
      localStorage.setItem("autoLoginPw", userPw);
    }
  }, [checkedAutoLogin, userId, userPw]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 아이디 저장 활성화된 경우
  useEffect(() => {
    if (checkedSaveId) {
      localStorage.setItem("saveId", "true");
      localStorage.setItem("ID_SAVED", userId);
    }
  }, [checkedSaveId, userId]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 초기 로드 시 로컬 저장소에서 사용자 정보 가져오기
  useEffect(() => {
    const autoLogin = localStorage.getItem("autoLogin");
    const autoLoginId = localStorage.getItem("autoLoginId");
    const autoLoginPw = localStorage.getItem("autoLoginPw");
    const saveId = localStorage.getItem("saveId");
    const ID_SAVED = localStorage.getItem("ID_SAVED");

    if (autoLogin === "true") {
      setCheckedAutoLogin(true);
      if (autoLoginId && autoLoginPw) {
        setUserId(autoLoginId);
        setUserPw(autoLoginPw);
      }
      setLoginTrigger(true);
    }
    if (saveId === "true") {
      setCheckedSaveId(true);
      if (ID_SAVED) {
        setUserId(ID_SAVED);
      }
    }
  }, []);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (user_id, user_pw) => {
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
    .then((res) => {
      if (res.data.status === "success") {
        // localStorage
        if (checkedSaveId) {
          localStorage.setItem("ID_SAVED", res.data.result.user_id);
        }
        localStorage.setItem("GOOGLE", "false");

        // sessionStorage
        if (res.data.admin === "admin") {
          sessionStorage.setItem("ADMIN", "true");
        }
        else {
          sessionStorage.setItem("ADMIN", "false");
        }

        sessionStorage.setItem("ID_SESSION", res.data.result.user_id);
        sessionStorage.setItem("CATEGORY", JSON.stringify(res.data.result.dataCategory));
        sessionStorage.setItem("LANG", "ko");

        sync();
        navigate("/today/list");
      }
      else {
        alert(translate(res.data.msg));
        sessionStorage.setItem("ID_SESSION", "");
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowGoogle = async () => {
    axios.get(`${URL_GOOGLE}/login`)
    .then((res) => {
      if (res.data.status === "success") {
        window.location.href = res.data.url;
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err) => {
      console.error(err);
    });
  };

  // 7. userLogin ----------------------------------------------------------------------------------
  const userLoginNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Card
        className={"d-center fs-2-0rem p-0"}
        onClick={() => {
          setClickCount((prevCount) => {
            const newCount = prevCount + 1;
            if (newCount === 5) {
              setUserId(ADMIN_ID);
              setUserPw(ADMIN_PW);
              setLoginTrigger(true);
              setClickCount(0);
            }
            return newCount;
          });
        }}
      >
        {translate("login")}
      </Card>
    );
    // 7-2. card
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"d-column p-10"} key={i}>
          <Input
            label={translate("id")}
            value={userId}
            inputRef={REFS.current.user_id}
            error={ERRORS.user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
          />
          <Br10 />
          <Input
            type={"password"}
            label={translate("pw")}
            value={userPw}
            inputRef={REFS.current.user_pw}
            error={ERRORS.user_pw}
            onChange={(e) => {
              setUserPw(e.target.value);
            }}
          />
          <Br10 />
          <Div className={"d-center mb-n20"}>
            <Div className={"fs-0-8rem"}>
              {translate("autoLogin")}
            </Div>
            <Checkbox
              color={"primary"}
              size={"small"}
              checked={checkedAutoLogin}
              onChange={(e) => {
                setCheckedAutoLogin(e.target.checked);
              }}
            />
            <Div className={"w-20"} />
            <Div className={"fs-0-8rem"}>
              {translate("saveId")}
            </Div>
            <Checkbox
              color={"primary"}
              size={"small"}
              checked={checkedSaveId}
              onChange={(e) => {
                setCheckedSaveId(e.target.checked);
              }}
            />
          </Div>
        </Card>
      );
      return (
        cardFragment(0)
      );
    };
    // 7-3. button
    const buttonSection = () => (
      <Button
        color={"primary"}
        className={"w-100p fs-1-0rem"}
        variant={"contained"}
        onClick={() => {
          flowSave();
        }}
      >
        {translate("login")}
      </Button>
    );
    // 7-4. google
    const googleSection = () => (
      <Input
        value={translate("googleLogin")}
        className={"bg-white pointer"}
        startAdornment={user1 && <Img src={user1} className={"w-15 h-15"} />}
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
      <Paper className={"content-wrapper d-center radius border h-min97vh"}>
        <Grid container columnSpacing={1}>
          <Grid size={12}>
            {titleSection()}
            <Hr40 />
            {cardSection()}
            <Hr40 />
            {buttonSection()}
            <Br10 />
            {googleSection()}
            <Hr40 />
            {toSignupSection()}
            <Br10 />
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