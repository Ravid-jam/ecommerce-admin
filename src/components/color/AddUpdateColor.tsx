import { yupResolver } from "@hookform/resolvers/yup";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";
import CommonModel from "../common/CommonModel";
import TextInput from "../common/TextInput";
import {
  setIsLoading,
  setSuccess,
  setSuccessMessage,
  store,
} from "../services/pulState/store";
import { useAddColor, useUpdateColor } from "../services/query/ApiHandlerQuery";
import { IColor } from "../types/colorAndSize";

export interface IFormCategory {
  colorName: string;
  colorCode: string;
}

const schema = yup
  .object({
    colorName: yup.string().required(),
    colorCode: yup.string().required(),
  })
  .required();

interface IAddUpdateColorProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ObjColor?: IColor;
  isEdit?: boolean;
  setIsEdit: (data: boolean) => void;
}

export default function AddUpdateColor(props: IAddUpdateColorProps) {
  const { open, setOpen, ObjColor, isEdit } = props;
  const isLoading = store.useState((s) => s.isLoading);

  const objForm = useForm<IFormCategory>({
    resolver: yupResolver(schema),
    defaultValues: ObjColor,
  });

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        setIsLoading(true);
        const edit = await useUpdateColor(data, ObjColor?._id);
        setIsLoading(false);

        setOpen(false);
        setSuccess(true);
        setSuccessMessage(edit.message);
      } else {
        setIsLoading(true);
        const res = await useAddColor(data);
        setIsLoading(false);
        setOpen(false);
        setSuccess(true);
        setSuccessMessage(res.message);
      }
    } catch (error: any) {
      setOpen(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
      });
    }
  };

  return (
    <div>
      <CommonModel
        editTitle="Edit Color"
        modelSize={"md"}
        title="Add Color"
        isEdit={isEdit}
        open={open}
        setOpen={setOpen}
      >
        <form onSubmit={objForm.handleSubmit(onSubmit)}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <TextInput
                label="Color Name"
                type="text"
                fullWidth
                size="small"
                variant="outlined"
                {...objForm.register("colorName")}
                error={objForm.formState.errors.colorName ? true : false}
                helperText={objForm.formState.errors.colorName?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextInput
                label="Color Code"
                type="text"
                fullWidth
                size="small"
                variant="outlined"
                {...objForm.register("colorCode")}
                error={objForm.formState.errors.colorCode ? true : false}
                helperText={objForm.formState.errors.colorCode?.message}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <LoadingButton
              color="secondary"
              type="submit"
              loading={isLoading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              style={{ backgroundColor: !isLoading ? "#095192" : "" }}
            >
              {isEdit ? "Edit " : "Save"}
            </LoadingButton>
          </DialogActions>
        </form>
      </CommonModel>
    </div>
  );
}
