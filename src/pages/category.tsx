import AuthGard from "@/components/AuthGard";
import Category from "@/components/category/Category";
import MainLayout from "@/components/common/header/MainLayout";
import React from "react";

export default function category() {
  return (
    <div>
      <AuthGard>
        <MainLayout>
          <Category />
        </MainLayout>
      </AuthGard>
    </div>
  );
}
