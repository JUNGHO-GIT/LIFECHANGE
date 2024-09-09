// FileInput.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { Div, Br } from "@imports/ImportComponents";
import { MuiFileInput, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const FileInput = (props: any) => {

  // 2-1. useState ---------------------------------------------------------------------------------
  // 컴포넌트 내부에서 파일 상태 관리
  const [fileList, setFileList] = useState<any[]>(props?.value || []);

  // 2-2. useEffect --------------------------------------------------------------------------------
  // 최초 로드 시 파일 배열 초기화
  useEffect(() => {
    setFileList(props?.value || []);
  }, [props?.value]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 기존 요소 삭제하기
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

  }, [props]);

  // 4. handle -------------------------------------------------------------------------------------
  // 파일 높이 계산
  const handleCalcHeight = (files: any[]) => {
    const heightPerFile = 30;
    const minHeight = 100;
    return `${Math.max(minHeight, files.length * heightPerFile)}px`;
  };

  // 4. handle -------------------------------------------------------------------------------------
  // 파일 추가 로직
  const handleFileAdd = (e: any) => {
    e.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.style.display = "none";
    input.onchange = (e: any) => {
      handleFileChange(Array.from(e.target.files));
    };
    document.body.appendChild(input);
    input.click();
  };

  // 4. handle -------------------------------------------------------------------------------------
  // 파일 변경 로직
  const handleFileChange = (newFiles: File[] | null) => {
    if (newFiles) {
      setFileList((prevFiles) => {
        const existingFiles = prevFiles || [];

        // 중복 파일 필터링
        const nonDuplicateFiles = newFiles.filter((newFile) => (
          !existingFiles.some(
            (existingFile: File) => existingFile.name === newFile.name
          )
        ));

        // 부모로 변경된 파일 리스트 전달
        const updatedFiles = [...existingFiles, ...nonDuplicateFiles];
        props?.onChange(updatedFiles);

        return updatedFiles;
      });
    }
  };

  // 4. handle -------------------------------------------------------------------------------------
  // 파일 삭제 로직
  const handleFileDelete = (index: number) => {
    setFileList((prevFiles) => {

      // 부모 컴포넌트에 변경 사항 전달
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      props?.onChange(updatedFiles);

      return updatedFiles;
    });
  };

  // 4. handle -------------------------------------------------------------------------------------
  // 파일 전체 삭제 로직
  const handleFileDeleteAll = () => {
    if (fileList.length === 0) {
      return;
    }
    setFileList(() => {
      props?.onChange([]);
      return [];
    });
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      <Div className={"d-left black-50 fs-0-9rem fw-400 mt-15"}>
        {props?.required ? `${props?.label} *` : props?.label}
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
            height: handleCalcHeight(fileList),
          },
          className: (
            props?.inputclass?.includes("fs-") ? (
              `text-left ${props?.inputclass || ""}`
            ) : (
              `text-left fs-1-0rem ${props?.inputclass || ""}`
            )
          ),
          startAdornment: (
            <Grid container spacing={2} columns={12}>
              <Grid size={4}>
                {fileList.length > 0 && fileList.map((file: any, index: number) => (
                  <Grid size={12} className={"d-left"} key={index}>
                    <Div
                      className={"black-50 fs-0-9rem fw-500"}
                      onClick={() => {}}
                    >
                      {file?.name}
                    </Div>
                    <Div
                      className={"black fs-0-9rem fw-500 pointer-burgundy ms-15"}
                      onClick={() => handleFileDelete(index)}
                    >
                      {!file?.name ? "" : "x"}
                    </Div>
                  </Grid>
                ))}
              </Grid>
              <Grid size={8}>
                <Grid size={12} className={"d-right"}>
                  <Div
                    className={"fs-1-0rem fw-600 pointer-burgundy"}
                    onClick={(e: any) => handleFileAdd(e)}
                  >
                    파일 추가
                  </Div>
                </Grid>
                <Br px={10} />
                <Grid size={12} className={"d-right"}>
                  <Div
                    className={"fs-1-0rem fw-600 pointer-burgundy"}
                    onClick={() => handleFileDeleteAll()}
                  >
                    전체 삭제
                  </Div>
                </Grid>
              </Grid>
            </Grid>
          )
        }}
      />
    </>
  );
};