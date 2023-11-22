export interface User{
    userName: string;
    email:string;
}

// Material type
export type Material = {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  pricePer500sqft?: number;
};

export type MaterialAdd = {
  name: string;
  image: string;
  unitPrice: number;
};

export type Estimate = {
    materialId: string;
    quantity: number;
}