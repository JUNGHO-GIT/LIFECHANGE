// UserSignup.jsx

import {React, useState, useNavigate, useRef, createRef} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {Div, Br10, Br20, Img, Hr40, Hr20} from "../../import/ImportComponents.jsx";
import {Paper, TextField, Button, MenuItem} from "../../import/ImportMuis.jsx";
import {user1} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const UserSignup = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const {translate} = useTranslate();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [clientCode, setClientCode] = useState("");

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
    user_weight: "",
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
    user_gender: false,
    user_height: false,
    user_weight: false,
  });
  const REFS = useRef({
    user_id: createRef(),
    user_id_verified: createRef(),
    user_pw: createRef(),
    user_pw_verified: createRef(),
    user_age: createRef(),
    user_gender: createRef(),
    user_height: createRef(),
    user_weight: createRef(),
  });

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT) => {
    let foundError = false;
    const initialErrors = {
      user_id: false,
      user_id_verified: false,
      user_pw: false,
      user_pw_verified: false,
      user_age: false,
      user_gender: false,
      user_height: false,
      user_weight: false,
    };
    const refsCurrent = REFS?.current;

    if (!refsCurrent) {
      console.warn('Ref is undefined, skipping validation');
      return;
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
    else if (OBJECT.user_gender === "" || !OBJECT.user_gender) {
      alert(translate("errorUserGender"));
      refsCurrent.user_gender.current &&
      refsCurrent.user_gender.current?.focus();
      initialErrors.user_gender = true;
      foundError = true;
    }
    else if (OBJECT.user_height === "" || !OBJECT.user_height) {
      alert(translate("errorUserHeight"));
      refsCurrent.user_height.current &&
      refsCurrent.user_height.current?.focus();
      initialErrors.user_height = true;
      foundError = true;
    }
    else if (OBJECT.user_weight === "" || !OBJECT.user_weight) {
      alert(translate("errorUserWeight"));
      refsCurrent.user_weight.current &&
      refsCurrent.user_weight.current?.focus();
      initialErrors.user_weight = true;
      foundError = true;
    }

    setERRORS(initialErrors);
    return !foundError;
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSend = async () => {
    await axios.post (`${URL_OBJECT}/send`, {
      user_id: OBJECT.user_id
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
      }
      else {
        alert(res.data.msg);
      }
    })
    .catch((err) => {
      console.error(err);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowVerify = async () => {
    await axios.post (`${URL_OBJECT}/verify`, {
      user_id: OBJECT.user_id,
      verify_code: clientCode
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        setOBJECT((prev) => ({
          ...prev,
          user_id_verified: true
        }));
      }
      else {
        alert(res.data.msg);
        setOBJECT((prev) => ({
          ...prev,
          user_id_verified: false
        }));
      }
    })
    .catch((err) => {
      console.error(err);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    if (!validate(OBJECT)) {
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
                flowSend();
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
              disabled={OBJECT.user_id_verified}
              onClick={() => {
                flowVerify();
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
          {/** section 2 **/}
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={translate("gender")}
            value={OBJECT.user_gender || "N"}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_gender}
            error={ERRORS.user_gender}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                user_gender: e.target.value
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
          {/** 1 ~ 100 **/}
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
          {/** 100cm ~ 200cm **/}
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={translate("height")}
            value={OBJECT.user_height}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_height}
            error={ERRORS.user_height}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                user_height: e.target.value
              }))
            )}
          >
            {Array.from({length: 101}, (v, i) => i + 100).map((item, i) => (
              <MenuItem key={i} value={item}>
                {`${item} cm`}
              </MenuItem>
            ))}
          </TextField>
          <Br10 />
          {/** 30kg ~ 200kg **/}
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={translate("weight")}
            value={OBJECT.user_weight}
            className={"w-86vw text-left"}
            inputRef={REFS.current.user_weight}
            error={ERRORS.user_weight}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                user_weight: e.target.value
              }))
            )}
          >
            {Array.from({length: 171}, (v, i) => i + 30).map((item, i) => (
              <MenuItem key={i} value={item}>
                {`${item} kg`}
              </MenuItem>
            ))}
          </TextField>
          <Br10 />
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
          value={translate("googleSignup")}
          className={"w-100p bg-white"}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Img src={user1} className={"w-15 h-15"} />
            ),
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
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
    </>
  );
};