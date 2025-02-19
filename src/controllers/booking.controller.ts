import { BookingService } from "../services/booking.service"
import { AddBookingAttributes } from "../types/booking.types"
import { Request, Response } from "express";
import { ListingService } from "../services/listing.service";


export const createBooking = async (req:Request, res: Response) => {
    try {

        const selectedListing = await ListingService.getListingById(req.body.listingId)

        if (!selectedListing) {
            res.status(404).json({ message: "Listing not found" });
            return;
        }

        const totalPrice = selectedListing.price * (new Date(req.body.checkOut).getDate() - new Date(req.body.checkIn).getDate())

        const booking: AddBookingAttributes = {
            listingId: req.body.listingId,
            renterId: req.user?.id,
            checkInDate: req.body.checkIn,
            checkOutDate: req.body.checkOut,
            totalPrice: totalPrice
        }

        const createdBooking = await BookingService.createBooking(booking)
        selectedListing.availabilityStatus = false
        await ListingService.updateListing(selectedListing)
        res.status(200).json({
            message: "Booking created successfully",
            booking: createdBooking
        })

        return;

    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
}