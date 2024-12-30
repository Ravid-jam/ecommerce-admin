export default interface ICategory {
  _id?: string;
  categoryImage?: string;
  categoryTitle?: string;
  Date?: string;
}

export default interface ISubCategory {
  _id?: string;
  subCategoryImage?: string;
  subCategoryTitle: string;
  categoryId: string;
  Date?: string;
}
