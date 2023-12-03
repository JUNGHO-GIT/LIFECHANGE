// useDynamicStyle.ts
import {useEffect} from "react";

// useDynamicStyle -------------------------------------------------------------------------------->
export const useDynamicStyle = (
  baseElement: HTMLElement,
  locationName: string
) => {

  // 0. 현재 locationName 확인 -------------------------------------------------------------------->
  localStorage.setItem("locationName", locationName);

  // 1-1. style 접두사 + css속성 + 단위 ----------------------------------------------------------->
  const stylesNumber:any = {
    "w"  : ["width", "%"],
    "h"  : ["height", "%"],
    "p"  : ["padding", "px"],
    "pt" : ["padding-top", "px"],
    "pb" : ["padding-bottom", "px"],
    "ps" : ["padding-left", "px"],
    "pe" : ["padding-right", "px"],
    "m"  : ["margin", "px"],
    "mt" : ["margin-top", "px"],
    "mb" : ["margin-bottom", "px"],
    "ms" : ["margin-left", "px"],
    "me" : ["margin-right", "px"],
    "fw" : ["font-weight", "00"],
    "fs" : ["font-size", "px"],
    "fsr" : ["font-size", "rem"],
    "z" : ["z-index", ""],
  };

  // 1-2. style 접두사 + css속성 ------------------------------------------------------------------>
  const stylesString:any = {
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
    "d-inline": {
      "display": "inline-block",
    },
    "d-inline-flex": {
      "display": "inline-flex",
    },
    "pos-static": {
			"position": "static",
		},
		"pos-relative": {
			"position": "relative",
		},
    "over-hidden": {
      "overflow": "hidden",
    },
    "over-auto": {
      "overflow": "auto",
    },
    "pointer": {
      "cursor": "pointer",
      "caret-color": "transparent",
    },
    "resize-none": {
      "resize": "none",
    },
    "webkit-fill": {
      "width": "-webkit-fill-available",
      "height": "-webkit-fill-available",
    },
    "fw-normal": {
      "font-weight": "normal",
    },
    "fw-bold": {
      "font-weight": "bold",
    },
    "fw-bolder": {
      "font-weight": "bolder",
    },
    "pos-rel": {
      "position": "relative",
    },
    "pos-ab": {
      "position": "absolute",
    },
    "pos-fix": {
      "position": "fixed",
    },
    "pos-stc": {
      "position": "static",
    },
  };

  // 스타일 맵 만들기 ----------------------------------------------------------------------------->
  const styleMap:Map<string, any> = new Map();

  Object.keys(stylesNumber).forEach((key) => {
    styleMap.set(key, {
      type: "number",
      styles: stylesNumber[key],
    });
  });

  Object.keys(stylesString).forEach((key) => {
    styleMap.set(key, {
      type: "string",
      styles: stylesString[key],
    });
  });

  // 숫자 검증 및 적용 ---------------------------------------------------------------------------->
  const applyNumberStyle = (element:HTMLElement, className:string) => {
    let [prefix, value] = className.split("-");
    let styleInfo = styleMap.get(prefix);

    if (styleInfo && styleInfo.type === "number") {
      let [property, unit] = styleInfo.styles;
      let style = value + unit;
      element.style.setProperty(property, style, "important");
    }
  };

  // 문자열 검증 및 적용 -------------------------------------------------------------------------->
  const applyStringStyle = (element:HTMLElement, className:string) => {
    let styleInfo = styleMap.get(className);
    if (styleInfo && styleInfo.type === "string") {
      let style = styleInfo.styles;
      Object.keys(style).forEach((property) => {
        element.style.setProperty(property, style[property], "important");
      });
    }
  };

  // 전체 스타일 검증 및 해당 함수 호출 ----------------------------------------------------------->
  const checkAndApplyStyle = (element:HTMLElement) => {
    let classNames:Array<string> = [];
    if (typeof element.className === "string") {
      classNames = element.className.split(" ").filter(Boolean);
    }
    else {
      classNames = Array.from(element.classList);
    }

    classNames.forEach((className) => {
      if (styleMap.has(className)) {
        let styleInfo = styleMap.get(className);
        if (styleInfo) {
          if (styleInfo.type === "number") {
            applyNumberStyle(element, className);
          }
          else if (styleInfo.type === "string") {
            applyStringStyle(element, className);
          }
        }
      }
      else {
        let stylePrefix = className.split("-")[0];
        if (styleMap.has(stylePrefix)) {
          let styleInfo = styleMap.get(stylePrefix);
          if (styleInfo && styleInfo.type === "number") {
            applyNumberStyle(element, className);
          }
        }
      }
    });
  };

  // useEffect를 사용 동적 스타일 적용 ------------------------------------------------------------>
  useEffect(() => {
    baseElement.querySelectorAll("*").forEach((element:HTMLElement | any) => {
      checkAndApplyStyle(element);
    });
  }, [baseElement, locationName]);

  // useEffect를 사용 동적 스타일 적용 ------------------------------------------------------------>
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              checkAndApplyStyle(node as HTMLElement);
            }
          });
        }
      });
    });

    observer.observe(baseElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });

  }, [baseElement, locationName]);
};