// Loading.jsx

import React from "react";
import {Box} from "@mui/material";
import {CustomIcon} from "../assets/jsx/CustomIcon.jsx";

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
        <CustomIcon name={"FaSpinner"} className={"w-24 h-24 dark"} />
      </Box>
    </React.Fragment>
  );
}