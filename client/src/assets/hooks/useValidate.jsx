// useValidate.js

import {React, createRef, useState, useRef, useEffect} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";

export const useValidate = (OBJECT) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useTranslate();
  const [isValid, setIsValid] = useState(false);
  const [ERRORS, setERRORS] = useState({
    user_id: false,
    user_id_verified: false,
    user_pw: false,
    user_pw_verified: false,
    user_age: false,
    user_gender: false,
    user_height: false,
    user_weight: false,
  });
  const REFS = useRef({
    user_id: createRef(),
    user_id_verified: createRef(),
    user_pw: createRef(),
    user_pw_verified: createRef(),
    user_age: createRef(),
    user_gender: createRef(),
    user_height: createRef(),
    user_weight: createRef(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    let foundError = false;
    const initialErrors = {
      user_id: false,
      user_id_verified: false,
      user_pw: false,
      user_pw_verified: false,
      user_age: false,
      user_gender: false,
      user_height: false,
      user_weight: false,
    };
    const refsCurrent = REFS?.current;

    if (!refsCurrent) {
      console.warn('Ref is undefined, skipping validation');
      return;
    }
    else if (OBJECT.user_id === "" || !OBJECT.user_id) {
      alert(translate("errorUserId"));
      refsCurrent.user_id.current &&
      refsCurrent.user_id.current?.focus();
      initialErrors.user_id = true;
      foundError = true;
    }
    else if (OBJECT.user_id.indexOf("@") === -1) {
      alert(translate("errorUserIdAt"));
      refsCurrent.user_id.current &&
      refsCurrent.user_id.current?.focus();
      initialErrors.user_id = true;
      foundError = true;
    }
    else if (OBJECT.user_id_verified === false || !OBJECT.user_id_verified) {
      alert(translate("errorUserIdVerified"));
      refsCurrent.user_id_verified.current &&
      refsCurrent.user_id_verified.current?.focus();
      initialErrors.user_id_verified = true;
      foundError = true;
    }
    else if (OBJECT.user_pw === "" || !OBJECT.user_pw) {
      alert(translate("errorUserPw"));
      refsCurrent.user_pw.current &&
      refsCurrent.user_pw.current?.focus();
      initialErrors.user_pw = true;
      foundError = true;
    }
    else if (OBJECT.user_pw_verified === false || !OBJECT.user_pw_verified) {
      alert(translate("errorUserPwVerified"));
      refsCurrent.user_pw_verified.current &&
      refsCurrent.user_pw_verified.current?.focus();
      initialErrors.user_pw_verified = true;
      foundError = true;
    }
    else if (OBJECT.user_age === "" || !OBJECT.user_age) {
      alert(translate("errorUserAge"));
      refsCurrent.user_age.current &&
      refsCurrent.user_age.current?.focus();
      initialErrors.user_age = true;
      foundError = true;
    }
    else if (OBJECT.user_gender === "" || !OBJECT.user_gender) {
      alert(translate("errorUserGender"));
      refsCurrent.user_gender.current &&
      refsCurrent.user_gender.current?.focus();
      initialErrors.user_gender = true;
      foundError = true;
    }
    else if (OBJECT.user_height === "" || !OBJECT.user_height) {
      alert(translate("errorUserHeight"));
      refsCurrent.user_height.current &&
      refsCurrent.user_height.current?.focus();
      initialErrors.user_height = true;
      foundError = true;
    }
    else if (OBJECT.user_weight === "" || !OBJECT.user_weight) {
      alert(translate("errorUserWeight"));
      refsCurrent.user_weight.current &&
      refsCurrent.user_weight.current?.focus();
      initialErrors.user_weight = true;
      foundError = true;
    }

    setERRORS(initialErrors);
    setIsValid(!foundError);

  })()}, [OBJECT]);

  return {isValid, ERRORS, REFS};
};
