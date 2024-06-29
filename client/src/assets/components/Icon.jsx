// Icon.jsx

import {React} from "../../import/ImportReacts.jsx";
import {IconButton} from "@mui/material";

// -------------------------------------------------------------------------------------------------
export const Icons = ({ name, onClick, ...props }) => {

  if (!name) {
    return null;
  }

  // ex. 'FaHome' => (preStr = fa)
  let preStr = "";
  if (name.startsWith("Li")) {
    preStr = "lia";
  }
  else {
    preStr = name.slice(0, 2).toLowerCase();
  }

  let importCode = null;
  let importIcon = null;
  let IconComponent = React.Fragment;

  try {
    importCode = require(`react-icons/${preStr}/index`);
    importIcon = importCode[name];
    if (importIcon) {
      IconComponent = importCode[name];
    }
    else {
      console.log(`Icon '${name}' not found!`);
      return null;
    }
  }
  catch (error) {
    console.error(error);
  }

  return (
    <IconButton className={"p-5"} onClick={onClick}>
      <IconComponent {...props} />
    </IconButton>
  );
};
