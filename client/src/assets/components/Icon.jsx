// Icon.jsx

import {React} from "../../import/ImportReacts.jsx";
import {InputAdornment, IconButton} from "@mui/material";

// ------------------------------------------------------------------------------------------------>
export const Icons = ({...props}) => {

  if (!props.name) {
    return (
      null
    );
  }

  // ex. 'FaHome' => (preStr = fa)
  let preStr = "";
  if (props.name.startsWith("Li")) {
    preStr = "lia";
  }
  else {
    preStr = props.name.slice(0, 2).toLowerCase();
  }

  let importCode = null;
  let importIcon = null;
  let IconComponent = React.Fragment;

  try {
    importCode = require(`react-icons/${preStr}/index`);
    importIcon = importCode[props.name];
    if (importIcon) {
      IconComponent = importCode[props.name];
    }
    else {
      console.log(`Icon '${props.name}' not found!`);
      return (
        null
      );
    }
  }
  catch (error) {
    console.error(error);
  }

  return (
    <IconButton className={"p-5"}>
      <IconComponent {...props}>
        {props.children}
      </IconComponent>
    </IconButton>
  );
};

// ------------------------------------------------------------------------------------------------>
export const Adorn = ({...props}) => {

  if (!props.name) {
    return (
      null
    );
  }

  // ex. 'FaHome' => (preStr = fa)
  let preStr = "";
  if (props.name.startsWith("Li")) {
    preStr = "lia";
  }
  else {
    preStr = props.name.slice(0, 2).toLowerCase();
  }

  let importCode = null;
  let importIcon = null;
  let IconComponent = React.Fragment;

  try {
    importCode = require(`react-icons/${preStr}/index`);
    importIcon = importCode[props.name];
    if (importIcon) {
      IconComponent = importCode[props.name];
    }
    else {
      console.log(`Icon '${props.name}' not found!`);
      return (
        null
      );
    }
  }
  catch (error) {
    console.error(error);
  }

  return (
    <InputAdornment position={props.position}>
      <IconComponent {...props} />
    </InputAdornment>
  );
};
