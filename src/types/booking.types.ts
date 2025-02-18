import { Optional } from "sequelize";

export interface BookingAttributes {
    id?: string;
    listingId?: string;
    renterId?: string;
    checkInDate?: Date;
    checkOutDate?: Date;
    totalPrice?: number;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AddBookingAttributes extends Optional
<BookingAttributes,
|"id"
|"listingId"
|"renterId"
|"checkInDate"
|"checkOutDate"
|"totalPrice"
|"status"
|"createdAt"
|"updatedAt"
> {}

export interface BookingOutputs extends Required<BookingAttributes> {}