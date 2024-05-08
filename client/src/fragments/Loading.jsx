// Loading.jsx

import React from "react";
import {Box} from "@mui/material";
import {CustomIcon} from "../assets/icon/CustomIcon.tsx";

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
        <CustomIcon name={"FaSpinner"} />
      </Box>
    </React.Fragment>
  );
}