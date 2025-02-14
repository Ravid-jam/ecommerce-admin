import { yupResolver } from "@hookform/resolvers/yup";
import { Card, CardActions } from "@material-ui/core";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import CommonModel from "../common/CommonModel";

import SelectField from "../common/SelectField";
import TextInput from "../common/TextInput";
import ApiServices from "../services/Apiservices";
import {
  useAddProduct,
  useCategoryList,
  useSubCategoryList,
  useUpdateProduct,
} from "../services/query/ApiHandlerQuery";
import { default as ICategory } from "../types/category";
import IProducts from "../types/products";
import dynamic from "next/dynamic";
import { Add, Delete } from "@material-ui/icons";
import { IColor, ISize } from "../types/colorAndSize";
import {
  setIsLoading,
  setSuccess,
  setSuccessMessage,
  store,
} from "../services/pulState/store";
import Swal from "sweetalert2";
const RichTextEditor = dynamic(() => import("react-quill"), { ssr: false });

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
  brandName: yup.string().optional(),
  returnPolicy: yup.string().optional(),
  brandDetails: yup.string().optional(),
  shipping: yup.string().optional(),
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
  images: yup.array().required("images must be provided"),

  stock: yup.number().min(0, "Stock cannot be less than 0"),
  deliveryDetail: yup.string().required("deliveryDetail is required"),
});

interface IAddUpdateCarouselProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  ObjProduct?: any;
  isEdit?: boolean;
}

export default function AddUpdateProduct(props: IAddUpdateCarouselProps) {
  const { open, setOpen, ObjProduct, isEdit } = props;
  const isLoading = store.useState((s) => s.isLoading);
  const lstCategory = useCategoryList();
  const lstSubCategory = useSubCategoryList();
  const [lstColor, setLstColor] = React.useState<any>([]);
  const [lstsizes, setLstSizes] = React.useState<any>("");
  const [images, setImages] = React.useState<any>(
    ObjProduct?.images ? ObjProduct?.images : []
  );
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

      const updatedImages = [...images, ...newImages];

      setImages(updatedImages);
      objForm.setValue("images", updatedImages);
      objForm.clearErrors("images");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev: any) => {
      const updatedImages = prev.filter((_: any, i: number) => i !== index);
      objForm.setValue("images", updatedImages);
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
  const { control } = objForm;
  const { fields, append, remove } = useFieldArray({ control, name: "size" });

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
    if (isEdit) {
      try {
        setIsLoading(true);
        const edit = await useUpdateProduct(data, ObjProduct?._id);
        console.log(edit);
        if (edit.status === true) {
          setIsLoading(false);
          setOpen(false);
          setSuccess(true);
          setSuccessMessage(edit.message);
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
    } else {
      try {
        setIsLoading(true);
        const res = await useAddProduct(data);
        setIsLoading(false);
        setOpen(false);
        setSuccess(true);
        setSuccessMessage(res.message);
      } catch (error: any) {
        setOpen(false);
        setIsLoading(false);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message}`,
        });
      }
    }
  };

  const categoryValue = objForm.watch("category");
  const selectCategory = lstCategory?.data?.find(
    (c: ICategory) => c?._id === categoryValue
  );
  React.useEffect(() => {
    if (ObjProduct) {
      objForm.reset({
        title: ObjProduct?.title || "",
        slug: ObjProduct?.slug || "",
        brandName: ObjProduct?.brandName || "",
        returnPolicy: ObjProduct?.returnPolicy || "",
        brandDetails: ObjProduct?.brandDetails || "",
        shipping: ObjProduct?.shipping || "",
        productDetail: ObjProduct?.productDetail || "",
        discount: ObjProduct?.discount || 0,
        deliveryDetail: ObjProduct?.deliveryDetail || "",
        price: ObjProduct?.price || 0,
        size: ObjProduct?.size || [],
        images: ObjProduct?.images || [],
      });
    }
  }, [ObjProduct, objForm]);

  return (
    <div>
      <CommonModel
        editTitle="Edit Product"
        title="Add Product"
        isEdit={isEdit}
        modelSize={"xl"}
        open={open}
        setOpen={setOpen}
      >
        <form onSubmit={objForm.handleSubmit(onSubmit)}>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={4}>
              <TextField
                label="Title"
                fullWidth
                size="small"
                variant="outlined"
                {...objForm.register("title")}
                error={!!objForm.formState.errors.title}
                helperText={objForm?.formState?.errors?.title?.message || ""}
                onChange={(e) => {
                  objForm.setValue("title", e.target.value, {
                    shouldValidate: true,
                  });

                  // Automatically generate the slug from the title
                  const formattedSlug = e.target.value
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-") // Replace spaces with a single "-"
                    .replace(/[^a-z0-9-]/g, "") // Remove special characters except "-"
                    .replace(/-+/g, "-"); // Ensure only single "-"

                  objForm.setValue("slug", formattedSlug, {
                    shouldValidate: true,
                  });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Slug"
                type="text"
                size="small"
                disabled
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                {...objForm.register("slug")}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="category"
                control={objForm.control}
                defaultValue={ObjProduct?.category?._id || ""}
                render={({ field }) => (
                  <SelectField
                    {...field}
                    size="small"
                    label="Category"
                    id="category-select"
                    options={lstCategory?.data?.map((item: ICategory) => ({
                      value: item._id,
                      label: item.name,
                    }))}
                    error={!!objForm.formState.errors.category}
                    helperText={objForm.formState.errors?.category?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <Controller
                name="subcategory"
                control={objForm.control}
                defaultValue={ObjProduct?.subcategory?._id || ""}
                render={({ field }) => (
                  <SelectField
                    {...field}
                    label="Sub Category"
                    id="subcategory-select"
                    options={lstSubCategory?.data
                      ?.filter((i: any) => i.category._id === categoryValue)
                      .map((item: any) => ({
                        value: item._id,
                        label: item.name,
                      }))}
                    error={objForm.formState.errors.subcategory ? true : false}
                    helperText={objForm.formState.errors?.subcategory?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <TextInput
                id="name"
                label="Brand Name"
                type="text"
                fullWidth
                variant="outlined"
                {...objForm.register("brandName")}
                error={objForm.formState.errors.brandName ? true : false}
                helperText={
                  objForm.formState.errors.brandName
                    ? objForm.formState.errors.brandName.message
                    : ""
                }
              />
            </Grid>

            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
            <Grid item xs={4}>
              <Controller
                name="color"
                control={objForm.control}
                defaultValue={ObjProduct?.color._id || ""}
                render={({ field }) => (
                  <SelectField
                    size="medium"
                    label="Color"
                    id="Color-Name-select"
                    options={lstColor?.map((item: IColor) => ({
                      value: item._id,
                      label: item.colorName,
                    }))}
                    {...field}
                    onChange={(e: any) => {
                      field.onChange(e.target.value);
                    }}
                    error={!!objForm?.formState?.errors.color}
                    helperText={objForm.formState?.errors.color?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            {selectCategory?.name === "Clothes" && (
              <Grid item xs={12} md={12}>
                <Typography variant="h6" style={{ marginBottom: "20px" }}>
                  Product Sizes
                </Typography>
                {fields.map((item, index) => (
                  <Grid
                    container
                    columnSpacing={{ xs: 1, sm: 2, md: 2 }}
                    sx={{ marginBottom: "25px" }}
                    key={item.id}
                  >
                    <Grid item xs={4}>
                      <Controller
                        name={`size.${index}.name`}
                        control={objForm.control}
                        defaultValue={ObjProduct?.size._id || ""}
                        render={({ field }) => (
                          <SelectField
                            size="medium"
                            label="Size Name"
                            id={`Size-Name-select-${index}`}
                            options={(Array.isArray(lstsizes)
                              ? lstsizes
                              : []
                            ).map((size: ISize) => ({
                              value: size._id,
                              label: size.sizeName,
                            }))}
                            {...field}
                            error={
                              !!objForm.formState.errors.size?.[index]?.name
                            }
                            helperText={
                              objForm.formState.errors.size?.[index]?.name
                                ?.message
                            }
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        {...objForm.register(`size.${index}.availableStock`)}
                        label="Stock"
                        type="number"
                        error={
                          !!objForm.formState.errors.size?.[index]
                            ?.availableStock
                        }
                        helperText={
                          objForm.formState.errors.size?.[index]?.availableStock
                            ?.message
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={() => remove(index)} color="error">
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <div>
                  <Button
                    startIcon={<Add />}
                    onClick={() => append({ name: "", availableStock: 0 })}
                    variant="outlined"
                    style={{ marginTop: "5px" }}
                  >
                    Add Size
                  </Button>
                </div>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h6" style={{ marginBottom: "20px" }}>
                Product Image
              </Typography>
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
                      <img
                        src={img.url || img.base64}
                        height={100}
                        width={"100%"}
                      />
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
                  Product Details
                </Typography>
                <Controller
                  name="productDetail"
                  control={objForm.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RichTextEditor
                      style={{
                        height: "200px",
                      }}
                      {...field}
                    />
                  )}
                />
              </div>
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
                <Controller
                  name="brandDetails"
                  control={objForm.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RichTextEditor
                      style={{
                        height: "200px",
                      }}
                      {...field}
                    />
                  )}
                />
              </div>
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
                  Return Policy
                </Typography>
                <Controller
                  name="returnPolicy"
                  control={objForm.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RichTextEditor
                      style={{
                        height: "200px",
                      }}
                      {...field}
                    />
                  )}
                />
              </div>
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
                  Shipping
                </Typography>
                <Controller
                  name="shipping"
                  control={objForm.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RichTextEditor
                      style={{
                        height: "200px",
                      }}
                      {...field}
                    />
                  )}
                />
              </div>
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
                  Delivery Detail
                </Typography>
                <Controller
                  name="deliveryDetail"
                  control={objForm.control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <RichTextEditor
                      style={{
                        height: "200px",
                      }}
                      {...field}
                    />
                  )}
                />
              </div>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <LoadingButton
              color="primary"
              type="submit"
              loading={isLoading}
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
