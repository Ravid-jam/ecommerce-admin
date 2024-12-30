import AuthGard from "@/components/AuthGard";
import MainLayout from "@/components/common/header/MainLayout";
import Size from "@/components/size/Size";
import React from "react";

export default function sizes() {
  return (
    <div>
      <AuthGard>
        <MainLayout>
          <Size />
        </MainLayout>
      </AuthGard>
    </div>
  );
}
