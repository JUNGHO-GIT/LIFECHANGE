// InputFile.tsx

import { useState, useEffect, useRef, useMemo } from "@importReacts";
import { useStoreAlert } from "@importStores";
import { Div, Br, Img, Icons, Grid } from "@importComponents";
import { MuiFileInput } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const InputFile = ({ handleExistingFilesChange, ...props }: any) => {

	// 1. common ----------------------------------------------------------------------------------
  const { setALERT } = useStoreAlert();
  
  // Refs to avoid DOM queries
  const adornmentRootRef = useRef<HTMLElement | null>(null);

	// 2-2. useState ---------------------------------------------------------------------------------
  const [fileExisting, setFileExisting] = useState<any[]>([]);
  const [fileList, setFileList] = useState<File[] | null>(null);
  const [fileCount, setFileCount] = useState<number>(0);
  const [fileHeight, setFileHeight] = useState<string>("100px");
  const [fileLimit, setFileLimit] = useState<number>(1);

  // Memoized calculations to prevent unnecessary recalculations
  const calculatedHeight = useMemo(() => {
    const heightPerFile = 30;
    const minHeight = 100;
    return `${Math.max(minHeight, (props?.value || [])?.length * heightPerFile)}px`;
  }, [props?.value]);

  const calculatedCount = useMemo(() => {
    const newCount = fileList?.length || 0;
    const existingCount = fileExisting?.length || 0;
    return newCount + existingCount;
  }, [fileList, fileExisting]);

	// 2-3. useEffect -----------------------------------------------------------------------------
  // Consolidated initialization and DOM cleanup - runs only once
  useEffect(() => {
    // Batch DOM operations to minimize layout thrashing
    const performDOMCleanup = () => {
      const defaultInput = props?.inputRef?.current;
      const existAdornment = document.querySelector(`.MuiInputAdornment-root.MuiInputAdornment-positionEnd.MuiInputAdornment-outlined.MuiInputAdornment-sizeSmall`);
      const existLabel = existAdornment?.previousElementSibling;
      const existSpan = document.querySelector(`.notranslate`);
      const adornmentRoot = document.querySelector(`.MuiInputAdornment-root`);

      // Batch removals
      [defaultInput, existAdornment, existLabel, existSpan].forEach(element => {
        if (element) {
          element.remove();
        }
      });

      // Apply styles
      if (adornmentRoot) {
        adornmentRoot.setAttribute("style", "width: 100%;");
        adornmentRootRef.current = adornmentRoot;
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(performDOMCleanup);
  }, []);

	// 2-3. useEffect -----------------------------------------------------------------------------
  // Consolidated props updates - reduced from 4 separate useEffect hooks
  useEffect(() => {
    // Update existing files
    setFileExisting(props?.existing || []);
    
    // Update file limit
    setFileLimit(props?.limit || 1);
    
    // Update file list and height
    setFileList(props?.value || []);
    setFileHeight(calculatedHeight);
  }, [props?.existing, props?.limit, props?.value, calculatedHeight]);

	// 2-3. useEffect -----------------------------------------------------------------------------
  // Update file count when calculated count changes
  useEffect(() => {
    setFileCount(calculatedCount);
  }, [calculatedCount]);

  // 6. handle (파일 추가) -------------------------------------------------------------------------
  const flowFileChange = (newFiles: File[] | null) => {

    // 파일이 이미지가 아닌 경우
    if (newFiles && newFiles.some((file: File) => !file.type.startsWith("image/"))) {
      setALERT({
        open: true,
        severity: "error",
        msg: "이미지 파일만 업로드 가능합니다.",
      });

      // input 요소 삭제
      const input = document.querySelector("input[type=file]");
      if (input) {
        input.remove();
      }
      return;
    }

    // 파일이 제한 개수 이상인 경우
    else if (newFiles && newFiles?.length + fileCount > fileLimit) {
      setALERT({
        open: true,
        severity: "error",
        msg: `파일은 최대 ${fileLimit}개까지 업로드 가능합니다.`,
      });

      // input 요소 삭제
      const input = document.querySelector("input[type=file]");
      if (input) {
        input.remove();
      }
      return;
    }

    // 파일이 3mb 이상인 경우
    else if (newFiles && newFiles.some((file: File) => (file.size > 3 * 1024 * 1024))) {
      setALERT({
        open: true,
        severity: "error",
        msg: "파일은 최대 3MB까지 업로드 가능합니다.",
      });

      // input 요소 삭제
      const input = document.querySelector("input[type=file]");
      if (input) {
        input.remove();
      }
      return;
    }

    if (newFiles) {
      const existingFiles = fileList || [];

      // Filter out duplicate files
      const nonDuplicateFiles = newFiles?.filter((newFile) => (
        !existingFiles.some((existingFile) => existingFile.name === newFile.name)
      ));

      // Create the updated files list
      const updatedFiles = [...existingFiles, ...nonDuplicateFiles];

      // Update state
      setFileList(updatedFiles);

      // Notify parent component
      props.onChange(updatedFiles);
    }
  };

  // 5. handle -------------------------------------------------------------------------------------
  // 파일 추가 로직
  const handleFileAdd = (e: any) => {
    e.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.style.display = "none";
    input.onchange = (e: any) => {
      flowFileChange(Array.from(e.target.files));
    };
    document.body.appendChild(input);
    input.click();
  };

  // 6. handle (파일 삭제) -------------------------------------------------------------------------
  const handleFileDelete = (index: number, extra?: string) => {
    if (extra === "single") {
      if (!fileList) {
        return;
      }
      const updatedFiles = fileList?.filter((_file, i) => i !== index);
      setFileList(updatedFiles);
      props.onChange(updatedFiles);
    }
    else if (extra === "all") {
      setFileList([]);
      props.onChange([]);
    }
  };

  // 6. handle (파일 삭제) -------------------------------------------------------------------------
  const handleExistingFileDelete = (index: number) => {
    const updatedExistingFile = fileExisting?.filter((_file: any, i: number) => i !== index);
    setFileExisting(updatedExistingFile);

    if (handleExistingFilesChange) {
      handleExistingFilesChange(updatedExistingFile);
    }
  }

  // 7. node ---------------------------------------------------------------------------------------
  const adornmentNode = (
    <Grid container={true} spacing={0}>
      <Grid size={8} className={"d-col-left"}>
        {fileList && fileList?.length > 0 && fileList.map((file: any, index: number) => (
          <Div className={"d-row-center"} key={index}>
            <Img
              max={25}
              hover={true}
              shadow={true}
              radius={false}
              group={"new"}
              src={URL.createObjectURL(file)}
              className={"mr-10px"}
            />
            <Div max={14} className={"black fs-0-9rem fw-500"}>
              {file?.name}
            </Div>
            <Div
              className={"black fs-0-9rem fw-500 pointer-burgundy ml-15px"}
              onClick={() => handleFileDelete(index, "single")}
            >
              {file?.name ? "x" : ""}
            </Div>
          </Div>
        ))}
      </Grid>
      <Grid size={4} className={"d-col-right mr-n20px"}>
        <Icons
          key={"CirclePlus"}
          name={"CirclePlus"}
          className={"w-22px h-22px pointer-burgundy"}
          onClick={(e: any) => {
            handleFileAdd(e);
          }}
        />
        <Icons
          key={"Trash"}
          name={"Trash"}
          className={"w-22px h-22px pointer-burgundy"}
          onClick={() => {
            handleFileDelete(0, "all");
          }}
        />
      </Grid>
    </Grid>
  );

  // 7. node ---------------------------------------------------------------------------------------
  const existingNode = () => (
    <Grid container={true} spacing={0}>
      <Grid size={12} className={"d-col-left"}>
        {fileExisting.map((file: any, index: number) => (
          <Div className={"d-row-center"} key={index}>
            <Img
              max={25}
              hover={true}
              shadow={true}
              radius={false}
              group={props?.group}
              src={file}
              className={"mr-10px"}
            />
            <Div max={14} className={"black fs-0-9rem fw-500"}>
              {file}
            </Div>
            <Div
              className={"black fs-0-9rem fw-500 pointer-burgundy ml-5px"}
              onClick={() => {
                handleExistingFileDelete(index);
              }}
            >
              {file?.name ? "x" : ""}
            </Div>
          </Div>
        ))}
      </Grid>
    </Grid>
  );

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
    <MuiFileInput
      {...props}
      label={props?.label || ""}
      value={[]}
      select={false}
      variant={"outlined"}
      size={props?.size || "small"}
      className={props?.className || ""}
      inputRef={props?.inputRef || null}
      error={props?.error || false}
      fullWidth={props?.fullWidth || true}
      multiline={props?.multiline || true}
      multiple={props?.multiple || true}
      onClick={(e: any) => e.preventDefault()}
      InputProps={{
        ...props?.InputProps,
        readOnly: (
          props?.readOnly || false
        ),
        style: {
          height: fileHeight,
        },
        className: (
          props?.inputclass?.includes("fs-") ? (
            `text-left ${props?.inputclass || ""}`
          ) : (
            `fs-0-9rem text-left ${props?.inputclass || ""}`
          )
        ),
        startAdornment: adornmentNode,
      }}
    />
    <Br m={20} />
    {/** 기존 이미지 표시하기 **/}
    {fileExisting?.length > 0 && existingNode()}
    </>
  );
};