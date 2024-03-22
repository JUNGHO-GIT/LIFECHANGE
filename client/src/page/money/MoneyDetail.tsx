// MoneyDetail.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const MoneyDetail = () => {

  // 1. components -------------------------------------------------------------------------------->
  const TITLE = "Money Detail";
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const moneySection_id = location.state.moneySection_id;
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [MONEY, setMONEY] = useState<any> ({});

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchMoneyDetail = async () => {
      try {
        const response = await axios.get(`${URL_MONEY}/moneyDetail`, {
          params: {
            _id : _id,
            moneySection_id : moneySection_id
          },
        });
        setMONEY(response.data);
        log("MONEY : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        alert(`Error fetching money data: ${error.message}`);
        setMONEY({});
      }
    };
    fetchMoneyDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowMoneyDelete = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (!confirm) {
        return;
      }
      else {
        const response = await axios.delete(`${URL_MONEY}/moneyDelete`, {
          params: {
            _id : _id,
            moneySection_id : moneySection_id
          },
        });
        if (response.data === "success") {
          alert("Delete Success");
          navParam(`/moneyListDay`);
        }
        else {
          alert("Delete failed");
        }
      }
    }
    catch (error:any) {
      alert(`Error fetching money data: ${error.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableMoneyDetail = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Part</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {MONEY?.moneySection?.flatMap((moneyItem: any) => (
            <tr key={moneyItem._id}>
              <td>{moneyItem.money_part_val}</td>
              <td>{moneyItem.money_title_val}</td>
              <td>{moneyItem.money_amount}</td>
              <td>{moneyItem.money_content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonMoneyDelete = () => {
    return (
      <button type="button" className="btn btn-sm btn-danger ms-2" onClick={flowMoneyDelete}>
        Delete
      </button>
    );
  };
  const buttonMoneyUpdate = (_id: string) => {
    return (
      <button
        type="button"
        className="btn btn-sm btn-primary ms-2"
        onClick={() => {
          navParam(`/moneyUpdate`, {
            state: {_id},
          });
        }}>
        Update
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };
  const buttonMoneyList = () => {
    return (
      <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => {
        navParam(`/moneyListDay`);
      }}>
        List
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center mt-5">
          <div className="col-12">
            <h1 className="mb-3 fw-7">{TITLE}</h1>
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12 d-center">
            {tableMoneyDetail()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {buttonRefreshPage()}
            {buttonMoneyUpdate(MONEY._id)}
            {buttonMoneyDelete()}
            {buttonMoneyList()}
          </div>
        </div>
      </div>
    </div>
  );
};
