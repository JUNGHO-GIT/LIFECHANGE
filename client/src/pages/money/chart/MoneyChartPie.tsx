/**
 * @file MoneyChartPie.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@exportStores";
import { MoneyPie, MoneyPieType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "@exportLibs";

// -------------------------------------------------------------------------------------------------
declare interface MoneyChartPieProps {
  TYPE?: any;
  setTYPE?: any;
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
export const MoneyChartPie = memo((props: MoneyChartPieProps) => {

  // 1. common ----------------------------------------------------------------------------------
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
      line: `income`,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------
  const [ TYPE_STATE, setTYPE_STATE ] = useState(() => {
    return props?.TYPE !== undefined ? props.TYPE : TYPE;
  });
  const [ DATE, _setDATE ] = useState({
    dateType: ``,
    dateStart: getDayFmt(),
    dateEnd: getDayFmt(),
    weekStartFmt: getWeekStartFmt(),
    weekEndFmt: getWeekEndFmt(),
    monthStartFmt: getMonthStartFmt(),
    monthEndFmt: getMonthEndFmt(),
    yearStartFmt: getYearStartFmt(),
    yearEndFmt: getYearEndFmt(),
  });

  // 2-2. useState -------------------------------------------------------------------------------
  const [ OBJECT_INCOME_WEEK, setOBJECT_INCOME_WEEK ] = useState<[MoneyPieType]>([MoneyPie]);
  const [ OBJECT_EXPENSE_WEEK, setOBJECT_EXPENSE_WEEK ] = useState<[MoneyPieType]>([MoneyPie]);
  const [ OBJECT_INCOME_MONTH, setOBJECT_INCOME_MONTH ] = useState<[MoneyPieType]>([MoneyPie]);
  const [ OBJECT_EXPENSE_MONTH, setOBJECT_EXPENSE_MONTH ] = useState<[MoneyPieType]>([MoneyPie]);
  const [ OBJECT_INCOME_YEAR, setOBJECT_INCOME_YEAR ] = useState<[MoneyPieType]>([MoneyPie]);
  const [ OBJECT_EXPENSE_YEAR, setOBJECT_EXPENSE_YEAR ] = useState<[MoneyPieType]>([MoneyPie]);

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
          axios.get(`${URL_OBJECT}/chart/pie/week`, {
            params: params,
          }),
          axios.get(`${URL_OBJECT}/chart/pie/month`, {
            params: params,
          }),
          axios.get(`${URL_OBJECT}/chart/pie/year`, {
            params: params,
          }),
        ]);

        // 서버에서 기본값을 포함한 응답을 받으므로 직접 설정
        setOBJECT_INCOME_WEEK(
					resWeek.data.result.income && Array.isArray(resWeek.data.result.income)
          ? resWeek.data.result.income
          : [MoneyPie]
        );
        setOBJECT_EXPENSE_WEEK(
					resWeek.data.result.expense && Array.isArray(resWeek.data.result.expense)
          ? resWeek.data.result.expense
          : [MoneyPie]
        );
        setOBJECT_INCOME_MONTH(
					resMonth.data.result.income && Array.isArray(resMonth.data.result.income)
          ? resMonth.data.result.income
          : [MoneyPie]
        );
        setOBJECT_EXPENSE_MONTH(
					resMonth.data.result.expense && Array.isArray(resMonth.data.result.expense)
          ? resMonth.data.result.expense
          : [MoneyPie]
        );
        setOBJECT_INCOME_YEAR(
					resYear.data.result.income && Array.isArray(resYear.data.result.income)
          ? resYear.data.result.income
          : [MoneyPie]
        );
        setOBJECT_EXPENSE_YEAR(
					resYear.data.result.expense && Array.isArray(resYear.data.result.expense)
          ? resYear.data.result.expense
          : [MoneyPie]
        );
      }
      catch (error: any) {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(error.response.data.msg),
          severity: `error`,
        });
        console.error(error);
        // 에러 발생 시에도 기본값 설정
        setOBJECT_INCOME_WEEK([MoneyPie]);
        setOBJECT_EXPENSE_WEEK([MoneyPie]);
        setOBJECT_INCOME_MONTH([MoneyPie]);
        setOBJECT_EXPENSE_MONTH([MoneyPie]);
        setOBJECT_INCOME_YEAR([MoneyPie]);
        setOBJECT_EXPENSE_YEAR([MoneyPie]);
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

		(TYPE_STATE.section === `week` && TYPE_STATE.line === `income`) ? (() => {
		  object = OBJECT_INCOME_WEEK;
		})()
		: (TYPE_STATE.section === `week` && TYPE_STATE.line === `expense`) ? (() => {
		  object = OBJECT_EXPENSE_WEEK;
		})()
		: (TYPE_STATE.section === `month` && TYPE_STATE.line === `income`) ? (() => {
		  object = OBJECT_INCOME_MONTH;
		})()
		: (TYPE_STATE.section === `month` && TYPE_STATE.line === `expense`) ? (() => {
		  object = OBJECT_EXPENSE_MONTH;
		})()
		: (TYPE_STATE.section === `year` && TYPE_STATE.line === `income`) ? (() => {
		  object = OBJECT_INCOME_YEAR;
		})()
		: (TYPE_STATE.section === `year` && TYPE_STATE.line === `expense`) && (() => {
		  object = OBJECT_EXPENSE_YEAR;
		})();

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
		      {object?.[index]?.name ? translate(object?.[index].name as string) : ``}
		    </tspan>
		    <tspan x={x} dy={`1.4em`} dx={`0.4em`}>
		      {Number(value).toLocaleString()}
		    </tspan>
		  </text>
		);
  };

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartNode = () => {

    let object: any[] = [MoneyPie];
    let endStr: string = ``;
    let dateRange: string = ``;

		(TYPE_STATE.section === `week` && TYPE_STATE.line === `income`) ? (() => {
		  object = OBJECT_INCOME_WEEK;
		  dateRange = `${DATE?.weekStartFmt} \u00A0 - \u00A0 ${DATE?.weekEndFmt}`;
		})()
		: (TYPE_STATE.section === `week` && TYPE_STATE.line === `expense`) ? (() => {
		  object = OBJECT_EXPENSE_WEEK;
		  dateRange = `${DATE?.weekStartFmt} \u00A0 - \u00A0 ${DATE?.weekEndFmt}`;
		})()
		: (TYPE_STATE.section === `month` && TYPE_STATE.line === `income`) ? (() => {
		  object = OBJECT_INCOME_MONTH;
		  dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`;
		})()
		: (TYPE_STATE.section === `month` && TYPE_STATE.line === `expense`) ? (() => {
		  object = OBJECT_EXPENSE_MONTH;
		  dateRange = `${DATE?.monthStartFmt} \u00A0 - \u00A0 ${DATE?.monthEndFmt}`;
		})()
		: (TYPE_STATE.section === `year` && TYPE_STATE.line === `income`) ? (() => {
		  object = OBJECT_INCOME_YEAR;
		  dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`;
		})()
		: (TYPE_STATE.section === `year` && TYPE_STATE.line === `expense`) && (() => {
		  object = OBJECT_EXPENSE_YEAR;
		  dateRange = `${DATE?.yearStartFmt} \u00A0 - \u00A0 ${DATE?.yearEndFmt}`;
		})();

		// 안전장치: object가 비어있거나 null인 경우 기본값 설정
		if (!object || !Array.isArray(object) || object.length === 0) {
		  object = [MoneyPie];
		}

		return (
		  <ResponsiveContainer width={`100%`} height={380}>
		    <PieChart margin={{ top: 60, right: 20, bottom: 10, left: 20 }}>
		      <defs>
		        <filter id={`textBackground`} x={0} y={0} width={1} height={1}>
		          <feFlood floodColor={`#f9f9f9`} />
		          <feComposite in={`SourceGraphic`} />
		        </filter>
		      </defs>
		      <rect
		        x={`50%`}
		        y={15}
		        width={120}
		        height={20}
		        rx={4}
		        transform={`translate(-60, 0)`}
		        fill={`transparent`}
		      />
		      <text
		        x={`50%`}
		        y={25}
		        textAnchor={`middle`}
		        dominantBaseline={`middle`}
		        style={{
		          fontSize: `1.0rem`,
		          fill: `#666`,
		          fontWeight: 600,
		        }}
		      >
		        {dateRange}
		      </text>
		      <Pie
		        data={object}
		        cx={`50%`}
		        cy={`45%`}
		        label={renderPie as any}
		        labelLine={false}
		        outerRadius={110}
		        fill={`#8884d8`}
		        dataKey={`value`}
		        isAnimationActive={true}
		        animationBegin={0}
		        animationDuration={400}
		        animationEasing={`linear`}
		      >
		        {object?.map((_entry: any, index: number) => (
		          <Cell
		            key={`cell-${_entry.name ?? _entry.dataKey ?? _entry.value}`}
		            fill={_entry.name === `Empty`
		              ? `#edf0f4`
		              : chartThemeColors[TYPE_STATE.line]
		                ?? chartColors[index % chartColors.length]}
		            fillOpacity={_entry.name === `Empty`
		              ? 1
		              : Math.max(0.6, 1 - (index * 0.1))}
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
