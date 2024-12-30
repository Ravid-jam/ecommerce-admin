import { yupResolver } from "@hookform/resolvers/yup";
import SaveIcon from "@mui/icons-material/Save";
import UploadTwoToneIcon from "@mui/icons-material/UploadTwoTone";
import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
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
import {
  useAddCategory,
  useUpdateCategory,
} from "../services/query/ApiHandlerQuery";
import ICategory from "../types/category";

export interface IFormCategory {
  categoryTitle: string;
  categoryImage: string;
}

const schema = yup
  .object({
    categoryTitle: yup.string().required(),
    categoryImage: yup.string().required(),
  })
  .required();

interface IAddUpdateCarouselProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ObjCategory?: ICategory;
  isEdit?: boolean;
  setIsEdit: (data: boolean) => void;
}

export default function AddUpdateCategory(props: IAddUpdateCarouselProps) {
  const { open, setOpen, ObjCategory, isEdit } = props;
  const isLoading = store.useState((s) => s.isLoading);
  const [image, setImage] = React.useState<any>({
    url: ObjCategory?.categoryImage ? ObjCategory.categoryImage : "",
  });

  const objForm = useForm<IFormCategory>({
    resolver: yupResolver(schema),
    defaultValues: {
      categoryImage: ObjCategory?.categoryImage,
      categoryTitle: ObjCategory?.categoryTitle,
    },
  });

  const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];

    const base64 = await convertToBase64(file);
    setImage({
      ...image,
      url: base64 ? base64 : ObjCategory?.categoryImage,
    });
    objForm.setValue("categoryImage", file.name);
  };

  const onSubmit = async (data: any) => {
    const result = { ...data, categoryImage: image.url };
    try {
      if (isEdit) {
        setIsLoading(true);
        const edit = await useUpdateCategory(result, ObjCategory?._id);
        setIsLoading(false);

        setOpen(false);
        setSuccess(true);
        setSuccessMessage(edit.message);
      } else {
        setIsLoading(true);
        const res = await useAddCategory(result);
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
        editTitle="Edit Category"
        title="Add Category"
        modelSize={"md"}
        isEdit={isEdit}
        open={open}
        setOpen={setOpen}
      >
        <form onSubmit={objForm.handleSubmit(onSubmit)}>
          <Grid container rowSpacing={3} columnGap={10}>
            <Grid item xs={12}>
              {/* <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                size="small"
                variant="outlined"
                {...objForm.register("categoryTitle")}
                error={objForm.formState.errors.categoryTitle ? true : false}
                helperText={
                  <span style={{ color: "red" }}>
                    {objForm.formState.errors.categoryTitle?.message}
                  </span>
                }
              /> */}
              <TextInput
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                size="small"
                {...objForm.register("categoryTitle")}
                error={objForm.formState.errors.categoryTitle ? true : false}
                helperText={
                  <span style={{ color: "red" }}>
                    {objForm.formState.errors.categoryTitle?.message}
                  </span>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <label htmlFor="change-cover">
                <TextField
                  id="change-cover"
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <Button
                  startIcon={<UploadTwoToneIcon />}
                  variant="contained"
                  component="span"
                >
                  Select Image
                </Button>
              </label>
              {objForm.formState.errors.categoryImage && !image.url && (
                <span
                  style={{ color: "red", marginLeft: "20px", fontSize: "12px" }}
                >
                  {objForm.formState.errors.categoryImage.message}
                </span>
              )}
              {image.url && (
                <Box
                  sx={{
                    paddingTop: "10px",
                  }}
                >
                  <Card
                    sx={{
                      maxWidth: 310,
                      maxHeight: 160,
                      padding: "5px",
                    }}
                  >
                    <img
                      src={image.url}
                      style={{
                        objectFit: "fill",
                        height: "150px",
                        width: "300px",
                        border: "1px solid gray",
                      }}
                    />
                  </Card>
                </Box>
              )}
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
