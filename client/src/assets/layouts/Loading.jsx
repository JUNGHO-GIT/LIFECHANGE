// Loading.jsx

import {React, useState, useEffect, useLocation} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// 14. loading -------------------------------------------------------------------------------------
export const Loading = ({
  LOADING, setLOADING
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const location = useLocation();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const [height, setHeight] = useState("");

  // 2. useEffect ----------------------------------------------------------------------------------
  useEffect(() => {
    if (!LOADING) {
      return;
    }
    else if (firstStr === "calendar") {
      setHeight("h-min75vh");
    }
    else {
      if (secondStr === "list") {
        setHeight("h-min50vh");
      }
      else {
        setHeight("h-min75vh");
      }
    }
  }, [secondStr]);

  // 6. default ------------------------------------------------------------------------------------
  const defaultNode = () => (
    <Div className={`flex-wrapper ${height}`}>
      <Div className={"d-column"}>
        <Div className={"loader"} />
      </Div>
    </Div>
  );

  // 7. loading ------------------------------------------------------------------------------------
  const loadingFragment = () => (
    <Paper className={"content-wrapper radius border shadow-none"}>
      {defaultNode()}
    </Paper>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
    {loadingFragment()}
    </>
  );
};