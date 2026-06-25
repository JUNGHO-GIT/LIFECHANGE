/**
 * @file useValidateExercise.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-25
 */

import { React, createRef, useCallback, useRef, useState } from "@exportReacts";
import { useStoreAlert, useStoreConfirm, useStoreLanguage } from "@exportStores";

// 구조 타입 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
type FieldRefs = Record<string, React.RefObject<unknown>>;
type FieldErrors = Record<string, boolean>;
type ExerciseSection = Record<string, string>;
type ExerciseObject = {
  _id?: string;
  exercise_goal_count?: string;
  exercise_goal_volume?: string;
  exercise_goal_cardio?: string;
  exercise_goal_scale?: string;
  exercise_section?: ExerciseSection[];
};
type ExerciseCount = {
  newSectionCnt: number;
};
type ExerciseValidate = (
  OBJECT: ExerciseObject, COUNT: ExerciseCount, extra: string
) => Promise<boolean>;

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const useValidateExercise = () => {

  // 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setCONFIRM } = useStoreConfirm();

  // 2-2. useState ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const REFS: React.RefObject<FieldRefs[]> = useRef<FieldRefs[]>([]);
  const validate: React.RefObject<ExerciseValidate> = useRef<ExerciseValidate>(async () => false);
  const [ ERRORS, setERRORS ] = useState<FieldErrors[]>([]);

  // alert 표시 및 focus ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const alert = useCallback((field: string, msg: string, idx: number) => {
    setALERT({
      open: true,
      msg: translate(msg),
      severity: `error`,
    });
    field && setTimeout(() => {
      (REFS?.current?.[idx]?.[field]?.current as { focus?: () => void } | undefined)?.focus?.();
    }, 0);
    field && setERRORS((prev) => {
      const updatedErrors: FieldErrors[] = [...prev];
      updatedErrors[idx] = {
        ...updatedErrors[idx],
        [field]: true,
      };
      return updatedErrors;
    });
  }, [ setALERT, translate ]);

  // 7. validate ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  validate.current = async (OBJECT, COUNT, extra) => {
    // 7-1. goal
    if (extra === `goal`) {
      const target: string[] = [
        `exercise_goal_count`,
        `exercise_goal_volume`,
        `exercise_goal_cardio`,
        `exercise_goal_scale`,
      ];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );
      if (COUNT.newSectionCnt <= 0) {
        alert(``, `errorCount`, 0);
        return false;
      }
      if (!OBJECT.exercise_goal_count || OBJECT.exercise_goal_count === `0`) {
        alert(`exercise_goal_count`, `errorExerciseGoalCount`, 0);
        return false;
      }
      if (!OBJECT.exercise_goal_volume || OBJECT.exercise_goal_volume === `0`) {
        alert(`exercise_goal_volume`, `errorExerciseGoalVolume`, 0);
        return false;
      }
      if (!OBJECT.exercise_goal_cardio || OBJECT.exercise_goal_cardio === `00:00`) {
        alert(`exercise_goal_cardio`, `errorExerciseGoalCardio`, 0);
        return false;
      }
      if (!OBJECT.exercise_goal_scale || OBJECT.exercise_goal_scale === `0`) {
        alert(`exercise_goal_scale`, `errorExerciseGoalScale`, 0);
        return false;
      }
      return true;
    }

    // 7-2. record
    if (extra === `record`) {
      const target: string[] = [
        `exercise_record_part`,
        `exercise_record_title`,
        `exercise_record_set`,
        `exercise_record_rep`,
        `exercise_record_weight`,
      ];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );

      const section = OBJECT.exercise_section ?? [];
      if (COUNT.newSectionCnt <= 0) {
        alert(``, `errorCount`, 0);
        return false;
      }
      for (let i = 0; i < section.length; i++) {
        if (!section[i].exercise_record_part || section[i].exercise_record_part === `all`) {
          alert(`exercise_record_part`, `errorExercisePart`, i);
          return false;
        }
        if (!section[i].exercise_record_title || section[i].exercise_record_title === `all`) {
          alert(`exercise_record_title`, `errorExerciseTitle`, i);
          return false;
        }
        if (!section[i].exercise_record_set || section[i].exercise_record_set === `0`) {
          alert(`exercise_record_set`, `errorExerciseSet`, i);
          return false;
        }
        if (!section[i].exercise_record_rep || section[i].exercise_record_rep === `0`) {
          alert(`exercise_record_rep`, `errorExerciseRep`, i);
          return false;
        }
        if (!section[i].exercise_record_weight || section[i].exercise_record_weight === `0`) {
          alert(`exercise_record_weight`, `errorExerciseKg`, i);
          return false;
        }
      }
      return true;
    }

    // 7-3. delete
    if (extra === `delete`) {
      const target: string[] = [`_id`];
      REFS.current = (
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, createRef() ]))
        ))
      );
      setERRORS(
        Array.from({ length: COUNT.newSectionCnt }, (_, _idx) => (
          Object.fromEntries(target.map((cur) => [ cur, false ]))
        )),
      );
      const confirmResult: boolean = await new Promise<boolean>((resolve) => {
        setCONFIRM({
          open: true,
          msg: translate(`confirmDelete`),
        }, (confirmed: boolean) => {
          resolve(confirmed);
        });
      });
      if (confirmResult) {
        if (!OBJECT?._id || OBJECT?._id === ``) {
          alert(``, `noData`, 0);
          return false;
        }
        return true;
      }
      return false;
    }
    return false;
  };

  // 10. return ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  return {
    ERRORS: ERRORS,
    REFS: REFS.current,
    validate: validate.current,
  };
};
