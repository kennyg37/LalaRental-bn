import { Optional } from "sequelize";


export interface ListingAttributes {
    id?:string;
    title?:string;
    description?:string;
    price?:number;
    category?:string;
    location?:string;
    hostId?:string;
    image?:string[];
    createdAt?:Date;
    updatedAt?:Date;
    availabilityStatus?:boolean;
}

export interface AddListingAttributes extends  Optional
<ListingAttributes,
|"id"
|"title"
|"description"
|"price"
|"category"
|"location"
|"hostId"
|"image"
|"createdAt"
|"updatedAt"
|"availabilityStatus"
> {}

export interface ListingOutputs extends Required<ListingAttributes> {}