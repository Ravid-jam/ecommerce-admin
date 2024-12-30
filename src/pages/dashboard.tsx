import AuthGard from "@/components/AuthGard";
import Dashboard from "@/components/Dashboard/Dashboard";
import MainLayout from "@/components/common/header/MainLayout";
import Login from "@/components/login/Login";
import React from "react";

export default function dashboard() {
  return (
    <div>
      <AuthGard>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </AuthGard>
    </div>
  );
}
