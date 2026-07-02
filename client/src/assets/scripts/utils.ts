/**
 * @file utils.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

// 1. random ----------------------------------------------------------------------------------
export const randomNumber = (data: number) => Math.floor(Math.random() * (Number.isNaN(Number(data)) ? 100 : data));

// 2. time ------------------------------------------------------------------------------------
export const randomTime = (): string => {
  const hour: string = Math.floor(Math.random() * 23)
  .toString()
  .padStart(2, `0`);
  const minute: string = Math.floor(Math.random() * 60)
  .toString()
  .padStart(2, `0`);
  return `${hour}:${minute}`;
};

// 3. date ------------------------------------------------------------------------------------
export const calcDate = (startTime: string, endTime: string) => {
  const start: Date = new Date(`1970/01/01 ${startTime}`);
  const end: Date = new Date(`1970/01/01 ${endTime}`);
  const duration: Date = new Date(Number(end) - Number(start) + 24 * 60 * 60 * 1000);
  return `${duration.getHours().toString().padStart(2, `0`)}:${duration.getMinutes().toString().padStart(2, `0`)}`;
};

// 4. decimal ---------------------------------------------------------------------------------
export const strToDecimal = (time: string): number => {
  if (!time) {
    return 0;
  }
  const [ hours, minutes ] = time.split(`:`).map(Number);
  const adjustedHours: number = hours + Math.floor(minutes / 60);
  const adjustedMinutes: number = minutes % 60;

  return adjustedHours + adjustedMinutes / 60;
};

// 5. decimal ---------------------------------------------------------------------------------
export const decimalToStr = (time: number) => {
  if (time === null || time === undefined || Number.isNaN(time)) {
    return `00:00`;
  }
  const hours: number = Math.floor(time);
  const minutes: number = Math.round((time - hours) * 60);
  const adjustedHours: number = hours + Math.floor(minutes / 60);
  const adjustedMinutes: number = minutes % 60;

  return `${String(adjustedHours).padStart(2, `0`)}:${String(adjustedMinutes).padStart(2, `0`)}`;
};

// 6. insertComma -----------------------------------------------------------------------------
// - 세자리 마다 콤마(,) 삽입
export const insertComma = (param: string | number) => {
  let str: string | number = param;

  // 만약 number 형식이면 string 으로 변환
  if (typeof str === `number`) {
    str = str.toString();
  }
  // 변환이 실패하면 그대로 반환
  if (Number.isNaN(Number(str))) {
    return str;
  }
  // 맨 앞에 + 또는 - 기호가 있는 경우 제거하고 부호를 기억
  const isNegative: boolean = str.startsWith(`-`);
  isNegative && (str = str.slice(1));

  // 소수점 이하 포함하여 문자열로 변환 후 3자리마다 콤마 추가
  const [ integerPart, decimalPart ] = str.split(`.`);
  const formattedNum: string = integerPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, `,`);

  // 최종 반환 문자열 구성 (소수점 이하가 있는 경우 포함)
  return (isNegative ? `-` : ``) + formattedNum + (decimalPart !== undefined ? `.${decimalPart}` : ``);
};

// 7. makeForm --------------------------------------------------------------------------------
export const makeForm = (object: Record<string, unknown> | null, fileList: File[] | null, extra?: Record<string, string>) => {
  const form: FormData = new FormData();

  // object 데이터 추가
  if (object) {
    Object.keys(object).forEach((key: string) => {
      const value: unknown = object[key];
      // 이미지 배열인 경우
      if (Array.isArray(value)) {
        form.append(`OBJECT[${key}]`, JSON.stringify(value));
      }
      // 나머지 항목인 경우
      else {
        form.append(`OBJECT[${key}]`, String(value));
      }
    });
  }
  // 파일 추가
  if (fileList) {
    fileList.forEach((file: File) => {
      const newFile: File = new File([file], `${Date.now()}_${file.name}`, { type: file.type });
      form.append(`fileList`, newFile);
    });
  }
  // 추가 데이터 추가
  if (extra) {
    Object.keys(extra).forEach((key: string) => {
      form.append(key, extra[key]);
    });
  }
  return form;
};

// 8. handleNumberInput -----------------------------------------------------------------------
/**
 * 숫자 입력 처리 유틸
 * - 콤마(,) 제거, 최대값 제한, 소수점 자리 제한, 선행 0 제거를 수행합니다.
 * - 유효하지 않은 입력(패턴 불일치 또는 최대값 초과)일 경우 null을 반환합니다.
 *
 * 예: handleNumberInput("1,234.56", 10000, 2) => "1234.56"
 *
 * @param val 사용자 입력값 (콤마 포함 가능)
 * @param max 허용 최대값 (Number 비교)
 * @param decimalPlaces 허용 소수 자릿수 (기본 0, 정수 전용)
 * @returns 가공된 문자열 값 또는 null
 */
export const handleNumberInput = (val: string, max: number, decimalPlaces: number = 0) => {
  let processedValue: string = val === `` ? `0` : val.replaceAll(`,`, ``);
  const regex: RegExp = decimalPlaces === 0 ? /^\d+$/ : new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces}}$`);
  if (Number(processedValue) > max || !regex.test(processedValue)) {
    return null;
  }
  if (/^0(?!\.)/.test(processedValue)) {
    processedValue = processedValue.replaceAll(/^0+/g, ``) || `0`;
  }
  return processedValue;
};

// 9. formatY ---------------------------------------------------------------------------------
// - 차트 Y축 범위 및 눈금 계산
declare interface FormatYResult {
  domain: [number, number];
  ticks: number[];
  formatterY: (_value: number) => string;
}

const formatYCache: WeakMap<object, Map<string, FormatYResult>> = new WeakMap();

export const formatY = (OBJECT: unknown, array: unknown, type: string, _extra?: string): FormatYResult => {
  const objRef: Record<string, unknown>[] = Array.isArray(OBJECT) ? OBJECT as Record<string, unknown>[] : [];
  const arrRef: string[] = Array.isArray(array) ? array as string[] : [];
  const key: string = `${arrRef.join(`|`)}|${type}|${_extra ?? ``}`;

  const outerCache: Map<string, FormatYResult> = formatYCache.get(objRef) ?? (() => {
    const newMap: Map<string, FormatYResult> = new Map();
    formatYCache.set(objRef, newMap);
    return newMap;
  })();
  const cached: FormatYResult | undefined = outerCache.get(key);

  return (
    cached || (() => {
      const ticks: number[] = [];

      // maxValue 계산 (한 번만, 불필요한 중복 계산 제거)
      let maxValue: number = 0;
      objRef.forEach((item: Record<string, unknown>) => {
        arrRef.forEach((arrKey: string) => {
          const val: number = Number(item?.[arrKey] ?? 0);
          val > maxValue && (maxValue = val);
        });
      });

      // 범위를 사람이 읽기 좋은 값으로 맞춰주는 보조 함수
      const computeNiceTick = (max: number, targetTicks: number) => {
        const rough: number = Math.max(Math.ceil(max / Math.max(targetTicks, 1)), 1);
        const exponent: number = rough > 0 ? Math.floor(Math.log10(rough)) : 0;
        const pow10: number = 10 ** exponent;
        const normalized: number = rough / pow10;
        const niceFraction: number = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
        const niceTick: number = niceFraction * pow10;
        const top: number = Math.ceil(max / niceTick) * niceTick;
        return {
          niceTick: niceTick,
          top: top,
        };
      };

      const config = (
				type === `sleep` ? {
				  maxValue: maxValue,
				  tickInterval: _extra === `line` ? 5 : 1,
				  topValue: _extra === `line` ? Math.ceil(maxValue / 100) * 100 : 24,
				} : type === `money` ? (() => {
				  const { niceTick, top } = computeNiceTick(maxValue, 6);
				  return {
				    maxValue: maxValue,
				    tickInterval: niceTick,
				    topValue: top,
				  };
				})() : type === `food` ? (() => {
				  const { niceTick, top } = computeNiceTick(maxValue, 6);
				  return {
				    maxValue: maxValue,
				    tickInterval: Math.max(niceTick, 1),
				    topValue: top,
				  };
				})() : type === `exercise` ? (() => {
				  const { niceTick, top } = computeNiceTick(maxValue, 6);
				  return {
				    maxValue: maxValue,
				    tickInterval: Math.max(niceTick, 1),
				    topValue: top,
				  };
				})() : (() => {
				  throw new Error(`formatY: type error`);
				})()
      ) as {
        maxValue: number;
        tickInterval: number;
        topValue: number;
      };

      let i: number = 0;
      while (i <= config.topValue) {
        ticks.push(i);
        i += config.tickInterval;
      }
      const result: FormatYResult = {
        domain: [ 0, config.topValue ],
        ticks: ticks,
        formatterY: (value: number) => (value >= 1_000_000_000 ? `${(value / 1_000_000_000).toFixed(1)}b` : value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}m` : value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString()),
      };

      outerCache.set(key, result);
      return result;
    })()
  );
};

// 10. formatDateMmDd ---------------------------------------------------------------------------------
// - 날짜 형식 변환 (YYYY-MM-DD -> MM/DD)
export const formatDateMmDd = (dateStr?: string) => {
  const datePattern: RegExp = /\d{4}-(\d{2})-(\d{2})/g;
  return (dateStr ?? ``).replaceAll(datePattern, `$1/$2`);
};

// 10. formatDateYyMmDd -----------------------------------------------------------------------------
// - 날짜 형식 변환 (YYYY-MM-DD -> YY/MM/DD)
export const formatDateYyMmDd = (dateStr?: string) => {
  const datePattern: RegExp = /\d{2}(\d{2})-(\d{2})-(\d{2})/g;
  return (dateStr ?? ``).replaceAll(datePattern, `$1/$2/$3`);
};

// 10. formatDateYyyyMmDd -----------------------------------------------------------------------------
// - 날짜 형식 변환 (YYYY-MM-DD -> YYYY/MM/DD)
export const formatDateYyyyMmDd = (dateStr?: string) => {
  const datePattern: RegExp = /(\d{4})-(\d{2})-(\d{2})/g;
  return (dateStr ?? ``).replaceAll(datePattern, `$1/$2/$3`);
};
