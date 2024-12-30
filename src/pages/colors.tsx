import AuthGard from "@/components/AuthGard";
import Color from "@/components/color/Color";
import MainLayout from "@/components/common/header/MainLayout";
import React from "react";

export default function colors() {
  return (
    <div>
      <AuthGard>
        <MainLayout>
          <Color />
        </MainLayout>
      </AuthGard>
    </div>
  );
}
