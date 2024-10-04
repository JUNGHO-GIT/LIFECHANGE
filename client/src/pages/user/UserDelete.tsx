// UserDelete.tsx

import { useState } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Input } from "@imports/ImportContainers";
import { Div, Hr, Btn } from "@imports/ImportComponents";
import { Paper, Card, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserDelete = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, navigate } = useCommonValue();
  const { translate } = useLanguageStore();
  const { setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>(User);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSendEmail = () => {
    setLOADING(true);
    if (!validate(OBJECT, "delete", "send")) {
      setLOADING(false);
      return;
    }
    axios.post (`${URL_OBJECT}/email/send`, {
      user_id: OBJECT.user_id,
      type: "delete"
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: true,
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
          open: true,
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
          open: true,
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
          open: true,
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
    if (!validate(OBJECT, "delete", "verify")) {
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
          open: true,
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
          open: true,
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
    if (!validate(OBJECT, "delete", "save")) {
      setLOADING(false);
      return;
    }
    axios.delete(`${URL_OBJECT}/delete`,{
      data: {
        user_id: OBJECT.user_id,
        user_pw: OBJECT.user_pw,
      },
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate("/user/login");
      }
      else {
        setALERT({
          open: true,
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

  // 7. userResetPw --------------------------------------------------------------------------------
  const userResetPwNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Div className={"d-center fs-2-0rem"}>
        {translate("userDelete")}
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
        color={"error"}
        className={"w-100p fs-1-0rem"}
        onClick={() => {
          flowSave();
        }}
      >
        {translate("userDelete")}
      </Btn>
    );
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper d-center border-1 radius-1 h-min100vh"}>
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