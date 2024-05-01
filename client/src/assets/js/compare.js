// compare.jsx

import React from "react";

// ------------------------------------------------------------------------------------------------>
export const compare = (
  plan, real, part, extra
) => {

  // 1. food
  const foodCompare = (plan, real, extra) => {
    const abs = Math.abs(plan - real);
    if (real < plan) {
      return (<span className={"text-danger"}>{abs}</span>);
    }
    else if (real === plan) {
      return (<span className={"text-primary"}>{abs}</span>);
    }
    else if (real > plan) {
      return (<span className={"text-success"}>{abs}</span>);
    }
  }

  // 2. money
  const moneyCompare = (plan, real, extra) => {
    const abs = Math.abs(plan - real);
    // 1. 수입 항목인 경우
    if (extra === "in") {
      if (real < plan) {
        return (<span className={"text-danger"}>{abs}</span>);
      }
      else if (real === plan) {
        return (<span className={"text-primary"}>{abs}</span>);
      }
      else if (real > plan) {
        return (<span className={"text-success"}>{abs}</span>);
      }
    }
    // 2. 지출 항목인 경우
    else if (extra === "out") {
      if (real < plan) {
        return (<span className={"text-success"}>{abs}</span>)
      }
      else if (real === plan) {
        return (<span className={"text-primary"}>{abs}</span>)
      }
      else if (real > plan) {
        return (<span className={"text-danger"}>{abs}</span>)
      }
    }
  }

  // 3. sleep
  const sleepCompare = (plan, real, extra) => {
    const planDate = new Date(`1970-01-01T${plan}Z`);
    const realDate = new Date(`1970-01-01T${real}Z`);

    let diff = 0;
    if (realDate < planDate) {
      diff = planDate.getTime() - realDate.getTime();
    }
    else {
      diff = realDate.getTime() - planDate.getTime();
    }

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const diffTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    // 1. 10분이내
    if (0 <= diff && diff <= 600000) {
      return (<span className={"text-primary"}>{diffTime}</span>);
    }
    // 2. 10분 ~ 20분
    else if (600000 < diff && diff <= 1200000) {
      return (<span className={"text-warning"}>{diffTime}</span>);
    }
    // 3. 20분 ~ 30분
    else if (1200000 < diff && diff <= 1800000) {
      return (<span className={"text-danger"}>{diffTime}</span>);
    }
    // 4. 30분 ~ 40분
    else if (1800000 < diff && diff <= 2400000) {
      return (<span className={"text-danger"}>{diffTime}</span>);
    }
    // 5. 40분 초과
    else if (2400000 < diff) {
      return (<span className={"text-danger"}>{diffTime}</span>);
    }
  }

  // 4. exercise
  const exerciseCompare = (plan, real, extra) => {
    const abs = Math.abs(plan - real);
    if (real < plan) {
      return (<span className={"text-danger"}>{abs}</span>);
    }
    else if (real === plan) {
      return (<span className={"text-primary"}>{abs}</span>);
    }
    else if (real > plan) {
      return (<span className={"text-success"}>{abs}</span>);
    }
  }

  if (part === "food") {
    return foodCompare(plan, real, extra);
  }
  else if (part === "money") {
    return moneyCompare(plan, real, extra);
  }
  else if (part === "sleep") {
    return sleepCompare(plan, real, extra);
  }
  else if (part === "exercise") {
    return exerciseCompare(plan, real, extra);
  }

};