// UserSignup.jsx

import {React, useState, useNavigate, useRef, createRef} from "../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {Loading} from "../../import/ImportLayouts.jsx";
import {Div, Br10, Br20, Img, Hr40, Hr20} from "../../import/ImportComponents.jsx";
import {Paper, TextField, Button, MenuItem} from "../../import/ImportMuis.jsx";
import {user1} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const UserSignup = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const SUBFIX_GOOGLE = process.env.REACT_APP_GOOGLE || "";
  const URL_OBJECT = URL + SUBFIX;
  const URL_GOOGLE = URL + SUBFIX_GOOGLE;
  const navigate = useNavigate();
  const {translate} = useTranslate();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [clientCode, setClientCode] = useState("");
  const [LOADING, setLOADING] = useState(false);

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    user_number: 0,
    user_id: "",
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
    else {
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
    await axios.post (`${URL_OBJECT}/email/send`, {
      user_id: OBJECT.user_id
    })
    .then((res) => {
      if (res.data.status === "duplicate") {
        alert(res.data.msg);
        setOBJECT((prev) => ({
          ...prev,
          user_id_verified: false
        }));
      }
      else if (res.data.status === "success") {
        alert(res.data.msg);
        setOBJECT((prev) => ({
          ...prev,
          user_id_verified: true
        }));
      }
      else {
        alert(res.data.msg);
        return;
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
    await axios.post (`${URL_OBJECT}/email/verify`, {
      user_id: OBJECT.user_id,
      verify_code: clientCode
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        setOBJECT((prev) => ({
          ...prev,
          user_id_verified: false
        }));
      }
      else {
        alert(res.data.msg);
        setOBJECT((prev) => ({
          ...prev,
          user_id_verified: true
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
    await axios.post (`${URL_OBJECT}/signup`, {
      user_id: OBJECT.user_id,
      OBJECT: OBJECT
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        navigate("/user/login");
      }
      else if (res.data.status === "duplicated") {
        alert(res.data.msg);
        setOBJECT((prev) => ({
          ...prev,
          user_id: "",
          user_pw: "",
        }));
      }
      else if (res.data.status === "fail") {
        alert(res.data.msg);
        setOBJECT((prev) => ({
          ...prev,
          user_id: "",
          user_pw: "",
        }));
      }
      else {
        alert(res.data.msg);
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
    await axios.get (`${URL_GOOGLE}/login`)
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
    })
  };

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Div className={"d-center fs-2-0rem"}>
        {translate("signup")}
      </Div>
    );
    // 7-2. table
    const tableSection = () => {
      const tableFragment = (i) => (
        <Div className={"d-column"} key={i}>
          {/** section 1 **/}
          <Div className={"d-center w-86vw"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
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
                setOBJECT((prev) => ({
                  ...prev,
                  user_id_verified: false
                }));
              }}
            >
              {translate("send")}
            </Button>
          </Div>
          <Br10 />
          <Div className={"d-center w-86vw"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
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
              disabled={!OBJECT.user_id_verified}
              onClick={() => {
                flowVerifyEmail();
              }}
            >
              {translate("verify")}
            </Button>
          </Div>
          <Br10 />
          <TextField
            select={false}
            type={"password"}
            size={"small"}
            label={translate("pw")}
            value={OBJECT.user_pw}
            className={"w-86vw"}
            inputRef={REFS.current.user_pw}
            error={ERRORS.user_pw}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                user_pw: e.target.value
              }))
            )}
          />
          <Br10 />
          <TextField
            select={false}
            type={"password"}
            size={"small"}
            label={translate("pwVerified")}
            value={OBJECT.user_pw_verified}
            className={"w-86vw"}
            inputRef={REFS.current.user_pw_verified}
            error={ERRORS.user_pw_verified}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                user_pw_verified: e.target.value
              }))
            )}
          />
          <Hr40 />
          {/** 성별 (N, M, F) **/}
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={translate("gender")}
            value={OBJECT.user_gender || "N"}
            className={"w-86vw text-left"}
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
          </TextField>
          <Br10 />
          {/** 나이 (1세 ~ 100세) **/}
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={translate("age")}
            value={OBJECT.user_age}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_age}
            error={ERRORS.user_age}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                user_age: e.target.value
              }))
            )}
          >
            {Array.from({length: 100}, (v, i) => i + 1).map((item, i) => (
              <MenuItem key={i} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
          <Br10 />
          {/** 신장 **/}
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("height")}
            value={OBJECT.user_height}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_height}
            error={ERRORS.user_height}
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
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("scale")}
            value={OBJECT.user_initScale}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_initScale}
            error={ERRORS.user_initScale}
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
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("property")}
            value={OBJECT.user_initProperty}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_initProperty}
            error={ERRORS.user_initProperty}
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
          {translate("signup")}
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
      <Div className={"d-center w-86vw fs-0-8rem"}>
        {translate("alreadyId")}
        <Div className={"d-center blue pointer ms-10"} onClick={() => {
          navigate("/user/login");
        }}>
          {translate("login")}
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
          {toLoginSection()}
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