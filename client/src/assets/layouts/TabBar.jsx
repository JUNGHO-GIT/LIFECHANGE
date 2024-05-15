// TabBar.jsx

import {React, useState, useNavigate} from "../../import/ImportReacts.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";
import {Tabs, Tab} from "../../import/ImportMuis.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const TabBar = () => {

  // 1. common ------------------------------------------------------------------------------------>

  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row h-7vh"}>
      <Tabs value={value} className={"w-100p"} onChange={(event, newValue) => {
        setValue(newValue);
      }}>
        <Tab
          label={"운동"}
          value={0}
          icon={<Icons name={"LuDumbbell"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue(0);
            navigate("/exercise/list");
          }}
        />
        <Tab
          label={"식단"}
          value={1}
          icon={<Icons name={"BiBowlHot"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue(1);
            navigate("/food/list");
          }}
        />
        <Tab
          label={"메인"}
          value={2}
          icon={<Icons name={"LuCalendarCheck"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue(2);
            navigate("/calendar/list");
          }}
        />
        <Tab
          label={"재무"}
          value={3}
          icon={<Icons name={"TbPigMoney"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue(3);
            navigate("/money/list");
          }}
        />
        <Tab
          label={"수면"}
          value={4}
          icon={<Icons name={"TbMoon"} className={"w-16 h-16 dark"}/>}
          onClick={() => {
            setValue(4);
            navigate("/sleep/list");
          }}
        />
      </Tabs>
    </Div>
  );

  // 7. navigation -------------------------------------------------------------------------------->
  const navigationNode = () => (
    <Paper className={"flex-wrapper p-sticky top-14vh border-bottom"}>
      {defaultNode()}
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {navigationNode()}
    </>
  );
};