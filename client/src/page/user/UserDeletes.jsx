// UserDeletes.jsx
// Node -> Section -> Fragment

import { React, useState, useEffect } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { moment, axios } from "../../import/ImportLibs.jsx";
import { Loading } from "../../import/ImportLayouts.jsx";
import { Empty, Div, Br20, Hr40, Select, Input } from "../../import/ImportComponents.jsx";
import { Paper,  Button, TextArea, Grid, Card } from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const UserDeletes = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, translate, sessionId, URL_OBJECT,
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    user_id: "",
    user_google: false,
    user_number: 0,
    user_gender: "",
    user_age: "",
    user_height: "",
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
    .then(res => {
      setOBJECT(res.data.result || OBJECT_DEF);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    setLOADING(true);
    axios.delete(`${URL_OBJECT}/deletes`,{
      data: {
        user_id: sessionId,
      },
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        navigate("/user/login");
      }
      else {
        alert(translate(res.data.msg));
        navigate(0);
      }
    })
    .catch((err) => {
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
        {translate("deletes")}
      </Div>
    );
    // 7-2. card
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"d-column"} key={i}>
          <Input
            label={translate("id")}
            value={OBJECT.user_id}
            InputProps={{
              readOnly: true,
            }}
          />
          <Br20 />
          <Input
            label={translate("signupDate")}
            value={moment(OBJECT.user_regDt).format("YYYY-MM-DD HH:mm:ss")}
            InputProps={{
              readOnly: true,
            }}
          />
          <Br20 />
          <TextArea
            readOnly={false}
            className={"w-86vw h-9vh border p-10 pointer"}
            value={`탈퇴 후에는 복구가 불가능합니다.\n정말로 탈퇴하시겠습니까?`}
          />
        </Card>
      );
      return (
        cardFragment(0)
      );
    };
    // 7-3. button
    const buttonSection = () => (
      <Div className={"d-center"}>
        <Button
          size={"small"}
          color={"error"}
          className={"w-100p fs-1-0rem"}
          variant={"contained"}
          onClick={() => {
            flowSave();
          }}
        >
          {translate("userDeletes")}
        </Button>
      </Div>
    );
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper radius border h-min84vh"}>
        <Grid container columnSpacing={1}>
          <Grid size={12}>
            {titleSection()}
            <Hr40 />
            {cardSection()}
            <Hr40 />
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