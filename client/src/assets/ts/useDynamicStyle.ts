// useDynamicStyle.ts
import {useLayoutEffect} from "react";
import {useMutationObserver} from '@react-hooks-library/core'

// useDynamicStyle -------------------------------------------------------------------------------->
export const useDynamicStyle = (
  baseElement:Document | HTMLElement | Element,
  locationName:string
) => {

  // 숫자관련 스타일과 문자열 관련 스타일 --------------------------------------------------------->
  const stylesNumber:any = {
    "w": ["width", "%"],
    "h": ["height", "%"],
    "t": ["top", "px"],
    "b": ["bottom", "px"],
    "l": ["left", "px"],
    "r": ["right", "px"],
    "p": ["padding", "px"],
    "pt": ["padding-top", "px"],
    "pb": ["padding-bottom", "px"],
    "ps": ["padding-left", "px"],
    "pe": ["padding-right", "px"],
    "m": ["margin", "px"],
    "mt": ["margin-top", "px"],
    "mb": ["margin-bottom", "px"],
    "ms": ["margin-left", "px"],
    "me": ["margin-right", "px"],
    "fw": ["font-weight", "00"],
    "fs": ["font-size", "px"],
  };

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
  let styleMap:Map<string, any> = new Map();

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

  // useLayoutEffect를 사용해서 동적으로 스타일 적용 ---------------------------------------------->
  useLayoutEffect(() => {
    baseElement.querySelectorAll("*").forEach((element) => {
      checkAndApplyStyle(element as HTMLElement);
    });

    let observer = new MutationObserver((mutations) => {
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
      childList: true,
      subtree: true,
      attributes: true
    });

  }, [baseElement, locationName]);

};
