import { TextField } from "@mui/material";

const TextInput = (props: any) => {
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
};

export default TextInput;
