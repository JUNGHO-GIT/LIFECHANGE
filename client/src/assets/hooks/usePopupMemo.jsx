// usePopupMemo.jsx

import {React, useEffect, useState} from "../../import/ImportReacts.jsx";

// ------------------------------------------------------------------------------------------------>
export const usePopupMemo = (
  OBJECT, setOBJECT
) => {

  const [initialContent, setInitialContent] = useState([]);

  // 최초 렌더링에서만 초기값을 설정합니다.
  useEffect(() => {
    if (OBJECT?.money_section && initialContent.length === 0) {
      setInitialContent(OBJECT.money_section.map((section) => (
        section.money_content
      )));
    }
  }, [OBJECT, initialContent.length]);

  const handleChange = (value, index) => {
    setOBJECT((prev) => ({
      ...prev,
      money_section: prev.money_section.map((section, idx) =>
        idx === index ? { ...section, money_content: value } : section
      ),
    }));
  };

  const handleCancel = () => {
    setOBJECT((prev) => ({
      ...prev,
      money_section: prev.money_section.map((section, idx) => ({
        ...section,
        money_content: initialContent[idx]
      })),
    }));
  };

  return {
    handleChange,
    handleCancel
  };
};