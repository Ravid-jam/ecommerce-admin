import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthServices from "./services/AuthServices";

export default function AuthGard(props: { children?: any }) {
  const [userInfo, setUserInfo] = useState();
  const router = useRouter();
  useEffect(() => {
    const isLogin = AuthServices.getUser();
    setUserInfo(isLogin);
    if (!isLogin) {
      router.push("/login");
    }
  }, []);

  return <div>{props.children}</div>;
}
