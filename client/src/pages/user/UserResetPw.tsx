// UserResetPw.tsx

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
export const UserResetPw = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, URL_GOOGLE, navigate } = useCommonValue();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>(User);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSendEmail = () => {
    setLOADING(true);
    if (!validate(OBJECT, "resetPw", "send")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/email/send`, {
      user_id: OBJECT.user_id,
      type: "resetPw"
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
      else if (res.data.status === "notExist") {
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
      else if (res.data.status === "isGoogle") {
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
    if (!validate(OBJECT, "resetPw", "verify")) {
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
    if (!validate(OBJECT, "resetPw", "save")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/resetPw`, {
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
    });
  };

  // 7. userResetPw --------------------------------------------------------------------------------
  const userResetPwNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Card className={"p-0"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            <Div className={"fs-1-8rem fw-500"}>
              {translate("resetPw")}
            </Div>
          </Grid>
        </Grid>
      </Card>
    );
    // 7-2. reset
    const resetSection = () => {
      const detailFragment = (item: any, i: number) => (
        <Card className={"p-10"}>
          <Grid container spacing={1} columns={12}>
            {/** 이메일 **/}
            <Grid size={9}>
              <Input
                label={`${translate("id")}`}
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
      const resetFragment = () => (
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
                {translate("resetPw")}
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
              {resetFragment()}
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
      const toSignupFragment = () => (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={7} className={"d-row-right"}>
              <Div className={"fs-0-8rem black"}>
                {translate("notId")}
              </Div>
            </Grid>
            <Grid size={5} className={"d-row-left"}>
              <Div className={"fs-0-8rem blue pointer"} onClick={() => {
                navigate("/user/signup");
              }}>
                {translate("signup")}
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
              {toSignupFragment()}
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
            {resetSection()}
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
      {userResetPwNode()}
    </>
  );
};