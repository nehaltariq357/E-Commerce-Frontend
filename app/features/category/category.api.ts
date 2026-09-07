import { api } from "../../lib/api";
import { CategoriesResponse } from "./category.types";

// get all categories

export const getCategories = async () =>
  await api<CategoriesResponse>("/categories");


// get category by id

export const getCategoryById = async(categoryId:number)=>{
return api(`/categories/${categoryId}`)
}

