// Loading.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Paper, Box} from "../../import/ImportMuis.jsx";
import {CustomIcons} from "../../import/ImportIcons.jsx";

// 14. loading ------------------------------------------------------------------------------------>
export const Loading = ({
  LOADING, setLOADING
}) => {

  if (!LOADING) {
    return null;
  }

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Paper className={"content-wrapper"} variant={"outlined"}>
      <Box className={"block-wrapper h-75vh"}
        sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
      }}>
        <CustomIcons name={"FaSpinner"} className={"w-24 h-24 dark"} />
      </Box>
    </Paper>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};