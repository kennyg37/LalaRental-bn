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

        if (new Date(req.body.checkIn) >= new Date(req.body.checkOut)) {
            res.status(400).json({ message: "Check out date must be greater than check in date" });
            return;
        }
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

export const getBooking = async (req: Request, res: Response) => {
    try {
        const booking = await BookingService.getBookingById(req.params.id)
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        res.status(200).json({ booking });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
}

export const getListingBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await BookingService.getBookingsByListingId(req.params.listingId)
        if (!bookings) {
            res.status(404).json({ message: "No bookings found" });
            return;
        }
        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
}

export const getRenterBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await BookingService.getBookingsByRenterId(req.user?.id as string)
        if (!bookings) {
            res.status(404).json({ message: "No bookings found" });
            return;
        }
        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
}

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const booking = await BookingService.getBookingById(req.params.id)
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        booking.status = req.body.status
        await BookingService.updateBooking(booking)
        res.status(200).json({ message: "Booking updated successfully", booking });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
}

export const modifyBooking = async (req: Request, res: Response) => {
    try {
        const booking = await BookingService.getBookingById(req.params.id)
        const userId = req.user?.id
        if (booking?.renterId !== userId) {
            res.status(403).json({ message: "You are not authorized to modify this booking" });
            return;
        }
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }

        if((new Date(req.body.checkIn) >= new Date(booking.checkOutDate)) || (new Date(req.body.checkOut) <= new Date(booking.checkInDate))) {
            res.status(400).json({ message: "Check in date must be less than check out date" });
            return;
        }

        booking.checkInDate = req.body.checkIn
        booking.checkOutDate = req.body.checkOut

        await BookingService.updateBooking(booking)
        res.status(200).json({ message: "Booking updated successfully", booking });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
}

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        const booking = await BookingService.getBookingById(req.params.id)
        const userId = req.user?.id
        if (booking?.renterId !== userId) {
            res.status(403).json({ message: "You are not authorized to delete this booking" });
            return;
        }

        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }
        await BookingService.deleteBooking(req.params.id)
        res.status(200).json({ message: "Booking deleted successfully", booking });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
}

export const getBookingsByStatus = async (req: Request, res: Response) => {
    try {
        const bookings = await BookingService.getBookingsByStatus(req.params.status)
        if (!bookings) {
            res.status(404).json({ message: "No bookings found" });
            return;
        }
        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message, message: "An error occurred" });
    }
}
