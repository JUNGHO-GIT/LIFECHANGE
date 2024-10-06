// form.ts

// 1. makeFormData ---------------------------------------------------------------------------------
export const makeFormData = (
  object: any,
  fileList: File[] | null,
  extra?: any
) => {

  const form = new FormData();

  // object 데이터 추가
  if (object) {
    Object.keys(object).forEach((key: string, _index: number) => {
      // 이미지 배열인 경우
      if (Array.isArray(object[key])) {
        form.append(`OBJECT[${key}]`, JSON.stringify(object[key]));
      }
      // 나머지 항목인 경우
      else {
        form.append(`OBJECT[${key}]`, object[key]);
      }
    });
  }

  // 파일 추가
  if (fileList) {
    fileList.forEach((file: File, _index: number) => {
      const newFile = new File(
        [file],
        `${new Date().getTime()}_${file.name}`,
        { type: file.type }
      );
      form.append("fileList", newFile);
    });
  }

  // 추가 데이터 추가
  if (extra) {
    Object.keys(extra).forEach((key: string, _index: number) => {
      form.append(key, extra[key]);
    });
  }

  return form;
};