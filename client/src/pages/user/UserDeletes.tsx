// UserDeletes.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommon, useValidateUser } from "@imports/ImportHooks";
import { moment, axios } from "@imports/ImportLibs";
import { Loading } from "@imports/ImportLayouts";
import { Div, Hr, Input, Btn } from "@imports/ImportComponents";
import { Paper, TextArea, Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserDeletes = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, translate, sessionId, URL_OBJECT
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
    user_google: "N",
    user_id_verified: false,
    user_pw: "",
    user_pw_verified: "",
    user_gender: "",
    user_age: "",
    user_initScale: "",
    user_curScale: "",
    user_initProperty: "",
    user_curProperty: "",
    user_image: "",
    user_regDt: "",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result || OBJECT_DEF);
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    setLOADING(true);
    if (!validate(OBJECT)) {
      setLOADING(false);
      return;
    }
    axios.delete(`${URL_OBJECT}/deletes`,{
      data: {
        user_id: sessionId,
      },
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        navigate("/user/login");
      }
      else {
        alert(translate(res.data.msg));
        navigate(0);
      }
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 7. userDeletes --------------------------------------------------------------------------------
  const userDeletesNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Div className={"d-center fs-2-0rem"}>
        {translate("userDeletes")}
      </Div>
    );
    // 7-2. card
    const cardSection = () => {
      const cardFragment = (i: number) => (
        <Card className={"p-10"} key={i}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Input
                label={translate("id")}
                value={OBJECT.user_id}
                readOnly={true}
              />
            </Grid>
            <Grid size={12}>
              <Input
                label={translate("signupDate")}
                value={moment(OBJECT.user_regDt).format("YYYY-MM-DD HH:mm:ss")}
                readOnly={true}
              />
            </Grid>
            <Hr px={20} />
            <Grid size={12}>
              <TextArea
                className={"border radius resize-none cursor-none w-100p p-10"}
                value={`탈퇴 후에는 복구가 불가능합니다.\n정말로 탈퇴하시겠습니까?`}
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
        color={"error"}
        className={"w-100p fs-1-0rem"}
        onClick={() => {
          flowSave();
        }}
      >
        {translate("userDeletes")}
      </Btn>
    );
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper d-center radius border h-min84vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {titleSection()}
            <Hr px={40} />
            {cardSection()}
            <Hr px={40} />
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
      {userDeletesNode()}
    </>
  );
};