// utils.ts

// 1. random ----------------------------------------------------------------------------------
export const randomNumber = (data: number) => {
	return Math.floor(Math.random() * data);
};

// 2. time ------------------------------------------------------------------------------------
export const randomTime = (): string => {
	const hour = Math.floor(Math.random() * 23).toString().padStart(2, '0');
	const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
	return `${hour}:${minute}`;
};

// 3. date ------------------------------------------------------------------------------------
export const calcDate = (startTime: string, endTime: string) => {
	const start = new Date(`1970/01/01 ${startTime}`);
	const end = new Date(`1970/01/01 ${endTime}`);
	const duration = new Date(Number(end) - Number(start) + 24 * 60 * 60 * 1000);
	return `${duration.getHours().toString().padStart(2, '0')}:${duration.getMinutes().toString().padStart(2, '0')}`;
};

// 4. decimal ---------------------------------------------------------------------------------
export const strToDecimal = (time: string) => {
	if (!time) {
		return 0;
	}
	const [hours, minutes] = time.split(":").map(Number);
	const adjustedHours = hours + Math.floor(minutes / 60);
	const adjustedMinutes = minutes % 60;

	return adjustedHours + adjustedMinutes / 60;
};

// 4. decimal --------------------------------------------------------------------------------
export const decimalToStr = (time: number) => {
	if (time === null || time === undefined) {
		return "00:00";
	}
	const hours = Math.floor(time);
	const minutes = Math.round((time - hours) * 60);
	const adjustedHours = hours + Math.floor(minutes / 60);
	const adjustedMinutes = minutes % 60;

	return `${String(adjustedHours).padStart(2, "0")}:${String(adjustedMinutes).padStart(2, "0")}`;
};

// 5. insertComma -----------------------------------------------------------------------------
// - 세자리 마다 콤마(,) 삽입
export const insertComma = (str: string | number) => {
	try {
		// 만약 number 형식이면 string 으로 변환
		if (typeof str === "number") {
			str = str.toString();
		}
		// 변환이 실패하면 그대로 반환
		if (isNaN(Number(str))) {
			return str;
		}

		// 맨 앞에 + 또는 - 기호가 있는 경우 제거하고 부호를 기억
		const isNegative = str.charAt(0) === "-";
		if (isNegative) {
			str = str.slice(1);
		}

		// 소수점 이하 포함하여 문자열로 변환 후 3자리마다 콤마 추가
		const [integerPart, decimalPart] = str.split(".");
		const formattedNum = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		// 최종 반환 문자열 구성 (소수점 이하가 있는 경우 포함)
		return (
			(isNegative ? "-" : "") +
			formattedNum +
			(decimalPart !== undefined ? "." + decimalPart : "")
		);
	}
	catch (error) {
		console.error("insertComma error", error);
	}
};

// 6. makeForm --------------------------------------------------------------------------------
export const makeForm = (
	object: any,
	fileList: File[] | null,
	extra?: any
) => {

	const form = new FormData();

	// object 데이터 추가
	if (object) {
		Object.keys(object).forEach((key: string, _index: number) => {
			// 이미지 배열인 경우
			if (Array.isArray(object[key])) {
				form.append(`OBJECT[${key}]`, JSON.stringify(object[key]));
			}
			// 나머지 항목인 경우
			else {
				form.append(`OBJECT[${key}]`, object[key]);
			}
		});
	}

	// 파일 추가
	if (fileList) {
		fileList.forEach((file: File, _index: number) => {
			const newFile = new File(
				[file],
				`${new Date().getTime()}_${file.name}`,
				{ type: file.type }
			);
			form.append("fileList", newFile);
		});
	}

	// 추가 데이터 추가
	if (extra) {
		Object.keys(extra).forEach((key: string, _index: number) => {
			form.append(key, extra[key]);
		});
	}

	return form;
};

// 7. handleNumberInput ---------------------------------------------------------------------------
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
	let processedValue = val === "" ? "0" : val.replace(/,/g, "");
	const regex = decimalPlaces === 0 ? /^\d+$/ : new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces}}$`);
	if (Number(processedValue) > max || !regex.test(processedValue)) {
		return null;
	}
	if (/^0(?!\.)/.test(processedValue)) {
		processedValue = processedValue.replace(/^0+/, "");
	}
	return processedValue;
};

// 8. formatY -------------------------------------------------------------------------------------
// - 차트 Y축 범위 및 눈금 계산
export const formatY = (
	OBJECT: any,
	array: any,
	type: string,
	_extra?: string,
) => {
	// 캐시: 동일한 데이터(reference)로 여러 번 호출될 때 계산을 재사용
	const cacheMap = (formatY as any)._cache || new WeakMap();
	(formatY as any)._cache || ((formatY as any)._cache = cacheMap);

	const objRef = OBJECT || [];
	const key = `${(array || []).join("|")}|${type}|${_extra || ""}`;

	const outer = cacheMap.get(objRef) || (cacheMap.set(objRef, new Map()), cacheMap.get(objRef));
	const cached = outer.get(key);
	return cached ? cached : (() => {
		const ticks: number[] = [];

		// maxValue 계산 (한 번만, 불필요한 중복 계산 제거)
		let maxValue = 0;
		for (let i = 0; i < (objRef || []).length; i++) {
			const item = objRef[i];
			for (let j = 0; j < (array || []).length; j++) {
				const val = Number(item?.[array[j]] || 0);
				(val > maxValue) && (maxValue = val);
			}
		}

		// 범위를 사람이 읽기 좋은 값으로 맞춰주는 보조 함수
		const computeNiceTick = (max: number, targetTicks: number) => {
			const rough = Math.max(Math.ceil(max / Math.max(targetTicks, 1)), 1);
			const exponent = rough > 0 ? Math.floor(Math.log10(rough)) : 0;
			const pow10 = Math.pow(10, exponent);
			const normalized = rough / pow10;
			const niceFraction = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
			const niceTick = niceFraction * pow10;
			const top = Math.ceil(max / niceTick) * niceTick;
			return { niceTick, top };
		};

		const config = (
			type === "sleep" ? {
				maxValue: maxValue,
				tickInterval: _extra === "line" ? 5 : 1,
				topValue: _extra === "line" ? Math.ceil(maxValue / 100) * 100 : 24,
			}
			: type === "money" ? (() => {
				const { niceTick, top } = computeNiceTick(maxValue, 6);
				return { maxValue: maxValue, tickInterval: niceTick, topValue: top };
			})()
			: type === "food" ? (() => {
				const { niceTick, top } = computeNiceTick(maxValue, 6);
				return { maxValue: maxValue, tickInterval: Math.max(niceTick, 1), topValue: top };
			})()
			: type === "exercise" ? (() => {
				const { niceTick, top } = computeNiceTick(maxValue, 6);
				return { maxValue: maxValue, tickInterval: Math.max(niceTick, 1), topValue: top };
			})()
			: (() => {
				throw new Error("formatY: type error");
			})()
		);

		for (let i = 0; i <= config.topValue; i += config.tickInterval) {
			ticks.push(i);
		}

		const result = {
			domain: [0, config.topValue],
			ticks: ticks,
			formatterY: (value: number) => (
				value >= 1000000000 ? (
					`${(value / 1000000000).toFixed(1)}b`
				)
				: value >= 1000000 ? (
					`${(value / 1000000).toFixed(1)}m`
				)
				: value >= 1000 ? (
					`${(value / 1000).toFixed(1)}k`
				)
				: value.toLocaleString()
			)
		};

		outer.set(key, result);
		return result;
	})();
};

// 9. formaytDate ---------------------------------------------------------------------------------
// - 날짜 형식 변환 (YYYY-MM-DD -> MM-DD)
export const formatDate = (dateStr: string) => {
	const datePattern = /\d{4}-(\d{2})-(\d{2})/g;
	return dateStr.replace(datePattern, '$1-$2');
};