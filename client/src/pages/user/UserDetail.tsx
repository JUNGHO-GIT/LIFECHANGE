// UserDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { axios, sync, insertComma } from "@imports/ImportUtils";
import { Footer, Loading } from "@imports/ImportLayouts";
import { Input } from "@imports/ImportContainers";
import { Hr, Img, Div } from "@imports/ImportComponents";
import { Paper, Avatar, Grid, Checkbox } from "@imports/ImportMuis";

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
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
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
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
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
      <Grid container spacing={2} columns={12}>
        <Grid size={12} className={"d-center"}>
          <Avatar
            src={OBJECT?.user_image}
            alt={"user_image"}
            className={"w-150 h-150"}
          />
        </Grid>
      </Grid>
    );
    // 7-2. detail
    const detailSection = () => {
      const detailFragment = (item: any, i: number) => (
        <Grid container spacing={2} columns={12} className={"p-10"}>
          {/** 아이디 **/}
          <Grid size={12}>
            <Input
              disabled={true}
              label={translate("id")}
              value={item?.user_id}
            />
          </Grid>
          {/** 등록일 **/}
          <Grid size={12}>
            <Input
              disabled={true}
              label={translate("regDt")}
              value={item?.user_regDt.split("T")[0]}
            />
          </Grid>
          <Hr px={1} />
          {/** 최초 몸무게 **/}
          <Grid size={12}>
            <Input
              label={translate("initScale")}
              value={insertComma(item.user_initScale || "0")}
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
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 999 제한 + 소수점 둘째 자리
                if (Number(value) > 999 || !/^\d*\.?\d{0,2}$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  user_initScale: value,
                }));
              }}
            />
          </Grid>
          {/** 현재 몸무게 **/}
          <Grid size={12}>
            <Input
              disabled={true}
              label={translate("curScale")}
              value={insertComma(item.user_curScale || "0")}
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
          <Hr px={1} />
          {/** 초기 자산 **/}
          <Grid size={12}>
            <Input
              label={translate("initProperty")}
              value={insertComma(item.user_initProperty || "0")}
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
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 9999999999 제한 + 정수
                if (Number(value) > 9999999999 || !/^\d+$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  user_initProperty: value,
                }));
              }}
            />
          </Grid>
          {/** 현재 자산 **/}
          <Grid size={12}>
            <Input
              disabled={true}
              label={translate("curProperty")}
              value={
                includingExclusions ? (
                  insertComma(item.user_curPropertyInclude || "0")
                ) : (
                  insertComma(item.user_curPropertyExclude || "0")
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
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} key={`detail-${0}`}>
            {detailFragment(OBJECT, 0)}
          </Grid>
        </Grid>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {imageSection()}
            <Hr px={40} />
            {LOADING ? <Loading /> : detailSection()}
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