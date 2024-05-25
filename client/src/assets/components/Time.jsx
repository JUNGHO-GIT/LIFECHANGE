// Time.jsx

import {React, useLocation} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {PopUp, Img} from "../../import/ImportComponents.jsx";
import {TextField} from "../../import/ImportMuis.jsx";
import {DigitalClock, AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {sleep2, sleep3, sleep4, exercise4} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Time = ({
  OBJECT, setOBJECT, extra, i
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";

  let image = null;
  let translateStr = "";
  if (firstStr === "sleep" && secondStr === "plan") {
    if (extra.split("_")[2] === "night") {
      image = sleep2;
      translateStr = "sleep-planNight";
    }
    else if (extra.split("_")[2] === "morning") {
      image = sleep3;
      translateStr = "sleep-planMorning";
    }
    else if (extra.split("_")[2] === "time") {
      image = sleep4;
      translateStr = "sleep-planTime";
    }
  }
  else if (firstStr === "sleep" && secondStr !== "plan") {
    if (extra.split("_")[1] === "night") {
      image = sleep2;
      translateStr = "sleep-night";
    }
    else if (extra.split("_")[1] === "morning") {
      image = sleep3;
      translateStr = "sleep-morning";
    }
    else if (extra.split("_")[1] === "time") {
      image = sleep4;
      translateStr = "sleep-time";
    }
  }
  else if (firstStr === "exercise" && secondStr === "plan") {
    if (extra.split("_")[2] === "cardio") {
      image = exercise4;
      translateStr =  "exercise-planCardio";
    }
  }
  else if (firstStr === "exercise" && secondStr !== "plan") {
    if (extra.split("_")[1] === "cardio") {
      image = exercise4;
      translateStr =  "exercise-cardio";
    }
  }

  // 2. planNode ---------------------------------------------------------------------------------->
  const planNode = () => (
    <PopUp
      key={`${i}`}
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
        <DigitalClock
          timeStep={10}
          ampm={false}
          timezone={"Asia/Seoul"}
          value={moment(OBJECT?.[`${extra}`], "HH:mm")}
          sx={{width: "40vw", height: "40vh"}}
          onChange={(e) => {
            setOBJECT((prev) => ({
              ...prev,
              [`${extra}`]: moment(e).format("HH:mm")
            }));
            closePopup();
          }}
        />
      </LocalizationProvider>
      )}>
      {(popTrigger={}) => (
        <TextField
          select={false}
          label={translate(translateStr)}
          size={"small"}
          variant={"outlined"}
          className={"w-86vw"}
          value={OBJECT?.[`${extra}`]}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Img src={image} className={"w-16 h-16"} />
            ),
            endAdornment: (
              translate("common-endHour")
            )
          }}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}
        />
      )}
    </PopUp>
  );

  // 3. realNode ---------------------------------------------------------------------------------->
  const realNode = () => (
    <PopUp
      key={`${i}`}
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
        <DigitalClock
          timeStep={10}
          ampm={false}
          timezone={"Asia/Seoul"}
          value={moment(OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`], "HH:mm")}
          sx={{width: "40vw", height: "40vh"}}
          onChange={(e) => {
            setOBJECT((prev) => ({
              ...prev,
              [`${firstStr}_section`]: prev[`${firstStr}_section`].map((item, idx) => (
                idx === i ? {
                  ...item,
                  [`${extra}`]: moment(e).format("HH:mm")
                } : item
              ))
            }));
            closePopup();
          }}
        />
      </LocalizationProvider>
      )}>
      {(popTrigger={}) => (
        <TextField
          select={false}
          label={translate(translateStr)}
          size={"small"}
          variant={"outlined"}
          className={`${firstStr === "sleep" ? "w-86vw" : "w-40vw ms-3vw"}`}
          value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Img src={image} className={"w-16 h-16"} />
            ),
            endAdornment: (
              translate("common-endHour")
            )
          }}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}
        />
      )}
    </PopUp>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {secondStr === "plan" ? planNode() : realNode()}
    </>
  );
};