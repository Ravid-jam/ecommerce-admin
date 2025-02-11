import AuthGard from "@/components/AuthGard";
import MainLayout from "@/components/common/header/MainLayout";
import SubCategory from "@/components/subCategory/SubCategory";

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
