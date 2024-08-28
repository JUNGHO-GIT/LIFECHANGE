// Memo.jsx

import { React, useState, useLocation } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { PopUp, Img, Div, Br20, Input } from "../../import/ImportComponents.jsx";
import {  Button, TextArea } from "../../import/ImportMuis.jsx";
import { calendar3 } from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const Memo = ({
  OBJECT, setOBJECT, extra, i
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {firstStr, translate} = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [prevContent, setPrevContent] = useState("");

  // 3. memoNode -----------------------------------------------------------------------------------
  const memoNode = () => (
    <PopUp
      key={i}
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Div className={"d-column"}>
          <Div className={"d-center"}>
            <TextArea
              readOnly={false}
              className={"w-86vw h-55vh border p-10"}
              value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
              onChange={(e) => {
                const newContent = e.target.value;
                setOBJECT((prev) => ({
                  ...prev,
                  [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      [`${extra}`]: newContent
                    } : item
                  ))
                }));
              }}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Button
              size={"small"}
              color={"primary"}
              variant={"contained"}
              style={{
                padding: "4px 10px",
                textTransform: "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginRight: "2vw",
                fontSize: "0.8rem"
              }}
              onClick={() => {
                closePopup();
              }}
            >
              {translate("confirm")}
            </Button>
            <Button
              size={"small"}
              color={"error"}
              variant={"contained"}
              style={{
                padding: "4px 10px",
                textTransform: "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "0.8rem"
              }}
              onClick={() => {
                // 이전 상태로 복원
                setOBJECT((prev) => ({
                  ...prev,
                  [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      [`${extra}`]: prevContent
                    } : item
                  ))
                }));
                closePopup();
              }}
            >
              {translate("close")}
            </Button>
          </Div>
        </Div>
      )}>
      {(popTrigger={}) => (
        <Input
          label={translate("memo")}
          size={"small"}
          variant={"outlined"}
          className={"w-86vw pointer"}
          value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Img src={calendar3} className={"w-16 h-16"} />
            ),
          }}
          onClick={(e) => {
            // 팝업 열릴 때 현재 상태를 저장
            setPrevContent(OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]);
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    </PopUp>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {memoNode()}
    </>
  );
};
