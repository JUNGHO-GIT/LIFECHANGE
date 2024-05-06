import React from 'react';
import PropTypes from 'prop-types';
import { NumericFormat } from 'react-number-format';
import TextField from '@mui/material/TextField';

const NumericFormatCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        if (onChange) {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }
      }}
      thousandSeparator={props.thousandSeparator}
      fixedDecimalScale={props.fixedDecimalScale}
      allowNegative={false}
    />
  );
});

export const NumericInput = ({
  label,
  value,
  onChange,
  min,
  max,
  minLength,
  maxLength,
  datatype,
  displayType,
  className,
  id,
  name,
  disabled
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      className={className}
      disabled={disabled}
      inputProps={{
        min,
        max,
        minLength,
        maxLength,
        type: datatype,
      }}
      InputProps={{
        inputComponent: NumericFormatCustom,
      }}
      variant="outlined"
    />
  );
};

NumericInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  datatype: PropTypes.string,
  displayType: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  thousandSeparator: PropTypes.bool,
  fixedDecimalScale: PropTypes.bool,
};

NumericFormatCustom.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  thousandSeparator: PropTypes.bool,
  fixedDecimalScale: PropTypes.bool,
};
