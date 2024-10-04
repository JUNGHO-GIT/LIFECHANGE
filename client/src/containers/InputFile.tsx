// InputFile.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { Alert } from "@imports/ImportLayouts";
import { Div, Br, Img } from "@imports/ImportComponents";
import { MuiFileInput, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const InputFile = ({ handleExistingFilesChange, ...props }: any) => {

  // 1. common -------------------------------------------------------------------------------------
  const { translate } = useLanguageStore();
  const { setALERT } = useAlertStore();

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
        msg: translate("uploadImageOnly"),
        severity: "error",
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
        msg: translate(`uploadMaxFileCount`),
        severity: "error",
      });

      // input 요소 삭제
      const input = document.querySelector("input[type=file]");
      if (input) {
        input.remove();
      }
      return;
    }

    // 파일이 5mb 이상인 경우
    else if (newFiles && newFiles.some((file: File) => (file.size > 5 * 1024 * 1024))) {
      setALERT({
        open: true,
        msg: translate("uploadMaxFileSize"),
        severity: "error",
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
    <Grid container spacing={2} columns={12}>
      <Grid size={8}>
        {fileList && fileList.length > 0 && fileList.map((file: any, index: number) => (
          <Grid size={12} className={"d-row-left"} key={index}>
            <Img
              max={40}
              hover={false}
              shadow={false}
              radius={true}
              group={"new"}
              src={URL.createObjectURL(file)}
              className={"w-35 h-35 me-10"}
            />
            <Div className={"black fs-0-9rem fw-500"} max={15}>
              {file?.name}
            </Div>
            <Div
              className={"black fs-0-9rem fw-500 pointer-burgundy ms-15"}
              onClick={() => handleFileDelete(index, "single")}
            >
              {!file?.name ? "" : "x"}
            </Div>
          </Grid>
        ))}
      </Grid>
      <Grid size={4} className={"d-column-right"}>
        <Div
          className={"fs-0-9rem fw-600 pointer-burgundy"}
          onClick={(e: any) => handleFileAdd(e)}
        >
          파일 추가
        </Div>
        <Br px={10} />
        <Div
          className={"fs-0-9rem fw-600 pointer-burgundy"}
          onClick={() => handleFileDelete(0, "all")}
        >
          전체 삭제
        </Div>
      </Grid>
    </Grid>
  );

  // 7. node ---------------------------------------------------------------------------------------
  const existingNode = () => (
    <Grid container spacing={2} columns={12}>
      {fileExisting.map((file: any, index: number) => (
        <Grid size={12} key={index} className={"d-row-left"}>
          <Img
            max={40}
            hover={false}
            shadow={false}
            radius={true}
            group={props?.group}
            src={file}
            className={"w-35 h-35 me-10"}
          />
          <Div className={"black fs-0-9rem fw-500"} max={20}>
            {file}
          </Div>
          <Div
            className={"black fs-0-9rem fw-500 pointer-burgundy ms-15"}
            onClick={() => {
              handleExistingFileDelete(index);
            }}
          >
            {!file ? "" : "x"}
          </Div>
        </Grid>
      ))}
    </Grid>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <Div className={"w-100p mt-10"}>
      <Div
        className={"d-column-left fs-0-9rem fw-400"}
        style={{ color: "#484848de" }}
      >
        {props?.label ? props?.required ? `${props?.label} *` : props?.label : ""}
      </Div>
      <Br px={10} />
      <MuiFileInput
        {...props}
        label={""}
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
              `text-left fs-1-0rem ${props?.inputclass || ""}`
            )
          ),
          startAdornment: adornmentNode,
        }}
      />
      <Br px={20} />
      {/** 기존 이미지 표시하기 **/}
      {fileExisting.length > 0 && existingNode()}
    </Div>
  );
};