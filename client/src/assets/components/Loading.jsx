// Loading.jsx

import {React} from "../../import/ImportReacts";
import {Paper, Container, Grid2, Box} from "../../import/ImportMuis";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";

// 14. loading ------------------------------------------------------------------------------------>
export const Loading = ({
  LOADING, setLOADING
}) => {

  if (!LOADING) {
    return null;
  }

  return (
    <React.Fragment>
      <Paper className={"content-wrapper"} variant={"outlined"}>
        <Container className={"p-0"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
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
            </Grid2>
          </Grid2>
        </Container>
      </Paper>
    </React.Fragment>
  );
};