import { Request, Response } from "express";
import { AddListingAttributes } from "../types/listing.types";
import { ListingService } from "../services/listing.service";
import cloudinary from "cloudinary";
// import dotenv from "dotenv";
// import Listing from "../database/models/Listing.model";
import { notificationEventEmitter } from "../events/notificationEvents.event";
import "../utils/cloudinary.utils";
import Listing from "../database/models/listing.model";
import { BookingService } from "../services/booking.service";

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

export const updateListing = async (req: Request, res: Response) => {
    try {
        const selectedListing = (await ListingService.getListingById(req.params.id)) as Listing;
        if (!selectedListing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }

        if (selectedListing.hostId !== req.user?.id) {
            res.status(403).json({ message: "You are not authorized to edit this listing" });
            return;
        }

        const {
            title,
            description,
            category,
            price,
            location,
        } = req.body;

        const updatedListing = await Listing.update(
            {
                title: title || selectedListing.title,
                description: description || selectedListing.description,
                category: category || selectedListing.category,
                price: price || selectedListing.price,
                location: location || selectedListing.location,
            },
            {
                where: { id: selectedListing.id },
                returning: true, 
            }
        );

        res.status(200).json({
            message: "Listing updated successfully",
            listing: updatedListing[1][0], 
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
};

export const getAvailableListings = async (_req: Request, res: Response) => {
    try {
        // Get all listings
        const allListings = await ListingService.getAllListings();

        // Get all bookings
        const allBookings = await BookingService.getallBookings();

        // Filter out listings that have bookings
        const availableListings = allListings.filter((listing) => {
            const hasBooking = allBookings.some((booking) => booking.listingId === listing.id);
            return !hasBooking; // Only include listings without bookings
        });

        res.status(200).json({
            message: "Available listings retrieved successfully",
            listings: availableListings,
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
};

export const getListingsAvailableOnDate = async (req: Request, res: Response) => {
    try {
        const { date } = req.query; // Date should be provided as a query parameter (e.g., /listings/available?date=2023-10-15)

        if (!date) {
            res.status(400).json({ message: "Date is required" });
            return;
        }

        const requestedDate = new Date(date as string);
        const allListings = await ListingService.getAllListings();
        const allBookings = await BookingService.getallBookings();

        // Filter listings that are available on the requested date
        const availableListings = allListings.filter((listing) => {
            const bookingsForListing = allBookings.filter((booking) => booking.listingId === listing.id);

            // If there are no bookings, the listing is available
            if (bookingsForListing.length === 0) {
                return true;
            }

            // Check if all bookings for this listing have a checkout date before the requested date
            const isAvailable = bookingsForListing.every((booking) => {
                const checkoutDate = new Date(booking.checkOutDate);
                const availableFromDate = new Date(checkoutDate);
                availableFromDate.setDate(availableFromDate.getDate() + 1); 

                return availableFromDate <= requestedDate;
            });

            return isAvailable;
        });

        res.status(200).json({
            message: "Listings available on the requested date retrieved successfully",
            listings: availableListings,
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
};

export const getListingById = async (req: Request, res: Response) => {
    try {
        const listing = await ListingService.getListingById(req.params.id);
        if (!listing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }
        res.status(200).json({ listing });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
}

export const deleteListing = async (req: Request, res: Response) => {
    try {
        const listing = await ListingService.getListingById(req.params.id);
        if (!listing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }

        if (listing.hostId !== req.user?.id) {
            res.status(403).json({ message: "You are not authorized to delete this listing" });
            return;
        }

        await ListingService.deleteListing(req.params.id);
        res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
};