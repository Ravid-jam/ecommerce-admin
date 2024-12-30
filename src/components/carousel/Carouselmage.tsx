import UploadTwoToneIcon from "@mui/icons-material/UploadTwoTone";
import { Box, Button, Card, TextField } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { IFormCarousel } from "./AddUpdateCarousel";
interface ICarouselImageProps {
  objForm: UseFormReturn<IFormCarousel, any, undefined>;
  base64: any;
  isEdit: boolean | undefined;
  setImage: React.Dispatch<any>;
  image: any;
}

export default function CarouselImage(props: ICarouselImageProps) {
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
    props.setImage({
      ...props.image,
      url: base64 ? base64 : props.base64,
    });
    props.objForm.setValue("imageUrl", file.name);
  };

  return (
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
          Select Image
        </Button>
      </label>
      {props.objForm.formState.errors.imageUrl && !props.image.url && (
        <span style={{ color: "red", marginLeft: "3px", marginTop: "" }}>
          {props.objForm.formState.errors.imageUrl.message}
        </span>
      )}
      {props.image.url && (
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
              src={props.image.url}
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
  );
}
