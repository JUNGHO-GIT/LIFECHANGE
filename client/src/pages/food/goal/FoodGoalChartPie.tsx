/**
 * @file FoodGoalChartPie.tsx
 * @description food goal and record pie comparison
 * @author Jungho
 * @since 2026-08-17
 */

import { useState, useEffect, useMemo, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@exportStores";
import { axios } from "@exportLibs";
import { insertComma } from "@exportScripts";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "@exportLibs";
import { Div, Grid } from "@exportComponents";

// -------------------------------------------------------------------------------------------------
declare interface GoalChartMetric {
  key: string;
  goal: number;
  record: number;
  percent: number;
}
declare interface FoodGoalChartPieProps {
  TYPE?: any;
  setTYPE?: any;
  DATE?: any;
}

// -------------------------------------------------------------------------------------------------
export const FoodGoalChartPie = memo((props: FoodGoalChartPieProps) => {

  // 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, chartThemeColors } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-1. useStorageLocal -----------------------------------------------------------------------
  const [ TYPE, setTYPE ] = useStorageLocal(
    `type`, `pie`, PATH, {
      section: `week`,
      metricKey: `kcal`,
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
      weekStartFmt: getWeekStartFmt(base),
      weekEndFmt: getWeekEndFmt(base),
      monthStartFmt: getMonthStartFmt(base),
      monthEndFmt: getMonthEndFmt(base),
      yearStartFmt: getYearStartFmt(base),
      yearEndFmt: getYearEndFmt(base),
    };
  }, [ props?.DATE?.dateStart ]);

  // 2-2. useState -------------------------------------------------------------------------------
  const [ OBJECT_WEEK, setOBJECT_WEEK ] = useState<GoalChartMetric[]>([]);
  const [ OBJECT_MONTH, setOBJECT_MONTH ] = useState<GoalChartMetric[]>([]);
  const [ OBJECT_YEAR, setOBJECT_YEAR ] = useState<GoalChartMetric[]>([]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    try {
      const params = {
        user_id: sessionId,
        DATE: DATE,
      };
      const [ resWeek, resMonth, resYear ] = await Promise.all([
        axios.get(`${URL_OBJECT}/goal/chart/pie/week`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/goal/chart/pie/month`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/goal/chart/pie/year`, {
          params: params,
        }),
      ]);
      setOBJECT_WEEK(Array.isArray(resWeek.data.result?.metrics) ? resWeek.data.result.metrics : []);
      setOBJECT_MONTH(Array.isArray(resMonth.data.result?.metrics) ? resMonth.data.result.metrics : []);
      setOBJECT_YEAR(Array.isArray(resYear.data.result?.metrics) ? resYear.data.result.metrics : []);
    }
    catch (error: any) {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(error.response?.data?.msg ?? `searchError`),
        severity: `error`,
      });
      console.error(error);
      setOBJECT_WEEK([]);
      setOBJECT_MONTH([]);
      setOBJECT_YEAR([]);
    }
    finally {
      setLOADING(false);
    }
  })()}, [ URL_OBJECT, DATE, sessionId ]);

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
  const units: Record<string, string> = { kcal: `kcal`, carb: `g`, protein: `g`, fat: `g` };
  const chartNode = () => {

    let object: GoalChartMetric[] = [];

    (TYPE_STATE.section === `month`) ? (() => {
      object = OBJECT_MONTH;
    })()
    : (TYPE_STATE.section === `year`) ? (() => {
      object = OBJECT_YEAR;
    })()
    : (() => {
      object = OBJECT_WEEK;
    })();

    const metric: GoalChartMetric = object.find((item) => item.key === TYPE_STATE.metricKey) ?? {
      key: TYPE_STATE.metricKey,
      goal: 0,
      record: 0,
      percent: 0,
    };
    const color: string = chartThemeColors[metric.key] ?? `#6ba6d9`;
    const achieved: number = Math.min(100, Math.max(0, metric.percent));
    const chartData = metric.goal <= 0
      ? [{ name: `Empty`, value: 1, color: `#edf0f4` }]
      : [
        { name: `record`, value: achieved, color },
        { name: `remain`, value: 100 - achieved, color: `#edf0f4` },
      ].filter((item) => item.value > 0);
    const formatValue = (value: number): string => {
      const unit: string = units[metric.key] ?? ``;
      return `${insertComma(value)} ${unit ? translate(unit) : ``}`.trim();
    };

    return (
      <>
        <Grid size={6} className={`d-row-center p-relative chart w-124px h-124px`}>
          <ResponsiveContainer width={124} height={124}>
            <PieChart>
              <Pie
                data={chartData}
                cx={`50%`}
                cy={`50%`}
                innerRadius={40}
                outerRadius={58}
                dataKey={`value`}
                nameKey={`name`}
                startAngle={90}
                endAngle={-270}
                stroke={`#fff`}
                strokeWidth={2}
                paddingAngle={chartData.length > 1 ? 2 : 0}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={520}
                animationEasing={`ease-out`}
              >
                {chartData.map((item) => <Cell key={item.name} fill={item.color} />)}
              </Pie>
              <Tooltip formatter={(value: any, name: any) => [`${insertComma(value)}%`, translate(name)]} />
            </PieChart>
          </ResponsiveContainer>
          <Div className={`chart-center fs-0-9rem fw-700`}>{`${metric.percent}%`}</Div>
        </Grid>
        <Grid size={6} className={`legend d-col-center`}>
          <Div className={`d-row-between w-100p mb-10px`}>
            <Div className={`fs-0-65rem fw-600 dark`}>{translate(`goal`)}</Div>
            <Div className={`fs-0-75rem fw-700`}>{formatValue(metric.goal)}</Div>
          </Div>
          <Div className={`d-row-between w-100p`}>
            <Div className={`fs-0-65rem fw-600 dark`}>{translate(`record`)}</Div>
            <Div className={`fs-0-75rem fw-700`} style={{ color }}>{formatValue(metric.record)}</Div>
          </Div>
        </Grid>
      </>
    );
  };

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {chartNode()}
    </>
  );
});
