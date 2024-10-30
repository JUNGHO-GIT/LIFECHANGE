// FallBack.tsx

import { Div } from "@importComponents";

// -------------------------------------------------------------------------------------------------
export const FallBack = () => {

  // 7.fallBack ------------------------------------------------------------------------------------
  const fallBackNode = () => {

    const sequentialFallBack = () => (
      <Div className={"h-min80vh sequential-loader d-col-center"} />
    );

    return (
      sequentialFallBack()
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {fallBackNode()}
    </>
  );
};