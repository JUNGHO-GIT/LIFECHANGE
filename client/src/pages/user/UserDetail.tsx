// UserDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { axios, numeral, sync } from "@imports/ImportUtils";
import { Footer, Loading } from "@imports/ImportLayouts";
import { Input } from "@imports/ImportContainers";
import { Hr, Br, Img, Div } from "@imports/ImportComponents";
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
  const flowSave = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, "detail", "")) {
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
      <Card className={"p-0"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12} className={"d-center"}>
            <Avatar
              src={OBJECT?.user_image}
              alt={"user_image"}
              className={"w-150 h-150"}
            />
          </Grid>
        </Grid>
      </Card>
    );
    // 7-2. detail
    const detailSection = () => {
      const detailFragment = (item: any, i: number) => (
        <Card className={"p-10"}>
          <Grid container spacing={1} columns={12}>
            {/** 아이디 **/}
            <Grid size={12}>
              <Input
                label={translate("id")}
                value={item?.user_id}
                disabled={true}
              />
            </Grid>
            <Br px={5} />
            {/** 등록일 **/}
            <Grid size={12}>
              <Input
                label={translate("regDt")}
                value={item?.user_regDt.split("T")[0]}
                disabled={true}
              />
            </Grid>
            <Hr px={20} />
            {/** 최초 몸무게 **/}
            <Grid size={12}>
              <Input
                label={translate("initScale")}
                value={item.user_initScale}
                inputRef={REFS?.[i]?.user_initScale}
                error={ERRORS?.[i]?.user_initScale}
                startadornment={
                  <Img
                  	key={"exercise5"}
                  	src={"exercise5"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("k")
                }
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
            <Br px={5} />
            {/** 현재 몸무게 **/}
            <Grid size={12}>
              <Input
                label={translate("curScale")}
                value={item.user_curScale}
                disabled={true}
                startadornment={
                  <Img
                  	key={"exercise5"}
                  	src={"exercise5"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("k")
                }
              />
            </Grid>
            <Hr px={20} />
            {/** 초기 자산 **/}
            <Grid size={12}>
              <Input
                label={translate("initProperty")}
                value={numeral(item.user_initProperty).format("0,0")}
                inputRef={REFS?.[i]?.user_initProperty}
                error={ERRORS?.[i]?.user_initProperty}
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
            <Br px={5} />
            {/** 현재 자산 **/}
            <Grid size={12}>
              <Input
                label={translate("curProperty")}
                disabled={true}
                value={
                  includingExclusions ? (
                    numeral(item.user_curPropertyInclude).format("0,0")
                  ) : (
                    numeral(item.user_curPropertyExclude).format("0,0")
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
            <Br px={5} />
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
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12} key={`detail-${0}`}>
              {detailFragment(OBJECT, 0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            {LOADING ? (
              <>
                <Loading />
              </>
            ) : (
              <>
                {imageSection()}
                <Hr px={40} />
                {detailSection()}
              </>
            )}
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