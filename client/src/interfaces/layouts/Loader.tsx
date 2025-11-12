// Loader.tsx

import { memo } from "@exportReacts";
import { Div } from "@exportComponents";
import { useStoreLoading } from "@exportStores";

// -------------------------------------------------------------------------------------------------
export const Loader = memo(() => {

	// 1. common ----------------------------------------------------------------------------------
  const { LOADING } = useStoreLoading();

  // 7.loader --------------------------------------------------------------------------------------
  const loaderNode = () => (
    LOADING ? (
      <Div className={"loader-wrapper"}>
        <Div className={"loader"} />
      </Div>
    ) : (
      <Div />
    )
  );

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {loaderNode()}
    </>
  );
});