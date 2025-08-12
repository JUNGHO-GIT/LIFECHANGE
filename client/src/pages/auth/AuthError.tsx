// AuthError.tsx

import { useEffect } from "@importReacts";
import { useCommonValue } from "@importHooks";
import { useStoreLoading } from "@importStores";
import { Div, Btn, Grid, Paper, Card } from "@importComponents";

// -------------------------------------------------------------------------------------------------
export const AuthError = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate } = useCommonValue();
  const { setLOADING } = useStoreLoading();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    setTimeout(() => {
      setLOADING(false);
    }, 500);
  }, []);

  // 7. errorNode ----------------------------------------------------------------------------------
  const errorNode = () => {
    const errorSection = () => {
      const imageFragment = () => (
        <Grid container={true} spacing={2}>
          <Grid size={12} className={"d-col-center"}>
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
      const textFragment = () => (
        <Grid container={true} spacing={2}>
          <Grid size={12} className={"d-col-center"}>
            <Div className={"fs-2-2rem fw-700"}>
              404
            </Div>
            <Div className={"fs-1-7rem fw-500"}>
              Page not found
            </Div>
          </Grid>
          <Grid size={12} className={"d-row-center"}>
            <Btn
              size={"large"}
              color={"error"}
              className={"w-30vw h-7vh fs-1-2rem fw-600"}
              onClick={() => {
                navigate("/user/login");
              }}
            >
              Go back
            </Btn>
          </Grid>
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {imageFragment()}
          {textFragment()}
        </Card>
      );
    };
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min-100vh d-col-center"}>
        {errorSection()}
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
