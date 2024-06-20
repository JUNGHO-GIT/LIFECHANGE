//  message

import {React, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {PopUp, Img, Div} from "../../import/ImportComponents.jsx";
import {TextField, Button, TextArea, Alert} from "../../import/ImportMuis.jsx";
import {calendar3} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const Message = (props) => {

  // 1. common -------------------------------------------------------------------------------------
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";

  // 2. messageNode --------------------------------------------------------------------------------
  const messageNode = () => (
    <Alert serverity={props.serverity}>
      {props.child}
    </Alert>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {messageNode()}
    </>
  );
};