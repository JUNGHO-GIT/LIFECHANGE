// UserDataDetail.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {axios, numeral} from "../../../import/ImportLibs.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {Div, Br30, Br20, Img, Hr40, Hr20} from "../../../import/ImportComponents.jsx";
import {Paper, TextField, Button, Avatar} from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const UserDataDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const property = JSON.parse(sessionStorage.getItem("property") || "{}");
  const totalProperty = property?.totalProperty || 0;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const PATH = location?.pathname;
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toDataCategory: "/user/data/category",
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    user_id: "",
    user_number: 0,
    user_gender: "",
    user_age: "",
    user_height: "",
    user_weight: "",
    user_image: "",
    user_regDt: "",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/data/detail`, {
      params: {
        user_id: sessionId
      },
    })
    .then((res) => {
      // 첫번째 객체를 제외하고 데이터 추가
      setOBJECT((prev) => {
        if (prev.length === 1 && prev[0]._id === "") {
          return res.data.result;
        }
        else {
          return {...prev, ...res.data.result};
        }
      });
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2));
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(JSON.stringify(res.data.msg).replace(/\"/g, ""));
        navigate(SEND.toDataCategory);
      }
      else {
        alert(JSON.stringify(res.data.msg).replace(/\"/g, ""));
        sessionStorage.setItem("dataCategory", JSON.stringify(OBJECT_DEF.dataCategory));
      }
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2));
    });
  };

  // 6. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-3. table
    const tableFragment = (i) => (
      <Div className={"d-column"} key={i}>
        <Avatar
          alt={"user_image"}
          src={OBJECT?.user_image}
          className={"m-auto w-150 h-150"}
        />
        <Br30 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("id")}
          value={OBJECT?.user_id}
          className={"w-76vw"}
          InputProps={{
            readOnly: true,
          }}
        />
        <Br20 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("regDt")}
          value={OBJECT?.user_regDt.split("T")[0]}
          className={"w-76vw"}
          InputProps={{
            readOnly: true,
          }}
        />
        <Br20 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("gender")}
          value={
            OBJECT?.user_gender === "M" ? translate("male") : OBJECT?.user_gender === "F" ?
            translate("female") : translate("unknown")
          }
          className={"w-76vw"}
          InputProps={{
            readOnly: true,
          }}
        />
        <Br20 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("age")}
          value={OBJECT?.user_age}
          className={"w-76vw"}
          InputProps={{
            readOnly: true,
          }}
        />
        <Br20 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("height")}
          value={numeral(OBJECT?.user_height).format("0,0")}
          InputProps={{
            readOnly: true,
            startAdornment: null,
            endAdornment: (
              <Div className={"fs-0-6rem"}>
                {translate("cm")}
              </Div>
            )
          }}
        />
        <Br20 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("weight")}
          value={numeral(OBJECT?.user_weight).format("0,0")}
          InputProps={{
            readOnly: true,
            startAdornment: null,
            endAdornment: (
              <Div className={"fs-0-6rem"}>
                {translate("kg")}
              </Div>
            )
          }}
        />
        <Br20 />
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          label={translate("property")}
          value={numeral(totalProperty).format("0,0")}
          InputProps={{
            readOnly: true,
            startAdornment: null,
            endAdornment: (
              <Div className={"fs-0-6rem"}>
                {translate("currency")}
              </Div>
            )
          }}
        />
      </Div>
    );
    // 7-8. table
    const tableSection = () => (
      tableFragment(0)
    );
    // 7-9. first
    const firstSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper d-column h-min85vh"}>
          {firstSection()}
        </Div>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
    </>
  );
};