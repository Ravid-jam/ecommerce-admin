import CommonModel from "@/components/common/CommonModel";
import TextInput from "@/components/common/TextInput";
import {
  setIsLoading,
  setSuccess,
  setSuccessMessage,
  store,
} from "@/components/services/pulState/store";
import {
  useAddSubCategory,
  useCategoryList,
  useUpdateSubCategory,
} from "@/components/services/query/ApiHandlerQuery";
import { yupResolver } from "@hookform/resolvers/yup";
import SaveIcon from "@mui/icons-material/Save";
import UploadTwoToneIcon from "@mui/icons-material/UploadTwoTone";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";
import {
  default as ICategory,
  default as ISubCategory,
} from "../../types/category";

export interface IFormSubCategory {
  subCategoryTitle: string;
  subCategoryImage: string;
  categoryId: ICategory;
}

const schema = yup
  .object({
    subCategoryTitle: yup.string().required(),
    subCategoryImage: yup.string().required(),
    categoryId: yup.string().required(),
  })
  .required();

interface IAddUpdateCarouselProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ObjSubCategory?: ISubCategory;
  isEdit?: boolean;
  setIsEdit: (data: boolean) => void;
}

export default function AddUpdateSubCategory(props: IAddUpdateCarouselProps) {
  const { open, setOpen, ObjSubCategory, isEdit, setIsEdit } = props;

  const lstCategory = useCategoryList();
  const isLoading = store.useState((s) => s.isLoading);
  const [image, setImage] = React.useState<any>({
    url: ObjSubCategory?.subCategoryImage
      ? ObjSubCategory.subCategoryImage
      : "",
  });

  const objForm = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      subCategoryImage: ObjSubCategory?.subCategoryImage,
      subCategoryTitle: ObjSubCategory?.subCategoryTitle,
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
      url: base64 ? base64 : ObjSubCategory?.subCategoryImage,
    });
    objForm.setValue("subCategoryImage", file.name);
  };

  const onSubmit = async (data: ISubCategory) => {
    const result = {
      ...data,
      subCategoryImage: image.url,
    };
    try {
      if (isEdit) {
        setIsLoading(true);
        const edit = await useUpdateSubCategory(result, ObjSubCategory?._id);
        setIsLoading(false);
        setOpen(false);
        setSuccess(true);
        setSuccessMessage(edit.message);
      } else {
        setIsLoading(true);
        const res = await useAddSubCategory(result);
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
        editTitle="Edit SubCategory"
        title="Add SubCategory"
        modelSize={"md"}
        isEdit={isEdit}
        open={open}
        setOpen={setOpen}
      >
        <form onSubmit={objForm.handleSubmit(onSubmit)}>
          <Box>
            <Grid container rowGap={4} columnSpacing={5}>
              <Grid item xs={6}>
                <div>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Category"
                      {...objForm.register("categoryId")}
                      defaultValue={ObjSubCategory?.categoryId}
                      error={objForm.formState.errors.categoryId ? true : false}
                    >
                      {lstCategory &&
                        lstCategory?.data?.map(
                          (item: ICategory, index: number) => (
                            <MenuItem value={item._id} key={index}>
                              {item.categoryTitle}
                            </MenuItem>
                          )
                        )}
                    </Select>
                    <FormHelperText style={{ color: "red" }}>
                      {objForm.formState.errors?.categoryId?.message}
                    </FormHelperText>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div>
                  <TextInput
                    label="SubCategory Name"
                    type="text"
                    fullWidth
                    size="small"
                    variant="outlined"
                    {...objForm.register("subCategoryTitle")}
                    error={
                      objForm.formState.errors.subCategoryTitle ? true : false
                    }
                    helperText={
                      <span style={{ color: "red" }}>
                        {objForm.formState.errors.subCategoryTitle?.message}
                      </span>
                    }
                  />
                </div>
              </Grid>

              <Grid item xs={6}>
                <div>
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
                      Select SubCategory Image
                    </Button>
                  </label>

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
                </div>
                <div style={{ marginTop: "7px" }}>
                  {objForm.formState.errors.subCategoryImage && !image.url && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      {objForm.formState.errors.subCategoryImage.message}
                    </span>
                  )}
                </div>
              </Grid>
            </Grid>
          </Box>
          <DialogActions>
            <div
              style={{
                marginTop: "20px",
              }}
            >
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
            </div>
          </DialogActions>
        </form>
      </CommonModel>
    </div>
  );
}
