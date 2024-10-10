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
export const Img = ({ group, src, hover, shadow, radius, max, ...props }: ImgProps) => {
  // 1. common -------------------------------------------------------------------------------------
  const { GCLOUD_URL } = useCommonValue();
  let fileName: string = "";
  let srcResult: string = "";
  const defaultImage: string = "https://via.placeholder.com/150";
  let imageClass: string = "";
  let imageStyle: any = {};

  if (src && typeof src === "string") {
    fileName = src.split("/").pop()?.split(".")[0] || "empty";
    srcResult = (
      group === "new"
      ? src
      : !group
      ? `${GCLOUD_URL}/main/${src}.webp`
      : `${GCLOUD_URL}/${group}/${src}.webp`
    );
  }

  if (!props?.className) {
    imageClass = `h-auto object-contain`;
  }
  else {
    imageClass = `${props?.className} h-auto object-contain`;
  }
  if (hover) {
    imageClass += " hover";
  }
  if (shadow) {
    imageClass += " shadow-3";
  }
  if (radius) {
    imageClass += " radius-1";
  }
  if (max) {
    imageClass += ` w-max${max || ""} h-max${max || ""}`;
  }

  // 2-1. useState ---------------------------------------------------------------------------------
  const [imgSrc, setImgSrc] = useState(srcResult);
  const [hasError, setHasError] = useState(false);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setImgSrc(srcResult);
    setHasError(false);
  }, [srcResult]);

  // 3. handle -------------------------------------------------------------------------------------
  const handleError = () => {
    setHasError(true);
    setImgSrc(defaultImage);
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <img
      {...props}
      src={hasError ? defaultImage : imgSrc}
      alt={fileName}
      key={fileName}
      onError={handleError}
      style={imageStyle}
      className={imageClass}
    />
  );
};
