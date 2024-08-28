// UserResetPw.jsx
// Node -> Section -> Fragment

import { React, useState, useRef, createRef } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { axios } from "../../import/ImportLibs.jsx";
import { Loading } from "../../import/ImportLayouts.jsx";
import { Empty, Div, Br10, Hr40, Select, Input } from "../../import/ImportComponents.jsx";
import { Paper,  Button, Card, Grid } from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const UserResetPw = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, URL_OBJECT, translate } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [clientCode, setClientCode] = useState("");
  const [LOADING, setLOADING] = useState(false);

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    user_number: 0,
    user_id: "",
    user_id_sended: false,
    user_id_verified: false,
    user_pw: "",
    user_pw_verified: "",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState({
    user_id: false,
    user_id_sended: false,
    user_id_verified: false,
    user_pw: false,
    user_pw_verified: false,
  });
  const REFS = useRef({
    user_id: createRef(),
    user_id_sended: createRef(),
    user_id_verified: createRef(),
    user_pw: createRef(),
    user_pw_verified: createRef(),
  });

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT, extra) => {
    const validateEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    };
    let foundError = false;
    const initialErrors = {
      user_id: false,
      user_id_sended: false,
      user_id_verified: false,
      user_pw: false,
      user_pw_verified: false,
    };
    const refsCurrent = REFS?.current;

    if (!refsCurrent) {
      console.warn('Ref is undefined, skipping validation');
      return;
    }

    if (extra === "send") {
      if (OBJECT.user_id === "" || !OBJECT.user_id) {
        alert(translate("errorUserId"));
        refsCurrent.user_id.current &&
        refsCurrent.user_id.current?.focus();
        initialErrors.user_id = true;
        foundError = true;
      }
      else if (validateEmail(OBJECT.user_id) === false) {
        alert(translate("errorUserIdAt"));
        refsCurrent.user_id.current &&
        refsCurrent.user_id.current?.focus();
        initialErrors.user_id = true;
        foundError = true;
      }
    }
    else if (extra === "save") {
      if (OBJECT.user_id === "" || !OBJECT.user_id) {
        alert(translate("errorUserId"));
        refsCurrent.user_id.current &&
        refsCurrent.user_id.current?.focus();
        initialErrors.user_id = true;
        foundError = true;
      }
      else if (validateEmail(OBJECT.user_id) === false) {
        alert(translate("errorUserIdAt"));
        refsCurrent.user_id.current &&
        refsCurrent.user_id.current?.focus();
        initialErrors.user_id = true;
        foundError = true;
      }
      else if (OBJECT.user_id === "" || !OBJECT.user_id) {
        alert(translate("errorUserId"));
        refsCurrent.user_id.current &&
        refsCurrent.user_id.current?.focus();
        initialErrors.user_id = true;
        foundError = true;
      }
      else if (OBJECT.user_id.indexOf("@") === -1) {
        alert(translate("errorUserIdAt"));
        refsCurrent.user_id.current &&
        refsCurrent.user_id.current?.focus();
        initialErrors.user_id = true;
        foundError = true;
      }
      else if (OBJECT.user_id_verified === false || !OBJECT.user_id_verified) {
        alert(translate("errorUserIdVerified"));
        refsCurrent.user_id_verified.current &&
        refsCurrent.user_id_verified.current?.focus();
        initialErrors.user_id_verified = true;
        foundError = true;
      }
      else if (OBJECT.user_pw === "" || !OBJECT.user_pw) {
        alert(translate("errorUserPw"));
        refsCurrent.user_pw.current &&
        refsCurrent.user_pw.current?.focus();
        initialErrors.user_pw = true;
        foundError = true;
      }
      else if (OBJECT.user_pw_verified === false || !OBJECT.user_pw_verified) {
        alert(translate("errorUserPwVerified"));
        refsCurrent.user_pw_verified.current &&
        refsCurrent.user_pw_verified.current?.focus();
        initialErrors.user_pw_verified = true;
        foundError = true;
      }
      else if (OBJECT.user_pw !== OBJECT.user_pw_verified) {
        alert(translate("errorUserPwMatch"));
        refsCurrent.user_pw_verified.current &&
        refsCurrent.user_pw_verified.current?.focus();
        initialErrors.user_pw_verified = true;
        foundError = true;
      }
    }

    setERRORS(initialErrors);

    return !foundError;
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSendEmail = async () => {
    setLOADING(true);
    if (!validate(OBJECT, "send")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/email/send`, {
      user_id: OBJECT.user_id,
      type: "resetPw"
    })
    .then((res) => {
      if (res.data.status === "notExist") {
        alert(translate(res.data.msg));
        setOBJECT((prev) => ({
          ...prev,
          user_id_sended: false
        }));
      }
      else if (res.data.status === "success") {
        alert(translate(res.data.msg));
        setOBJECT((prev) => ({
          ...prev,
          user_id_sended: true
        }));
      }
      else {
        alert(translate(res.data.msg));
        setOBJECT((prev) => ({
          ...prev,
          user_id_sended: false
        }));
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
  const flowVerifyEmail = async () => {
    setLOADING(true);
    axios.post (`${URL_OBJECT}/email/verify`, {
      user_id: OBJECT.user_id,
      verify_code: clientCode
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        setOBJECT((prev) => ({
          ...prev,
          user_id_verified: true
        }));
      }
      else {
        alert(translate(res.data.msg));
        setOBJECT((prev) => ({
          ...prev,
          user_id_verified: false
        }));
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
  const flowSave = async () => {
    setLOADING(true);
    if (!validate(OBJECT, "save")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/resetPw`, {
      user_id: OBJECT.user_id,
      OBJECT: OBJECT
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        navigate("/user/login");
      }
      else if (res.data.status === "fail") {
        alert(translate(res.data.msg));
        setOBJECT((prev) => ({
          ...prev,
          user_id: "",
          user_pw: "",
        }));
      }
      else {
        alert(translate(res.data.msg));
        setOBJECT((prev) => ({
          ...prev,
          user_id: "",
          user_pw: "",
        }));
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 7. userResetPw --------------------------------------------------------------------------------
  const userResetPwNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Div className={"d-center fs-2-0rem"}>
        {translate("resetPw")}
      </Div>
    );
    // 7-2. card
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"d-column"} key={i}>
          {/** section 1 **/}
          <Div className={"d-center"}>
            <Input
              label={`${translate("id")} (email)`}
              value={OBJECT.user_id}
              className={"w-66vw me-10"}
              inputRef={REFS.current.user_id}
              error={ERRORS.user_id}
              onChange={(e) => (
                setOBJECT((prev) => ({
                  ...prev,
                  user_id: e.target.value
                }))
              )}
            />
            <Button
              size={"small"}
              color={"primary"}
              className={"w-20vw"}
              variant={"contained"}
              onClick={() => {
                flowSendEmail();
              }}
            >
              {translate("send")}
            </Button>
          </Div>
          <Br10 />
          <Div className={"d-center"}>
            <Input
              label={translate("verify")}
              value={clientCode}
              className={"w-66vw me-10"}
              inputRef={REFS.current.user_id_verified}
              error={ERRORS.user_id_verified}
              onChange={(e) => (
                setClientCode(e.target.value)
              )}
            />
            <Button
              size={"small"}
              color={"primary"}
              className={"w-20vw"}
              variant={"contained"}
              disabled={!OBJECT.user_id_sended}
              onClick={() => {
                flowVerifyEmail();
              }}
            >
              {translate("verify")}
            </Button>
          </Div>
          <Br10 />
          <Input
            type={"password"}
            label={translate("newPw")}
            value={OBJECT.user_pw}
            inputRef={REFS.current.user_pw}
            error={ERRORS.user_pw}
            disabled={OBJECT.user_id_verified === false}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                user_pw: e.target.value
              }))
            )}
          />
          <Br10 />
          <Input
            type={"password"}
            label={translate("newPwVerified")}
            value={OBJECT.user_pw_verified}
            inputRef={REFS.current.user_pw_verified}
            error={ERRORS.user_pw_verified}
            disabled={OBJECT.user_id_verified === false}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                user_pw_verified: e.target.value
              }))
            )}
          />
        </Card>
      );
      return (
        cardFragment(0)
      );
    };
    // 7-3. button
    const buttonSection = () => (
      <Div className={"d-center"}>
        <Button
          size={"small"}
          color={"primary"}
          className={"w-100p fs-1-0rem"}
          variant={"contained"}
          onClick={() => {
            flowSave();
          }}
        >
          {translate("resetPw")}
        </Button>
      </Div>
    );
    // 7-5. toLogin
    const toLoginSection = () => (
      <Div className={"d-center fs-0-8rem"}>
        {translate("alreadyId")}
        <Div className={"d-center blue pointer ms-10"} onClick={() => {
          navigate("/user/login");
        }}>
          {translate("login")}
        </Div>
      </Div>
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
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper d-center radius border h-min94vh"}>
        <Grid container columnSpacing={1}>
          <Grid size={12}>
            {titleSection()}
            <Hr40 />
            {cardSection()}
            <Hr40 />
            {buttonSection()}
            <Hr40 />
            {toLoginSection()}
            <Br10 />
            {toSignupSection()}
          </Grid>
        </Grid>
      </Paper>
      </>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userResetPwNode()}
    </>
  );
};