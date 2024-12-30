import { yupResolver } from "@hookform/resolvers/yup";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
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
import { useAddSize, useUpdateSize } from "../services/query/ApiHandlerQuery";
import { ISize } from "../types/colorAndSize";

export interface IFormSize {
  sizeName: string;
}

const schema = yup
  .object({
    sizeName: yup.string().required(),
  })
  .required();

interface IAddUpdateSizeProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  objSize?: ISize;
  isEdit?: boolean;
  setIsEdit: (data: boolean) => void;
}

export default function AddUpdateSize(props: IAddUpdateSizeProps) {
  const { open, setOpen, objSize, isEdit } = props;
  const isLoading = store.useState((s) => s.isLoading);

  const objForm = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ISize) => {
    try {
      if (isEdit) {
        setIsLoading(true);
        const edit = await useUpdateSize(data, objSize?._id);
        setIsLoading(false);

        setOpen(false);
        setSuccess(true);
        setSuccessMessage(edit.message);
      } else {
        setIsLoading(true);
        const res = await useAddSize(data);
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
        editTitle="Edit Size"
        title="Add Size"
        modelSize={"md"}
        isEdit={isEdit}
        open={open}
        setOpen={setOpen}
      >
        <form onSubmit={objForm.handleSubmit(onSubmit)}>
          <TextInput
            label="Size"
            type="text"
            size="small"
            inputProps={{ style: { textTransform: "uppercase" } }}
            variant="outlined"
            {...objForm.register("sizeName")}
            error={objForm.formState.errors.sizeName ? true : false}
            defaultValue={objSize?.sizeName ? objSize?.sizeName : ""}
            helperText={objForm.formState.errors.sizeName?.message}
            fullWidth
          />

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
