/**
 * @file UserRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { exerciseArray } from "@assets/arrays/exerciseArray";
import { foodArray } from "@assets/arrays/foodArray";
import { moneyArray } from "@assets/arrays/moneyArray";
import { sleepArray } from "@assets/arrays/sleepArray";
import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { ExerciseRecord } from "@schemas/exercise/ExerciseRecord";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { FoodRecord } from "@schemas/food/FoodRecord";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { MoneyRecord } from "@schemas/money/MoneyRecord";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { SleepRecord } from "@schemas/sleep/SleepRecord";
import { User } from "@schemas/user/User";
import { Verify } from "@schemas/Verify";
import mongoose from "mongoose";

// 1-1. email - findId -----------------------------------------------------------------------------
export const emailFindId = async (user_id_param: string) => {
  const finalResult: any = await User.findOne({
    user_id: user_id_param,
  }).lean();

  return finalResult;
};

// 1-2. email - sendEmail --------------------------------------------------------------------------
export const emailSendEmail = async (
  user_id_param: string,
  code_param: string,
) => {
  const findResult: any = await Verify.findOne({
    verify_id: user_id_param,
  }).lean();

  if (findResult !== null) {
    await Verify.deleteMany({
      verify_id: user_id_param,
    });
  }

  const finalResult: any = await Verify.create({
    verify_id: user_id_param,
    verify_code: code_param,
    verify_regDt: new Date(),
  });

  return finalResult;
};

// 1-3. email - verifyEmail ------------------------------------------------------------------------
export const emailVerifyEmail = async (user_id_param: string) => {
  const finalResult: any = await Verify.findOne({
    verify_id: user_id_param,
  }).lean();

  return finalResult;
};

// 1-4. email - deleteCode -------------------------------------------------------------------------
// - 인증에 사용된 코드를 제거해 재사용을 막음
export const emailDeleteCode = async (user_id_param: string) => {
  const finalResult: any = await Verify.deleteMany({
    verify_id: user_id_param,
  });

  return finalResult;
};

// 1-5. email - issueTicket ------------------------------------------------------------------------
// - 코드 대조 성공 사실을 서버측 일회용 티켓으로 치환해 이후 단계가 인증을 증명할 수 있게 함
// - 코드는 즉시 비워 재사용을 막고, 만료는 verify_regDt TTL 이 그대로 관장함
export const emailIssueTicket = async (
  user_id_param: string,
  ticket_param: string,
) => {
  const finalResult: any = await Verify.findOneAndUpdate(
    {
      verify_id: user_id_param,
    },
    {
      $set: {
        verify_code: ``,
        verify_ticket: ticket_param,
      },
    },
    {
      returnDocument: `after`,
    },
  ).lean();

  return finalResult;
};

// 1-6. email - consumeTicket ----------------------------------------------------------------------
// - 조회와 삭제를 한 연산으로 묶어 동일 티켓의 동시 2회 사용을 원자적으로 차단함
export const emailConsumeTicket = async (
  user_id_param: string,
  ticket_param: string,
) => {
  const finalResult: any = await Verify.findOneAndDelete({
    verify_id: user_id_param,
    verify_ticket: ticket_param,
  }).lean();

  return finalResult;
};

// 2-1. user - checkId -----------------------------------------------------------------------------
export const userCheckId = async (user_id_param: string) => {
  const finalResult: any = await User.findOne({
    user_id: user_id_param,
  }).lean();

  return finalResult;
};

// 2-1-1. user - findTokenVersion ------------------------------------------------------------------
// - 인증 보도에서 세대만 대조하므로 필드 1개로 제한해 조회 보도를 잡음
export const userFindTokenVersion = async (user_id_param: string) => {
  const finalResult: any = await User.findOne({
    user_id: user_id_param,
  })
  .select(`user_tokenVersion`)
  .lean();

  return finalResult;
};

// 2-1-2. user - rotateTokenVersion ----------------------------------------------------------------
// - 세대를 갱싱해 기존 발급 토큼 전부를 무효화함 (밀번호 해시는 건드리지 않음)
export const userRotateTokenVersion = async (
  user_id_param: string,
  version_param: string,
) => {
  const finalResult: any = await User.findOneAndUpdate(
    {
      user_id: user_id_param,
    },
    {
      $set: {
        user_tokenVersion: version_param,
      },
    },
    {
      returnDocument: `after`,
    },
  )
  .select(`user_tokenVersion`)
  .lean();

  return finalResult;
};

// 2-2. user - signup -----------------------------------------------------------------------------
export const userSignup = async (user_id_param: string, OBJECT_param: any) => {
  const finalResult: any = await User.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    user_google: `N`,
    user_token: OBJECT_param.user_token,
    user_pw: OBJECT_param.user_pw,
    user_image: OBJECT_param.user_image,

    user_initScale: OBJECT_param.user_initScale,
    user_minScale: ``,
    user_maxScale: ``,
    user_curScale: ``,

    user_initAvgKcalIntake: OBJECT_param.user_initAvgKcalIntake,
    user_totalKcalIntake: ``,
    user_totalCarbIntake: ``,
    user_totalProteinIntake: ``,
    user_totalFatIntake: ``,
    user_curAvgKcalIntake: ``,
    user_curAvgCarbIntake: ``,
    user_curAvgProteinIntake: ``,
    user_curAvgFatIntake: ``,

    user_initProperty: OBJECT_param.user_initProperty,
    user_totalIncomeAll: ``,
    user_totalIncomeExclusion: ``,
    user_totalExpenseAll: ``,
    user_totalExpenseExclusion: ``,
    user_curPropertyAll: ``,
    user_curPropertyExclusion: ``,

    user_favorite: [
      {
        food_record_key: ``,
        food_record_name: ``,
        food_record_brand: ``,
        food_record_kcal: ``,
        food_record_carb: ``,
        food_record_protein: ``,
        food_record_fat: ``,
      },
    ],
    user_exercise_favorite: [],
    user_money_favorite: [],
    user_sleep_favorite: [],
    user_dataCategory: {
      exercise: exerciseArray,
      food: foodArray,
      money: moneyArray,
      sleep: sleepArray,
    },
    user_regDt: new Date(),
    user_updateDt: ``,
  });

  return finalResult;
};

// 2-3. user - resetPw -----------------------------------------------------------------------------
export const userResetPw = async (user_id_param: string, OBJECT_param: any) => {
  const finalResult: any = await User.findOneAndUpdate(
    {
      user_id: user_id_param,
    },
    {
      $set: {
        user_token: OBJECT_param.user_token,
        user_pw: OBJECT_param.user_pw,
        // 밀번호 변경 시 세대도 갱싱해 기존 발급 토큼 전부를 즐시 무효화함
        user_tokenVersion: OBJECT_param.user_tokenVersion,
      },
    },
    {
      returnDocument: `after`,
    },
  );

  return finalResult;
};

// 2-5. user - detail ------------------------------------------------------------------------------
// - 비밀번호 해시와 계정 토큰은 상세 조회 재료가 아니므로 프로젝션에서 제외함
export const userDetail = async (user_id_param: string) => {
  const finalResult: any = await User.findOne({
    user_id: user_id_param,
  })
  .select(`-user_pw -user_token`)
  .lean();

  return finalResult;
};

// 2-6. user - update ------------------------------------------------------------------------------
// - upsert 를 두면 임의 이메일로 유령 계정이 생성되고 user_number 채번도 누락되므로 제거함
export const userUpdate = async (user_id_param: string, OBJECT_param: any) => {
  const finalResult: any = await User.findOneAndUpdate(
    {
      user_id: user_id_param,
    },
    {
      $set: {
        user_image: OBJECT_param.user_image,
        user_initScale: OBJECT_param.user_initScale,
        user_initAvgKcalIntake: OBJECT_param.user_initAvgKcalIntake,
        user_initProperty: OBJECT_param.user_initProperty,
      },
    },
    {
      returnDocument: `after`,
    },
  )
  .select(`-user_pw -user_token`)
  .lean();

  return finalResult;
};

// 2-7. user - delete -----------------------------------------------------------------------------
export const userDelete = async (user_id_param: string) => {
  // 도메인 데이터 8건은 병렬 삭제, User 삭제는 마지막에 유지
  const domainResults = await Promise.all([
    ExerciseGoal.deleteMany({
      user_id: user_id_param,
    }),
    ExerciseRecord.deleteMany({
      user_id: user_id_param,
    }),
    FoodGoal.deleteMany({
      user_id: user_id_param,
    }),
    FoodRecord.deleteMany({
      user_id: user_id_param,
    }),
    MoneyGoal.deleteMany({
      user_id: user_id_param,
    }),
    MoneyRecord.deleteMany({
      user_id: user_id_param,
    }),
    SleepGoal.deleteMany({
      user_id: user_id_param,
    }),
    SleepRecord.deleteMany({
      user_id: user_id_param,
    }),
  ]);

  // 기존 반환 계약 보존: ExerciseGoal 삭제 결과를 finalResult로 유지
  const finalResult = domainResults[0];

  await User.deleteOne({
    user_id: user_id_param,
  });

  return finalResult;
};

// 3-2. category - detail --------------------------------------------------------------------------
export const categoryDetail = async (user_id_param: string) => {
  const finalResult: any = await User.aggregate([
    {
      $match: {
        user_id: user_id_param,
      },
    },
    {
      $project: {
        _id: 0,
        exercise: `$user_dataCategory.exercise`,
        food: `$user_dataCategory.food`,
        money: `$user_dataCategory.money`,
        sleep: `$user_dataCategory.sleep`,
      },
    },
  ]);

  return finalResult[0];
};

// 3-4. category - update --------------------------------------------------------------------------
export const categoryUpdate = async (
  user_id_param: string,
  OBJECT_param: any,
) => {
  const finalResult: any = await User.findOneAndUpdate(
    {
      user_id: user_id_param,
    },
    {
      $set: {
        user_dataCategory: {
          exercise: OBJECT_param.exercise,
          food: OBJECT_param.food,
          money: OBJECT_param.money,
          sleep: OBJECT_param.sleep,
        },
        user_updateDt: new Date(),
      },
    },
    {
      returnDocument: `after`,
    },
  )
  .select(`-user_pw -user_token`)
  .lean();

  return finalResult;
};
