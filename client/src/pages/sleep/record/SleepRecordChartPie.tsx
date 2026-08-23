/**
 * @file SleepRecordChartPie.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useMemo, memo } from "@exportReacts";
import { useChartMotion, useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@exportStores";
import { SleepPie, SleepPieType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "@exportLibs";

// -------------------------------------------------------------------------------------------------
declare interface SleepRecordChartPieProps {
  TYPE?: any;
  setTYPE?: any;
  DATE?: any;
}
declare interface PieProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  value?: number;
  index?: number;
}

// -------------------------------------------------------------------------------------------------
export const SleepRecordChartPie = memo((props: SleepRecordChartPieProps) => {

  // 1. common ----------------------------------------------------------------------------------
  const chartMotion = useChartMotion();
  const { URL_OBJECT, PATH, chartColors, chartThemeColors, sessionId } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-1. useStorageLocal -----------------------------------------------------------------------
  const [ TYPE, setTYPE ] = useStorageLocal(
    `type`, `pie`, PATH, {
      section: `week`,
      line: `bedTime`,
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
  const [ OBJECT_WEEK, setOBJECT_WEEK ] = useState<[SleepPieType]>([SleepPie]);
  const [ OBJECT_MONTH, setOBJECT_MONTH ] = useState<[SleepPieType]>([SleepPie]);
  const [ OBJECT_YEAR, setOBJECT_YEAR ] = useState<[SleepPieType]>([SleepPie]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      setLOADING(true);
      try {
        const params = {
          user_id: sessionId,
          DATE: DATE,
        };
        const [ resWeek, resMonth, resYear ] = await Promise.all([
          axios.get(`${URL_OBJECT}/record/chart/pie/week`, {
            params: params,
          }),
          axios.get(`${URL_OBJECT}/record/chart/pie/month`, {
            params: params,
          }),
          axios.get(`${URL_OBJECT}/record/chart/pie/year`, {
            params: params,
          }),
        ]);

        // 서버에서 기본값을 포함한 응답을 받으므로 직접 설정
        setOBJECT_WEEK(
          resWeek.data.result && Array.isArray(resWeek.data.result)
          ? resWeek.data.result
          : [SleepPie]
        );
        setOBJECT_MONTH(
          resMonth.data.result && Array.isArray(resMonth.data.result)
          ? resMonth.data.result
          : [SleepPie]
        );
        setOBJECT_YEAR(
          resYear.data.result && Array.isArray(resYear.data.result)
          ? resYear.data.result
          : [SleepPie]
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
        // 에러 발생 시에도 기본값 설정
        setOBJECT_WEEK([SleepPie]);
        setOBJECT_MONTH([SleepPie]);
        setOBJECT_YEAR([SleepPie]);
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

  // 4-1. render -----------------------------------------------------------------------------------
  const renderPie = (
    {
      cx, cy, midAngle, innerRadius, outerRadius, value, index,
    }: PieProps
  ) => {

    let object: any = null;
    let endStr: string = ``;
    if (TYPE_STATE.section === `week`) {
      object = OBJECT_WEEK;
      endStr = `%`;
    }
    else if (TYPE_STATE.section === `month`) {
      object = OBJECT_MONTH;
      endStr = `%`;
    }
    else if (TYPE_STATE.section === `year`) {
      object = OBJECT_YEAR;
      endStr = `%`;
    }

    if (
      cx === undefined
      || cy === undefined
      || midAngle === undefined
      || innerRadius === undefined
      || outerRadius === undefined
      || value === undefined
      || index === undefined
    ) {
      return null;
    }

    const RADIAN: number = Math.PI / 180;
    const radius: number = innerRadius + (outerRadius - innerRadius) / 2;
    const x: number = cx + radius * Math.cos(-midAngle * RADIAN);
    const y: number = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={`white`}
        textAnchor={`middle`}
        dominantBaseline={`central`}
        className={`fs-0-6rem`}
      >
        <tspan x={x} dy={`-0.5em`} dx={`0.4em`}>
          {object?.[index]?.name ? translate(object?.[index]?.name as string) : ``}
        </tspan>
        <tspan x={x} dy={`1.4em`} dx={`0.4em`}>
          {`${Number(value).toLocaleString()} ${endStr}`}
        </tspan>
      </text>
    );
  };

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartNode = () => {

    let object: any[] = [SleepPie];
    let endStr: string = `%`;

    if (TYPE_STATE.section === `week`) {
      object = OBJECT_WEEK || [SleepPie];
    }
    else if (TYPE_STATE.section === `month`) {
      object = OBJECT_MONTH || [SleepPie];
    }
    else if (TYPE_STATE.section === `year`) {
      object = OBJECT_YEAR || [SleepPie];
    }

    // 안전장치: object가 비어있거나 null인 경우 기본값 설정
    if (!object || !Array.isArray(object) || object.length === 0) {
      object = [SleepPie];
    }

    return (
      <ResponsiveContainer width={`100%`} height={`100%`}>
        <PieChart margin={{ top: 60, right: 20, bottom: 10, left: 20 }}>
          <defs>
            <filter id={`textBackground`} x={0} y={0} width={1} height={1}>
              <feFlood floodColor={`#f9f9f9`} />
              <feComposite in={`SourceGraphic`} />
            </filter>
          </defs>
          <Pie
            data={object}
            cx={`50%`}
            cy={`35%`}
            label={renderPie as any}
            labelLine={false}
            outerRadius={110}
            fill={`#8884d8`}
            dataKey={`value`}
            {...chartMotion}
          >
            {object?.map((_entry: any, index: number) => (
              <Cell
                key={`cell-${_entry.name ?? _entry.dataKey ?? _entry.value}`}
                fill={_entry.name === `Empty`
                  ? `#edf0f4`
                  : chartThemeColors[_entry.name]
                    ?? chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any, name: any) => {
              const customName: string = translate(name as string);
              return [ `${Number(value).toLocaleString()} ${endStr}`, customName ];
            }}
            contentStyle={{
              backgroundColor: `rgba(255, 255, 255, 0.8)`,
              border: `none`,
              borderRadius: `10px`,
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
        </PieChart>
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
