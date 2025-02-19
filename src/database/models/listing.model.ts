import { DataTypes, Model } from "sequelize";
import { AddListingAttributes, ListingAttributes } from "../../types/listing.types";
import { sequelize } from "../config/sequelize.config";

class Listing
  extends Model<ListingAttributes, AddListingAttributes>
  implements ListingAttributes
{
  declare id: string;
  declare title: string;
  declare description: string;
  declare price: number;
  declare category: string;
  declare location: string;
  declare hostId: string;
  declare image: string[];
  declare availabilityStatus: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Listing.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        isUrl: true,
      }
    },
    category: {
      type: DataTypes.ENUM("Apartment", "House", "Villa", "Studio", "Room"),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    hostId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    availabilityStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, 
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
    timestamps: true,
    sequelize,
    tableName: "listings",
    modelName: "Listing",
  }
);

export default Listing;
