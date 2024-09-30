// Img.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";

// -------------------------------------------------------------------------------------------------
declare type ImgProps = React.HTMLAttributes<HTMLImageElement> & {
  group?: string;
  src?: any;
  hover?: boolean;
  shadow?: boolean;
  radius?: boolean;
  max?: number;
};

// -------------------------------------------------------------------------------------------------
export const Img = ( { group, src, hover, shadow, radius, max, ...props }: ImgProps ) => {

  // 1. common -------------------------------------------------------------------------------------
  let { GCLOUD_URL } = useCommonValue();
  let fileName: string = "";
  let srcResult: string = "";
  let defaultImage: string = "https://via.placeholder.com/150";
  let imageClass: any = "";
  let imageStyle: any = {};

  if (src && typeof src === "string") {
    fileName = (
      src.split("/").pop()?.split(".")[0] || "empty"
    );
    srcResult = (
      group === "new" ? src
      : !group ? `${GCLOUD_URL}/main/${src}.webp`
      : `${GCLOUD_URL}/${group}/${src}.webp`
    );
  }

  if (!props?.className) {
    imageClass = `h-auto object-cover`;
  }
  else {
    imageClass = `${props?.className} h-auto object-cover`;
  }

  if (hover) {
    imageClass += " hover";
  }
  if (shadow) {
    imageClass += " shadow-4";
  }
  if (radius) {
    imageClass += " radius-1";
  }

  if (max) {
    imageStyle = {
      maxWidth: `${max}px`,
      maxHeight: `${max}px`,
    };
  }

  // 2-1. useState ---------------------------------------------------------------------------------
  const [imgSrc, setImgSrc] = useState(srcResult);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setImgSrc(srcResult);
  }, [srcResult]);

  // 3. handle -------------------------------------------------------------------------------------
  const handleError = () => {
    setImgSrc(defaultImage);
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <img
      {...props}
      src={imgSrc}
      alt={fileName}
      loading={"lazy"}
      onError={handleError}
      style={imageStyle}
      className={imageClass}
    />
  );
};
