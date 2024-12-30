import AuthGard from "@/components/AuthGard";
import SubCategory from "@/components/category/subCategory/SubCategory";
import MainLayout from "@/components/common/header/MainLayout";
import React from "react";

export default function subCategory() {
  return (
    <div>
      <AuthGard>
        <MainLayout>
          <SubCategory />
        </MainLayout>
      </AuthGard>
    </div>
  );
}
