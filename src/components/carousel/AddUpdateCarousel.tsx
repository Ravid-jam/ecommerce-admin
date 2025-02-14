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
import {
  useAddCarousel,
  useUpdateCarousel,
} from "../services/query/ApiHandlerQuery";
import ICarousel from "../types/carousel";
import CarouselImage from "./Carouselmage";

export interface IFormCarousel {
  title: string;
  imageUrl: string;
}

const schema = yup
  .object({
    title: yup.string().required(),
    imageUrl: yup.string().required(),
  })
  .required();

interface IAddUpdateCarouselProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  objCarousel?: ICarousel;
  isEdit?: boolean;
}

export default function AddUpdateCarousel(props: IAddUpdateCarouselProps) {
  const { open, setOpen, objCarousel, isEdit } = props;
  const isLoading = store.useState((s) => s.isLoading);
  const [image, setImage] = React.useState<any>({
    url: objCarousel?.imageUrl ? objCarousel.imageUrl : "",
  });

  const objForm = useForm<IFormCarousel>({
    resolver: yupResolver(schema),
    defaultValues: {
      imageUrl: objCarousel?.imageUrl,
    },
  });

  const onSubmit = async (data: any) => {
    const result = { ...data, imageUrl: image.url };
    try {
      if (isEdit) {
        setIsLoading(true);
        const edit = await useUpdateCarousel(result, objCarousel?._id);
        setIsLoading(false);
        setOpen(false);
        setSuccess(true);
        setSuccessMessage(edit.message);
      } else {
        setIsLoading(true);
        const res = await useAddCarousel(result);
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
        editTitle="Edit Carousel"
        modelSize="md"
        isEdit={isEdit}
        open={open}
        setOpen={setOpen}
        title="Add Carousel"
      >
        <form onSubmit={objForm.handleSubmit(onSubmit)}>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <TextInput
                label="First Name"
                type="text"
                size="small"
                fullWidth
                variant="outlined"
                {...objForm.register("title")}
                error={objForm.formState.errors.title ? true : false}
                defaultValue={isEdit ? objCarousel?.title : null}
                helperText={objForm.formState.errors.title?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <CarouselImage
                base64={objCarousel?.imageUrl}
                objForm={objForm}
                isEdit={isEdit}
                setImage={setImage}
                image={image}
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
