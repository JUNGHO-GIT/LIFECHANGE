// UserDetail.jsx

import {React, useState, useEffect, useRef, createRef} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../import/ImportHooks.jsx";
import {axios, numeral} from "../../import/ImportLibs.jsx";
import {Footer, Loading} from "../../import/ImportLayouts.jsx";
import {Div, Br30, Br20, Hr40} from "../../import/ImportComponents.jsx";
import {Paper, TextField, Avatar, MenuItem} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const UserDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const property = JSON.parse(sessionStorage.getItem("property") || "{}");
  const curProperty = property?.curProperty || 0;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const sessionId = sessionStorage.getItem("ID_SESSION");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toUpdate: "/user/update",
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    user_id: "",
    user_google: false,
    user_number: 0,
    user_gender: "",
    user_age: "",
    user_height: "",
    user_initScale: "",
    user_curScale: "",
    user_initProperty: "",
    user_curProperty: "",
    user_image: "",
    user_regDt: "",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState({
    user_age: false,
    user_gender: false,
    user_height: false,
    user_initScale: false,
    user_initProperty: false,
  });
  const REFS = useRef({
    user_age: createRef(),
    user_gender: createRef(),
    user_height: createRef(),
    user_initScale: createRef(),
    user_initProperty: createRef(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId
      },
    })
    .then((res) => {
      // 첫번째 객체를 제외하고 데이터 추가
      setOBJECT((prev) => {
        if (prev.length === 1 && prev[0]?._id === "") {
          return res.data.result;
        }
        else {
          return {...prev, ...res.data.result};
        }
      });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId]);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT, extra) => {
    let foundError = false;
    const initialErrors = {
      user_age: false,
      user_gender: false,
      user_height: false,
      user_initScale: false,
      user_initProperty: false,
    };
    const refsCurrent = REFS?.current;

    if (!refsCurrent) {
      console.warn('Ref is undefined, skipping validation');
      return;
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
    setERRORS(initialErrors);

    return !foundError;
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    setLOADING(true);
    if (!validate(OBJECT)) {
      return;
    }
    await axios.post(`${URL_OBJECT}/update`, {
      user_id: sessionId,
      OBJECT: OBJECT,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        navigate(0);
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

  // 6. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. table
    const tableSection = () => {
      const tableFragment = (i) => (
        <Div className={"d-column"} key={i}>
          <Avatar
            alt={"user_image"}
            src={OBJECT?.user_image}
            className={"m-auto w-150 h-150"}
          />
          <Hr40 />
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("id")}
            value={OBJECT?.user_id}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
            }}
          />
          <Br20 />
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("regDt")}
            value={OBJECT?.user_regDt.split("T")[0]}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
            }}
          />
          <Br30 />
          {/** 성별 (N, M, F) **/}
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={translate("gender")}
            value={OBJECT.user_gender}
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
          <Br20 />
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
          <Br20 />
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
          <Br30 />
          {/** 최초 몸무게 **/}
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("initScale")}
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
          <Br20 />
          {/** 현재 몸무게 **/}
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("curScale")}
            value={OBJECT.user_curScale}
            className={"w-86vw text-left"}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("k")}
                </Div>
              )
            }}
          />
          <Br30 />
          {/** 초기 자산 **/}
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("initProperty")}
            value={numeral(OBJECT.user_initProperty).format("0,0")}
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
          <Br20 />
          {/** 현재 자산 **/}
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("curProperty")}
            value={numeral(curProperty).format("0,0")}
            className={"w-86vw text-left"}
            InputProps={{
              readOnly: true,
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
        LOADING ? <Loading /> : tableFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper h-min75vh"}>
          {tableSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        SEND
      }}
      functions={{
        setSEND
      }}
      handlers={{
        navigate, flowSave
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};