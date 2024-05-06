import * as React from "react";
import PropTypes from "prop-types";
import { NumericFormat } from "react-number-format";
import TextField from "@mui/material/TextField";

const NumericFormatCustom = React.forwardRef((props, ref) => {
  const { onChange, min, max, name, disabled, ...other } = props;

  const handleValueChange = (values) => {
    const limitedValue = Math.min(max, parseInt(values.value, 10));
    onChange({
      target: {
        name: name,
        value: limitedValue.toString(),
      },
    });
  };

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={handleValueChange}
      thousandSeparator={false}
      valueIsNumericString={true}
      fixedDecimalScale={true}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
});

NumericFormatCustom.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  disabled: PropTypes.bool
};

export const NumericInput = ({ value, onChange, min, max, name, label, id, disabled }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      disabled={disabled}
      InputProps={{
        inputComponent: NumericFormatCustom,
        inputProps: {
          min,
          max,
          onChange,
          name,
          disabled
        }
      }}
      variant="standard"
    />
  );
};

NumericInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};
