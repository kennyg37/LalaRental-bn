import { DataTypes, Model } from "sequelize";
import { AddBookingAttributes, BookingAttributes } from "../../types/booking.types";
import { sequelize } from "../config/sequelize.config";

class Booking extends Model<BookingAttributes, AddBookingAttributes> implements BookingAttributes {
  declare id: string;
  declare listingId: string;
  declare renterId: string;
  declare checkInDate: Date;
  declare checkOutDate: Date;
  declare totalPrice: number;
  declare status: "Pending" | "Confirmed" | "Canceled";
  declare createdAt: Date;
  declare updatedAt: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    listingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Listings", key: "id" },
      onDelete: "CASCADE",
    },
    renterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: new Date().toISOString(),
      },
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterDate(value: any) {
          if (this.checkInDate && value <= this.checkInDate) {
            throw new Error("Check-out date must be after check-in date.");
          }
        },
      },
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Confirmed", "Canceled"),
      allowNull: false,
      defaultValue: "Pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Booking",
    tableName: "bookings",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["listingId", "checkInDate", "checkOutDate"], 
      },
    ],
  }
);

export default Booking;
