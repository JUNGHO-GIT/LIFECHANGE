var dynamicStyle = function (baseElement = document) {

  // 숫자관련 스타일과 문자열 관련 스타일 --------------------------------------------------------->
  var stylesNumber = {
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

  var stylesString = {
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
  var styleMap = new Map();

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
  var applyNumberStyle = (element, className) => {
    var [prefix, value] = className.split("-");
    var styleInfo = styleMap.get(prefix);

    if (styleInfo && styleInfo.type === "number") {
      var [property, unit] = styleInfo.styles;
      var style = value + unit;
      element.style.setProperty(property, style, "important");
    }
  };

  // 문자열 검증 및 적용 -------------------------------------------------------------------------->
  var applyStringStyle = (element, className) => {
    var styleInfo = styleMap.get(className);
    if (styleInfo && styleInfo.type === "string") {
      var style = styleInfo.styles;
      Object.keys(style).forEach((property) => {
        element.style.setProperty(property, style[property], "important");
      });
    }
  };

  // 전체 스타일 검증 및 해당 함수 호출 ----------------------------------------------------------->
  var checkAndApplyStyle = (element) => {
    var classNames = [];

    if (typeof element.className === "string") {
      classNames = element.className.split(" ").filter(Boolean);
    }
    else {
      classNames = Array.from(element.classList);
    }

    classNames.forEach((className) => {
      if (styleMap.has(className)) {
        var styleInfo = styleMap.get(className);
        if (styleInfo) {
          if (styleInfo.type === "number") {
            applyNumberStyle(element, className);
          } else if (styleInfo.type === "string") {
            applyStringStyle(element, className);
          }
        }
      }
      else {
        var stylePrefix = className.split("-")[0];
        if (styleMap.has(stylePrefix)) {
          var styleInfo = styleMap.get(stylePrefix);
          if (styleInfo && styleInfo.type === "number") {
            applyNumberStyle(element, className);
          }
        }
      }
    });
  };

  // 동적 스타일 적용 ----------------------------------------------------------------------------->
  baseElement.querySelectorAll("*").forEach((element) => {
    checkAndApplyStyle(element);
  });

  var observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            checkAndApplyStyle(node);
          }
        });
      }
    });
  });

  observer.observe(baseElement, {
    childList: true,
    subtree: true
  });

};

document.addEventListener("DOMContentLoaded", () => {
  dynamicStyle();
});