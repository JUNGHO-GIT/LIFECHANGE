// InputFile.tsx

import { useState, useEffect } from "@importReacts";
import { useStoreAlert } from "@importHooks";
import { Div, Br, Img, Icons } from "@importComponents";
import { MuiFileInput, Grid } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const InputFile = ({ handleExistingFilesChange, ...props }: any) => {

  // 1. common -------------------------------------------------------------------------------------
  const { setALERT } = useStoreAlert();

  // 2-1. useState ---------------------------------------------------------------------------------
  const [fileExisting, setFileExisting] = useState<any[]>([]);
  const [fileList, setFileList] = useState<File[] | null>(null);
  const [fileCount, setFileCount] = useState<number>(0);
  const [fileHeight, setFileHeight] = useState<string>("100px");
  const [fileLimit, setFileLimit] = useState<number>(1);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultInput = props?.inputRef?.current;
    const existAdornment = document.querySelector(`.MuiInputAdornment-root.MuiInputAdornment-positionEnd.MuiInputAdornment-outlined.MuiInputAdornment-sizeSmall`);
    const existLabel = existAdornment?.previousElementSibling;
    const existSpan = document.querySelector(`.notranslate`);
    const adornmentRoot = document.querySelector(`.MuiInputAdornment-root`);

    // 기존 요소 삭제
    if (defaultInput) {
      defaultInput.remove();
    }
    if (existAdornment) {
      existAdornment.remove();
    }
    if (existLabel) {
      existLabel.remove();
    }
    if (existSpan) {
      existSpan.remove();
    }

    // adornment 에 스타일 적용
    if (adornmentRoot) {
      adornmentRoot.setAttribute("style", "width: 100%;");
    }
  }, []);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setFileExisting(props?.existing || []);
  }, [props?.existing]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setFileLimit(props?.limit || 1);
  }, [props?.limit]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    // 최초 로드 시 파일 배열 초기화
    setFileList(props?.value || []);

    // 파일 높이 계산
    const heightPerFile = 30;
    const minHeight = 100;
    setFileHeight(`${Math.max(minHeight, (props?.value || []).length * heightPerFile)}px`);

  }, [props?.value]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (fileList) {
      const newCount = fileList.length;
      const existingCount = fileExisting.length;

      if (newCount + existingCount > 0) {
        setFileCount(newCount + existingCount);
      }
      else {
        setFileCount(0);
      }
    }
  }, [fileList, fileExisting]);

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
    else if (newFiles && newFiles.length + fileCount > fileLimit) {
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
      const nonDuplicateFiles = newFiles.filter((newFile) => (
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
      const updatedFiles = fileList.filter((_file, i) => i !== index);
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
    const updatedExistingFile = fileExisting.filter((_file: any, i: number) => i !== index);
    setFileExisting(updatedExistingFile);

    if (handleExistingFilesChange) {
      handleExistingFilesChange(updatedExistingFile);
    }
  }

  // 7. node ---------------------------------------------------------------------------------------
  const adornmentNode = (
    <Grid container={true} spacing={0}>
      <Grid size={8} className={"d-col-left"}>
        {fileList && fileList.length > 0 && fileList.map((file: any, index: number) => (
          <Div className={"d-row-center"} key={index}>
            <Img
              max={25}
              hover={true}
              shadow={true}
              radius={false}
              group={"new"}
              src={URL.createObjectURL(file)}
              className={"me-10"}
            />
            <Div max={12} className={"black fs-0-9rem fw-500"}>
              {file?.name}
            </Div>
            <Div
              className={"black fs-0-9rem fw-500 pointer-burgundy ms-15"}
              onClick={() => handleFileDelete(index, "single")}
            >
              {file?.name ? "x" : ""}
            </Div>
          </Div>
        ))}
      </Grid>
      <Grid size={4} className={"d-col-right me-n20"}>
        <Icons
          key={"CirclePlus"}
          name={"CirclePlus"}
          className={"w-22 h-22 pointer-burgundy"}
          onClick={(e: any) => {
            handleFileAdd(e);
          }}
        />
        <Icons
          key={"Trash"}
          name={"Trash"}
          className={"w-22 h-22 pointer-burgundy"}
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
              className={"me-10"}
            />
            <Div max={20} className={"black fs-0-9rem fw-500"}>
              {file}
            </Div>
            <Div
              className={"black fs-0-9rem fw-500 pointer-burgundy ms-5"}
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

  // 10. return ------------------------------------------------------------------------------------
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
            `fs-1-0rem text-left ${props?.inputclass || ""}`
          )
        ),
        startAdornment: adornmentNode,
      }}
    />
    <Br m={20} />
    {/** 기존 이미지 표시하기 **/}
    {fileExisting.length > 0 && existingNode()}
    </>
  );
};