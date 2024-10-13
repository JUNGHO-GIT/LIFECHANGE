// UserSignup.tsx

import { useState } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Input } from "@imports/ImportContainers";
import { Div, Btn, Img, Hr, Br } from "@imports/ImportComponents";
import { Paper, Card, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserSignup = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, URL_GOOGLE, navigate, localCurrency } = useCommonValue();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>(User);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSendEmail = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, "signup", "send")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/email/send`, {
      user_id: OBJECT.user_id,
      type: "signup"
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_sended: true
        }));
      }
      else if (res.data.status === "duplicate") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_sended: false
        }));
      }
      else if (res.data.status === "fail") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_sended: false
        }));
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_sended: false
        }));
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

  // 3. flow ---------------------------------------------------------------------------------------
  const flowVerifyEmail = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, "signup", "verify")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/email/verify`, {
      user_id: OBJECT.user_id,
      verify_code: OBJECT.user_verify_code
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_verified: true
        }));
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_verified: false
        }));
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

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, "signup", "save")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/signup`, {
      user_id: OBJECT.user_id,
      OBJECT: OBJECT
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate("/user/login");
      }
      else if (res.data.status === "alreadyExist") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
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

  // 3. flow ---------------------------------------------------------------------------------------
  const flowGoogle = () => {
    axios.get (`${URL_GOOGLE}/login`)
    .then((res: any) => {
      if (res.data.status === "success") {
        window.location.href = res.data.url;
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
    });
  };

  // 7. userSignup ---------------------------------------------------------------------------------
  const userSignupNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Card className={"p-0"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            <Div className={"fs-1-8rem fw-500"}>
              {translate("signup")}
            </Div>
          </Grid>
        </Grid>
      </Card>
    );
    // 7-2. signup
    const signupSection = () => {
      const detailFragment = (item: any, i: number) => (
        <Card className={"p-10"}>
          <Grid container spacing={1} columns={12}>
            {/** 이메일 **/}
            <Grid size={9}>
              <Input
                label={translate("id")}
                helperText={`* ${translate("helperId")}`}
                value={item.user_id}
                inputRef={REFS?.[i]?.user_id}
                error={ERRORS?.[i]?.user_id}
                disabled={item.user_id_verified === true}
                placeholder={"abcd@naver.com"}
                onChange={(e: any) => {
                  const value = e.target.value;
                  if (value.length > 30) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_id: prev.user_id,
                    }));
                  }
                  else {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      user_id: value,
                    }));
                  }
                }}
              />
            </Grid>
            <Grid size={3}>
              <Btn
                color={"primary"}
                className={"mt-n25"}
                disabled={item.user_id_verified === true}
                onClick={() => {
                  flowSendEmail();
                }}
              >
                {translate("send")}
              </Btn>
            </Grid>
            {/** 이메일 인증 **/}
            <Grid size={9}>
              <Input
                label={translate("verify")}
                helperText={`* ${translate("helperIdVerified")}`}
                value={item.user_verify_code}
                inputRef={REFS?.[i]?.user_id_verified}
                error={ERRORS?.[i]?.user_id_verified}
                disabled={item.user_id_verified === true}
                placeholder={"123456"}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_verify_code: e.target.value
                  }))
                }}
              />
            </Grid>
            <Grid size={3}>
              <Btn
                color={"primary"}
                className={"mt-n25"}
                disabled={!item.user_id_sended || item.user_id_verified === true}
                onClick={() => {
                  flowVerifyEmail();
                }}
              >
                {translate("verify")}
              </Btn>
            </Grid>
            <Hr px={10} />
            {/** 비밀번호 **/}
            <Grid size={12}>
              <Input
                type={"password"}
                label={translate("pw")}
                helperText={`* ${translate("helperPw")}`}
                value={item.user_pw}
                inputRef={REFS?.[i]?.user_pw}
                error={ERRORS?.[i]?.user_pw}
                disabled={item.user_id_verified === false}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_pw: e.target.value
                  }))
                }}
              />
            </Grid>
            {/** 비밀번호 확인 **/}
            <Grid size={12}>
              <Input
                type={"password"}
                label={translate("pwVerified")}
                helperText={`* ${translate("helperPwVerified")}`}
                value={item.user_pw_verified}
                inputRef={REFS?.[i]?.user_pw_verified}
                error={ERRORS?.[i]?.user_pw_verified}
                disabled={item.user_id_verified === false}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_pw_verified: e.target.value
                  }))
                }}
              />
            </Grid>
            <Hr px={10} />
            {/** 초기 체중 **/}
            <Grid size={12}>
              <Input
                label={translate("scale")}
                value={item.user_initScale}
                inputRef={REFS?.[i]?.user_initScale}
                error={ERRORS?.[i]?.user_initScale}
                disabled={item.user_id_verified === false}
                helperText={`* ${translate("helperScale")}`}
                endadornment={
                  translate("cm")
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
            {/** 초기 자산 **/}
            <Grid size={12}>
              <Input
                label={translate("property")}
                value={item.user_initProperty}
                inputRef={REFS?.[i]?.user_initProperty}
                error={ERRORS?.[i]?.user_initProperty}
                disabled={item.user_id_verified === false}
                helperText={`* ${translate("helperProperty")}`}
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
                endadornment={
                  localCurrency
                }
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
    // 7-4. button
    const buttonSection = () => {
      const signupFragment = () => (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              <Btn
                color={"primary"}
                className={"w-90p fs-1-0rem"}
                onClick={() => {
                  flowSave();
                }}
              >
                {translate("signup")}
              </Btn>
            </Grid>
          </Grid>
        </Card>
      );
      const googleFragment = () => (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              <Btn
                color={"primary"}
                className={"w-90p bg-white"}
                onClick={() => {
                  flowGoogle();
                }}
              >
                <Div className={"d-row-center"}>
                  <Img
                    key={"user1"}
                    src={"user1"}
                    className={"w-15 h-15 me-10"}
                  />
                  <Div className={"fs-1-0rem black"}>
                    {translate("googleLogin")}
                  </Div>
                </Div>
              </Btn>
            </Grid>
          </Grid>
        </Card>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {signupFragment()}
              <Br px={10} />
              {googleFragment()}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-5. link
    const linkSection = () => {
      const toLoginFragment = () => (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={7} className={"d-row-right"}>
              <Div className={"fs-0-8rem black"}>
                {translate("alreadyId")}
              </Div>
            </Grid>
            <Grid size={5} className={"d-row-left"}>
              <Div className={"fs-0-8rem blue pointer"} onClick={() => {
                navigate("/user/login");
              }}>
                {translate("login")}
              </Div>
            </Grid>
          </Grid>
        </Card>
      );
      const toResetPwFragment = () => (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={7} className={"d-row-right"}>
              <Div className={"fs-0-8rem black"}>
                {translate("forgotPw")}
              </Div>
            </Grid>
            <Grid size={5} className={"d-row-left"}>
              <Div className={"fs-0-8rem blue pointer"} onClick={() => {
                navigate("/user/resetPw");
              }}>
                {translate("resetPw")}
              </Div>
            </Grid>
          </Grid>
        </Card>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {toLoginFragment()}
              <Br px={10} />
              {toResetPwFragment()}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper d-center border-1 radius-1 shadow-1 h-min100vh"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            {titleSection()}
            <Hr px={30} />
            {signupSection()}
            <Hr px={10} />
            {buttonSection()}
            <Hr px={30} />
            {linkSection()}
          </Grid>
        </Grid>
      </Paper>
      </>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userSignupNode()}
    </>
  );
};