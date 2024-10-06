// UserSignup.tsx

import { useState } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Input } from "@imports/ImportContainers";
import { Div, Img, Hr, Btn } from "@imports/ImportComponents";
import { Paper, Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserSignup = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, URL_GOOGLE, navigate,  localCurrency } = useCommonValue();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>(User);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSendEmail = () => {
    setLOADING(true);
    if (!validate(OBJECT, "signup", "send")) {
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
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowVerifyEmail = () => {
    setLOADING(true);
    if (!validate(OBJECT, "signup", "verify")) {
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
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = () => {
    setLOADING(true);
    if (!validate(OBJECT, "signup", "save")) {
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
      console.error(err);
    })
  };

  // 7. userSignup ---------------------------------------------------------------------------------
  const userSignupNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Div className={"d-center fs-2-0rem p-0"}>
        {translate("signup")}
      </Div>
    );
    // 7-2. card
    const detailSection = () => {
      const detailFragment = (i: number) => (
        <Card className={"p-10"} key={i}>
          {/** section 1 **/}
          <Grid container spacing={2} columns={12}>
            {/** 이메일 **/}
            <Grid size={10}>
              <Input
                label={`${translate("id")}`}
                helperText={`* ${translate("helperId")}`}
                value={OBJECT.user_id}
                inputRef={REFS?.[i]?.user_id}
                error={ERRORS?.[i]?.user_id}
                disabled={OBJECT.user_id_verified === true}
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
            <Grid size={2}>
              <Btn
                color={"primary"}
                className={"mb-25"}
                disabled={OBJECT.user_id_verified === true}
                onClick={() => {
                  flowSendEmail();
                }}
              >
                {translate("send")}
              </Btn>
            </Grid>
            {/** 이메일 인증 **/}
            <Grid size={10}>
              <Input
                label={translate("verify")}
                helperText={`* ${translate("helperIdVerified")}`}
                value={OBJECT.user_verify_code}
                inputRef={REFS?.[i]?.user_id_verified}
                error={ERRORS?.[i]?.user_id_verified}
                disabled={OBJECT.user_id_verified === true}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_verify_code: e.target.value
                  }))
                }}
              />
            </Grid>
            <Grid size={2}>
              <Btn
                color={"primary"}
                className={"mb-25"}
                disabled={!OBJECT.user_id_sended || OBJECT.user_id_verified === true}
                onClick={() => {
                  flowVerifyEmail();
                }}
              >
                {translate("verify")}
              </Btn>
            </Grid>
            <Hr px={20} />
            {/** 비밀번호 **/}
            <Grid size={12}>
              <Input
                type={"password"}
                label={translate("pw")}
                helperText={`* ${translate("helperPw")}`}
                value={OBJECT.user_pw}
                inputRef={REFS?.[i]?.user_pw}
                error={ERRORS?.[i]?.user_pw}
                disabled={OBJECT.user_id_verified === false}
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
                value={OBJECT.user_pw_verified}
                inputRef={REFS?.[i]?.user_pw_verified}
                error={ERRORS?.[i]?.user_pw_verified}
                disabled={OBJECT.user_id_verified === false}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_pw_verified: e.target.value
                  }))
                }}
              />
            </Grid>
            <Hr px={20} />
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
            {/** 초기 체중 **/}
            <Grid size={12}>
              <Input
                label={translate("scale")}
                value={OBJECT.user_initScale}
                inputRef={REFS?.[i]?.user_initScale}
                error={ERRORS?.[i]?.user_initScale}
                disabled={OBJECT.user_id_verified === false}
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
                value={OBJECT.user_initProperty}
                inputRef={REFS?.[i]?.user_initProperty}
                error={ERRORS?.[i]?.user_initProperty}
                disabled={OBJECT.user_id_verified === false}
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
        detailFragment(0)
      );
    };
    // 7-3. button
    const buttonSection = () => (
      <Btn
        color={"primary"}
        className={"w-100p fs-1-0rem"}
        onClick={() => {
          flowSave();
        }}
      >
        {translate("signup")}
      </Btn>
    );
    // 7-4. google
    const googleSection = () => (
      <Btn
        color={"primary"}
        className={"w-100p bg-white"}
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
    );
    // 7-5. toLogin
    const toLoginSection = () => (
      <Div className={"d-center fs-0-8rem"}>
        {translate("alreadyId")}
        <Div className={"d-center blue pointer ms-10"} onClick={() => {
          navigate("/user/login");
        }}>
          {translate("login")}
        </Div>
      </Div>
    );
    // 7-6. toResetPw
    const toResetPwSection = () => (
      <Div className={"d-center fs-0-8rem"}>
        {translate("forgotPw")}
        <Div className={"d-center blue pointer ms-10"} onClick={() => {
          navigate("/user/resetPw");
        }}>
          {translate("resetPw")}
        </Div>
      </Div>
    );
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper d-center border-1 radius-1 h-min94vh"}>
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            {titleSection()}
          </Grid>
          <Hr px={10} />
          <Grid size={12}>
            {detailSection()}
          </Grid>
          <Hr px={10} />
          <Grid size={12}>
            {buttonSection()}
          </Grid>
          <Grid size={12}>
            {googleSection()}
          </Grid>
          <Hr px={10} />
          <Grid size={12}>
            {toLoginSection()}
          </Grid>
          <Grid size={12}>
            {toResetPwSection()}
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