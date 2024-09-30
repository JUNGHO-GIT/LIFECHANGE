// UserDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Footer, Loading } from "@imports/ImportLayouts";
import { Input, Select, Hr, Img, Div } from "@imports/ImportComponents";
import { Paper, Avatar, MenuItem, Card, Grid, Checkbox } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useTranslate();
  const {
    navigate, URL_OBJECT, sessionId, localCurrency,
  } = useCommonValue();
  const {
    ERRORS, REFS, validate
  } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>(User);
  const [includingExclusions, setIncludingExclusions] = useState<boolean>(false);
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
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
      setOBJECT(res.data.result || User);
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = () => {
    setLOADING(true);
    if (!validate(OBJECT)) {
      setLOADING(false);
      return;
    }
    axios.put(`${URL_OBJECT}/update`, {
      user_id: sessionId,
      OBJECT: OBJECT,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sync();
        navigate("/user/detail");
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
    const detailSection = () => {
      const detailFragment = (i: number) => (
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
                inputRef={REFS[i]?.user_gender}
                error={ERRORS[i]?.user_gender}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_gender: e.target.value
                  }))
                }}
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
                inputRef={REFS[i]?.user_age}
                error={ERRORS[i]?.user_age}
                disabled={OBJECT.user_id_verified === false}
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  const newValue = value === "" ? 0 : Number(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_age: "0",
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 200) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_age: String(newValue),
                    }));
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
                inputRef={REFS[i]?.user_initScale}
                error={ERRORS[i]?.user_initScale}
                startadornment={
                  <Img
                  	key={"exercise5"}
                  	src={"exercise5"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={translate("k")}
                onChange={(e: any) => {
                  const value = e.target.value;
                  const newValue = value.startsWith("0") ? value.slice(1) : value;
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_initScale: "0",
                    }));
                  }
                  else if (newValue.match(/^\d*\.?\d{0,2}$/) && Number(newValue) <= 999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_initScale: String(newValue),
                    }));
                  }
                }}
              />
            </Grid>
            {/** 현재 몸무게 **/}
            <Grid size={12}>
              <Input
                label={translate("curScale")}
                value={OBJECT.user_curScale}
                startadornment={
                  <Img
                  	key={"exercise5"}
                  	src={"exercise5"}
                  	className={"w-16 h-16"}
                  />
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
                inputRef={REFS[i]?.user_initProperty}
                error={ERRORS[i]?.user_initProperty}
                startadornment={
                  <Img
                  	key={"money2"}
                  	src={"money2"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={localCurrency}
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  const newValue = value === "" ? 0 : Number(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_initProperty: "0",
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 9999999999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_initProperty: String(newValue),
                    }));
                  }
                }}
              />
            </Grid>
            {/** 현재 자산 **/}
            <Grid size={12}>
              <Input
                label={translate("curProperty")}
                readOnly={true}
                value={
                  includingExclusions ? (
                    numeral(OBJECT.user_curPropertyAll).format("0,0")
                  ) : (
                    numeral(OBJECT.user_curProperty).format("0,0")
                  )
                }
                startadornment={
                  <Img
                  	key={"money2"}
                  	src={"money2"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  localCurrency
                }
              />
            </Grid>
            {/** 포함 여부 **/}
            <Grid size={12} className={"d-row-left"}>
              <Div className={"fs-0-7rem fw-500 dark ms-10"}>
                {translate("includingExclusions")}
              </Div>
              <Checkbox
                size={"small"}
                className={"p-0 ms-5"}
                checked={includingExclusions}
                onChange={(e: any) => {
                  setIncludingExclusions(e.target.checked);
                }}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        LOADING ? <Loading /> : detailFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius h-min75vh"}>
        <Grid container spacing={2}>
          <Grid size={12} className={"d-center"}>
            {imageSection()}
          </Grid>
          <Hr px={20} />
          <Grid size={12}>
            {detailSection()}
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
        flowSave
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