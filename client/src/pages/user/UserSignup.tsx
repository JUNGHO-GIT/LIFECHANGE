// UserSignup.tsx
// Node -> Section -> Fragment

import { useState } from "@imports/ImportReacts";
import { useCommon, useValidateUser } from "@imports/ImportHooks";
import { axios } from "@imports/ImportLibs";
import { Loading } from "@imports/ImportLayouts";
import { Input, Div, Img, Hr, Select, Btn } from "@imports/ImportComponents";
import { Paper, MenuItem, Grid, Card } from "@imports/ImportMuis";
import { user1 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const UserSignup = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, URL_OBJECT, URL_GOOGLE, translate
  } = useCommon();
  const {
    ERRORS, REFS, validate
  } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF: any = {
    _id: "",
    user_number: 0,
    user_id: "",
    user_id_sended: false,
    user_verify_code: "",
    user_id_verified: false,
    user_pw: "",
    user_pw_verified: "",
    user_age: "",
    user_gender: "",
    user_initScale: "",
    user_curScale: "",
    user_initProperty: "",
    user_curProperty: "",
    user_image: "",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSendEmail = async () => {
    setLOADING(true);
    if (!validate(OBJECT, "send")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/email/send`, {
      user_id: OBJECT.user_id,
      type: "signup"
    })
    .then((res: any) => {
      if (res.data.status === "duplicate") {
        alert(translate(res.data.msg));
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_sended: false
        }));
      }
      else if (res.data.status === "success") {
        alert(translate(res.data.msg));
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_sended: true
        }));
      }
      else {
        alert(translate(res.data.msg));
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
  const flowVerifyEmail = async () => {
    setLOADING(true);
    if (!validate(OBJECT, "verify")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/email/verify`, {
      user_id: OBJECT.user_id,
      verify_code: OBJECT.user_verify_code
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_verified: true
        }));
      }
      else {
        alert(translate(res.data.msg));
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
  const flowSave = async () => {
    setLOADING(true);
    if (!validate(OBJECT, "save")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/signup`, {
      user_id: OBJECT.user_id,
      OBJECT: OBJECT
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        navigate("/user/login");
      }
      else if (res.data.status === "alreadyExist") {
        alert(translate(res.data.msg));
        setOBJECT((prev: any) => ({
          ...prev,
          user_id: "",
          user_pw: "",
        }));
      }
      else if (res.data.status === "fail") {
        alert(translate(res.data.msg));
        setOBJECT((prev: any) => ({
          ...prev,
          user_id: "",
          user_pw: "",
        }));
      }
      else {
        alert(translate(res.data.msg));
        setOBJECT((prev: any) => ({
          ...prev,
          user_id: "",
          user_pw: "",
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
  const flowGoogle = async () => {
    axios.get (`${URL_GOOGLE}/login`)
    .then((res: any) => {
      if (res.data.status === "success") {
        window.location.href = res.data.url;
      }
      else {
        alert(translate(res.data.msg));
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
    const cardSection = () => {
      const cardFragment = (i: number) => (
        <Card className={"p-10"} key={i}>
          {/** section 1 **/}
          <Grid container spacing={2}>
            {/** 이메일 **/}
            <Grid size={10}>
              <Input
                label={`${translate("id")}`}
                helperText={`* ${translate("helperId")}`}
                value={OBJECT.user_id}
                inputRef={REFS.current[i]?.user_id}
                error={ERRORS[i]?.user_id}
                disabled={OBJECT.user_id_verified === true}
                onChange={(e: any) => (
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_id: e.target.value
                  }))
                )}
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
                inputRef={REFS.current[i]?.user_id_verified}
                error={ERRORS[i]?.user_id_verified}
                disabled={OBJECT.user_id_verified === true}
                onChange={(e: any) => (
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_verify_code: e.target.value
                  }))
                )}
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
                inputRef={REFS.current[i]?.user_pw}
                error={ERRORS[i]?.user_pw}
                disabled={OBJECT.user_id_verified === false}
                onChange={(e: any) => (
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_pw: e.target.value
                  }))
                )}
              />
            </Grid>
            {/** 비밀번호 확인 **/}
            <Grid size={12}>
              <Input
                type={"password"}
                label={translate("pwVerified")}
                helperText={`* ${translate("helperPwVerified")}`}
                value={OBJECT.user_pw_verified}
                inputRef={REFS.current[i]?.user_pw_verified}
                error={ERRORS[i]?.user_pw_verified}
                disabled={OBJECT.user_id_verified === false}
                onChange={(e: any) => (
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_pw_verified: e.target.value
                  }))
                )}
              />
            </Grid>
            <Hr px={20} />
            {/** 성별 (N, M, F) **/}
            <Grid size={12}>
              <Select
                label={translate("gender")}
                value={OBJECT.user_gender || "N"}
                disabled={OBJECT.user_id_verified === false}
                onChange={(e: any) => (
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_gender: e.target.value || "N"
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
                inputRef={REFS.current[i]?.user_age}
                error={ERRORS[i]?.user_age}
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
            {/** 초기 체중 **/}
            <Grid size={12}>
              <Input
                label={translate("scale")}
                value={OBJECT.user_initScale}
                inputRef={REFS.current[i]?.user_initScale}
                error={ERRORS[i]?.user_initScale}
                disabled={OBJECT.user_id_verified === false}
                onChange={(e: any) => {
                  const value = e.target.value.replace(/^0+/, '');
                  if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                    const newValue = parseFloat(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        user_initScale: "0",
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        user_initScale: value,
                      }));
                    }
                  }
                }}
                endadornment={
                  translate("cm")
                }
              />
            </Grid>
            {/** 초기 자산 **/}
            <Grid size={12}>
              <Input
                label={translate("property")}
                value={OBJECT.user_initProperty}
                inputRef={REFS.current[i]?.user_initProperty}
                error={ERRORS[i]?.user_initProperty}
                disabled={OBJECT.user_id_verified === false}
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        user_initProperty: "0",
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 9999999999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        user_initProperty: value,
                      }));
                    }
                  }
                }}
                endadornment={
                  translate("currency")
                }
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        cardFragment(0)
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
      <Input
        value={translate("googleLogin")}
        className={"bg-white pointer"}
        readOnly={true}
        startadornment={
          <Img src={user1} className={"w-15 h-15"} />
        }
        onClick={() => {
          flowGoogle();
        }}
      />
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
      <Paper className={"content-wrapper d-center radius border h-min94vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {titleSection()}
          </Grid>
          <Hr px={10} />
          <Grid size={12}>
            {cardSection()}
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