// UserSignup.jsx

import {React, useState, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios, numeral} from "../../import/ImportLibs.jsx";
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
  const [pwConfirm, setPwConfirm] = useState("");
  const [serverCode, setServerCode] = useState("");
  const [clientCode, setClientCode] = useState("");

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    user_number: 0,
    user_id: "",
    user_pw: "",
    user_gender: "",
    user_age: "",
    user_height: "",
    user_weight: "",
    user_image: "",
    user_property: 0
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSend = async () => {
    const res = await axios.post (`${URL_OBJECT}/send`, {
      user_id: OBJECT.user_id
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      setServerCode(res.data.result.code);
    }
    else {
      alert(res.data.msg);
    }
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    const res = await axios.post (`${URL_OBJECT}/signup`, {
      user_id: OBJECT.user_id,
      OBJECT: OBJECT
    });
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
      navigate(0);
    }
  };

  // 4. handler ------------------------------------------------------------------------------------
  const handlerCheck = () => {
    if (clientCode === serverCode) {
      alert(translate("isVerified"));
    }
    else {
      alert(translate("isNotVerified"));
    }
  };

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-7. fragment
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
            label={translate("verified")}
            value={clientCode}
            className={"w-66vw me-10"}
            onChange={(e) => (
              setClientCode(e.target.value)
            )}
          />
          <Button
            size={"small"}
            color={"primary"}
            className={"w-20vw"}
            variant={"contained"}
            onClick={() => {
              handlerCheck();
            }}
          >
            {translate("verified")}
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
          label={translate("pwConfirm")}
          value={pwConfirm}
          className={"w-86vw"}
          onChange={(e) => (
            setPwConfirm(e.target.value)
          )}
        />

        <Hr40 />

        {/** section 2 **/}
        <TextField
          select={true}
          type={"text"}
          size={"small"}
          label={translate("gender")}
          value={OBJECT.user_gender}
          className={"w-86vw text-left"}
          onChange={(e) => (
            setOBJECT((prev) => ({
              ...prev,
              user_gender: e.target.value
            }))
          )}
        >
          {["선택하지 않음", "남성", "여성"].map((item, i) => (
            <MenuItem key={i} value={i === 0 ? "N" : i === 1 ? "M" : "F"}>
              {item}
            </MenuItem>
          ))}
        </TextField>
        <Br10 />
        <TextField
          select={true}
          type={"text"}
          size={"small"}
          label={translate("age")}
          value={OBJECT.user_age}
          className={"w-86vw text-left"}
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
        <TextField
          select={true}
          type={"text"}
          size={"small"}
          label={translate("height")}
          value={OBJECT.user_height}
          className={"w-86vw text-left"}
          onChange={(e) => (
            setOBJECT((prev) => ({
              ...prev,
              user_height: e.target.value
            }))
          )}
        >
          {/** 100cm ~ 200cm **/}
          {Array.from({length: 101}, (v, i) => i + 100).map((item, i) => (
            <MenuItem key={i} value={item}>
              {`${item} cm`}
            </MenuItem>
          ))}
        </TextField>
        <Br10 />
        <TextField
          select={true}
          type={"text"}
          size={"small"}
          label={translate("weight")}
          value={OBJECT.user_weight}
          className={"w-86vw text-left"}
          onChange={(e) => (
            setOBJECT((prev) => ({
              ...prev,
              user_weight: e.target.value
            }))
          )}
        >
          {/** 30kg ~ 200kg **/}
          {Array.from({length: 171}, (v, i) => i + 30).map((item, i) => (
            <MenuItem key={i} value={item}>
              {`${item} kg`}
            </MenuItem>
          ))}
        </TextField>
        <Br10 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("property")}
          value={numeral(OBJECT.user_property).format("0,0")}
          className={"w-86vw text-left"}
          onChange={(e) => (
            setOBJECT((prev) => ({
              ...prev,
              user_property: Number(e.target.value)
            }))
          )}
          InputProps={{
            readOnly: false,
            endAdornment: (
              <Div className={"fs-0-8rem"}>
                {translate("endCurrency")}
              </Div>
            )
          }}
        />
      </Div>
    );
    // 7-8. table
    const tableSection = () => (
      tableFragment(0)
    );
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center fs-2-0rem"}>
        {translate("signup")}
      </Div>
    );
    // 7-9. second
    const secondSection = () => (
      tableSection()
    );
    // 7-9. fourth
    const fourthSection = () => (
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
    // 7-9. fifth
    const fifthSection = () => (
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
            endAdornment: null,
          }}
        />
      </Div>
    );
    // 7-9. sixth
    const sixthSection = () => (
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
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-column h-min94vh"}>
          {firstSection()}
          <Hr40 />
          {secondSection()}
          <Hr40 />
          {fourthSection()}
          <Br10 />
          {fifthSection()}
          <Hr40 />
          {sixthSection()}
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