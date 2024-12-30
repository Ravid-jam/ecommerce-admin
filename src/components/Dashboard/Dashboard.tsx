import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  useCarouselList,
  useCategoryList,
  useSubCategoryList,
} from "../services/query/ApiHandlerQuery";

export default function Dashboard() {
  const router = useRouter();
  const listCategory = useCategoryList();
  const listSubCategory = useSubCategoryList();
  const listCarousel = useCarouselList();

  const DashboardCard = [
    {
      Name: "Category",
      Icon: <CategoryIcon style={{ height: "25px", width: "25px" }} />,
      Route: "/category",
      totalItem: listCategory.data?.length,
    },
    {
      Name: "Sub Category",
      Icon: (
        <ShoppingCartCheckoutIcon style={{ height: "25px", width: "25px" }} />
      ),
      Route: "/subCategory",
      totalItem: listSubCategory.data?.length,
    },
    {
      Name: "Carousel",
      Icon: (
        <ShoppingCartCheckoutIcon style={{ height: "25px", width: "25px" }} />
      ),
      Route: "/carousel",
      totalItem: listCarousel.data?.length,
    },
    {
      Name: "Products",
      Icon: (
        <ShoppingCartCheckoutIcon style={{ height: "25px", width: "25px" }} />
      ),
      Route: "/products",
      totalItem: listCategory.data?.length,
    },
  ];
  return (
    <div>
      <Grid
        container
        spacing={{ xs: 2, md: 2 }}
        columns={{ xs: 1, sm: 8, md: 12 }}
      >
        {DashboardCard.map((item: any, index: number) => (
          <Grid item xs={2} sm={3} md={3} key={index}>
            <Card
              sx={{ maxWidth: 350 }}
              style={{ cursor: "pointer", backgroundColor: "#095192" }}
              onClick={() => {
                router.push(`${item.Route}`);
              }}
            >
              <CardContent>
                <IconButton sx={{ color: "white" }}>{item.Icon}</IconButton>
                <Typography variant="h5" color="white" fontWeight={600}>
                  {item.Name}
                </Typography>
                <Typography variant="h4" color="white">
                  {item.totalItem}
                </Typography>
              </CardContent>
              <CardActions></CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
