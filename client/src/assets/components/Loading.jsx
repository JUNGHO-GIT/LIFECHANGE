// Loading.jsx

import React from "react";
import {Box} from "../../import/ImportMuis";
import {CustomIcons} from "../../import/ImportIcons";

// 14. loading ------------------------------------------------------------------------------------>
export const Loading = ({
  LOADING, setLOADING
}) => {

  if (!LOADING) {
    return null;
  }

  return (
    <React.Fragment>
      <Box className={"loading-wrapper"}>
        <CustomIcons name={"FaSpinner"} className={"w-24 h-24 dark"} />
      </Box>
    </React.Fragment>
  );
}