import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ICommonModelProps {
  open: boolean;
  title: string;
  editTitle: string;
  modelSize: any;
  children: any;
  isEdit: boolean | undefined;
  setOpen: (data: boolean) => void;
}
export default function CommonModel(props: ICommonModelProps) {
  const { open, children, editTitle, title, isEdit, modelSize, setOpen } =
    props;
  const theme: any = useTheme();
  const size = modelSize;
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={size}
      >
        <DialogTitle
          style={{
            backgroundColor: "#095192",
            color: "white",
            padding: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" gutterBottom style={{ marginBottom: 0 }}>
                {isEdit ? editTitle : title}
              </Typography>
            </div>
            <div>
              <IconButton
                aria-label="delete"
                size="large"
                style={{
                  padding: "5px",
                  border: "1px solid gray",
                  backgroundColor: "white",
                }}
                onClick={() => setOpen(false)}
              >
                <CloseOutlinedIcon style={{ color: "black" }} />
              </IconButton>
            </div>
          </div>
        </DialogTitle>

        <DialogContent>
          <div
            style={{
              paddingTop: "30px",
            }}
          >
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
