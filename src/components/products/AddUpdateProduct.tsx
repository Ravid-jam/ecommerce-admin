import { yupResolver } from "@hookform/resolvers/yup";
import { Card, CardActions } from "@material-ui/core";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
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
import styled from "styled-components";
import Swal from "sweetalert2";
import * as yup from "yup";
import CommonModel from "../common/CommonModel";
import ApiServices from "../services/Apiservices";
import {
  setIsLoading,
  setSuccess,
  setSuccessMessage,
  store,
} from "../services/pulState/store";
import {
  useAddProduct,
  useCategoryList,
  useSubCategoryList,
  useUpdateProduct,
} from "../services/query/ApiHandlerQuery";
import {
  default as ICategory,
  default as ISubCategory,
} from "../types/category";
import IProducts from "../types/products";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
export interface IFormProduct {
  title: string;
  slug: string;
  category: string;
  subCategory: string;
  description: string;
  color: any[];
  size: string[];
  price: number;
  images: any[];
}

const schema = yup
  .object({
    title: yup.string().required(),
    slug: yup.string().required(),
    category: yup.string().required(),
    subCategory: yup.string().required(),
    description: yup.string().required(),
    color: yup.array().min(1, "At least one color is required").required(),
    size: yup.array().min(1, "At least one size is required").required(),
    price: yup.number().required("price is required"),
    images: yup.array().min(1, "At least one image is required").required(),
  })
  .required();

interface IAddUpdateCarouselProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ObjProduct?: IProducts;
  isEdit?: boolean;
  setIsEdit: (data: boolean) => void;
}

export default function AddUpdateProduct(props: IAddUpdateCarouselProps) {
  const { open, setOpen, ObjProduct, isEdit, setIsEdit } = props;
  const [singleFile, setSingleFile] = React.useState<any>([]);

  const isLoading = store.useState((s) => s.isLoading);
  const lstCategory = useCategoryList();
  const lstSubCategory = useSubCategoryList();
  const [selectColor, setSelectColor] = React.useState<any>("");
  const [lstColor, setLstColor] = React.useState<any>("");
  const [lstsizes, setLstSizes] = React.useState<any>("");
  const [selectSizes, setSelectSizes] = React.useState<any>("");
  const [images, setImages] = React.useState<any>([]);
  const [state, setState] = React.useState<any>({
    file: null,
    base64URL: "",
  });

  const objForm = useForm<IFormProduct>({
    resolver: yupResolver(schema),
  });

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      const newImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const base64 = await getBase64(file);
          return { base64 };
        })
      );

      setImages((prev: any) => {
        const updatedImages = [...prev, ...newImages];
        objForm.setValue("images", updatedImages); // Update form value
        objForm.clearErrors("images"); // Clear validation errors
        return updatedImages;
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev: any) => {
      const updatedImages = prev.filter((_: any, i: number) => i !== index);
      objForm.setValue("images", updatedImages); // Update form value
      return updatedImages;
    });
  };
  const getBase64 = (file: any): Promise<string> => {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
    });
  };
  React.useEffect(() => {
    const loadData = async () => {
      const res = await ApiServices.getLstColor();
      const sizes = await ApiServices.getLstSize();
      setLstColor(res);

      setLstSizes(sizes);
    };
    loadData();
  }, []);

  const onSubmit = async (data: any) => {
    const result = {
      ...data,
      images: images,
    };
    try {
      if (isEdit) {
        setIsLoading(true);
        const edit = await useUpdateProduct(result, ObjProduct?._id);
        setIsLoading(false);
        setOpen(false);
        setSuccess(true);
        setSuccessMessage(edit.message);
      } else {
        setIsLoading(true);
        const res = await useAddProduct(result);
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

  // React.useEffect(() => {
  //   objForm.reset({
  //     size: selectSizes,
  //   });
  // }, [selectSizes]);
  return (
    <div>
      <CommonModel
        editTitle="Edit Product"
        title="Add Product"
        modelSize={"md"}
        isEdit={isEdit}
        open={open}
        setOpen={setOpen}
      >
        <form onSubmit={objForm.handleSubmit(onSubmit)}>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <TextField
                label="Title"
                fullWidth
                size="small"
                variant="outlined"
                {...objForm.register("title")}
                error={!!objForm.formState.errors.title}
                helperText={objForm.formState.errors.title?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Slug"
                type="text"
                size="small"
                fullWidth
                variant="outlined"
                {...objForm.register("slug")}
                error={objForm.formState.errors.slug ? true : false}
                helperText={objForm.formState.errors.slug?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Category"
                  {...objForm.register("category")}
                  multiline
                  defaultValue={ObjProduct?.category}
                  error={objForm.formState.errors.category ? true : false}
                >
                  {lstCategory.data &&
                    lstCategory.data.map((item: ICategory, index: number) => (
                      <MenuItem value={item._id} key={index}>
                        {item.categoryTitle}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText style={{ color: "red" }}>
                  {objForm.formState.errors?.category?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Sub Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="SubCategory"
                  {...objForm.register("subCategory")}
                  multiline
                  defaultValue={ObjProduct?.subCategory}
                  error={objForm.formState.errors.subCategory ? true : false}
                >
                  {lstSubCategory.data &&
                    lstSubCategory.data.map(
                      (item: ISubCategory, index: number) => (
                        <MenuItem value={item._id} key={index}>
                          {item.subCategoryTitle}
                        </MenuItem>
                      )
                    )}
                </Select>
                <FormHelperText style={{ color: "red" }}>
                  {objForm.formState.errors?.subCategory?.message}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                multiline
                minRows={5}
                {...objForm.register("description")}
                defaultValue={ObjProduct?.description}
                error={objForm.formState.errors.description ? true : false}
                helperText={objForm.formState.errors.description?.message}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                size="small"
                multiple
                id="tags-outlined-color"
                options={lstColor || []}
                getOptionLabel={(option: any) => option.colorName || ""}
                filterSelectedOptions
                value={Array.isArray(selectColor) ? selectColor : []}
                onChange={(_, data) => {
                  setSelectColor(data || []);
                  objForm.setValue("color", data || []);
                  objForm.clearErrors("color");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Color"
                    placeholder="Select Color"
                    error={!!objForm.formState.errors.color}
                    helperText={objForm.formState.errors.color?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                size="small"
                multiple
                id="tags-outlined-size"
                options={lstsizes || []}
                getOptionLabel={(option: any) => option.sizeName || ""}
                filterSelectedOptions
                value={Array.isArray(selectSizes) ? selectSizes : []}
                onChange={(_, data) => {
                  setSelectSizes(data || []);
                  objForm.setValue("size", data || []);
                  objForm.clearErrors("size");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Size"
                    placeholder="Select Size"
                    error={!!objForm.formState.errors.size}
                    helperText={objForm.formState.errors.size?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                size="small"
                id="name"
                label="Price"
                type="number"
                fullWidth
                variant="outlined"
                {...objForm.register("price")}
                error={objForm.formState.errors.price ? true : false}
                defaultValue={ObjProduct?.price}
                helperText={
                  objForm.formState.errors.price && (
                    <span style={{ color: "red" }}>
                      {"number is required dield"}
                    </span>
                  )
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                select Multiple Image
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileInputChange}
                  multiple
                />
              </Button>
              {objForm.formState.errors.images && (
                <FormHelperText style={{ color: "red" }}>
                  {objForm.formState.errors.images.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid
              xs={12}
              item
              style={{
                display: "flex",
                flexDirection: "row",
                cursor: "pointer",
              }}
            >
              {images &&
                images?.map((img: any, index: number) => (
                  <Grid item xs={3} key={index}>
                    <Card style={{ maxWidth: "160px", padding: "5px" }}>
                      <CardActions
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "end",
                        }}
                      >
                        <CancelRoundedIcon
                          onClick={() => removeImage(index)}
                          color="error"
                        />
                      </CardActions>
                      <img src={img.base64} height={100} width={"100%"} />
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <LoadingButton
              color="secondary"
              type="submit"
              loading={false}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              {isEdit ? "Edit " : "Save"}
            </LoadingButton>
          </DialogActions>
        </form>
      </CommonModel>
    </div>
  );
}
