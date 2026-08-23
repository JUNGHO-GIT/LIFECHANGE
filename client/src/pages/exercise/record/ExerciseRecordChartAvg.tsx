/**
 * @file ExerciseRecordChartAvg.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useMemo, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@exportStores";
import { ExerciseAvgVolume, ExerciseAvgCardio, ExerciseAvgType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { formatY, formatDateMmDd } from "@exportScripts";
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "@exportLibs";

// -------------------------------------------------------------------------------------------------
declare interface ExerciseRecordChartAvgProps {
  TYPE?: any;
  setTYPE?: any;
  DATE?: any;
}

// -------------------------------------------------------------------------------------------------
export const ExerciseRecordChartAvg = memo((props: ExerciseRecordChartAvgProps) => {

  // 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, chartThemeColors, exerciseChartArray } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-1. useStorageLocal -----------------------------------------------------------------------
  const [ TYPE, setTYPE ] = useStorageLocal(
    `type`, `avg`, PATH, {
      section: `week`,
      line: `volume`,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------
  const [ TYPE_STATE, setTYPE_STATE ] = useState(() => {
    return props?.TYPE !== undefined ? props.TYPE : TYPE;
  });

  // 2-2. useMemo --------------------------------------------------------------------------------
  // - 리스트의 DATE가 주어지면 그 날짜 기준으로 주/월/년 범위를 계산
  const DATE = useMemo(() => {
    const base: string = props?.DATE?.dateStart ?? getDayFmt();
    return {
      dateType: ``,
      dateStart: base,
      dateEnd: props?.DATE?.dateEnd ?? base,
      weekStartFmt: getWeekStartFmt(base),
      weekEndFmt: getWeekEndFmt(base),
      monthStartFmt: getMonthStartFmt(base),
      monthEndFmt: getMonthEndFmt(base),
      yearStartFmt: getYearStartFmt(base),
      yearEndFmt: getYearEndFmt(base),
    };
  }, [ props?.DATE?.dateStart, props?.DATE?.dateEnd ]);

  // 2-2. useState -------------------------------------------------------------------------------
  const [ OBJECT_VOLUME_WEEK, setOBJECT_VOLUME_WEEK ] = useState<[ExerciseAvgType]>([ExerciseAvgVolume]);
  const [ OBJECT_CARDIO_WEEK, setOBJECT_CARDIO_WEEK ] = useState<[ExerciseAvgType]>([ExerciseAvgCardio]);
  const [ OBJECT_VOLUME_MONTH, setOBJECT_VOLUME_MONTH ] = useState<[ExerciseAvgType]>([ExerciseAvgVolume]);
  const [ OBJECT_CARDIO_MONTH, setOBJECT_CARDIO_MONTH ] = useState<[ExerciseAvgType]>([ExerciseAvgCardio]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      setLOADING(true);
      try {
        const params = {
          user_id: sessionId,
          DATE: DATE,
        };
        const [ resWeek, resMonth ] = await Promise.all([
          axios.get(`${URL_OBJECT}/record/chart/avg/week`, {
            params: params,
          }),
          axios.get(`${URL_OBJECT}/record/chart/avg/month`, {
            params: params,
          }),
        ]);
        setOBJECT_VOLUME_WEEK(
          resWeek.data.result.volume?.length > 0 ? resWeek.data.result.volume : [ExerciseAvgVolume]
        );
        setOBJECT_CARDIO_WEEK(
          resWeek.data.result.cardio?.length > 0 ? resWeek.data.result.cardio : [ExerciseAvgCardio]
        );
        setOBJECT_VOLUME_MONTH(
          resMonth.data.result.volume?.length > 0 ? resMonth.data.result.volume : [ExerciseAvgVolume]
        );
        setOBJECT_CARDIO_MONTH(
          resMonth.data.result.cardio?.length > 0 ? resMonth.data.result.cardio : [ExerciseAvgCardio]
        );
      }
      catch (error: any) {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(error.response?.data?.msg ?? `searchError`),
          severity: `error`,
        });
        console.error(error);
      }
      finally {
        setLOADING(false);
      }
    })();
  }, [ URL_OBJECT, DATE, sessionId ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    if (props?.TYPE !== undefined) {
      const isSame: boolean = JSON.stringify(props.TYPE) === JSON.stringify(TYPE_STATE);
      if (!isSame) {
        setTYPE_STATE(props.TYPE);
      }
    }
  }, [props?.TYPE]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    if (props?.setTYPE) {
      const isSame: boolean = JSON.stringify(props.TYPE) === JSON.stringify(TYPE_STATE);
      if (!isSame) {
        props.setTYPE(TYPE_STATE);
      }
    }
    else {
      setTYPE(TYPE_STATE);
    }
  }, [TYPE_STATE]);

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartNode = () => {

    let object: any = null;
    let endStr: string = ``;

    (TYPE_STATE.section === `week` && TYPE_STATE.line === `volume`) ? (() => {
      object = OBJECT_VOLUME_WEEK;
      endStr = `vol`;
    })()
    : (TYPE_STATE.section === `week` && TYPE_STATE.line === `cardio`) ? (() => {
      object = OBJECT_CARDIO_WEEK;
      endStr = `hr`;
    })()
    : (TYPE_STATE.section === `month` && TYPE_STATE.line === `volume`) ? (() => {
      object = OBJECT_VOLUME_MONTH;
      endStr = `vol`;
    })()
    : (TYPE_STATE.section === `month` && TYPE_STATE.line === `cardio`) && (() => {
      object = OBJECT_CARDIO_MONTH;
      endStr = `hr`;
    });

    const { domain, ticks, formatterY } = formatY(object, exerciseChartArray, `exercise`);
    return (
      <ResponsiveContainer width={`100%`} height={`100%`}>
        <ComposedChart
          data={object as any[]}
          margin={{ top: 20, right: 20, bottom: 10, left: 20 }}
          barGap={8}
          barCategoryGap={`20%`}
        >
          <defs>
            <filter id={`textBackground`} x={0} y={0} width={1} height={1}>
              <feFlood floodColor={`#f9f9f9`} />
              <feComposite in={`SourceGraphic`} />
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray={`3 3`}
            stroke={`#f5f5f5`}
          />
          <XAxis
            type={`category`}
            dataKey={`name`}
            tickLine={false}
            axisLine={false}
            tick={{ fill: `#666`, fontSize: 14 }}
            tickFormatter={(value) => {
              return translate(value as string);
            }}
          />
          <YAxis
            width={30}
            type={`number`}
            domain={domain}
            tickLine={false}
            axisLine={false}
            ticks={ticks}
            tick={{ fill: `#666`, fontSize: 14 }}
            tickFormatter={formatterY}
          />
          {TYPE_STATE.line === (`volume`) && (
            <Bar
              dataKey={`volume`}
              fill={chartThemeColors.volume}
              radius={[ 10, 10, 0, 0 ]}
              minPointSize={1}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={400}
              animationEasing={`linear`}
            />
          )}
          {TYPE_STATE.line === (`cardio`) && (
            <Bar
              dataKey={`cardio`}
              fill={chartThemeColors.cardio}
              radius={[ 10, 10, 0, 0 ]}
              minPointSize={1}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={400}
              animationEasing={`linear`}
            />
          )}
          <Tooltip
            labelFormatter={(_label: any, payload: any) => {
              const name: string = payload?.length > 0 ? payload[0]?.payload.name : ``;
              const date: string = payload?.length > 0 ? payload[0]?.payload.date : ``;
              return `${translate(name)} (${formatDateMmDd(date)})`;
            }}
            formatter={(value: any, name: any) => {
              const customName: string = translate(name as string);
              return [ `${Number(value).toLocaleString()} ${endStr}`, customName ];
            }}
            cursor={{
              fill: `rgba(0, 0, 0, 0.1)`,
            }}
            contentStyle={{
              borderRadius: `10px`,
              boxShadow: `0 2px 4px 0 rgba(0, 0, 0, 0.1)`,
              padding: `10px`,
              border: `none`,
              background: `#fff`,
              color: `#666`,
            }}
          />
          <Legend
            iconType={`circle`}
            iconSize={8}
            verticalAlign={`bottom`}
            align={`center`}
            formatter={(value) => {
              return translate(value as string);
            }}
            wrapperStyle={{
              width: `95%`,
              display: `flex`,
              justifyContent: `center`,
              alignItems: `center`,
              fontSize: `0.8rem`,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {chartNode()}
    </>
  );
});
