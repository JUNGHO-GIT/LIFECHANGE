// Loader.jsx

import React from "react";
import {Box} from "@mui/material";

// ------------------------------------------------------------------------------------------------>
export const Loader = () => {
  return (
    <React.Fragment>
      <Box className={"background"}>
        <Box className={"loader"}></Box>
      </Box>
    </React.Fragment>
  );
};