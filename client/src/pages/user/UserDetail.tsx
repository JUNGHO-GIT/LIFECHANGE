// UserDetail.tsx
// Node -> Section -> Fragment

import { useState, useEffect, useRef, createRef } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";
import { axios, numeral } from "@imports/ImportLibs";
import { Footer, Loading } from "@imports/ImportLayouts";
import { Input, Select, Hr, Img } from "@imports/ImportComponents";
import { Paper, Avatar, MenuItem, Card, Grid } from "@imports/ImportMuis";
import { money2, exercise5 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const UserDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, curProperty, URL_OBJECT, sessionId, translate
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toUpdate: "/user/update",
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF: any = {
    _id: "",
    user_id: "",
    user_google: false,
    user_number: 0,
    user_gender: "",
    user_age: "",
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
    user_initScale: false,
    user_initProperty: false,
  });
  const REFS: any = useRef({
    user_age: createRef(),
    user_gender: createRef(),
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
    .then((res: any) => {
      // 첫번째 객체를 제외하고 데이터 추가
      setOBJECT((prev: any) => {
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
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId]);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT: any) => {
    let foundError = false;
    const initialErrors = {
      user_age: false,
      user_gender: false,
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
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        navigate(0);
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err: any) => {
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
      <Avatar
        src={OBJECT?.user_image}
        alt={"user_image"}
        className={"w-150 h-150"}
      />
    );
    // 7-2. card
    const cardSection = () => {
      const cardFragment = (i: number) => (
        <Card className={"p-10"} key={i}>
          <Grid container spacing={2}>
            {/** 아이디 **/}
            <Grid size={12}>
              <Input
                label={translate("id")}
                value={OBJECT?.user_id}
                readOnly={true}
              />
            </Grid>
            {/** 등록일 **/}
            <Grid size={12}>
              <Input
                label={translate("regDt")}
                value={OBJECT?.user_regDt.split("T")[0]}
                readOnly={true}
              />
            </Grid>
            <Hr px={10} />
            {/** 성별 (N, M, F) **/}
            <Grid size={12}>
              <Select
                label={translate("gender")}
                value={OBJECT.user_gender}
                inputRef={REFS.current.user_gender}
                error={ERRORS.user_gender}
                onChange={(e: any) => (
                  setOBJECT((prev: any) => ({
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
            </Grid>
            {/** 나이 (1세 ~ 100세) **/}
            <Grid size={12}>
              <Input
                label={translate("age")}
                value={OBJECT.user_age}
                inputRef={REFS.current.user_age}
                error={ERRORS.user_age}
                disabled={OBJECT.user_id_verified === false}
                onChange={(e: any) => {
                  const value = e.target.value.replace(/^0+/, '');
                  if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                    const newValue = parseFloat(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        user_age: "0",
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 200) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        user_age: value,
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Hr px={10} />
            {/** 최초 몸무게 **/}
            <Grid size={12}>
              <Input
                label={translate("initScale")}
                value={OBJECT.user_initScale}
                inputRef={REFS.current.user_initScale}
                error={ERRORS.user_initScale}
                startadornment={
                  <Img src={exercise5} className={"w-16 h-16"} />
                }
                endadornment={translate("k")}
                onChange={(e: any) => (
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_initScale: e.target.value
                  }))
                )}
              />
            </Grid>
            {/** 현재 몸무게 **/}
            <Grid size={12}>
              <Input
                label={translate("curScale")}
                value={OBJECT.user_curScale}
                startadornment={
                  <Img src={exercise5} className={"w-16 h-16"} />
                }
                endadornment={translate("k")}
                readOnly={true}
              />
            </Grid>
            <Hr px={10} />
            {/** 초기 자산 **/}
            <Grid size={12}>
              <Input
                label={translate("initProperty")}
                value={numeral(OBJECT.user_initProperty).format("0,0")}
                inputRef={REFS.current.user_initProperty}
                error={ERRORS.user_initProperty}
                startadornment={
                  <Img src={money2} className={"w-16 h-16"} />
                }
                endadornment={translate("currency")}
                onChange={(e: any) => (
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_initProperty: e.target.value
                  }))
                )}
              />
            </Grid>
            {/** 현재 자산 **/}
            <Grid size={12}>
              <Input
                label={translate("curProperty")}
                value={numeral(curProperty).format("0,0")}
                startadornment={
                  <Img src={money2} className={"w-16 h-16"} />
                }
                endadornment={translate("currency")}
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
        <Grid container spacing={2}>
          <Grid size={12} className={"d-center"}>
            {imageSection()}
          </Grid>
          <Hr px={20} />
          <Grid size={12}>
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