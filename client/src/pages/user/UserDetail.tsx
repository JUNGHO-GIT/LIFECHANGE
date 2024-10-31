// UserDetail.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useValidateUser } from "@importHooks";
import { useStoreLanguage, useStoreAlert } from "@importHooks";
import { axios } from "@importLibs";
import { sync, insertComma } from "@importScripts";
import { User } from "@importSchemas";
import { Footer, Loader } from "@importLayouts";
import { Input } from "@importContainers";
import { Hr, Img, Div } from "@importComponents";
import { Paper, Avatar, Grid, Checkbox, Card } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const UserDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, navigate, sessionId, localCurrency, localUnit } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { ALERT, setALERT } = useStoreAlert();
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
      setTimeout(() => {
        setLOADING(false);
      }, 300);
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
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate("/user/detail");
        sync();
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
      setTimeout(() => {
        setLOADING(false);
      }, 300);
    });
  };

  // 6. userDetail ---------------------------------------------------------------------------------
  const userDetailNode = () => {
    // 7-1. image
    const imageSection = () => (
      <Grid container={true} spacing={2}>
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
      const detailFragment = () => (
        <Grid container={true} spacing={0}>
          {[OBJECT].filter((_: any, idx: number) => idx === 0).map((item: any, i: number) => (
            <Grid size={12} key={`detail-${i}`}>
              <Grid container spacing={2} className={"p-10"}>
                {/** 아이디 **/}
                <Grid container={true} spacing={2}>
                  <Grid size={12}>
                    <Input
                      readOnly={true}
                      label={translate("id")}
                      value={item?.user_id}
                    />
                  </Grid>
                </Grid>

                {/** 등록일 **/}
                <Grid container={true} spacing={2}>
                  <Grid size={12}>
                    <Input
                      readOnly={true}
                      label={translate("regDt")}
                      value={item?.user_regDt.split("T")[0]}
                    />
                  </Grid>
                </Grid>

                <Hr px={1} />

                {/** 최초 몸무게 **/}
                <Grid container={true} spacing={2}>
                  <Grid size={12}>
                    <Input
                      label={translate("initScale")}
                      value={insertComma(item.user_initScale || "0")}
                      inputRef={REFS?.[i]?.user_initScale}
                      error={ERRORS?.[i]?.user_initScale}
                      startadornment={
                        <Img
                          max={15}
                          hover={true}
                          shadow={false}
                          radius={false}
                          src={"exercise5"}
                        />
                      }
                      endadornment={
                        localUnit
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
                </Grid>

                {/** 현재 몸무게 **/}
                <Grid container={true} spacing={2}>
                  <Grid size={12}>
                    <Input
                      readOnly={true}
                      label={translate("curScale")}
                      value={insertComma(item.user_curScale || "0")}
                      startadornment={
                        <Img
                          max={15}
                          hover={true}
                          shadow={false}
                          radius={false}
                          src={"exercise5"}
                        />
                      }
                      endadornment={
                        localUnit
                      }
                    />
                  </Grid>
                </Grid>

                <Hr px={1} />

                {/** 초기 평균 칼로리 섭취량 목표 **/}
                <Grid container={true} spacing={2}>
                  <Grid size={12}>
                    <Input
                      label={translate("initAvgKcalIntake")}
                      value={insertComma(item.user_initAvgKcalIntake || "0")}
                      inputRef={REFS?.[i]?.user_initAvgKcalIntake}
                      error={ERRORS?.[i]?.user_initAvgKcalIntake}
                      startadornment={
                        <Img
                          max={15}
                          hover={true}
                          shadow={false}
                          radius={false}
                          src={"food2"}
                        />
                      }
                      endadornment={
                        translate("kc")
                      }
                      onChange={(e: any) => {
                        // 빈값 처리
                        let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                        // 9999 제한 + 정수
                        if (Number(value) > 9999 || !/^\d+$/.test(value)) {
                          return;
                        }
                        // 01, 05 같은 숫자는 1, 5로 변경
                        if (/^0(?!\.)/.test(value)) {
                          value = value.replace(/^0+/, '');
                        }
                        // object 설정
                        setOBJECT((prev: any) => ({
                          ...prev,
                          user_initAvgKcalIntake: value,
                        }));
                      }}
                    />
                  </Grid>
                </Grid>

                {/** 현재 목표 칼로리 **/}
                <Grid container={true} spacing={2}>
                  <Grid size={12}>
                    <Input
                      readOnly={true}
                      label={translate("curAvgKcalIntake")}
                      value={insertComma(item.user_curAvgKcalIntake || "0")}
                      startadornment={
                        <Img
                          max={15}
                          hover={true}
                          shadow={false}
                          radius={false}
                          src={"food2"}
                        />
                      }
                      endadornment={
                        translate("kc")
                      }
                    />
                  </Grid>
                </Grid>

                <Hr px={1} />

                {/** 초기 자산 **/}
                <Grid container={true} spacing={2}>
                  <Grid size={12}>
                    <Input
                      label={translate("initProperty")}
                      value={insertComma(item.user_initProperty || "0")}
                      inputRef={REFS?.[i]?.user_initProperty}
                      error={ERRORS?.[i]?.user_initProperty}
                      startadornment={
                        <Img
                          max={15}
                          hover={true}
                          shadow={false}
                          radius={false}
                          src={"money2"}
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
                </Grid>

                {/** 현재 자산 **/}
                <Grid container={true} spacing={2}>
                  <Grid size={12}>
                    <Input
                      readOnly={true}
                      label={translate("curPropertyExclusion")}
                      value={
                        includingExclusions ? (
                          insertComma(item.user_curPropertyAll || "0")
                        ) : (
                          insertComma(item.user_curPropertyExclusion || "0")
                        )
                      }
                      startadornment={
                        <Img
                          max={15}
                          hover={true}
                          shadow={false}
                          radius={false}
                          src={"money2"}
                        />
                      }
                      endadornment={
                        localCurrency
                      }
                    />
                  </Grid>
                </Grid>

                {/** 포함 여부 **/}
                <Grid container={true} spacing={2}>
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
              </Grid>
            </Grid>
          ))}
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {detailFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        {imageSection()}
        <Hr px={40} />
        {LOADING ? <Loader /> : detailSection()}
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