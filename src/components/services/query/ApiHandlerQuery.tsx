import { useQuery } from "react-query";
import ApiServices from "../Apiservices";
import ICarousel from "../../types/carousel";
import ICategory from "@/components/types/category";
import IProducts from "@/components/types/products";
import { IColor, ISize } from "@/components/types/colorAndSize";

export function useCarouselList() {
  return useQuery("list", () => {
    return ApiServices.getLstCarousel();
  });
}
export function useSizeList() {
  return useQuery("list", () => {
    return ApiServices.getLstSize();
  });
}

export function useCategoryList() {
  return useQuery("categorylist", () => {
    return ApiServices.getLstCategory();
  });
}
export function useSubCategoryList() {
  return useQuery("SubCategorylist", () => {
    return ApiServices.getLstSubCategory();
  });
}

export function useProductList() {
  return useQuery("list", () => {
    return ApiServices.getLstProduct();
  });
}

export function useColorList() {
  return useQuery("Colorlist", () => {
    return ApiServices.getLstColor();
  });
}
//add
export function useAddCategory(data?: ICategory) {
  return ApiServices.addCategory(data);
}
export function useAddSubCategory(data?: ICategory) {
  return ApiServices.addSubCategory(data);
}
export function useAddProduct(data?: IProducts) {
  return ApiServices.addProduct(data);
}

export function useAddSize(data?: ISize) {
  return ApiServices.addSize(data);
}
export function useAddCarousel(data?: ICarousel) {
  return ApiServices.addCarousel(data);
}

export function useAddColor(data?: IColor) {
  return ApiServices.addColor(data);
}

//update

export function useUpdateCarousel(data?: ICarousel, _id?: string) {
  return ApiServices.updateCarousel(data, _id);
}
export function useUpdateSize(data?: ISize, _id?: string) {
  return ApiServices.updateSize(data, _id);
}
export function useUpdateCategory(data?: ICategory, _id?: string) {
  return ApiServices.updateCategory(data, _id);
}

export function useUpdateSubCategory(data?: ICategory, _id?: string) {
  return ApiServices.updateSubCategory(data, _id);
}
export function useUpdateProduct(data?: IProducts, _id?: string) {
  return ApiServices.updateProduct(data, _id);
}

export function useUpdateColor(data?: IColor, _id?: string) {
  return ApiServices.updateColor(data, _id);
}

//delete

export function useDeleteSubCategory(_id?: string) {
  return ApiServices.deleteSubCategory(_id);
}

export function useDeleteCategory(_id?: string) {
  return ApiServices.deleteCategory(_id);
}

export function useDeleteColor(_id?: string) {
  return ApiServices.deleteColor(_id);
}

export function useDeleteSize(_id?: string) {
  return ApiServices.deleteSize(_id);
}
export function useDeleteCarousel(_id?: string) {
  return ApiServices.deleteCarousel(_id);
}
