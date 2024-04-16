// compare.jsx

import React from "react";

// ------------------------------------------------------------------------------------------------>
export const compare = (
  plan, real, part, extra
) => {

  let finalResult;

  // 1. food
  if (part === "food") {
    const abs = Math.abs(plan - real);
    if (real < plan) {
      finalResult = (<span className={"text-danger"}>{abs}</span>);
    }
    else if (real === plan) {
      finalResult = (<span className={"text-primary"}>{abs}</span>);
    }
    else if (real > plan) {
      finalResult = (<span className={"text-success"}>{abs}</span>);
    }

    return finalResult;
  }

  // 2. money
  else if (part === "money") {
    const abs = Math.abs(plan - real);
    // 1. 수입 항목인 경우
    if (extra === "in") {
      if (real < plan) {
        finalResult = (<span className={"text-danger"}>{abs}</span>);
      }
      else if (real === plan) {
        finalResult = (<span className={"text-primary"}>{abs}</span>);
      }
      else if (real > plan) {
        finalResult = (<span className={"text-success"}>{abs}</span>);
      }
    }
    // 2. 지출 항목인 경우
    else if (extra === "out") {
      if (real < plan) {
        finalResult = (<span className={"text-success"}>{abs}</span>)
      }
      else if (real === plan) {
        finalResult = (<span className={"text-primary"}>{abs}</span>)
      }
      else if (real > plan) {
        finalResult = (<span className={"text-danger"}>{abs}</span>)
      }
    }

    return finalResult;
  }

  // 3. sleep
  else if (part === "sleep") {
    const planDate = new Date(`1970-01-01T${plan}:00.000Z`);
    const realDate = new Date(`1970-01-01T${real}:00.000Z`);

    if (realDate < planDate) {
      realDate.setHours(realDate.getHours() + 24);
    }

    const diff = Math.abs(realDate.getTime() - planDate.getTime());
    const diffMinutes = Math.floor(diff / 60000);

    if (0 <= diffMinutes && diffMinutes <= 10) {
      finalResult = (<span className={"text-primary"}>{diffMinutes}</span>);
    }
    else if (10 < diffMinutes && diffMinutes <= 20) {
      finalResult = (<span className={"text-success"}>{diffMinutes}</span>);
    }
    else if (20 < diffMinutes && diffMinutes <= 30) {
      finalResult = (<span className={"text-warning"}>{diffMinutes}</span>);
    }
    else if (30 < diffMinutes) {
      finalResult = (<span className={"text-danger"}>{diffMinutes}</span>);
    }

    return finalResult;
  }

  // 4. work
  else if (part === "work") {
    const abs = Math.abs(plan - real);
    if (real < plan) {
      finalResult = (<span className={"text-danger"}>{abs}</span>);
    }
    else if (real === plan) {
      finalResult = (<span className={"text-primary"}>{abs}</span>);
    }
    else if (real > plan) {
      finalResult = (<span className={"text-success"}>{abs}</span>);
    }

    return finalResult;
  }
};