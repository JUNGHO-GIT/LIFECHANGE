import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Signup from "../../page/user/Signup";

// ------------------------------------------------------------------------------------------------>
const SecretKeys = () => {
  const [validSecretKeys, setValidSecretKeys] = useState(false);
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const secretKeysFlow = async () => {
      const promptValue = window.prompt("Input your SecretKeys");

      if (promptValue === null || promptValue === "") {
        alert("Enter the SecretKeys");
        navigate(-1);
        return;
      }

      const res = await axios.post("http://127.0.0.1:4000/secretKeys/secretKeys", {
          secretKeys: promptValue
      });

      if (res.data === "success") {
        alert("Valid SecretKeys");
        setValidSecretKeys(true);
        return;
      }
      else if (res.data === "fail") {
        alert("Invalid SecretKeys");
        navigate(-1);
        return;
      }
      else {
        alert(`${res.data}에러발생`);
        navigate(-1);
        return;
      }
    };

    secretKeysFlow();
  }, [navigate]);

  if (validSecretKeys) {
    return <Signup />;
  }
  else {
    return <></>;
  }
};

export default SecretKeys;
