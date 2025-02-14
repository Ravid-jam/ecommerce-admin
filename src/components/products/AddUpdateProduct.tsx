import { yupResolver } from "@hookform/resolvers/yup";
import { Card, CardActions } from "@material-ui/core";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, FormHelperText, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import CommonModel from "../common/CommonModel";
import RichTextEditor from "../common/RichTextEditor";
import SelectField from "../common/SelectField";
import TextInput from "../common/TextInput";
import ApiServices from "../services/Apiservices";
import {
  useCategoryList,
  useSubCategoryList,
} from "../services/query/ApiHandlerQuery";
import { default as ICategory } from "../types/category";
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

const productSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  slug: yup.string().required("Slug is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be greater than 0"),
  discount: yup
    .number()
    .min(0, "Discount must be a positive number")
    .max(100, "Discount cannot be more than 100"),

  category: yup.string().required("Category is required"),
  subcategory: yup.string().required("Subcategory is required"),
  brandName: yup.string().required("Brand Name is required"),
  returnPolicy: yup.string().required("Return Policy is required"),
  brandDetails: yup.string().required("Brand Details is required"),
  shipping: yup.string().required("Shipping details are required"),
  productDetail: yup.string().required("Product Details are required"),
  color: yup.string(),
  offers: yup.array().of(yup.string()),
  size: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Size name is required"),
      availableStock: yup
        .number()
        .required("Available stock is required")
        .min(0, "Available stock must be a positive number"),
    })
  ),
  images: yup
    .array()
    .min(1, "At least one image is required")
    .required("images must be provided"),

  stock: yup.number().min(0, "Stock cannot be less than 0"),
});

interface IAddUpdateCarouselProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ObjProduct?: IProducts;
  isEdit?: boolean;
  setIsEdit: (data: boolean) => void;
}

export default function AddUpdateProduct(props: IAddUpdateCarouselProps) {
  const { open, setOpen, ObjProduct, isEdit, setIsEdit } = props;

  const lstCategory = useCategoryList();
  const lstSubCategory = useSubCategoryList();
  const [selectColor, setSelectColor] = React.useState<any>("");
  const [lstColor, setLstColor] = React.useState<any>("");
  const [lstsizes, setLstSizes] = React.useState<any>("");
  const [selectSizes, setSelectSizes] = React.useState<any>("");
  const [images, setImages] = React.useState<any>([]);

  const objForm = useForm({
    resolver: yupResolver(productSchema),
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
        objForm.setValue("images", updatedImages);
        objForm.clearErrors("images");
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
    // try {
    //   if (isEdit) {
    //     setIsLoading(true);
    //     const edit = await useUpdateProduct(data, ObjProduct?._id);
    //     setIsLoading(false);
    //     setOpen(false);
    //     setSuccess(true);
    //     setSuccessMessage(edit.message);
    //   } else {
    //     setIsLoading(true);
    //     const res = await useAddProduct(data);
    //     setIsLoading(false);
    //     setOpen(false);
    //     setSuccess(true);
    //     setSuccessMessage(res.message);
    //   }
    // } catch (error: any) {
    //   setOpen(false);
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: `${error.message}`,
    //   });
    // }
  };

  const categoryValue = objForm.watch("category");
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
                helperText={objForm?.formState?.errors?.title?.message || ""}
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
                helperText={objForm.formState.errors.slug?.message || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectField
                label="Category"
                id="category-select"
                options={lstCategory?.data?.map((item: ICategory) => ({
                  value: item._id,
                  label: item.name,
                }))}
                {...objForm.register("category")}
                error={objForm.formState.errors.category ? true : false}
                helperText={objForm.formState.errors?.category?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectField
                label="Sub Category"
                id="category-select"
                disabled={categoryValue ? false : true}
                options={lstSubCategory?.data
                  ?.filter((i: any) => i.category._id === categoryValue)
                  .map((item: any) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                {...objForm.register("subcategory")}
                error={objForm.formState.errors.subcategory ? true : false}
                helperText={objForm.formState.errors?.subcategory?.message}
              />
            </Grid>

            <Grid item xs={12} marginBottom={7}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                }}
              >
                <Typography variant="inherit" color={"black"}>
                  Product Details
                </Typography>
                {/* <Controller
                  name="brandDetails"
                  control={objForm.control}
                  // defaultValue={objAbout?.section1 ? objAbout?.section1 : ""}
                  rules={{ required: true }} // Apply validation rules
                  render={({ field }) => <RichTextEditor field={field} />}
                /> */}
              </div>
            </Grid>
            <Grid item xs={6}>
              <TextInput
                id="name"
                label="Brand Name"
                type="text"
                fullWidth
                variant="outlined"
                {...objForm.register("brandName")}
                error={objForm.formState.errors.brandName ? true : false}
                // defaultValue={ObjProduct?.brandName}
                helperText={
                  objForm.formState.errors.brandName
                    ? objForm.formState.errors.brandName.message
                    : ""
                }
              />
            </Grid>

            <Grid item xs={6}>
              <TextInput
                id="name"
                label="Price"
                type="number"
                fullWidth
                variant="outlined"
                {...objForm.register("price")}
                error={objForm.formState.errors.price ? true : false}
                defaultValue={ObjProduct?.price}
                helperText={
                  objForm.formState.errors.price
                    ? objForm.formState.errors.price.message
                    : ""
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextInput
                label="Discount"
                fullWidth
                variant="outlined"
                type="number"
                {...objForm.register("discount")}
                error={!!objForm.formState.errors.discount}
                helperText={objForm.formState.errors.discount?.message}
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
            <Grid item xs={6}>
              <Autocomplete
                size="medium"
                multiple
                id="tags-outlined-color"
                options={lstColor || []}
                getOptionLabel={(option: any) => option.colorName || ""}
                filterSelectedOptions
                value={Array.isArray(selectColor) ? selectColor : []}
                onChange={(_, data: any) => {
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
                size="medium"
                multiple
                id="tags-outlined-size"
                options={lstsizes || []}
                getOptionLabel={(option: any) => option.sizeName || ""}
                filterSelectedOptions
                value={Array.isArray(selectSizes) ? selectSizes : []}
                onChange={(_, data: any) => {
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
            <Grid item xs={12} marginBottom={7}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                }}
              >
                <Typography variant="inherit" color={"black"}>
                  Brand Details
                </Typography>
                {/* <Controller
                  name="brandDetails"
                  control={objForm.control}
                  // defaultValue={objAbout?.section1 ? objAbout?.section1 : ""}
                  rules={{ required: true }}
                  render={({ field }) => <RichTextEditor field={field} />}
                /> */}
              </div>
            </Grid>

            {/* <Grid item xs={6}>
              <Autocomplete
                size="small"
                multiple
                id="tags-outlined-color"
                options={lstColor || []}
                getOptionLabel={(option: any) => option.colorName || ""}
                filterSelectedOptions
                value={Array.isArray(selectColor) ? selectColor : []}
                onChange={(_, data: any) => {
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
            </Grid> */}
          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <LoadingButton
              color="primary"
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
