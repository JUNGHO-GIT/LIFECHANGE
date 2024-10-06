// UserDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { axios, numeral, sync } from "@imports/ImportUtils";
import { Footer, Loading } from "@imports/ImportLayouts";
import { Input } from "@imports/ImportContainers";
import { Hr, Img, Div } from "@imports/ImportComponents";
import { Paper, Avatar, Card, Grid, Checkbox } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, navigate, sessionId, localCurrency } = useCommonValue();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateUser();

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
  }, [URL_OBJECT, sessionId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = () => {
    setLOADING(true);
    if (!validate(OBJECT, "detail", "")) {
      setLOADING(false);
      return;
    }
    axios.put(`${URL_OBJECT}/update`, {
      user_id: sessionId,
      OBJECT: OBJECT,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        sync();
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate("/user/detail");
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
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
          <Grid container spacing={2} columns={12}>
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
            {/** 나이 (1세 ~ 100세) **/}
            <Grid size={12}>
              <Input
                label={translate("age")}
                value={OBJECT.user_age}
                inputRef={REFS?.[i]?.user_age}
                error={ERRORS?.[i]?.user_age}
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
                inputRef={REFS?.[i]?.user_initScale}
                error={ERRORS?.[i]?.user_initScale}
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
                inputRef={REFS?.[i]?.user_initProperty}
                error={ERRORS?.[i]?.user_initProperty}
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
                    numeral(OBJECT.user_curPropertyInclude).format("0,0")
                  ) : (
                    numeral(OBJECT.user_curPropertyExclude).format("0,0")
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
      <Paper className={"content-wrapper border-1 radius-1 h-min75vh"}>
        <Grid container spacing={2} columns={12}>
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