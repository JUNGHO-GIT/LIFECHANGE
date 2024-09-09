// UserResetPw.tsx
// Node -> Section -> Fragment

import { useState } from "@imports/ImportReacts";
import { useCommonValue, useTranslate, useValidateUser } from "@imports/ImportHooks";
import { axios } from "@imports/ImportLibs";
import { Loading } from "@imports/ImportLayouts";
import { Div, Hr, Btn, Input } from "@imports/ImportComponents";
import { Paper, Card, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserResetPw = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useTranslate();
  const {
    navigate, URL_OBJECT,
  } = useCommonValue();
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
  };
  const [OBJECT, setOBJECT] = useState<any>(OBJECT_DEF);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSendEmail = async () => {
    setLOADING(true);
    if (!validate(OBJECT, "send")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/email/send`, {
      user_id: OBJECT.user_id,
      type: "resetPw"
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_sended: true
        }));
      }
      else if (res.data.status === "notExist") {
        alert(translate(res.data.msg));
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_sended: false
        }));
      }
      else if (res.data.status === "isGoogle") {
        alert(translate(res.data.msg));
        setOBJECT((prev: any) => ({
          ...prev,
          user_id_sended: false
        }));
      }
      else if (res.data.status === "fail") {
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
    axios.post (`${URL_OBJECT}/resetPw`, {
      user_id: OBJECT.user_id,
      OBJECT: OBJECT
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        navigate("/user/login");
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

  // 7. userResetPw --------------------------------------------------------------------------------
  const userResetPwNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Div className={"d-center fs-2-0rem"}>
        {translate("resetPw")}
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
        {translate("resetPw")}
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
    // 7-5. toSignup
    const toSignupSection = () => (
      <Div className={"d-center fs-0-8rem"}>
        {translate("notId")}
        <Div className={"d-center blue pointer ms-10"} onClick={() => {
          navigate("/user/signup");
        }}>
          {translate("signup")}
        </Div>
      </Div>
    );
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper d-center radius border h-min100vh"}>
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
          <Hr px={10} />
          <Grid size={12}>
            {toLoginSection()}
          </Grid>
          <Grid size={12}>
            {toSignupSection()}
          </Grid>
        </Grid>
      </Paper>
      </>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userResetPwNode()}
    </>
  );
};