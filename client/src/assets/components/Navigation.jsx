// Footer.jsx

import {React, useState}from "../../import/ImportReacts.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";
import {Paper, BottomNavigation, BottomNavigationAction} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Navigation = ({
  strings, objects, functions, handlers
}) => {

  const [value, setValue] = React.useState(0);

  const navigationNode = () => (
    <BottomNavigation
      showLabels={true}
      value={value}
      className={"d-center w-100p m-auto"}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >
      <BottomNavigationAction label="Recents"
      icon={
        <Icons name={"TbTextPlus"} className={"w-18 h-18 dark"}/>
      } />
      <BottomNavigationAction label="Favorites"
      icon={
        <Icons name={"TbTextPlus"} className={"w-18 h-18 dark"}/>
      } />
      <BottomNavigationAction label="Archive" icon={
        <Icons name={"TbTextPlus"} className={"w-18 h-18 dark"}/>
      } />
    </BottomNavigation>
  );

  // 7. resultNode -------------------------------------------------------------------------------->
  const resultNode = () => (
    <Div className={"block-wrapper h-50 d-row"}>
      {navigationNode()}
    </Div>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {resultNode()}
    </>
  );
};