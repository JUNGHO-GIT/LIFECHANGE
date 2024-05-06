// Loading.jsx

import React from "react";
import {Box} from "@mui/material";

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
        <i className={"bx bx-loader-alt bx-spin"}></i>
      </Box>
    </React.Fragment>
  );
}