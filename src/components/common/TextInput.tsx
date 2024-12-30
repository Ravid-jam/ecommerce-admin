import { TextField, TextFieldProps } from "@material-ui/core";
import { forwardRef } from "react";

const TextInput = forwardRef<HTMLDivElement, TextFieldProps>((props, ref) => {
  const {
    label,
    name,
    value,
    onChange,
    onBlur,
    error,
    helperText,
    variant = "outlined",
    fullWidth = true,
    size = "medium",
    ...otherProps
  } = props;

  return (
    <TextField
      ref={ref}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      {...otherProps}
    />
  );
});

export default TextInput;
