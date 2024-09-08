// AuthError.tsx
// Node -> Section -> Fragment

import { useCommonValue } from "@imports/ImportHooks";
import { Div, Btn } from "@imports/ImportComponents";
import { Grid, Paper } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const AuthError = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate
  } = useCommonValue();

  // 7. errorNode ----------------------------------------------------------------------------------
  const errorNode = () => {
    const imageSection = () => (
      <Grid container spacing={2}>
        <Grid size={12}>
          <svg
            className="error_paper__main"
            viewBox="0 0 300 300"
            width="300px"
            height="300px"
            role="img"
            aria-label="A piece of paper torn in half"
          >
            <g
              className="error_paper__outline"
              fill="none"
              stroke="hsl(0,10%,10%)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(61,4)"
            >
              <g className="error_paper__top" transform="translate(0,25)">
                <polygon
                  className="error_paper__shadow"
                  fill="hsl(0,10%,70%)"
                  stroke="none"
                  points="0 148,0 0,137 0,187 50,187 148,155 138,124 148,93 138,62 148,31 138"
                  transform="translate(-12,12)"
                ></polygon>
                <rect
                  className="error_paper__tear-fill"
                  fill="hsl(0,0%,100%)"
                  stroke="none"
                  x="0"
                  y="137"
                  width="0"
                  height="23px"
                ></rect>
                <polygon
                  className="error_paper__fill"
                  fill="hsl(0,0%,100%)"
                  stroke="none"
                  points="0 148,0 0,137 0,187 50,187 148,155 138,124 148,93 138,62 148,31 138"
                ></polygon>
                <polygon
                  className="error_paper__shadow"
                  fill="hsl(0,10%,70%)"
                  stroke="none"
                  points="137 0,132 55,187 50,142 45"
                ></polygon>
                <polyline points="137 0,142 45,187 50"></polyline>
                <polyline points="0 148,0 0,137 0,187 50,187 148"></polyline>
                <g className="error_paper__lines" stroke="hsl(0,10%,70%)">
                  <polyline points="22 88,165 88"></polyline>
                  <polyline points="22 110,165 110"></polyline>
                  <polyline points="22 132,165 132"></polyline>
                </g>
                <polyline
                  className="error_paper__tear"
                  points="0 148,31 138,62 148,93 138,124 148,155 138,187 148"
                  strokeDasharray="198 198"
                  strokeDashoffset="-198"
                ></polyline>
              </g>
              <g className="error_paper__bottom" transform="translate(0,25)">
                <polygon
                  className="error_paper__shadow"
                  fill="hsl(0,10%,70%)"
                  stroke="none"
                  points="0 148,31 138,62 148,93 138,124 148,155 138,187 148,187 242,0 242"
                  transform="translate(-12,12)"
                ></polygon>
                <polygon
                  className="error_paper__fill"
                  fill="hsl(0,0%,100%)"
                  stroke="none"
                  points="0 148,31 140,62 148,93 138,124 148,155 138,187 148,187 242,0 242"
                ></polygon>
                <polyline points="187 148,187 242,0 242,0 148"></polyline>
                <g className="error_paper__lines" stroke="hsl(0,10%,70%)">
                  <polyline points="22 154,165 154"></polyline>
                  <polyline points="22 176,165 176"></polyline>
                  <polyline points="22 198,94 198"></polyline>
                </g>
                <polyline
                  className="error_paper__tear"
                  points="0 148,31 138,62 148,93 138,124 148,155 138,187 148"
                  strokeDasharray="198 198"
                  strokeDashoffset="-198"
                ></polyline>
              </g>
            </g>
          </svg>
        </Grid>
      </Grid>
    );
    const textSection = () => (
      <Grid container spacing={2}>
        <Grid size={12}>
          <Div className={"fs-50 fw-700"}>
            404
          </Div>
          <Div className={"fs-20 fw-500"}>
            Page not found
          </Div>
        </Grid>
        <Grid size={12}>
          <Btn
            size={"large"}
            color={"error"}
            onClick={() => {
              navigate("/");
            }}
          >
            Go back
          </Btn>
        </Grid>
      </Grid>
    );
    return (
      <Paper className={"content-wrapper d-center radius border h-min100vh"}>
        <Grid container spacing={2}>
          <Grid size={6}>
            {imageSection()}
          </Grid>
          <Grid size={6}>
            {textSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {errorNode()}
    </>
  );
};
