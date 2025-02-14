import CommonModel from "@/components/common/CommonModel";
import SelectField from "@/components/common/SelectField";
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
import { Box, Card } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";
import {
  default as ICategory,
  default as ISubCategory,
} from "../types/category";

export interface IFormSubCategory {
  name: string;
  status: string;
  category: ICategory;
}

const data = [
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "INACTIVE", label: "INACTIVE" },
];
const schema = yup
  .object({
    name: yup.string().required(),
    status: yup.string().required(),
    category: yup.string().required(),
    image: yup.string().required(),
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
    url: ObjSubCategory?.image ? ObjSubCategory?.image : "",
  });

  const objForm = useForm({
    resolver: yupResolver(schema),
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
      url: base64 ? base64 : ObjSubCategory?.image,
    });
    objForm.setValue("image", file.name);
  };

  const onSubmit = async (data: any) => {
    const result = {
      ...data,
      image: image.url,
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
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
      });
    }
  };

  React.useEffect(() => {
    objForm.reset({
      name: ObjSubCategory?.name || "",
      status: ObjSubCategory?.status || "",
      image: ObjSubCategory?.image.id || "",
    });
  }, [ObjSubCategory]);
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
          <Grid
            container
            spacing={2}
            rowSpacing={3}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <div
                style={{
                  height: "20%",
                }}
              >
                <SelectField
                  label="Category"
                  {...objForm.register("category")}
                  options={lstCategory?.data?.map((item: ICategory) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  defaultValue={ObjSubCategory?.category._id}
                  error={objForm.formState.errors.name ? true : false}
                  helperText={objForm.formState.errors?.name?.message}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <TextInput
                label="SubCategory Name"
                type="text"
                fullWidth
                size="small"
                variant="outlined"
                {...objForm.register("name")}
                error={objForm.formState.errors.name ? true : false}
                helperText={objForm.formState.errors.name?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectField
                options={data}
                label="Status"
                defaultValue={ObjSubCategory?.status || ""}
                {...objForm.register("status")}
                error={objForm.formState.errors.status ? true : false}
                helperText={objForm.formState.errors.status?.message}
              />
            </Grid>

            <Grid item xs={12}>
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
                        src={image?.url?.url || image.url}
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
                {objForm.formState.errors.image && !image.url && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {objForm.formState.errors.image.message}
                  </span>
                )}
              </div>
            </Grid>
          </Grid>
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
