// utils.ts

// -------------------------------------------------------------------------------------------------
export const randomNumber = (data: number) => {
	return Math.floor(Math.random() * data);
};

// -------------------------------------------------------------------------------------------------
/**
 * 시간 문자열 생성
 * @param none
 * @returns {string}
 */
export const randomTime = (): string => {
	const hour = Math.floor(Math.random() * 23).toString().padStart(2, '0');
	const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
	return `${hour}:${minute}`;
};

// --------------------------------------------------------------------------------------------
// 3. date
export const calcDate = (startTime: string, endTime: string) => {
	const start = new Date(`1970/01/01 ${startTime}`);
	const end = new Date(`1970/01/01 ${endTime}`);
	const duration = new Date(Number(end) - Number(start) + 24 * 60 * 60 * 1000);
	return `${duration.getHours().toString().padStart(2, '0')}:${duration.getMinutes().toString().padStart(2, '0')}`;
};

// --------------------------------------------------------------------------------------------
// 4. decimal
export const strToDecimal = (time: string) => {
	if (!time) {
		return 0;
	}
	const [hours, minutes] = time.split(":").map(Number);
	const adjustedHours = hours + Math.floor(minutes / 60);
	const adjustedMinutes = minutes % 60;

	return adjustedHours + adjustedMinutes / 60;
};

// --------------------------------------------------------------------------------------------
// 4. decimal
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

// --------------------------------------------------------------------------------------------
// 5. insertComma
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

// --------------------------------------------------------------------------------------------
// 6. makeForm
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

// -------------------------------------------------------------------------------------------------
// 7. handleY
// - 차트 Y축 범위 및 눈금 계산
export const handleY = (
	OBJECT: any,
	array: any,
	type: string,
) => {

	let ticks = [];
	let maxValue = 0;
	let topValue = 0;
	let tickInterval = 0;

	// 숫자 변환 및 NaN 처리
	OBJECT = OBJECT.map((item: any) => {
		let newItem: any = {};
		for (let key in item) {
			newItem[key] = Number(item[key] || 0);
		}
		return newItem;
	});

	if (type === "sleep") {
		maxValue = Math.max(...OBJECT.map((item: any) => (
			Math.max(...array.map((key: any) => (
				item[key] || 0
			)))
		)));
		tickInterval = 1;
		topValue = 24;
	}
	else if (type === "money") {
		maxValue = Math.max(...OBJECT.map((item: any) => (
			Math.max(...array.map((key: any) => (
				item[key] || 0
			)))
		)));
		tickInterval = 100;
		topValue = Math.ceil(maxValue / 100) * 100;
	}
	else if (type === "food") {
		maxValue = Math.max(...OBJECT.map((item: any) => (
			Math.max(...array.map((key: any) => (
				item[key] || 0
			)))
		)));
		tickInterval = 10;
		topValue = Math.ceil(maxValue / 100) * 100;
	}
	else if (type === "exercise") {
		maxValue = Math.max(...OBJECT.map((item: any) => (
			Math.max(...array.map((key: any) => (
				item[key] || 0
			)))
		)));
		tickInterval = 10;
		topValue = Math.ceil(maxValue / 100) * 100;
	}
	else {
		throw new Error("handleY: type error");
	}

	for (let i = 0; i <= topValue; i += tickInterval) {
		ticks.push(i);
	}

	return {
		domain: [0, topValue],
		ticks: ticks,
		formatterY: (tick: any) => (`${Number(tick).toLocaleString()}`)
	};
};