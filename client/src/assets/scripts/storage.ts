/**
 * @file storage.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

const TITLE: string = import.meta.env.VITE_APP_TITLE ?? ``;

// 0. safe parse ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
const safeParse = (raw: string | null): any => {
	try {
		return JSON.parse(raw ?? `{}`);
	} catch {
		return {};
	}
};

const isPlainObject = (v: any): boolean => {
	return !!v && typeof v === `object` && !Array.isArray(v);
};

// 1. getLocal ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const getLocal = (key1: string, key2: string, key3: string) => {
	const localTitle: any = safeParse(localStorage.getItem(TITLE));

	// 1. key1만 있는 경우
	if (key1 && !key2 && !key3) {
		return localTitle?.[key1];
	}

	// 2. key1, key2만 있는 경우
	if (key1 && key2 && !key3) {
		return localTitle?.[key1]?.[key2];
	}

	// 3. key1, key2, key3 모두 있는 경우
	if (key1 && key2 && key3) {
		return localTitle?.[key1]?.[key2]?.[key3];
	}
};

// 2. setLocal ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const setLocal = (
	key1: string,
	key2: string,
	key3: string,
	value: any,
) => {
	const localTitle: any = safeParse(localStorage.getItem(TITLE));

	// 1. key1만 있는 경우
	if (key1 && !key2 && !key3) {
		const prev1: any = localTitle?.[key1];
		const next1: any = isPlainObject(value)
			? {
					...(isPlainObject(prev1) ? prev1 : {}),
					...value,
				}
			: value;

		localStorage.setItem(
			TITLE,
			JSON.stringify({
				...localTitle,
				[key1]: next1,
			}),
		);
	}

	// 2. key1, key2만 있는 경우
	else if (key1 && key2 && !key3) {
		const prev1: any = localTitle?.[key1];
		const prev2: any = localTitle?.[key1]?.[key2];
		const next2: any = isPlainObject(value)
			? {
					...(isPlainObject(prev2) ? prev2 : {}),
					...value,
				}
			: value;

		localStorage.setItem(
			TITLE,
			JSON.stringify({
				...localTitle,
				[key1]: {
					...(isPlainObject(prev1) ? prev1 : {}),
					[key2]: next2,
				},
			}),
		);
	}

	// 3. key1, key2, key3 모두 있는 경우
	else if (key1 && key2 && key3) {
		const prev1: any = localTitle?.[key1];
		const prev2: any = localTitle?.[key1]?.[key2];
		const prev3: any = localTitle?.[key1]?.[key2]?.[key3];
		const next3: any = isPlainObject(value)
			? {
					...(isPlainObject(prev3) ? prev3 : {}),
					...value,
				}
			: value;

		localStorage.setItem(
			TITLE,
			JSON.stringify({
				...localTitle,
				[key1]: {
					...(isPlainObject(prev1) ? prev1 : {}),
					[key2]: {
						...(isPlainObject(prev2) ? prev2 : {}),
						[key3]: next3,
					},
				},
			}),
		);
	}
};

// 3. getSession ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const getSession = (key1: string, key2: string, key3: string) => {
	const sessionTitle: any = safeParse(sessionStorage.getItem(TITLE));

	// 1. key1만 있는 경우
	if (key1 && !key2 && !key3) {
		return sessionTitle?.[key1];
	}

	// 2. key1, key2만 있는 경우
	if (key1 && key2 && !key3) {
		return sessionTitle?.[key1]?.[key2];
	}

	// 3. key1, key2, key3 모두 있는 경우
	if (key1 && key2 && key3) {
		return sessionTitle?.[key1]?.[key2]?.[key3];
	}

	return {};
};

// 4. setSession ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const setSession = (
	key1: string,
	key2: string,
	key3: string,
	value: any,
) => {
	const sessionTitle: any = safeParse(sessionStorage.getItem(TITLE));

	// 1. key1만 있는 경우
	if (key1 && !key2 && !key3) {
		const prev1: any = sessionTitle?.[key1];
		const next1: any = isPlainObject(value)
			? {
					...(isPlainObject(prev1) ? prev1 : {}),
					...value,
				}
			: value;

		sessionStorage.setItem(
			TITLE,
			JSON.stringify({
				...sessionTitle,
				[key1]: next1,
			}),
		);
	}

	// 2. key1, key2만 있는 경우
	else if (key1 && key2 && !key3) {
		const prev1: any = sessionTitle?.[key1];
		const prev2: any = sessionTitle?.[key1]?.[key2];
		const next2: any = isPlainObject(value)
			? {
					...(isPlainObject(prev2) ? prev2 : {}),
					...value,
				}
			: value;

		sessionStorage.setItem(
			TITLE,
			JSON.stringify({
				...sessionTitle,
				[key1]: {
					...(isPlainObject(prev1) ? prev1 : {}),
					[key2]: next2,
				},
			}),
		);
	}

	// 3. key1, key2, key3 모두 있는 경우
	else if (key1 && key2 && key3) {
		const prev1: any = sessionTitle?.[key1];
		const prev2: any = sessionTitle?.[key1]?.[key2];
		const prev3: any = sessionTitle?.[key1]?.[key2]?.[key3];
		const next3: any = isPlainObject(value)
			? {
					...(isPlainObject(prev3) ? prev3 : {}),
					...value,
				}
			: value;

		sessionStorage.setItem(
			TITLE,
			JSON.stringify({
				...sessionTitle,
				[key1]: {
					...(isPlainObject(prev1) ? prev1 : {}),
					[key2]: {
						...(isPlainObject(prev2) ? prev2 : {}),
						[key3]: next3,
					},
				},
			}),
		);
	}
};
