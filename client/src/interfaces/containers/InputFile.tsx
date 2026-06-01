/**
 * @file InputFile.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Br, Div, Grid, Icons, Img } from "@exportComponents";
import { MuiFileInput } from "@exportMuis";
import { memo, useEffect, useRef, useState } from "@exportReacts";
import { useStoreAlert } from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const InputFile = memo(({ handleExistingFilesChange, ...props }: any) => {

  // 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const { setALERT } = useStoreAlert();

  // 2-2. useState ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const [ fileExisting, setFileExisting ] = useState<any[]>([]);
  const [ fileList, setFileList ] = useState<File[]>([]);
  const [ _fileCount, setFileCount ] = useState<number>(0);
  const [ fileHeight, setFileHeight ] = useState<string>(`100px`);
  const [ fileLimit, setFileLimit ] = useState<number>(1);
  const [ previewUrls, setPreviewUrls ] = useState<string[]>([]);

  // 2-2. useRef ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const fileInputRef: React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement | null>(null);
  const previewUrlRef: React.RefObject<string[]> = useRef<string[]>([]);
  const isPickingRef: React.RefObject<boolean> = useRef<boolean>(false);

  // 3. util ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
  const isSameFile = (a: File, b: File) => (
    a.name === b.name &&
		a.size === b.size &&
		a.lastModified === b.lastModified
  );

  const areSameFileList = (a: File[], b: File[]) => {
    if ((a?.length ?? 0) !== (b?.length ?? 0)) {
      return false;
    }
    for (const [i] of (a ?? []).entries()) {
      if (!isSameFile(a[i], b[i])) {
        return false;
      }
    }
    return true;
  };

  // 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
  useEffect(() => {
    setFileExisting(props?.existing ?? []);
  }, [props?.existing]);

  // 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
  useEffect(() => {
    setFileLimit(props?.limit ?? 1);
  }, [props?.limit]);

  // 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
  useEffect(() => {
    const nextFiles: File[] = props?.value ?? [];
    setFileList((prev: File[]) => (
			areSameFileList(prev ?? [], nextFiles ?? []) ? prev : nextFiles
    ));
  }, [props?.value]);

  // 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
  useEffect(() => {
    const newCount: number = fileList?.length ?? 0;
    const existingCount: number = fileExisting?.length ?? 0;
    setFileCount(newCount + existingCount);

    const heightPerFile: number = 30;
    const minHeight: number = 100;
    setFileHeight(`${Math.max(minHeight, newCount * heightPerFile)}px`);
  }, [ fileList, fileExisting ]);

  // 2-3. useEffect (preview url 관리) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
  useEffect(() => {

    // 기존 URL revoke
    if (previewUrlRef.current?.length > 0) {
      previewUrlRef.current.forEach((u: string) => {
        URL.revokeObjectURL(u);
      });
      previewUrlRef.current = [];
    }

    const urls: string[] = (fileList ?? []).map((file: File) => (
      URL.createObjectURL(file as Blob)
    ));

    previewUrlRef.current = urls;
    setPreviewUrls(urls);

    return () => {
      if (previewUrlRef.current?.length > 0) {
        previewUrlRef.current.forEach((u: string) => {
          URL.revokeObjectURL(u);
        });
        previewUrlRef.current = [];
      }
    };
  }, [fileList]);

  // 6. handle (파일 추가) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const flowFileChange = (newFiles: File[] | null) => {

    let hasError: boolean = false;
    let errorMsg: string = ``;

    const incoming: File[] = newFiles ?? [];
    const currentFiles: File[] = fileList ?? [];
    const existingCount: number = fileExisting?.length ?? 0;
    const currentCount: number = currentFiles?.length ?? 0;

		// 파일이 이미지가 아닌 경우
		!hasError && incoming.some((file: File) => !file.type.startsWith(`image/`)) ? (
			hasError = true,
			errorMsg = `이미지 파일만 업로드 가능합니다.`
		) : null;

		// 파일이 3mb 이상인 경우
		!hasError && incoming.some((file: File) => (file.size > 3 * 1024 * 1024)) ? (
			hasError = true,
			errorMsg = `파일은 최대 3MB까지 업로드 가능합니다.`
		) : null;

		// 중복 제거 (name/size/lastModified)
		const nonDuplicateFiles: File[] = !hasError ? incoming.filter((newFile: File) => (
		  !currentFiles.some((existingFile: File) => isSameFile(existingFile, newFile))
		)) : [];

		// 파일 제한 체크 (현재 기준)
		!hasError && (existingCount + currentCount + nonDuplicateFiles.length > fileLimit) ? (
			hasError = true,
			errorMsg = `파일은 최대 ${fileLimit}개까지 업로드 가능합니다.`
		) : null;

		hasError ? (
			setALERT({
			  open: true,
			  severity: `error`,
			  msg: errorMsg,
			})
		) : (
			(() => {
			  const updatedFiles: File[] = [ ...currentFiles, ...nonDuplicateFiles ];
			  setFileList(updatedFiles);
			  props.onChange(updatedFiles);
			})()
		);
  };

  // 5. handle ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  // 파일 선택창 오픈은 CirclePlus 아이콘에서만 호출되도록 제한
  const handleFileAdd = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

		!fileInputRef.current || isPickingRef.current ? null : (() => {
		  isPickingRef.current = true;

		  const onFocus = () => {
		    isPickingRef.current = false;
		    window.removeEventListener(`focus`, onFocus);
		  };

		  window.addEventListener(`focus`, onFocus, { once: true });

		  fileInputRef.current.value = ``;
		  fileInputRef.current.click();
		})();
  };

  // 6. handle (파일 삭제) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const handleFileDelete = (index: number, extra?: string) => {
    if (extra === `single`) {
      const updatedFiles: File[] = (fileList ?? []).filter((_file: File, i: number) => i !== index);
      setFileList(updatedFiles);
      props.onChange(updatedFiles);
    }
    else if (extra === `all`) {
      setFileList([]);
      props.onChange([]);
    }
  };

  // 6. handle (기존 파일 삭제) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const handleExistingFileDelete = (index: number) => {
    const updatedExistingFile: any[] = fileExisting?.filter((_file: any, i: number) => i !== index);
    setFileExisting(updatedExistingFile);

    if (handleExistingFilesChange) {
      handleExistingFilesChange(updatedExistingFile);
    }
  };

  // 7. node ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const endAdornmentNode = (
    <Grid container={true} spacing={0} className={`w-100p`}>
      <Grid size={12} className={`d-row-right mr-n20px`}>
        <Icons
          key={`CirclePlus`}
          name={`CirclePlus`}
          className={`w-22px h-22px pointer-burgundy`}
          onClick={(e: any) => {
            handleFileAdd(e);
          }}
        />
        <Icons
          key={`Trash`}
          name={`Trash`}
          className={`w-22px h-22px pointer-burgundy`}
          onClick={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            handleFileDelete(0, `all`);
          }}
        />
      </Grid>
    </Grid>
  );

  // 7. node ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const adornmentNode = (
    <Grid container={true} spacing={0}>
      <Grid size={12} className={`d-col-left`}>
        {fileList && fileList?.length > 0 ? fileList.map((file: File, index: number) => {
          const src: string = previewUrls?.[index] ?? ``;

          return (
            <Div className={`d-row-center`} key={index}>
              <Img
                key={src || index}
                max={25}
                hover={true}
                shadow={true}
                radius={false}
                group={`new`}
                src={src}
                className={`ml-15px mr-10px`}
              />
              <Div max={14} className={`black fs-0-9rem fw-500`}>
                {file?.name}
              </Div>
              <Div
                className={`black fs-0-9rem fw-500 pointer-burgundy ml-15px`}
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleFileDelete(index, `single`);
                }}
              >
                {file?.name ? `x` : ``}
              </Div>
            </Div>
          );
        }) : null}
      </Grid>
    </Grid>
  );

  // 7. node ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const existingNode = () => (
    <Grid container={true} spacing={0}>
      <Grid size={12} className={`d-col-left`}>
        {fileExisting.map((file: any, index: number) => (
          <Div className={`d-row-center`} key={index}>
            <Img
              max={25}
              hover={true}
              shadow={true}
              radius={false}
              group={props?.group}
              src={file}
              className={`ml-15px mr-10px`}
            />
            <Div max={14} className={`black fs-0-9rem fw-500`}>
              {file}
            </Div>
            <Div
              className={`black fs-0-9rem fw-500 pointer-burgundy ml-5px`}
              onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                handleExistingFileDelete(index);
              }}
            >
              {`x`}
            </Div>
          </Div>
        ))}
      </Grid>
    </Grid>
  );

  // 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  return (
    <>
      {/** 실제 파일 선택은 이 hidden input 하나로만 처리 */}
      <input
        ref={fileInputRef}
        type={`file`}
        multiple={true}
        accept={`image/*`}
        style={{ display: `none` }}
        onClick={(e: any) => {
          e.stopPropagation();
        }}
        onChange={(e: any) => {
          const files: File[] = e?.target?.files ? [...e.target.files] : [];
          flowFileChange(files);
          isPickingRef.current = false;
          e.target.value = ``;
        }}
      />
      <MuiFileInput
        {...props}
        label={props?.label ?? ``}
        value={[]}
        select={false}
        variant={`outlined`}
        size={props?.size ?? `small`}
        className={props?.className ?? ``}
        inputRef={props?.inputRef ?? null}
        error={props?.error ?? false}
        fullWidth={props?.fullWidth ?? true}
        multiline={props?.multiline ?? true}
        multiple={props?.multiple ?? true}
        onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        InputProps={{
          ...props?.InputProps,
          readOnly: true,
          style: {
            height: fileHeight,
          },
          className: (
						props?.inputclass?.includes(`fs-`) ? (
							`text-left ${props?.inputclass ?? ``}`
						) : (
							`fs-0-9rem text-left ${props?.inputclass ?? ``}`
						)
          ),
          startAdornment: adornmentNode,
          endAdornment: endAdornmentNode,
        }}
      />
      <Br m={20} />
      {/** 기존 이미지 표시하기 * */}
      {fileExisting?.length > 0 && existingNode()}
    </>
  );
});
