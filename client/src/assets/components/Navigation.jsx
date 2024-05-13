// Footer.jsx

import {React, useState}from "../../import/ImportReacts.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";
import {Paper, BottomNavigation, BottomNavigationAction} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Navigation = () => {
  
  const [value, setValue] = React.useState(0);
  
  const bottomNode = () => (
    <BottomNavigation
      showLabels={true}
      value={value}
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
  
  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Div className={"d-center w-100p m-auto"}>
      {bottomNode()}
    </Div>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};