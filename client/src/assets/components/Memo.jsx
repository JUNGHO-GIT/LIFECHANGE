// Memo.jsx

import {React, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {PopUp, Img, Div} from "../../import/ImportComponents.jsx";
import {TextField, Button, TextArea} from "../../import/ImportMuis.jsx";
import {calendar3} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Memo = ({
  OBJECT, setOBJECT, extra, i
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";

  // 2. memoNode ---------------------------------------------------------------------------------->
  const memoNode = () => (
    <PopUp
      key={i}
      type={"innerCenter"}
      position={"top"}
      direction={"center"}
      contents={({closePopup}) => (
      <Div className={"d-center"}>
        <TextArea
          readOnly={false}
          className={"w-70vw h-55vh border p-10"}
          value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
          onChange={(e) => {
            const newContent = e.target.value;
            setOBJECT((prev) => ({
              ...prev,
              [`${firstStr}_section`]: prev[`${firstStr}_section`].map((item, idx) => (
                idx === i ? {
                  ...item,
                  [`${extra}`]: newContent
                } : item
              ))
            }));
          }}
        />
      </Div>
      )}>
      {(popTrigger={}) => (
        <TextField
          select={false}
          label={"메모"}
          size={"small"}
          variant={"outlined"}
          className={"w-86vw pointer"}
          value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Img src={calendar3} className={"w-16 h-16"} />
            ),
            endAdornment: null
          }}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    </PopUp>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {memoNode()}
    </>
  );
};