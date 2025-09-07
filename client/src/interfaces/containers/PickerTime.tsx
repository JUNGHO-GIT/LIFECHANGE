// PickerTime.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue } from "@importHooks";
import { useStoreLanguage } from "@importStores";
import { moment } from "@importLibs";
import { PopUp, Input } from "@importContainers";
import { Img, Grid } from "@importComponents";
import { DigitalClock, AdapterMoment, LocalizationProvider } from "@importMuis";

// -------------------------------------------------------------------------------------------------
declare type PickerTimeProps = {
  OBJECT: any;
  setOBJECT: React.Dispatch<React.SetStateAction<any>>;
  REFS:  Record<string, any>;
  ERRORS: Record<string, any>;
  DATE: Record<string, any>;
  LOCKED: string;
  extra: string;
  i: number;
}

// -------------------------------------------------------------------------------------------------
export const PickerTime = (
  { OBJECT, setOBJECT, REFS, ERRORS, DATE, LOCKED, extra, i }: PickerTimeProps
) => {

	// 1. common ----------------------------------------------------------------------------------
  const { firstStr, secondStr, localLang, localTimeZone } = useCommonValue();
  const { translate } = useStoreLanguage();

	// 2-2. useState ---------------------------------------------------------------------------------
	const [image, setImage] = useState<string>("");
	const [targetStr, setTargetStr] = useState<string>("");
	const [translateStr, setTranslateStr] = useState<string>("");

	// 2-3. useEffect ----------------------------------------------------------------------------
	useEffect(() => {
		// 1. calendar
		if (firstStr === `calendar`) {
			if (extra.includes(`exercise_cardio`)) {
				setImage(`exercise4`);
				setTargetStr(`exercise`);
				setTranslateStr(translate(`cardio`));
			}
			else if (extra.includes(`sleep_bedTime`)) {
				setImage(`sleep2`);
				setTargetStr(`sleep`);
				setTranslateStr(translate(`bedTime`));
			}
			else if (extra.includes(`sleep_wakeTime`)) {
				setImage(`sleep3`);
				setTargetStr(`sleep`);
				setTranslateStr(translate(`wakeTime`));
			}
			else if (extra.includes(`sleep_sleepTime`)) {
				setImage(`sleep4`);
				setTargetStr(`sleep`);
				setTranslateStr(translate(`sleepTime`));
			}
		}

		// 2. exercise
		else if (firstStr === `exercise`) {
			// 1. exercise - goal 인 경우
			if (secondStr === `goal`) {
				if (extra.includes(`exercise_goal_cardio`)) {
					setImage(`exercise4`);
					setTargetStr(`exercise`);
					setTranslateStr(
						DATE?.dateType === `day` ? (
							translate(`goalCardio`)
						) : (
							`${translate(`goalCardio`)} (${translate(`total`)})`
						)
					);
				}
			}

			// 4. exercise - goal 아닌 경우
			else if (secondStr !== `goal`) {
				if (extra.includes(`exercise_cardio`)) {
					setImage(`exercise4`);
					setTargetStr(`exercise`);
					setTranslateStr(translate(`cardio`));
				}
			}
		}

		// 3. sleep
		else if (firstStr === `sleep`) {
			// 1. sleep - goal 인 경우
			if (secondStr === `goal`) {
				if (extra.includes(`sleep_goal_bedTime`)) {
					setImage(`sleep2`);
					setTargetStr(`sleep`);
					setTranslateStr(
						DATE?.dateType === `day` ? (
							translate(`goalBedTime`)
						) : (
							`${translate(`goalBedTime`)} (${translate(`avg`)})`
						)
					);
				}
				else if (extra.includes(`sleep_goal_wakeTime`)) {
					setImage(`sleep3`);
					setTargetStr(`sleep`);
					setTranslateStr(
						DATE?.dateType === `day` ? (
							translate(`goalWakeTime`)
						) : (
							`${translate(`goalWakeTime`)} (${translate(`avg`)})`
						)
					);
				}
				else if (extra.includes(`sleep_goal_sleepTime`)) {
					setImage(`sleep4`);
					setTargetStr(`sleep`);
					setTranslateStr(
						DATE?.dateType === `day` ? (
							translate(`goalSleepTime`)
						) : (
							`${translate(`goalSleepTime`)} (${translate(`avg`)})`
						)
					);
				}
			}

			// 2. sleep - goal 아닌 경우
			else if (secondStr !== `goal`) {
				if (extra.includes(`sleep_bedTime`)) {
					setImage(`sleep2`);
					setTargetStr(`sleep`);
					setTranslateStr(translate(`bedTime`));
				}
				else if (extra.includes(`sleep_wakeTime`)) {
					setImage(`sleep3`);
					setTargetStr(`sleep`);
					setTranslateStr(translate(`wakeTime`));
				}
				else if (extra.includes(`sleep_sleepTime`)) {
					setImage(`sleep4`);
					setTargetStr(`sleep`);
					setTranslateStr(translate(`sleepTime`));
				}
			}
		}
	}, [firstStr, secondStr, extra, DATE]);

  // 7. time ---------------------------------------------------------------------------------------
  const timeNode = () => {
		const calendarSection = () => (
      <PopUp
				key={`${firstStr}-${extra}-${i}`}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Grid container={true} spacing={2} className={"w-max-40vw h-max-40vh"}>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={localTimeZone}
                  value={moment(OBJECT?.[`calendar_${targetStr}_section`]?.[i]?.[`${extra}`], "HH:mm")}
                  sx={{
                    width: "40vw",
                    height: "40vh"
                  }}
                  onChange={(e: any) => {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      [`calendar_${targetStr}_section`]: prev?.[`calendar_${targetStr}_section`]?.map((section: any, idx: number) => (
                        idx === i ? {
                          ...section,
                          [`${extra}`]: moment(e).format("HH:mm")
                        } : section
                      ))
                    }));
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
        children={(popTrigger: any) => (
          <Input
            label={translateStr}
            value={OBJECT?.[`calendar_${targetStr}_section`]?.[i]?.[`${extra}`] || ``}
            inputRef={REFS?.[i]?.[`${extra}`]}
            error={ERRORS?.[i]?.[`${extra}`]}
            readOnly={true}
            locked={LOCKED}
            startadornment={
              <Img
                max={14}
                hover={true}
                shadow={false}
                radius={false}
                src={`${image}.webp`}
              />
            }
            endadornment={
              translate("hm")
            }
            onClick={(e: any) => {
              extra !== "sleep_sleepTime" && (
                LOCKED === "unlocked" && popTrigger.openPopup(e.currentTarget)
              )
            }}
          />
        )}
      />
		);
    const goalSection = () => (
      <PopUp
        key={`${firstStr}-${extra}-goal-${i}`}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Grid container={true} spacing={2} className={"w-max-40vw h-max-40vh"}>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={localTimeZone}
                  value={moment(OBJECT?.[`${extra}`], "HH:mm")}
                  sx={{
                    width: "40vw",
                    height: "40vh"
                  }}
                  onChange={(e: any) => {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      [`${extra}`]: moment(e).format("HH:mm")
                    }));
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
        children={(popTrigger: any) => (
          <Input
            label={translateStr}
            value={OBJECT?.[`${extra}`] || ``}
            inputRef={REFS?.[i]?.[`${extra}`]}
            error={ERRORS?.[i]?.[`${extra}`]}
            readOnly={true}
            locked={LOCKED}
            startadornment={
              <Img
                max={14}
                hover={true}
                shadow={false}
                radius={false}
                src={`${image}.webp`}
              />
            }
            endadornment={
              translate("hm")
            }
            onClick={(e: any) => {
              LOCKED === "unlocked" && popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      />
    );
    const realSection = () => (
      <PopUp
				key={`${firstStr}-${extra}-real-${i}`}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Grid container={true} spacing={2} className={"w-max-40vw h-max-40vh"}>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={localTimeZone}
                  value={moment(OBJECT?.[`${firstStr}_section`]?.[i]?.[`${extra}`], "HH:mm")}
                  sx={{
                    width: "40vw",
                    height: "40vh"
                  }}
                  onChange={(e: any) => {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      [`${firstStr}_section`]: prev?.[`${firstStr}_section`]?.map((section: any, idx: number) => (
                        idx === i ? {
                          ...section,
                          [`${extra}`]: moment(e).format("HH:mm")
                        } : section
                      ))
                    }));
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
        children={(popTrigger: any) => (
          <Input
            label={translateStr}
            value={OBJECT?.[`${firstStr}_section`]?.[i]?.[`${extra}`] || ``}
            inputRef={REFS?.[i]?.[`${extra}`]}
            error={ERRORS?.[i]?.[`${extra}`]}
            readOnly={true}
            locked={LOCKED}
            startadornment={
              <Img
                max={14}
                hover={true}
                shadow={false}
                radius={false}
                src={`${image}.webp`}
              />
            }
            endadornment={
              translate("hm")
            }
            onClick={(e: any) => {
              extra !== "sleep_sleepTime" && (
                LOCKED === "unlocked" && popTrigger.openPopup(e.currentTarget)
              )
            }}
          />
        )}
      />
    );
    return (
			firstStr === "calendar" ? (
				calendarSection()
			)
			: firstStr !== "calendar" && secondStr === "goal" ? (
				goalSection()
			) : (
				realSection()
			)
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {timeNode()}
    </>
  );
};