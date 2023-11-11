import { useEffect, useLayoutEffect } from "react";

// Hook을 사용하여 동적 스타일을 적용하는 커스텀 훅
export const useDynamicStyle = (baseElement = document) => {

  // 스타일 속성과 단위를 매핑하는 객체
  const stylesNumber = {
    w  : ["width", "%"],
    h  : ["height", "%"],
    p  : ["padding", "px"],
    pt : ["padding-top", "px"],
    pb : ["padding-bottom", "px"],
    ps : ["padding-left", "px"],
    pe : ["padding-right", "px"],
    m  : ["margin", "px"],
    mt : ["margin-top", "px"],
    mb : ["margin-bottom", "px"],
    ms : ["margin-left", "px"],
    me : ["margin-right", "px"],
    fw : ["font-weight", "00"],
    fs : ["font-size", "px"],
  };

  const stylesString = {
    "d-center": {
      "display": "flex",
      "justify-content": "center",
      "align-items": "center",
      "text-align": "center",
    },
    "d-left": {
      "display": "flex",
      "justify-content": "flex-start",
      "align-items": "center",
      "text-align": "left",
    },
    "d-right": {
      "display": "flex",
      "justify-content": "flex-end",
      "align-items": "center",
      "text-align": "right",
    },
    "d-none": {
      "display": "none",
    },
    "d-flex": {
      "display": "flex",
    },
    "d-inline-block": {
      "display": "inline-block",
    },
    "d-inline-flex": {
      "display": "inline-flex",
    },
    "over-hidden": {
      "overflow": "hidden",
    },
    "over-auto": {
      "overflow": "auto",
    },
    "pointer": {
      "cursor": "pointer",
    },
    "resize-none": {
      "resize": "none",
    },
    "webkit-fill": {
      "width": "-webkit-fill-available",
      "height": "-webkit-fill-available",
    }
  };

  // 유효한 클래스 이름인지 확인하는 함수
  const isValidClass = (className:string) => {
    const isNumberBased = !!stylesNumber[className.split("-")[0]];
    const isStringBased = !!stylesString[className];
    return isNumberBased || isStringBased;
  };

  // 스타일을 적용하는 함수
  const applyStyle = (element:HTMLElement) => {
    element.classList.forEach((className) => {
      if (isValidClass(className)) {
        const [prefix, value] = className.split("-");
        if (stylesNumber[prefix]) {
          const [property, unit] = stylesNumber[prefix];
          element.style[property] = `${value}${unit}`;
        }
        else if (stylesString[className]) {
          Object.entries(stylesString[className]).forEach(([property, value]) => {
            element.style[property] = value;
          });
        }
      }
    });
  };

  // DOM 요소를 선택하는 셀렉터 생성
  const numberSelector = Object.keys(stylesNumber).map((prefix) => `[class*="${prefix}-"]`).join(", ");
  const stringSelector = Object.keys(stylesString).join(", ");
  const selector = `${numberSelector}, ${stringSelector}`;

  // 요소에 스타일 적용
  useLayoutEffect(() => {
    baseElement.querySelectorAll(selector).forEach(applyStyle as (element:Element) => void);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              applyStyle(node as HTMLElement);
            }
          });
        }
      });
    });

    observer.observe(baseElement, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

};
