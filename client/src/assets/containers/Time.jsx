// Time.jsx

import { useEffect, createRef } from "../../imports/ImportReacts.jsx";
import { useCommon } from "../../imports/ImportHooks.jsx";
import { moment } from "../../imports/ImportLibs.jsx";
import { Img, Div, Input } from "../../imports/ImportComponents.jsx";
import { PopUp } from "../../imports/ImportContainers.jsx";
import { DigitalClock, AdapterMoment, LocalizationProvider } from "../../imports/ImportMuis.jsx";
import { sleep2, sleep3, sleep4, exercise4 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const Time = ({
  OBJECT, setOBJECT, REFS, ERRORS, DATE, extra, i
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {firstStr, secondStr, translate} = useCommon();

  // displayed image
  let image = null;

  // displayed label
  let translateStr = "";

  if (firstStr === "sleep" && secondStr === "goal") {
    if (extra.split("_")[2] === "bedTime") {
      image = sleep2;
      translateStr = (
        DATE?.dateType === "day" ? (
          `${translate("goalBedTime")}`
        ) : (
          `${translate("goalBedTime")} (${translate("avg")})`
        )
      )
    }
    else if (extra.split("_")[2] === "wakeTime") {
      image = sleep3;
      translateStr = (
        DATE?.dateType === "day" ? (
          `${translate("goalWakeTime")}`
        ) : (
          `${translate("goalWakeTime")} (${translate("avg")})`
        )
      )
    }
    else if (extra.split("_")[2] === "sleepTime") {
      image = sleep4;
      translateStr = (
        DATE?.dateType === "day" ? (
          `${translate("goalSleepTime")}`
        ) : (
          `${translate("goalSleepTime")} (${translate("avg")})`
        )
      )
    }
  }
  else if (firstStr === "sleep" && secondStr !== "goal") {
    if (extra.split("_")[1] === "bedTime") {
      image = sleep2;
      translateStr = `${translate("bedTime")}`;
    }
    else if (extra.split("_")[1] === "wakeTime") {
      image = sleep3;
      translateStr = `${translate("wakeTime")}`;
    }
    else if (extra.split("_")[1] === "sleepTime") {
      image = sleep4;
      translateStr = `${translate("sleepTime")}`;
    }
  }
  else if (firstStr === "exercise" && secondStr === "goal") {
    if (extra.split("_")[2] === "cardio") {
      image = exercise4;
      translateStr = (
        DATE?.dateType === "day" ? (
          `${translate("goalCardio")}`
        ) : (
          `${translate("goalCardio")} (${translate("total")})`
        )
      );
    }
  }
  else if (firstStr === "exercise" && secondStr !== "goal") {
    if (extra.split("_")[1] === "cardio") {
      image = exercise4;
      translateStr = `${translate("cardio")}`;
    }
  }

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    // 1. sleep
    if (firstStr === "sleep" && secondStr !== "goal") {
      REFS.current = OBJECT?.sleep_section?.map((_, idx) => ({
        sleep_bedTime: REFS?.current[idx]?.sleep_bedTime || createRef(),
        sleep_wakeTime: REFS?.current[idx]?.sleep_wakeTime || createRef(),
      }));
    }
  }, [OBJECT]);

  // 2. goalNode -----------------------------------------------------------------------------------
  const goalNode = () => (
    <PopUp
      key={`${i}`}
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
        <DigitalClock
          timeStep={20}
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
        <Input
          label={translateStr}
          className={"w-86vw"}
          value={OBJECT?.[`${extra}`]}
          inputRef={REFS?.current?.[`${extra}`]}
          error={ERRORS?.[`${extra}`]}
          slotProps={{
            input: {
              readOnly: true,
              startAdornment: (
                <Img src={image} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("hm")}
                </Div>
              )
            }
          }}
          onClick={(e) => {
            extra !== "sleep_sleepTime" && (
              popTrigger.openPopup(e.currentTarget)
            )
          }}
        />
      )}
    </PopUp>
  );

  // 3. realNode -----------------------------------------------------------------------------------
  const realNode = () => (
    <PopUp
      key={`${i}`}
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
        <DigitalClock
          timeStep={20}
          ampm={false}
          timezone={"Asia/Seoul"}
          value={moment(OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`], "HH:mm")}
          sx={{width: "40vw", height: "40vh"}}
          onChange={(e) => {
            setOBJECT((prev) => ({
              ...prev,
              [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((item, idx) => (
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
        <Input
          label={translate(translateStr)}
          className={`${firstStr === "sleep" ? "w-86vw" : "w-40vw ms-3vw"}`}
          value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
          inputRef={REFS?.current?.[i]?.[`${extra}`]}
          error={ERRORS?.[i]?.[`${extra}`]}
          readOnly={true}
          startAdornment={
            <Img src={image} className={"w-16 h-16"} />
          }
          endAdornment={
            translate("hm")
          }
          onClick={(e) => {
            extra !== "sleep_sleepTime" && (
              popTrigger.openPopup(e.currentTarget)
            )
          }}
        />
      )}
    </PopUp>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {secondStr === "goal" ? goalNode() : realNode()}
    </>
  );
};