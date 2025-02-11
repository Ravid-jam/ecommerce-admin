import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { forwardRef } from "react";

interface SelectFieldProps extends SelectProps {
  label: string;
  options?: Array<Record<string, any>>;
  valueKey?: string;
  labelKey?: string;
  helperText?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (props, ref) => {
    const {
      label,
      id,
      options = [],
      error,
      helperText,
      valueKey = "value",
      labelKey = "label",
      size = "medium",
      ...otherProps
    } = props;
    return (
      <div>
        <FormControl fullWidth size={size} error={error}>
          <InputLabel id={`${id}-label`}>{label}</InputLabel>
          <Select
            labelId={`${id}-label`}
            id={id}
            ref={ref}
            {...otherProps}
            label={label}
            fullWidth
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option[valueKey]}>
                {option[labelKey]}
              </MenuItem>
            ))}
          </Select>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      </div>
    );
  }
);

export default SelectField;
