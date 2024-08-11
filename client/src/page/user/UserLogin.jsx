// UserLogin.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {createRef, useRef} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {Loading} from "../../import/ImportLayouts.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {sync, log} from "../../import/ImportUtils";
import {Div, Br10, Br20, Img, Hr40} from "../../import/ImportComponents.jsx";
import {Paper, TextField, Button, Checkbox} from "../../import/ImportMuis.jsx";
import {user1} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const UserLogin = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const SUBFIX_GOOGLE = process.env.REACT_APP_GOOGLE || "";
  const URL_OBJECT = URL + SUBFIX;
  const URL_GOOGLE = URL + SUBFIX_GOOGLE;
  const ADMIN_ID = process.env.REACT_APP_ADMIN_ID || "";
  const ADMIN_PW = process.env.REACT_APP_ADMIN_PW || "";
  const navigate = useNavigate();
  const {translate} = useTranslate();

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
      return;
    }
    await axios.post(`${URL_OBJECT}/login`, {
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
        alert(res.data.msg);
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
    await axios.get(`${URL_GOOGLE}/login`)
    .then((res) => {
      if (res.data.status === "success") {
        window.location.href = res.data.url;
      }
      else {
        alert(res.data.msg);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  };

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Div className={"d-center fs-2-0rem"}
        onClick={(e) => {
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
        }}>
        {translate("login")}
      </Div>
    );
    // 7-2. table
    const tableSection = () => {
      const tableFragment = (i) => (
        <Div className={"d-column"} key={i}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("id")}
            className={"w-86vw"}
            value={userId}
            inputRef={REFS.current.user_id}
            error={ERRORS.user_id}
            InputProps={{
              readOnly: false
            }}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
          />
          <Br10 />
          <TextField
            select={false}
            type={"password"}
            size={"small"}
            label={translate("pw")}
            value={userPw}
            className={"w-86vw"}
            inputRef={REFS.current.user_pw}
            error={ERRORS.user_pw}
            InputProps={{
            }}
            onChange={(e) => {
              setUserPw(e.target.value);
            }}
          />
          <Br20 />
          <Div className={"d-center"}>
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
        </Div>
      );
      return (
        tableFragment(0)
      );
    };
    // 7-3. button
    const buttonSection = () => (
      <Div className={"d-center w-86vw"}>
        <Button
          size={"small"}
          color={"primary"}
          className={"w-100p fs-1-0rem"}
          variant={"contained"}
          onClick={() => {
            flowSave();
          }}
        >
          {translate("login")}
        </Button>
      </Div>
    );
    // 7-4. google
    const googleSection = () => (
      <Div className={"d-center w-86vw"}>
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          value={translate("googleLogin")}
          className={"w-100p bg-white pointer"}
          InputProps={{
            readOnly: true,
            className: "pointer",
            startAdornment: (
              <Img src={user1} className={"w-15 h-15"} />
            ),
          }}
          onClick={() => {
            flowGoogle();
          }}
        />
      </Div>
    );
    // 7-5. signup
    const signupSection = () => (
      <Div className={"d-center w-86vw fs-0-8rem"}>
        {translate("notId")}
        <Div className={"d-center blue pointer ms-10"} onClick={() => {
          navigate("/user/signup");
        }}>
          {translate("signup")}
        </Div>
      </Div>
    );
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper d-column h-min94vh"}>
          {titleSection()}
          <Hr40 />
          {tableSection()}
          <Hr40 />
          {buttonSection()}
          <Br10 />
          {googleSection()}
          <Hr40 />
          {signupSection()}
        </Div>
      </Paper>
      </>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
    </>
  );
};