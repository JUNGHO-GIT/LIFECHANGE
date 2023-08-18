import React, { useState } from "react";
import axios from "axios";
import { createGlobalStyle } from "styled-components";

// ------------------------------------------------------------------------------------------------>
const FoodListStyle = createGlobalStyle`
  .foodList {
    display: flex;
    align-items: center;
    padding-top: 40px;
    padding-bottom: 40px;
    background-color: #f5f5f5;
  }

  .form-foodList {
    max-width: 330px;
    padding: 15px;
  }

  .form-foodList .form-floating:focus-within {
    z-index: 2;
  }
`;

// ------------------------------------------------------------------------------------------------>
const FoodList = () => {
  const [foodValue, setFoodValue] = useState("");
  const [searchOption, setSearchOption] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const pagesToShow = 5;
  const itemsPerPage = 10;
  const [foodList, setFoodList] = useState<any[]>([]);
  const NAME_URL = `http://openapi.foodsafetykorea.go.kr/api/715fe7af70994e9fa08e/I2790/json/1/1000/DESC_KOR`;
  const COMPANY_URL = `http://openapi.foodsafetykorea.go.kr/api/715fe7af70994e9fa08e/I2790/json/1/1000/MAKER_NAME`;
  let URL = "";

  // ---------------------------------------------------------------------------------------------->
  const selectOnchange = (e: any) => {
    setSearchOption(e.target.value);
  };

  // ---------------------------------------------------------------------------------------------->
  const searchFood = async () => {
    if (foodValue.length < 2) {
      alert("검색어는 2글자 이상 입력해주세요.");
      return;
    }
    if (searchOption === "name") {
      URL = NAME_URL;
    }
    else if (searchOption === "company") {
      URL = COMPANY_URL;
    }
    await axios
    .get(`${URL}=${foodValue}`)
    .then((res) => {
      if (res.data.I2790.total_count === "0") {
        alert("검색 결과가 없습니다.");
      }
      else {
        const sortedFoodList = res.data.I2790.row.sort((a: any, b: any) => {
          // 년도로 정렬
          return parseInt(b.RESEARCH_YEAR) - parseInt(a.RESEARCH_YEAR);
        });
        setFoodList(sortedFoodList);
      }
    })
    .catch((err) => {
      console.log(err);
    });
    setCurrentPage(1);
  };

  // 현재 페이지의 항목만 표시
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodList.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(foodList.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    let pages = [];
    let startPage = Math.max(currentPage - Math.floor(pagesToShow / 2), 1);
    let endPage = Math.min(
      startPage + pagesToShow - 1,
      Math.ceil(foodList.length / itemsPerPage)
    );

    if (endPage - startPage < pagesToShow - 1) {
      startPage = Math.max(endPage - pagesToShow + 1, 1);
    }

    if (startPage > 1) {
      pages.push(
        <button type="button" onClick={() => setCurrentPage(currentPage - 5)}> « </button>
      );
    }
    if (startPage > 2) {
      pages.push(
        <button type="button" onClick={() => setCurrentPage(1)}>1</button>, "..."
      );
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push (
        <button type="button" key={i} onClick={() => setCurrentPage(i)}> {i} </button>
      );
    }

    if (endPage < Math.ceil(foodList.length / itemsPerPage) - 1)
      pages.push (
        "...",
        <button
          type="button"
          onClick={() =>
            setCurrentPage(Math.ceil(foodList.length / itemsPerPage))
          }
        >
          {Math.ceil(foodList.length / itemsPerPage)}
        </button>
      );
    if (endPage < Math.ceil(foodList.length / itemsPerPage))
      pages.push(
        <button type="button" onClick={() => setCurrentPage(currentPage + 5)}>
          »
        </button>
      );

    return pages;
  };

  // ---------------------------------------------------------------------------------------------->
  const resultFoodList = () => {
    return (
      <>
        <thead>
          <tr className="border border-1 border-dark">
            <th className="border-end border-1 border-dark">년도</th>
            <th className="border-end border-1 border-dark">식품이름</th>
            <th className="border-end border-1 border-dark">제조사명</th>
            <th className="border-end border-1 border-dark">총내용량</th>
            <th className="border-end border-1 border-dark">열량(kcal)</th>
            <th className="border-end border-1 border-dark">탄수화물(g)</th>
            <th className="border-end border-1 border-dark">단백질(g)</th>
            <th className="border-end border-1 border-dark">지방(g)</th>
            <th className="border-end border-1 border-dark">당(g)</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((food) => {
            return (
              <tr key={food.FOOD_CD} className="border border-1 border-dark">
                <td className="border-end border-1 border-dark">
                  {food.RESEARCH_YEAR === "" || undefined
                    ? "0"
                    : food.RESEARCH_YEAR}
                </td>
                <td className="border-end border-1 border-dark">
                  <a
                    href="#"
                    onClick={() => buttonFoodDetail(food.FOOD_CD)}
                    className="text-hover"
                  >
                    {food.DESC_KOR === "" || undefined ? "0" : food.DESC_KOR}
                  </a>
                </td>
                <td className="border-end border-1 border-dark">
                  {food.MAKER_NAME === "" || undefined ? "0" : food.MAKER_NAME}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.SERVING_SIZE === "" || undefined
                    ? "0"
                    : food.SERVING_SIZE}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.NUTR_CONT1 === "" || undefined ? "0" : food.NUTR_CONT1}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.NUTR_CONT2 === "" || undefined ? "0" : food.NUTR_CONT2}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.NUTR_CONT3 === "" || undefined ? "0" : food.NUTR_CONT3}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.NUTR_CONT4 === "" || undefined ? "0" : food.NUTR_CONT4}
                </td>
                <td className="border-end border-1 border-dark">
                  {food.NUTR_CONT5 === "" || undefined ? "0" : food.NUTR_CONT5}
                </td>
              </tr>
            );
          })}
        </tbody>
      </>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const refreshFoodList = () => {
    window.location.reload();
  };

  const buttonFoodDetail = (foodCD: string) => {
    window.location.href = "/foodDetail/" + foodCD;
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <FoodListStyle />
      <section className="foodList custom-flex-center">
        <form>
          <div className="empty-h50"></div>
          <h1 className="mb-3">Food List</h1>
          <div className="empty-h20"></div>
          <table className="border border-3 border-dark">
            {resultFoodList()}
          </table>
          <div className="d-flex justify-content-center">
            {renderPageNumbers()} {/* 페이지 번호 렌더링 */}
          </div>
          <div className="empty-h100"></div>
          <div className="d-flex justify-content-center">
            <select className="form-select me-2" onChange={selectOnchange}>
              <option value="name">식품이름</option>
              <option value="company">제조사명</option>
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              aria-label="Search"
              onChange={(e) => setFoodValue(e.target.value)}
            />
          </div>
          <br/>
            <button
              type="button"
              className="btn btn-primary"
              onClick={searchFood}
            >
              Search
            </button>
            &nbsp;
          <button
            type="button"
            className="btn btn-success"
            onClick={refreshFoodList}
          >
            Refresh
          </button>
          <div className="empty-h50"></div>
        </form>
      </section>
    </>
  );
};

export default FoodList;
