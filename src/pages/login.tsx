import AuthGard from "@/components/AuthGard";
import Login from "@/components/login/Login";

export default function login() {
  return (
    <div>
      <AuthGard>
        <Login />
      </AuthGard>
    </div>
  );
}
