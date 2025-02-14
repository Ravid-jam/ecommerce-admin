import config from "@/components/config";
import ICarousel from "../types/carousel";
import {
  default as ICategory,
  default as ISubCategory,
} from "../types/category";
import { IColor, ISize } from "../types/colorAndSize";
import IProducts from "../types/products";
import HttpService from "./HttpService";
class ApiServices {
  static register(data: any) {
    return HttpService.post(`${config.API_URL}/admin/register`, data);
  }

  static login(data: any) {
    let res = HttpService.post(`${config.API_URL}/admin/login`, data);
    return res;
  }

  static async getLstAdmin() {
    let res = await HttpService.get(
      `${config.API_URL}/admin/getAdmin`,
      localStorage.token
    );
    return res.data;
  }

  static async addColor(data?: IColor) {
    let res = await HttpService.post(
      `${config.API_URL}/api/color/addColor`,
      data,
      localStorage.token
    );
    return res;
  }

  static async getLstColor() {
    let res = await HttpService.get(
      `${config.API_URL}/api/color/getAllColors`,
      localStorage.token
    );
    return res.data;
  }

  static async updateColor(data?: IColor, _id?: string) {
    let res = await HttpService.put(
      `${config.API_URL}/api/color/updateColor/${_id}`,
      data,
      localStorage.token
    );
    return res;
  }

  static async deleteColor(_id?: string) {
    let res = await HttpService.delete(
      `${config.API_URL}/api/color/deleteColor/${_id}`,
      localStorage.token
    );
    return res;
  }

  static async addCategory(data?: ICategory) {
    let res = await HttpService.post(
      `${config.API_URL}/api/category/addCategory`,
      data,
      localStorage.token
    );
    return res;
  }

  static async getLstCategory() {
    let res = await HttpService.get(
      `${config.API_URL}/api/category/getCategory`,
      localStorage.token
    );
    return res.data;
  }

  static async getLstSubCategory() {
    let res = await HttpService.get(
      `${config.API_URL}/api/category/getSubCategory`,
      localStorage.token
    );
    return res.data;
  }

  static async updateCategory(data?: ICategory, _id?: string) {
    let res = await HttpService.put(
      `${config.API_URL}/api/category/updateCategory/${_id}`,
      data,
      localStorage.token
    );
    return res;
  }

  static async getCategory(_id: string) {
    let res = await HttpService.get(
      `${config.API_URL}/api/getCategory/${_id}`,
      localStorage.token
    );
    return res;
  }

  static async deleteCategory(_id?: string) {
    let res = await HttpService.delete(
      `${config.API_URL}/api/category/deleteCategory/${_id}`,
      localStorage.token
    );
    return res;
  }

  static async addSubCategory(data?: ISubCategory) {
    let res = await HttpService.post(
      `${config.API_URL}/api/category/addSubCategory`,
      data,
      localStorage.token
    );
    return res;
  }

  static async updateSubCategory(data?: ISubCategory, _id?: string) {
    let res = await HttpService.put(
      `${config.API_URL}/api/category/updateSubCategory/${_id}`,
      data,
      localStorage.token
    );
    return res;
  }

  static async deleteSubCategory(_id?: string) {
    let res = await HttpService.delete(
      `${config.API_URL}/api/category/deleteSubCategory/${_id}`,
      localStorage.token
    );
    return res;
  }

  static async getLstSize() {
    let res = await HttpService.get(
      `${config.API_URL}/api/size/getAllSize`,
      localStorage.token
    );
    return res.data;
  }

  static async addSize(data?: ISize) {
    let res = await HttpService.post(
      `${config.API_URL}/api/size/addSize`,
      data,
      localStorage.token
    );
    return res;
  }

  static async updateSize(data?: ISize, _id?: string) {
    let res = await HttpService.put(
      `${config.API_URL}/api/size/updateSize/${_id}`,
      data,
      localStorage.token
    );
    return res;
  }

  static async deleteSize(_id?: string) {
    let res = await HttpService.delete(
      `${config.API_URL}/api/size/deleteSize/${_id}`,
      localStorage.token
    );
    return res;
  }

  static async getLstProduct() {
    let res = await HttpService.get(
      `${config.API_URL}/api/product/getAllProducts`,
      localStorage.token
    );
    return res.data;
  }

  static async addProduct(data?: IProducts) {
    let res = await HttpService.post(
      `${config.API_URL}/api/product/addProduct`,
      data,
      localStorage.token
    );
    return res;
  }

  static async updateProduct(data?: IProducts, _id?: string) {
    let res = await HttpService.put(
      `${config.API_URL}/api/product/updateProduct/${_id}`,
      data,
      localStorage.token
    );
    return res;
  }

  static async deleteProduct(_id: string) {
    let res = await HttpService.delete(
      `${config.API_URL}/api/product/deleteProduct/${_id}`,
      localStorage.token
    );
    return res;
  }

  static async getLstCarousel() {
    let res = await HttpService.get(
      `${config.API_URL}/api/getCarousel`,
      localStorage.token
    );
    return res.data;
  }

  static async addCarousel(data?: ICarousel) {
    let res = await HttpService.post(
      `${config.API_URL}/api/addCarousel`,
      data,
      localStorage.token
    );
    return res;
  }

  static async updateCarousel(data?: ICarousel, _id?: string) {
    let res = await HttpService.put(
      `${config.API_URL}/api/updateCarousel/${_id}`,
      data,
      localStorage.token
    );
    return res;
  }

  static async deleteCarousel(_id?: string) {
    let res = await HttpService.get(
      `${config.API_URL}/api/deleteCarousel/${_id}`,
      localStorage.token
    );
    return res;
  }
}

export default ApiServices;
