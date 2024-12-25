// Paper.tsx

import { useEffect, useRef } from "@importReacts";
import { Paper as MuiPaper } from "@importMuis";
import { PaperProps } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const Paper = (props: PaperProps) => {
  const paperRef = useRef<HTMLDivElement | null>(null);

  // style 속성 자체를 제거
  useEffect(() => {
    if (paperRef.current) {
      paperRef.current.removeAttribute("style");
    }
  }, []);

  return (
    <MuiPaper
      {...props}
      ref={paperRef}
      component={"div"}
      className={props?.className || ""}
    />
  );
};
