import { IColor } from "./colorAndSize";

export default interface IProducts {
  _id?: string;
  category: string;
  title: string;
  slug: string;
  description: string;
  subCategory: string;
  price: number;
  color: IColor[];
  size: string;
  images: string[];
}
