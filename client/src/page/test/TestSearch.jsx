// TestSearch.jsx

import React, {useState, useEffect} from "react";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const TestSearch = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_TEST = process.env.REACT_APP_URL_TEST;

  // 2-1. useState -------------------------------------------------------------------------------->
  const [pageCount, setPageCount] = useState(0);
  const [filter, setFilter] = useState({
    query: "",
    page: 0,
    limit: 10
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const [FOOD_DEFAULT, setFOOD_DEFAULT] = useState([{
    title: "",
    brand: "",
    serv: "",
    kcal: "",
    fat: "",
    carb: "",
    protein: ""
  }]);
  const [FOOD, setFOOD] = useState([{
    title: "",
    brand: "",
    serv: "",
    kcal: "",
    fat: "",
    carb: "",
    protein: ""
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (filter.query === "") {
      return;
    }
    else {
      flowTestSearch();
    }
  }, [filter.page]);

  // ---------------------------------------------------------------------------------------------->
  const flowTestSearch = async () => {
    const response = await axios.post(`${URL_TEST}/search`, {
      query: filter.query,
      page: filter.page,
    });
    setPageCount(response.data.pageCount);
    setFOOD(response.data.result || FOOD_DEFAULT);
  };

  // 5-2. filter ---------------------------------------------------------------------------------->
  const filterBox = () => {
    const pageNumber = () => (
      <span className="ms-2 me-2">
        {filter.page + 1} / {pageCount}
      </span>
    );
    const prevNumber = () => (
      <button
        className="btn btn-sm"
        onClick={() => setFilter({
          ...filter, page: filter.page > 0 ? filter.page - 1 : 0
        })}
      >
        Prev
      </button>
    );
    const nextNumber = () => (
      <button
        className="btn btn-sm"
        onClick={() => setFilter({
          ...filter, page: filter.page < pageCount - 1 ? filter.page + 1 : filter.page
        })}
      >
        Next
      </button>
    );
    return (
      <div className="d-inline-flex">
        {prevNumber()}
        {pageNumber()}
        {nextNumber()}
      </div>
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableTestSearch = () => {
    return (
      <div>
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Brand</th>
              <th>Serving</th>
              <th>Kcal</th>
              <th>Fat</th>
              <th>Carbohydrate</th>
              <th>Protein</th>
            </tr>
          </thead>
          <tbody>
            {FOOD.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.brand}</td>
                  <td>{item.serv}</td>
                  <td>{item.kcal}</td>
                  <td>{item.fat}</td>
                  <td>{item.carb}</td>
                  <td>{item.protein}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20">
          <div className="col-12 d-center">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Search Food"
                id="search"
                name="search"
                value={filter.query}
                onChange={(e) => {
                  setFilter({
                    ...filter,
                    query: e.target.value
                  });
                }}
              />
              <button
                type="button"
                className="btn btn-sm btn-primary ms-2"
                onClick={() => {
                  setFilter({
                    ...filter,
                    page: 0
                  });
                  flowTestSearch();
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {filterBox()}
          </div>
        </div>
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {tableTestSearch()}
          </div>
        </div>
      </div>
    </div>
  );
};
