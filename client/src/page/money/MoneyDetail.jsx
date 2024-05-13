// MoneyDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar, Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Adornment, Icons, PopAlert, PopUp, PopDown} from "../../import/ImportComponents.jsx";
import {Div, Hr10, Br10} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {Badge} from "../../import/ImportMuis.jsx";
import {TextField} from "../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis.jsx";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const planStr = PATH?.split("/")[3] ? "plan" : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail: "/money/detail",
    toList: "/money/list",
    toUpdate: "/money/save",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    money_number: 0,
    money_demo: false,
    money_startDt: "0000-00-00",
    money_endDt: "0000-00-00",
    money_total_in: 0,
    money_total_out: 0,
    money_property: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: user_id,
        _id: location_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
    }));
    setLOADING(false);
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const res = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        user_id: user_id,
        _id: id,
        section_id: section_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      if (Object.keys(res.data.result).length > 0) {
        setOBJECT(res.data.result);
      }
      else {
        navParam(SEND.toList);
      }
    }
    else {
      alert(res.data.msg);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
        <DesktopDatePicker
          label={"날짜"}
          value={moment(DATE.startDt, "YYYY-MM-DD")}
          format={"YYYY-MM-DD"}
          timezone={"Asia/Seoul"}
          views={["day"]}
          className={"m-auto"}
          readOnly={false}
          slotProps={{
            textField: {sx: {
              width: "220px",
            }},
            layout: {sx: {
              "& .MuiPickersLayout-contentWrapper": {
                width: "220px",
                height: "280px",
              },
              "& .MuiDateCalendar-root": {
                width: "210px",
                height: "270px",
              },
              "& .MuiPickersDay-root": {
                width: "28px",
                height: "28px",
              },
            }},
          }}
          onChange={(day) => {
            setDATE((prev) => ({
              ...prev,
              startDt: moment(day).format("YYYY-MM-DD"),
              endDt: moment(day).format("YYYY-MM-DD")
            }));
          }}
        />
      </LocalizationProvider>
    );
    // 7-3. count
    const countSection = () => (
      <TextField
        type={"text"}
        id={"sectionCnt"}
        label={"항목수"}
        variant={"outlined"}
        size={"small"}
        className={"w-220"}
        value={COUNT?.sectionCnt}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <Adornment name={"TbTextPlus"} className={"w-18 h-18 dark"} position={"start"} />
          )
        }}
      />
    );
    // 7-4. total
    const totalSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 수입"}
            size={"small"}
            value={`${numeral(OBJECT?.money_total_in).format('0,0')}`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adornment name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 지출"}
            size={"small"}
            value={`${numeral(OBJECT?.money_total_out).format('0,0')}`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adornment name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 자산"}
            size={"small"}
            value={`${numeral(OBJECT?.money_property).format('0,0')}`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adornment name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Div>
      </Card>
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <>
      <Div className={"d-center"}>
        <Badge
          badgeContent={index + 1}
          color={"primary"}
          showZero={true}
        />
      </Div>
      <PopDown elementId={`pop-${index}`} contents={
        <>
        <Div className={"d-row align-center"} onClick={() => {
          flowDelete(id, sectionId);
        }}>
          <Icons name={"MdOutlineDelete"} className={"w-24 h-24 dark pointer"} />
          <p className={"fs-14"}>삭제</p>
        </Div>
        <Div className={"d-row align-center"} onClick={() => {
          SEND.startDt = DATE.startDt;
          SEND.endDt = DATE.endDt;
          navParam(SEND.toUpdate, {
            state: SEND,
          });
        }}>
          <Icons name={"MdOutlineEdit"} className={"w-24 h-24 dark pointer"} />
          <p className={"fs-14"}>수정</p>
        </Div>
        </>
      }>
        {(popTrigger) => (
          <Icons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark me-n10"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopDown>
      </>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between mt-n15 mb-20"}>
          {dropdownSection(OBJECT?._id, OBJECT?.money_section[i]._id, i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"파트"}
            type={"text"}
            variant={"outlined"}
            size={"small"}
            className={"w-100 me-10"}
            value={OBJECT?.money_section[i]?.money_part_val}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            select={false}
            label={"타이틀"}
            type={"text"}
            variant={"outlined"}
            size={"small"}
            className={"w-100 ms-10"}
            value={OBJECT?.money_section[i]?.money_title_val}
            InputProps={{
              readOnly: true,
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"금액"}
            type={"text"}
            variant={"outlined"}
            size={"small"}
            className={"w-220"}
            value={`${numeral(OBJECT?.money_section[i]?.money_amount).format('0,0')}`}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adornment name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"메모"}
            type={"text"}
            variant={"outlined"}
            size={"small"}
            className={"w-220"}
            value={OBJECT?.money_section[i]?.money_content}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adornment name={"BiEditAlt"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Div>
      </Card>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min500"}>
        <Div className={"d-column mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-center mb-20"}>
          {countSection()}
        </Div>
        <Div className={"d-column mb-20"}>
          {totalSection()}
        </Div>
        <Div className={"d-column"}>
          {OBJECT?.money_section.map((item, i) => tableFragment(i))}
        </Div>
      </Div>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
        {tableSection()}
      </Paper>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        part: partStr,
        type: typeStr,
        plan: planStr,
      }}
      objects={{
        DATE, SEND, COUNT, DAYPICKER
      }}
      functions={{
        setDATE, setSEND, setCOUNT, setDAYPICKER
      }}
      handlers={{
        navParam
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};