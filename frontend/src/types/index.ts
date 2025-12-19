export interface Category {
  _id: string;
  name: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Product {
  _id: string;
  name: string;
  categoryId: string | Category;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Brand {
  _id: string;
  name: string;
  productId: string | Product;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Sale {
  _id: string;
  brandId: string | Brand;
  month: number;
  value: number;
  year: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreateCategoryDto {
  name: string;
}

export interface CreateProductDto {
  name: string;
  categoryId: string;
}

export interface CreateBrandDto {
  name: string;
  productId: string;
}

export interface CreateSaleDto {
  brandId: string;
  month: number;
  value: number;
  year: number;
}

export interface UpdateCategoryDto {
  name: string;
}

export interface UpdateProductDto {
  name: string;
  categoryId: string;
}

export interface UpdateBrandDto {
  name: string;
  productId: string;
}

export interface UpdateSaleDto {
  month: number;
  value: number;
  year: number;
}
