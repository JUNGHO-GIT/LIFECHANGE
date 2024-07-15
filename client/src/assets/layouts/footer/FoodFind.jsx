// FoodFind.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Button, TextField, Card} from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodFind = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useTranslate();

  // 2. query --------------------------------------------------------------------------------------
  const queryNode = () => (
    <TextField
      select={false}
      size={"small"}
      variant={"outlined"}
      className={"w-20vw"}
      value={objects?.PAGING?.query}
      InputProps={{
        readOnly: false,
        className: "h-min0 h-30",
      }}
      onChange={(e) => {
        functions?.setPAGING((prev={}) => ({
          ...prev,
          query: e.target.value
        }));
      }}
    />
  );

  // 3. find ---------------------------------------------------------------------------------------
  const findNode = () => (
    <Button
      size={"small"}
      color={"primary"}
      variant={"contained"}
      className={"ms-3vw me-3vw"}
      onClick={async () => {
        handlers.flowFind();
        functions?.setPAGING((prev) => ({
          ...prev,
          page: 0
        }));
      }}
    >
      {translate("find")}
    </Button>
  );

  // 4. done ---------------------------------------------------------------------------------------
  const doneNode = () => (
    <Button
      size={"small"}
      color={"primary"}
      variant={"contained"}
      className={"ms-3vw me-3vw"}
      onClick={() => {
        Object.assign(objects?.SEND, {
          dateType: objects?.DATE.dateType,
          dateStart: objects?.DATE.dateStart,
          dateEnd: objects?.DATE.dateEnd
        });
        handlers.navigate(objects?.SEND.toSave, {
          state: objects?.SEND,
        });
      }}
    >
      {translate("done")}
    </Button>
  );

  // 7. foodFind -----------------------------------------------------------------------------------
  const foodFindNode = () => (
    <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
      {queryNode()}
      {findNode()}
      {doneNode()}
    </Card>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {foodFindNode()}
    </>
  );
};