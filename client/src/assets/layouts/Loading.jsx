// Loading.jsx

import {React, useState, useEffect, useLocation} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// 14. loading ------------------------------------------------------------------------------------>
export const Loading = ({
  LOADING, setLOADING
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const [height, setHeight] = useState("");

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {

    if (!LOADING) {
      return;
    }

    if (typeStr === "list") {
      setHeight("h-min50vh");
    }
    else {
      setHeight("h-min65vh");
    }
  }, [typeStr]);

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={`flex-wrapper ${height}`}>
      <Div className={"d-column"}>
        <Div className={"loader"} />
      </Div>
    </Div>
  );

  // 7. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Paper className={"content-wrapper"}>
      {defaultNode()}
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {loadingNode()}
    </>
  );
};