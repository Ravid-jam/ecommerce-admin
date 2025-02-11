export default interface ICategory {
  _id?: string;
  name?: string;
  status: string;
  createdAt?: any;
  image: {
    id: string;
    url: string;
  };
}

export default interface ISubCategory {
  _id?: string;
  name?: string;
  status: string;
  category: ICategory;
  image: {
    id: string;
    url: string;
  };
  createdAt?: any;
}
