// UserSignup.jsx
// Node -> Section -> Fragment

import { useState, useRef, createRef } from "../../imports/ImportReacts.jsx";
import { useCommon } from "../../imports/ImportHooks.jsx";
import { axios } from "../../imports/ImportLibs.jsx";
import { Loading } from "../../imports/ImportLayouts.jsx";
import { Input, Div, Br10, Img, Hr40, Select, Btn } from "../../imports/ImportComponents.jsx";
import { Paper, MenuItem, Grid, Card } from "../../imports/ImportMuis.jsx";
import { user1 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const UserSignup = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, URL_OBJECT, URL_GOOGLE, translate } = useCommon();

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
    user_age: "",
    user_gender: "",
    user_height: "",
    user_initScale: "",
    user_curScale: "",
    user_initProperty: "",
    user_curProperty: "",
    user_image: "",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState({
    user_id: false,
    user_id_sended: false,
    user_id_verified: false,
    user_pw: false,
    user_pw_verified: false,
    user_age: false,
    user_height: false,
    user_initScale: false,
    user_initProperty: false,
  });
  const REFS = useRef({
    user_id: createRef(),
    user_id_sended: createRef(),
    user_id_verified: createRef(),
    user_pw: createRef(),
    user_pw_verified: createRef(),
    user_age: createRef(),
    user_height: createRef(),
    user_initScale: createRef(),
    user_initProperty: createRef(),
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
      user_age: false,
      user_height: false,
      user_initScale: false,
      user_initProperty: false,
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
      else if (OBJECT.user_age === "" || !OBJECT.user_age) {
        alert(translate("errorUserAge"));
        refsCurrent.user_age.current &&
        refsCurrent.user_age.current?.focus();
        initialErrors.user_age = true;
        foundError = true;
      }
      else if (OBJECT.user_height === "" || !OBJECT.user_height) {
        alert(translate("errorUserHeight"));
        refsCurrent.user_height.current &&
        refsCurrent.user_height.current?.focus();
        initialErrors.user_height = true;
        foundError = true;
      }
      else if (OBJECT.user_initScale === "" || !OBJECT.user_initScale) {
        alert(translate("errorUserInitScale"));
        refsCurrent.user_initScale.current &&
        refsCurrent.user_initScale.current?.focus();
        initialErrors.user_initScale = true;
        foundError = true;
      }
      else if (OBJECT.user_initProperty === "" || !OBJECT.user_initProperty) {
        alert(translate("errorUserInitProperty"));
        refsCurrent.user_initProperty.current &&
        refsCurrent.user_initProperty.current?.focus();
        initialErrors.user_initProperty = true;
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
      type: "signup"
    })
    .then((res) => {
      if (res.data.status === "duplicate") {
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
    axios.post (`${URL_OBJECT}/signup`, {
      user_id: OBJECT.user_id,
      OBJECT: OBJECT
    })
    .then((res) => {
      if (res.data.status === "alreadyExist") {
        alert(translate(res.data.msg));
        setOBJECT((prev) => ({
          ...prev,
          user_id: "",
          user_pw: "",
        }));
      }
      else if (res.data.status === "success") {
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

  // 3. flow ---------------------------------------------------------------------------------------
  const flowGoogle = async () => {
    axios.get (`${URL_GOOGLE}/login`)
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
    })
  };

  // 7. userSignup ---------------------------------------------------------------------------------
  const userSignupNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Card className={"d-center fs-2-0rem p-0"}>
        {translate("signup")}
      </Card>
    );
    // 7-2. card
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"d-column p-10"} key={i}>
          {/** section 1 **/}
          <Grid container columnSpacing={1}>
            <Grid size={9}>
              <Input
                label={`${translate("id")} (email)`}
                value={OBJECT.user_id}
                inputRef={REFS.current.user_id}
                error={ERRORS.user_id}
                onChange={(e) => (
                  setOBJECT((prev) => ({
                    ...prev,
                    user_id: e.target.value
                  }))
                )}
              />
            </Grid>
            <Grid size={3}>
              <Btn
                color={"primary"}
                onClick={() => {
                  flowSendEmail();
                }}
              >
                {translate("send")}
              </Btn>
            </Grid>
          </Grid>
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
            <Btn
              color={"primary"}
              disabled={!OBJECT.user_id_sended}
              onClick={() => {
                flowVerifyEmail();
              }}
            >
              {translate("verify")}
            </Btn>
          </Div>
          <Br10 />
          <Input
            type={"password"}
            label={translate("pw")}
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
            label={translate("pwVerified")}
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
          <Hr40 />
          {/** 성별 (N, M, F) **/}
          <Select
            label={translate("gender")}
            value={OBJECT.user_gender || "N"}
            className={"w-86vw text-left"}
            disabled={OBJECT.user_id_verified === false}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                user_gender: e.target.value || "N"
              }))
            )}
          >
            {[translate("N"), translate("M"), translate("F")]?.map((item, i) => (
              <MenuItem key={i} value={i === 0 ? "N" : i === 1 ? "M" : "F"}>
                {item}
              </MenuItem>
            ))}
          </Select>
          <Br10 />
          {/** 나이 (1세 ~ 100세) **/}
          <Input
            label={translate("age")}
            value={OBJECT.user_age}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_age}
            error={ERRORS.user_age}
            disabled={OBJECT.user_id_verified === false}
            onChange={(e) => {
              const value = e.target.value.replace(/^0+/, '');
              if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                const newValue = parseFloat(value);
                if (value === "") {
                  setOBJECT((prev) => ({
                    ...prev,
                    user_age: "0",
                  }));
                }
                else if (!isNaN(newValue) && newValue <= 200) {
                  setOBJECT((prev) => ({
                    ...prev,
                    user_age: value,
                  }));
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("age")}
                </Div>
              )
            }}
          />
          <Br10 />
          {/** 신장 **/}
          <Input
            label={translate("height")}
            value={OBJECT.user_height}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_height}
            error={ERRORS.user_height}
            disabled={OBJECT.user_id_verified === false}
            onChange={(e) => {
              const value = e.target.value.replace(/^0+/, '');
              if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                const newValue = parseFloat(value);
                if (value === "") {
                  setOBJECT((prev) => ({
                    ...prev,
                    user_height: "0",
                  }));
                }
                else if (!isNaN(newValue) && newValue <= 999) {
                  setOBJECT((prev) => ({
                    ...prev,
                    user_height: value,
                  }));
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("cm")}
                </Div>
              )
            }}
          />
          <Br10 />
          {/** 초기 체중 **/}
          <Input
            label={translate("scale")}
            value={OBJECT.user_initScale}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_initScale}
            error={ERRORS.user_initScale}
            disabled={OBJECT.user_id_verified === false}
            onChange={(e) => {
              const value = e.target.value.replace(/^0+/, '');
              if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                const newValue = parseFloat(value);
                if (value === "") {
                  setOBJECT((prev) => ({
                    ...prev,
                    user_initScale: "0",
                  }));
                }
                else if (!isNaN(newValue) && newValue <= 999) {
                  setOBJECT((prev) => ({
                    ...prev,
                    user_initScale: value,
                  }));
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("k")}
                </Div>
              )
            }}
          />
          <Br10 />
          {/** 초기 자산 **/}
          <Input
            label={translate("property")}
            value={OBJECT.user_initProperty}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_initProperty}
            error={ERRORS.user_initProperty}
            disabled={OBJECT.user_id_verified === false}
            onChange={(e) => {
              const value = e.target.value.replace(/,/g, '');
              if (/^\d*$/.test(value) || value === "") {
                const newValue = Number(value);
                if (value === "") {
                  setOBJECT((prev) => ({
                    ...prev,
                    user_initProperty: "0",
                  }));
                }
                else if (!isNaN(newValue) && newValue <= 9999999999) {
                  setOBJECT((prev) => ({
                    ...prev,
                    user_initProperty: value,
                  }));
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("currency")}
                </Div>
              )
            }}
          />
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
        {translate("signup")}
      </Btn>
    );
    // 7-4. google
    const googleSection = () => (
      <Div className={"d-center"}>
        <Input
          value={translate("googleLogin")}
          className={"w-100p bg-white"}
          InputProps={{
            readOnly: true,
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
      <Paper className={"content-wrapper d-center radius border h-min94vh"}>
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
            {toLoginSection()}
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
      {userSignupNode()}
    </>
  );
};