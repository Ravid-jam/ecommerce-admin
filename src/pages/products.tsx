import AuthGard from "@/components/AuthGard";
import MainLayout from "@/components/common/header/MainLayout";
import Products from "@/components/products/Products";
import React from "react";

export default function products() {
  return (
    <div>
      <AuthGard>
        <MainLayout>
          <Products />
        </MainLayout>
      </AuthGard>
    </div>
  );
}
