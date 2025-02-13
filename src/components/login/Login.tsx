import { yupResolver } from "@hookform/resolvers/yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";
import TextInput from "../common/TextInput";
import AuthServices from "../services/AuthServices";
import { setUserData } from "../services/pulState/store";
const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

type loginData = yup.InferType<typeof schema>;

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: loginData) => {
    try {
      setIsLoading(true);
      let res = await fetch(
        "https://ecommerce-rest-api-y2lw.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (res.status === 400) {
        alert("Invalid login credentials");
        setIsLoading(false);
        return router.push("/login");
      }
      setUserData(result.data);
      setIsLoading(false);
      AuthServices.setToken(result.token);
      AuthServices.setUser(result.data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Login Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      router.push("/dashboard");
    } catch (errors: any) {
      console.log(errors);
    }
  };
  useEffect(() => {
    const isLogin = AuthServices.getUser();
    if (isLogin) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Grid container rowGap={1}>
              <Grid item xs={12}>
                <div>
                  <TextInput
                    margin="normal"
                    fullWidth
                    id="email"
                    size="small"
                    label="Email Address"
                    {...register("email")}
                    autoFocus
                    error={errors.email ? true : false}
                    helperText={errors.email?.message}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <div>
                  <TextInput
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    size="small"
                    autoComplete="current-password"
                    {...register("password")}
                    error={errors.password ? true : false}
                    helperText={errors.password?.message}
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  color="primary"
                  type="submit"
                  loading={isLoading ? true : false}
                  loadingPosition="start"
                  startIcon={<LoginIcon />}
                  variant="contained"
                  fullWidth
                >
                  Sign In
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </form>
    </div>
  );
}
