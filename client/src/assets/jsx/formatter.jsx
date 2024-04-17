// formatter.jsx

import React from "react";

// ------------------------------------------------------------------------------------------------>
export const formatter = (
  data, part, extra
) => {

  // 0. 공급가 계산 ------------------------------------------------------------------------------->
  var fnSupplyPrice = function (item) {
    return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 0. 천단위 콤마 추가 (input 태그 내에서 호출) ------------------------------------------------->
  function fnInputNum(obj) {
    var MAX_INT_VALUE = 2147483647;
    var debounceTimer = null;

    return function(obj) {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(function() {
        var inputVal = obj.value.replace(/,/g, '');
        var numericInputVal = parseInt(inputVal);

        // 입력값이 숫자이고 빈 문자열이 아닌 경우
        if (!isNaN(numericInputVal) && inputVal !== '') {
          if (numericInputVal > MAX_INT_VALUE) {
            // 최대값을 초과하는 경우
            alert("입력 가능한 최대값을 초과하였습니다.");
            obj.value = 0;
          }
          else {
            // 입력값이 유효한 경우, 콤마 추가하여 형식 지정
            inputVal = numericInputVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            obj.value = inputVal;
          }
        }
        // 입력값이 숫자가 아닌 경우
        else {
          alert("숫자만 입력 가능합니다.");
          obj.value = 0;
        }
      }, 100);
    };
  };

  // 0. 천단위 콤마 추가 (js에서 호출) ------------------------------------------------------------>
  var fnFormatNum = function (num) {
    // 값이 null, undefined, 또는 빈 문자열인 경우 0을 반환
    if (num === null || num === undefined || num === '') {
      return "0";
    }

    // 입력값을 숫자로 변환
    var numericInputVal = parseFloat(num);

    // 입력값이 숫자가 아니거나 NaN인 경우 0을 반환
    if (isNaN(numericInputVal)) {
      return "0";
    }

    // 숫자를 문자열로 변환하고 천단위 콤마 추가
    return numericInputVal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/\.00$/, '');
  };


  // 0. 숫자 비율형식 변환 (소숫점 3자리 - input 태그 내에서 호출) -------------------------------->
  var fnInputRate = (function() {
    var MAX_INT_VALUE = 2147483647;
    var debounceTimer = null;

    return function (obj) {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(function () {
        var inputVal = obj.value.replace(/,/g, '');

        // 입력값에 소수점이 두 개 이상 포함된 경우 체크
        if ((inputVal.match(/\./g) || []).length > 1) {
          alert("유효하지 않은 형식입니다.");
          obj.value = '0.000';
          return;
        }

        if (inputVal === '') {
          return;
        }
        else if (!isNaN(parseFloat(inputVal)) && isFinite(inputVal)) {
          var numericInputVal = parseFloat(inputVal);
          if (!isNaN(numericInputVal) && numericInputVal <= MAX_INT_VALUE) {
            var decimalPlaces = (inputVal.split('.')[1] || []).length;
            if (decimalPlaces <= 3) {
              obj.value = inputVal;
            }
            else {
              obj.value = numericInputVal.toFixed(3);
            }
          }
          else {
            alert("입력 가능한 최대값을 초과하였습니다.");
            obj.value = '0.000';
          }
        }
        else {
          alert("비율로 변환할 수 없는 값입니다.");
          obj.value = '0.000';
        }
      }, 100);
    };
  })();

  // 0. 숫자 비율형식 변환 (소숫점 3자리 - js에서 호출) ------------------------------------------->
  var fnFormatRate = function (num) {
    // 값이 null, undefined, 또는 빈 문자열인 경우 0을 반환
    if (num === null || num === undefined || num === '') {
      return "0.000";
    }

    // 입력값을 숫자로 변환
    var numericInputVal = parseFloat(num);

    // 입력값이 숫자가 아니거나 NaN인 경우 0을 반환
    if (isNaN(numericInputVal)) {
      return "0.000";
    }

    // 숫자를 문자열로 변환하고 소수점 3자리로 지정
    return numericInputVal.toFixed(3);
  };

  // 0. 날짜 형식 변환 ---------------------------------------------------------------------------->
  var fnFormatDate = function (value) {
    // 입력값이 유효한 날짜 형식인지 확인
    var validFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (validFormat.test(value)) {
      return value;
    }

    // 시간 정보 제거 (공백으로 구분된 첫 번째 부분만 사용)
    var datePart = value.split(' ')[0];

    // 숫자만 남기고 모든 비숫자 문자 제거
    var numbersOnly = datePart.replace(/\D/g, '');

    // YYYY-MM-DD 형식으로 변환
    if (numbersOnly.length <= 4) {
      return numbersOnly;
    }
    else if (numbersOnly.length <= 6) {
      return numbersOnly.slice(0, 4) + '-' + numbersOnly.slice(4);
    }
    else {
      return numbersOnly.slice(0, 4) + '-' + numbersOnly.slice(4, 6) + '-' + numbersOnly.slice(6, 8);
    }
  };

  if (part === "money") {
    return fnInputNum(data);
  }
};