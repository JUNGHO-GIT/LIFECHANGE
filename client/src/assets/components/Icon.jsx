// Icon.jsx
import {React} from "../../import/ImportReacts.jsx";
import {InputAdornment} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Icons = ({...props}) => {

  if (!props.name) {
    return (
      null
    );
  }

  // ex. 'FaHome' => (preStr = fa)
  const preStr = props.name.slice(0, 2).toLowerCase();

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
    <div className={"d-center"}>
      <IconComponent {...props} />
      {props.children}
    </div>
  );
};

// ------------------------------------------------------------------------------------------------>
export const Adornment = ({...props}) => {

  if (!props.name) {
    return (
      null
    );
  }

  // ex. 'FaHome' => (preStr = fa)
  const preStr = props.name.slice(0, 2).toLowerCase();

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
