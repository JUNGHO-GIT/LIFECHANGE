// Footer.jsx

import {React, useState}from "../../import/ImportReacts.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";
import {Paper, BottomNavigation, BottomNavigationAction} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Navigation = ({
  strings, objects, functions, handlers
}) => {

  const [value, setValue] = React.useState(0);

  const defaultNode = () => (
    <BottomNavigation
      showLabels={true}
      value={value}
      className={"d-center m-auto"}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >
      <BottomNavigationAction label="Recents"
      icon={
        <Icons name={"TbTextPlus"} className={"w-16 h-16 dark"}/>
      } />
      <BottomNavigationAction label="Favorites"
      icon={
        <Icons name={"TbTextPlus"} className={"w-16 h-16 dark"}/>
      } />
      <BottomNavigationAction label="Archive" icon={
        <Icons name={"TbTextPlus"} className={"w-16 h-16 dark"}/>
      } />
    </BottomNavigation>
  );

  // 7. navigation -------------------------------------------------------------------------------->
  const navigationNode = () => (
    <Div className={"block-wrapper d-row h-40"}>
      {defaultNode()}
    </Div>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {navigationNode()}
    </>
  );
};