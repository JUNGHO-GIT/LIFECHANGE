/**
 * @file useTime.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { useCommonDate } from "@exportHooks";
import { useEffect } from "@exportReacts";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const useTime = (
	OBJECT: Record<string, unknown>,
	setOBJECT: any,
	PATH: string,
	type: string,
) => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { getDayFmt } = useCommonDate();
	const match: RegExpMatchArray | null = PATH.match(/\/([^/]+)\//);
	const strLow: string | null = match ? match[1] : null;

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		const isGoalExercise: boolean = type === `goal` && strLow === `exercise`;
		const isGoalSleep: boolean = type === `goal` && strLow === `sleep`;
		const isRecordSleep: boolean = type === `record` && strLow === `sleep`;

		const getRecordSleepTime: (_section: unknown) => string | null = (
			section,
		) => {
			const sectionObj: Record<string, unknown> =
				section && typeof section === `object`
					? (section as Record<string, unknown>)
					: {};
			const sleepTime: unknown = sectionObj[`sleep_record_sleepTime`];
			return typeof sleepTime === `string` ? sleepTime : null;
		};

		let handled: boolean = false;

		if (isGoalExercise) {
			handled = true;

			const startTime: string =
				typeof OBJECT[`exercise_goal_dateStart`] === `string`
					? OBJECT[`exercise_goal_dateStart`]
					: ``;
			const endTime: string =
				typeof OBJECT[`exercise_goal_dateEnd`] === `string`
					? OBJECT[`exercise_goal_dateEnd`]
					: ``;

			if (startTime !== `` && endTime !== ``) {
				let startDate: Date = new Date(`${startTime}T00:00`);
				let endDate: Date = new Date(`${endTime}T00:00`);

				if (Number.isNaN(startDate.getTime())) {
					startDate = new Date(
						`${String(startTime).replaceAll(`/`, `-`)}T00:00`,
					);
				}
				if (Number.isNaN(endDate.getTime())) {
					endDate = new Date(`${String(endTime).replaceAll(`/`, `-`)}T00:00`);
				}

				if (
					!Number.isNaN(startDate.getTime()) &&
					!Number.isNaN(endDate.getTime())
				) {
					const diff: number = endDate.getTime() - startDate.getTime();
					if (!Number.isNaN(diff) && Number.isFinite(diff)) {
						const days: number = Math.floor(diff / 86_400_000);
						const time: string = String(days).padStart(2, `0`);

						setOBJECT((prev: Record<string, unknown>) => ({
							...prev,
							exercise_goal_time: time,
						}));
					}
				}
			}
		}

		if (!handled && isGoalSleep) {
			handled = true;

			const dayFmt: string = String(getDayFmt());
			const bedTimeTime: string =
				typeof OBJECT[`sleep_goal_bedTime`] === `string`
					? OBJECT[`sleep_goal_bedTime`]
					: ``;
			const wakeTimeTime: string =
				typeof OBJECT[`sleep_goal_wakeTime`] === `string`
					? OBJECT[`sleep_goal_wakeTime`]
					: ``;

			if (bedTimeTime !== `` && wakeTimeTime !== ``) {
				let startDate: Date = new Date(`${dayFmt}T${bedTimeTime}`);
				let endDate: Date = new Date(`${dayFmt}T${wakeTimeTime}`);

				if (Number.isNaN(startDate.getTime())) {
					startDate = new Date(`${dayFmt.replaceAll(`/`, `-`)}T${bedTimeTime}`);
				}
				if (Number.isNaN(endDate.getTime())) {
					endDate = new Date(`${dayFmt.replaceAll(`/`, `-`)}T${wakeTimeTime}`);
				}

				if (
					!Number.isNaN(startDate.getTime()) &&
					!Number.isNaN(endDate.getTime())
				) {
					if (endDate.getTime() < startDate.getTime()) {
						endDate.setDate(endDate.getDate() + 1);
					}

					const diff: number = endDate.getTime() - startDate.getTime();
					if (!Number.isNaN(diff) && Number.isFinite(diff)) {
						const hours: number = Math.floor(diff / 3_600_000);
						const minutes: number = Math.floor((diff % 3_600_000) / 60_000);
						const time: string = `${String(hours).padStart(2, `0`)}:${String(minutes).padStart(2, `0`)}`;

						setOBJECT((prev: Record<string, unknown>) => ({
							...prev,
							sleep_goal_sleepTime: time,
						}));
					}
				}
			}
		}

		if (!handled && isRecordSleep) {
			const dayFmt: string = String(getDayFmt());
			const sectionsRaw: unknown = OBJECT[`sleep_section`];
			const sections: unknown[] = Array.isArray(sectionsRaw) ? sectionsRaw : [];

			if (sections.length > 0) {
				const updatedSections: unknown[] = sections.map((section: unknown) => {
					if (!section || typeof section !== `object`) {
						return section;
					}

					const sectionObj: Record<string, unknown> = section as Record<
						string,
						unknown
					>;
					const bedTimeTime: string =
						typeof sectionObj[`sleep_record_bedTime`] === `string`
							? sectionObj[`sleep_record_bedTime`]
							: ``;
					const wakeTimeTime: string =
						typeof sectionObj[`sleep_record_wakeTime`] === `string`
							? sectionObj[`sleep_record_wakeTime`]
							: ``;

					let nextSection: Record<string, unknown> = sectionObj;

					if (bedTimeTime !== `` && wakeTimeTime !== ``) {
						let startDate: Date = new Date(`${dayFmt}T${bedTimeTime}`);
						let endDate: Date = new Date(`${dayFmt}T${wakeTimeTime}`);

						if (Number.isNaN(startDate.getTime())) {
							startDate = new Date(
								`${dayFmt.replaceAll(`/`, `-`)}T${bedTimeTime}`,
							);
						}
						if (Number.isNaN(endDate.getTime())) {
							endDate = new Date(
								`${dayFmt.replaceAll(`/`, `-`)}T${wakeTimeTime}`,
							);
						}

						if (
							!Number.isNaN(startDate.getTime()) &&
							!Number.isNaN(endDate.getTime())
						) {
							if (endDate.getTime() < startDate.getTime()) {
								endDate.setDate(endDate.getDate() + 1);
							}

							const diff: number = endDate.getTime() - startDate.getTime();
							if (!Number.isNaN(diff) && Number.isFinite(diff)) {
								const hours: number = Math.floor(diff / 3_600_000);
								const minutes: number = Math.floor((diff % 3_600_000) / 60_000);
								const time: string = `${String(hours).padStart(2, `0`)}:${String(minutes).padStart(2, `0`)}`;
								nextSection = {
									...sectionObj,
									sleep_record_sleepTime: time,
								};
							}
						}
					}

					return nextSection;
				});

				setOBJECT((prev: Record<string, unknown>) => {
					const prevSectionsRaw: unknown = prev[`sleep_section`];
					const prevSections: unknown[] = Array.isArray(prevSectionsRaw)
						? prevSectionsRaw
						: [];
					const isSame: boolean =
						prevSections.length === updatedSections.length &&
						prevSections.every(
							(s: unknown, idx: number) =>
								getRecordSleepTime(s) ===
								getRecordSleepTime(updatedSections[idx]),
						);
					return isSame
						? prev
						: {
								...prev,
								sleep_section: updatedSections,
							};
				});
			}
		}
	}, [
		strLow,
		type === `goal` && strLow === `exercise`
			? typeof OBJECT[`exercise_goal_dateStart`] === `string`
				? OBJECT[`exercise_goal_dateStart`]
				: ``
			: ``,
		type === `goal` && strLow === `exercise`
			? typeof OBJECT[`exercise_goal_dateEnd`] === `string`
				? OBJECT[`exercise_goal_dateEnd`]
				: ``
			: ``,
		type === `goal` && strLow === `sleep`
			? typeof OBJECT[`sleep_goal_bedTime`] === `string`
				? OBJECT[`sleep_goal_bedTime`]
				: ``
			: ``,
		type === `goal` && strLow === `sleep`
			? typeof OBJECT[`sleep_goal_wakeTime`] === `string`
				? OBJECT[`sleep_goal_wakeTime`]
				: ``
			: ``,
		type === `record` && strLow === `sleep`
			? (Array.isArray(OBJECT[`sleep_section`]) ? OBJECT[`sleep_section`] : [])
					.map((s: unknown) => {
						const sectionObj =
							s && typeof s === `object` ? (s as Record<string, unknown>) : {};
						const bed =
							typeof sectionObj[`sleep_record_bedTime`] === `string`
								? sectionObj[`sleep_record_bedTime`]
								: ``;
						const wake =
							typeof sectionObj[`sleep_record_wakeTime`] === `string`
								? sectionObj[`sleep_record_wakeTime`]
								: ``;
						return `${bed}-${wake}`;
					})
					.join(`|`)
			: ``,
	]);
};
