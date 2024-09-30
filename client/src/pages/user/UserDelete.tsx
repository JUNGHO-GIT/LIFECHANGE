// UserDelete.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { moment, axios } from "@imports/ImportLibs";
import { Loading } from "@imports/ImportLayouts";
import { Input } from "@imports/ImportContainers";
import { Div, Hr, Btn } from "@imports/ImportComponents";
import { Paper, TextArea, Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserDelete = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, sessionId, URL_OBJECT
  } = useCommonValue();
  const {
    translate,
  } = useTranslate();
  const {
    ERRORS, REFS, validate
  } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>(User);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result || User);
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = () => {
    setLOADING(true);
    if (!validate(OBJECT)) {
      setLOADING(false);
      return;
    }
    axios.delete(`${URL_OBJECT}/delete`,{
      data: {
        user_id: sessionId,
      },
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        localStorage.clear();
        sessionStorage.clear();
        navigate("/user/login");
      }
      else {
        alert(translate(res.data.msg));
        navigate("/user/delete");
      }
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 7. userDelete --------------------------------------------------------------------------------
  const userDeleteNode = () => {
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
                className={"border-1 radius-1 resize-none cursor-none w-100p p-10"}
                value={translate("deleteUser")}
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
      <Paper className={"content-wrapper d-center border-1 radius-1 h-min84vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {titleSection()}
            <Hr px={40} />
            {detailSection()}
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
      {userDeleteNode()}
    </>
  );
};