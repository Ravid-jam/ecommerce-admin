import AuthGard from "@/components/AuthGard";
import Carousel from "@/components/carousel/Carousel";
import MainLayout from "@/components/common/header/MainLayout";
import React from "react";

export default function doctor() {
  return (
    <div>
      <AuthGard>
        <MainLayout>
          <Carousel />
        </MainLayout>
      </AuthGard>
    </div>
  );
}
