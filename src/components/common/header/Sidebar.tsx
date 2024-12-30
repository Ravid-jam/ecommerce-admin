import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonIcon from "@mui/icons-material/Person";
import Person4Icon from "@mui/icons-material/Person4";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { CSSObject, styled, Theme, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface ISidebar {
  open: boolean;
}

const sidebar = [
  {
    Name: "Dashboard",
    route: "/dashboard",
    icon: <DashboardIcon />,
  },

  {
    Name: "Category",
    route: "/category",
    icon: <MeetingRoomIcon />,
  },
  {
    Name: "Sub Category",
    route: "/subCategory",
    icon: <MeetingRoomIcon />,
  },
  {
    Name: "Carousel",
    route: "/carousel",
    icon: <PersonIcon />,
  },
  {
    Name: "Color",
    route: "/colors",
    icon: <MeetingRoomIcon />,
  },
  {
    Name: "Size",
    route: "/sizes",
    icon: <MeetingRoomIcon />,
  },
  {
    Name: "Products",
    route: "/products",
    icon: <MeetingRoomIcon />,
  },
  {
    Name: "Admin",
    route: "/admin",
    icon: <Person4Icon />,
  },
];
export default function Sidebar(props: ISidebar) {
  const theme = useTheme();
  const { open } = props;
  const router = useRouter();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {sidebar?.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                display: "block",
                textDecoration: "none",
              }}
              onClick={() => {
                router.push(`${item.route}`);
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: 48,
                  cursor: "pointer",
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor:
                    router.pathname == item.route ? "#095192" : "white",
                  color: router.pathname == item.route ? "white" : "gray",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    display: "flex",
                    alignItems: "center",
                    color: router.pathname == item.route ? "white" : "gray",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.Name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
