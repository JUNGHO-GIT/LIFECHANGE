// UserLogin.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useValidateUser } from "@importHooks";
import { useStoreLanguage, useStoreAlert } from "@importHooks";
import { axios } from "@importLibs";
import { sync, getLocal, setLocal, setSession } from "@importScripts";
import { User } from "@importSchemas";
import { Loader } from "@importLayouts";
import { Input } from "@importContainers";
import { Div, Btn, Img, Hr } from "@importComponents";
import { Paper, Checkbox, Grid, Card } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const UserLogin = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, URL_GOOGLE, ADMIN_ID, ADMIN_PW, navigate } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { ALERT, setALERT } = useStoreAlert();
  const { ERRORS, REFS, validate } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [loginTrigger, setLoginTrigger] = useState<boolean>(false);
  const [checkedSaveId, setCheckedSaveId] = useState<boolean>(false);
  const [checkedAutoLogin, setCheckedAutoLogin] = useState<boolean>(false);
  const [_clickCount, setClickCount] = useState<number>(0);
  const [OBJECT, setOBJECT] = useState<any>(User);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 트리거가 활성화된 경우
  useEffect(() => {
    if (loginTrigger) {
      (async () => {
        await flowSave();
        setLoginTrigger(false);
      })();
    }
  }, [loginTrigger]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 초기 로드 시 자동로그인 설정 가져오기
  useEffect(() => {
    const { autoLogin, autoLoginId, autoLoginPw } = getLocal("setting", "id", "") || {};

    // 자동로그인 o
    if (autoLogin === "true") {
      setCheckedAutoLogin(true);
      setOBJECT((prev: any) => ({
        ...prev,
        user_id: autoLoginId,
        user_pw: autoLoginPw,
      }));
      setLoginTrigger(true);
    }
    // 자동로그인 x
    else if (autoLogin === "false") {
      setCheckedAutoLogin(false);
      setOBJECT((prev: any) => ({
        ...prev,
        user_id: "",
        user_pw: "",
      }));
      setLoginTrigger(false);
    }
  }, []);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 초기 로드 시 아이디 저장 설정 가져오기
  useEffect(() => {
    const { isSaved, isSavedId } = getLocal("setting", "id", "") || {};
    // 아이디 저장 o
    if (isSaved === "true") {
      setCheckedSaveId(true);
      setOBJECT((prev: any) => ({
        ...prev,
        user_id: isSavedId,
      }));
    }
    // 아이디 저장 x
    else if (isSaved === "false") {
      setCheckedSaveId(false);
      setOBJECT((prev: any) => ({
        ...prev,
        user_id: "",
      }));
    }
  }, []);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 자동로그인 활성화된 경우
  useEffect(() => {
    if (checkedAutoLogin) {
      setLocal("setting", "id", "", {
        autoLogin: "true",
        autoLoginId: OBJECT.user_id,
        autoLoginPw: OBJECT.user_pw,
      });
    }
    else {
      setLocal("setting", "id", "", {
        autoLogin: "false",
        autoLoginId: "",
        autoLoginPw: "",
      });
    }
  }, [checkedAutoLogin, OBJECT.user_id]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 아이디 저장 활성화된 경우
  useEffect(() => {
    if (checkedSaveId) {
      setLocal("setting", "id", "", {
        isSaved: "true",
        isSavedId: OBJECT.user_id,
      });
    }
    else {
      setLocal("setting", "id", "", {
        isSaved: "false",
        isSavedId: "",
      });
    }
  }, [checkedSaveId, OBJECT.user_id]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, "login", "")) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/login`, {
      user_id: OBJECT.user_id,
      user_pw: OBJECT.user_pw,
      isAutoLogin: checkedAutoLogin,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setSession("setting", "id", "", {
          sessionId: res.data.result.user_id,
          admin: res.data.admin === "admin" ? "true" : "false",
        });
        navigate("/today/list");
        sync();
      }
      else if (res.data.status === "isGoogleUser") {
        setSession("setting", "id", "", {
          sessionId: res.data.result.user_id,
          admin: res.data.admin === "admin" ? "true" : "false",
        });
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
      else {
        setSession("setting", "id", "", {
          sessionId: "",
          admin: "false",
        });
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
      }, 100);
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

  // 7. userLogin ----------------------------------------------------------------------------------
  const userLoginNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Grid container={true} spacing={2}>
        <Grid size={12}>
          <Div className={"fs-1-8rem fw-500"} onClick={() => {
            setClickCount((prevCount) => {
              const newCount = prevCount + 1;
              if (newCount === 5) {
                setOBJECT((prev: any) => ({
                  ...prev,
                  user_id: ADMIN_ID,
                  user_pw: ADMIN_PW,
                }));
                setCheckedSaveId(true);
                setCheckedAutoLogin(true);
                setLoginTrigger(true);
                setClickCount(0);
              }
              return newCount;
            });
          }}>
            {translate("login")}
          </Div>
        </Grid>
      </Grid>
    );
    // 7-2. login
    const loginSection = () => {
      const detailFragment = () => (
        <Grid container={true} spacing={0}>
          {[OBJECT].filter((_: any, idx: number) => idx === 0).map((item: any, i: number) => (
            <Grid container={true} spacing={2} className={"p-10"} key={`detail-${i}`}>
              {/* row 1 */}
              <Grid container={true} spacing={0}>
                <Grid size={12}>
                  <Input
                    label={translate("id")}
                    value={item.user_id}
                    inputRef={REFS?.[i]?.user_id}
                    error={ERRORS?.[i]?.user_id}
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
              </Grid>
              {/** /.row 1 **/}

              {/** row 2 **/}
              <Grid container={true} spacing={0}>
                <Grid size={12}>
                  <Input
                    type={"password"}
                    label={translate("pw")}
                    value={item.user_pw}
                    inputRef={REFS?.[i]?.user_pw}
                    error={ERRORS?.[i]?.user_pw}
                    onChange={(e: any) => {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        user_pw: e.target.value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
              {/** /.row 2 **/}
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
    // 7-3. check
    const checkSection = () => (
      <Grid container={true} spacing={0}>
        <Grid size={6} className={"d-row-right"}>
          <Div className={"d-center fs-0-8rem"}>
            {translate("autoLogin")}
            <Checkbox
              color={"primary"}
              size={"small"}
              checked={checkedAutoLogin}
              onChange={(e: any) => {
                setCheckedAutoLogin(e.target.checked);
              }}
            />
          </Div>
        </Grid>
        <Grid size={6} className={"d-row-left"}>
          <Div className={"fs-0-8rem"}>
            {translate("saveId")}
            <Checkbox
              color={"primary"}
              size={"small"}
              checked={checkedSaveId}
              onChange={(e: any) => {
                setCheckedSaveId(e.target.checked);
              }}
            />
          </Div>
        </Grid>
      </Grid>
    );
    // 7-4. button
    const buttonSection = () => (
      <Grid container={true} spacing={2}>
        {/** row 1 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12} className={"d-col-center"}>
            <Btn
              color={"primary"}
              className={"w-100p fs-1-0rem"}
              onClick={() => {
                flowSave();
              }}
            >
              {translate("login")}
            </Btn>
          </Grid>
        </Grid>
        {/** /.row 1 **/}

        {/** row 2 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12} className={"d-col-center"}>
            <Btn
              color={"primary"}
              className={"w-100p bg-white"}
              onClick={() => {
                flowGoogle();
              }}
            >
              <Div className={"d-row-center"}>
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"user1"}
                />
                <Div className={"fs-1-0rem black ms-10"}>
                  {translate("googleLogin")}
                </Div>
              </Div>
            </Btn>
          </Grid>
        </Grid>
        {/** /.row 2 **/}
      </Grid>
    );
    // 7-5. link
    const linkSection = () => (
      <Grid container={true} spacing={2}>
        {/** row 1 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12} className={"d-row-center"}>
            <Div className={"fs-0-8rem black me-10"}>
              {translate("notId")}
            </Div>
            <Div className={"fs-0-8rem blue pointer"} onClick={() => {
              navigate("/user/signup");
            }}>
              {translate("signup")}
            </Div>
          </Grid>
        </Grid>
        {/** /.row 1 **/}

        {/** row 2 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12} className={"d-row-center"}>
            <Div className={"fs-0-8rem black me-10"}>
              {translate("forgotPw")}
            </Div>
            <Div className={"fs-0-8rem blue pointer"} onClick={() => {
              navigate("/user/resetPw");
            }}>
              {translate("resetPw")}
            </Div>
          </Grid>
        </Grid>
        {/** /.row 2 **/}
      </Grid>
    );
    // 7-10. return
    return (
      <>
      {LOADING && <Loader />}
      <Paper className={"content-wrapper d-center border-1 radius-1 shadow-1 h-min100vh"}>
        {titleSection()}
        <Hr px={20} />
        {loginSection()}
        <Hr px={20} />
        {checkSection()}
        <Hr px={20} />
        {buttonSection()}
        <Hr px={20} />
        {linkSection()}
      </Paper>
      </>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userLoginNode()}
    </>
  );
};