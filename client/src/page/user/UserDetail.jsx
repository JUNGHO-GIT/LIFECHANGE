// UserDetail.jsx
// Node -> Section -> Fragment
// Fragment 는 반복요소

import { React, useState, useEffect, useRef, createRef } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { axios, numeral } from "../../import/ImportLibs.jsx";
import { Footer, Loading } from "../../import/ImportLayouts.jsx";
import { Br30, Br20, Hr60, Input, Select, Div } from "../../import/ImportComponents.jsx";
import { Paper, Avatar, MenuItem, Card, Grid } from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const UserDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, curProperty, URL_OBJECT, sessionId, translate } = useCommon();

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
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/detail`, {
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
          return {
            ...prev,
            ...res.data.result
          };
        }
      });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId]);

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
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/update`, {
      user_id: sessionId,
      OBJECT: OBJECT,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        navigate(0);
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 6. userDetail ---------------------------------------------------------------------------------
  const userDetailNode = () => {
    // 7-1. image
    const imageSection = () => (
      <Div className={"d-center"}>
        <Avatar
          src={OBJECT?.user_image}
          alt={"user_image"}
          className={"w-150 h-150"}
        />
      </Div>
    );
    // 7-2. card
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"d-column p-10"} key={i}>
          <Grid container columnSpacing={1}>
            <Grid size={12}>
              {/** 아이디 **/}
              <Input
                label={translate("id")}
                value={OBJECT?.user_id}
                readOnly={true}
              />
              <Br20 />
              {/** 등록일 **/}
              <Input
                label={translate("regDt")}
                value={OBJECT?.user_regDt.split("T")[0]}
                readOnly={true}
              />
            </Grid>
            <Br30 />
            <Grid size={12}>
              {/** 성별 (N, M, F) **/}
              <Select
                label={translate("gender")}
                value={OBJECT.user_gender}
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
              </Select>
              <Br20 />
              {/** 나이 (1세 ~ 100세) **/}
              <Select
                label={translate("age")}
                value={OBJECT.user_age}
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
              </Select>
              <Br20 />
              {/** 신장 **/}
              <Input
                label={translate("height")}
                value={OBJECT.user_height}
                inputRef={REFS.current.user_height}
                error={ERRORS.user_height}
                endAdornment={translate("cm")}
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
              />
            </Grid>
            <Br30 />
            <Grid size={12}>
              {/** 최초 몸무게 **/}
              <Input
                label={translate("initScale")}
                value={OBJECT.user_initScale}
                inputRef={REFS.current.user_initScale}
                error={ERRORS.user_initScale}
                endAdornment={translate("k")}
                onChange={(e) => (
                  setOBJECT((prev) => ({
                    ...prev,
                    user_initScale: e.target.value
                  }))
                )}
              />
              <Br20 />
              {/** 현재 몸무게 **/}
              <Input
                label={translate("curScale")}
                value={OBJECT.user_curScale}
                endAdornment={translate("k")}
                readOnly={true}
              />
            </Grid>
            <Br30 />
            <Grid size={12}>
              {/** 초기 자산 **/}
              <Input
                label={translate("initProperty")}
                value={numeral(OBJECT.user_initProperty).format("0,0")}
                inputRef={REFS.current.user_initProperty}
                error={ERRORS.user_initProperty}
                endAdornment={translate("currency")}
                onChange={(e) => (
                  setOBJECT((prev) => ({
                    ...prev,
                    user_initProperty: e.target.value
                  }))
                )}
              />
              <Br20 />
              {/** 현재 자산 **/}
              <Input
                label={translate("curProperty")}
                value={numeral(curProperty).format("0,0")}
                endAdornment={translate("currency")}
                readOnly={true}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        LOADING ? <Loading /> : cardFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min75vh"}>
        <Grid container columnSpacing={1}>
          <Grid size={12}>
            <Br20 />
            {imageSection()}
            <Hr60 />
            {cardSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        SEND
      }}
      setState={{
        setSEND
      }}
      flow={{
        navigate, flowSave
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userDetailNode()}
      {footerNode()}
    </>
  );
};