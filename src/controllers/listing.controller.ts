import { Request, Response } from "express";
import { AddListingAttributes } from "../types/listing.types";
import { ListingService } from "../services/listing.service";
import cloudinary from "cloudinary";
// import dotenv from "dotenv";
// import Listing from "../database/models/Listing.model";
import { notificationEventEmitter } from "../events/notificationEvents.event";
import "../utils/cloudinary.utils";

export const createListing = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length > 8 || files.length < 3) {
        res.status(400).json({
            message: "Please upload at least 3 images and not exceeding 8",
        });
        return;
        }

        let imageUrls = [] as string[];
        let imagePublicId = [] as string[];
        await Promise.all(
        files.map(async (file) => {
            const result = await cloudinary.v2.uploader.upload(file.path);
            imageUrls.push(result.secure_url);
            imagePublicId.push(result.public_id);
        })
        );

        const listing: AddListingAttributes = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            location: req.body.location,
            hostId: req.user?.id as string,
            image: imageUrls,
        }

        if (!listing.title || !listing.price || !listing.description || !listing.hostId) {
            imagePublicId.forEach(async (publicId) => {
              await cloudinary.v2.uploader.destroy(publicId);
            });
            res.status(400).json({ message: "All required fields must be provided" });

            return;
          }
      
          const createdListing = await ListingService.createListing(listing);
          notificationEventEmitter.emit("listingCreated", listing);
      
          res.status(200).json({
            message: "Listing created successfully",
            listing: createdListing,
          });

          return;
    
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, other: "An error occurred" });
        return;
    }
};
 