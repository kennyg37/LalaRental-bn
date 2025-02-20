import Booking from "../database/models/booking.model";
import { AddBookingAttributes } from "../types/booking.types";

export class BookingService {
    static async createBooking(booking: AddBookingAttributes) {
        return await Booking.create(booking);
    }

    static async getallBookings() {
        return await Booking.findAll();
    }
    
    static async getBookingById(id: string) {
        return await Booking.findOne({ where: { id: id } });
    }
    
    static async getBookingsByListingId(listingId: string) {
        return await Booking.findAll({ where: { listingId: listingId } });
    }
    
    static async getBookingsByRenterId(renterId: string) {
        return await Booking.findAll({ where: { renterId: renterId } });
    }
    
    static async updateBooking(booking: Booking) {
        return await booking.save();
    }
    
    static async deleteBooking(id: string) {
        const booking = await BookingService.getBookingById(id);
        if (booking) {
        await booking.destroy();
        return booking;
        }
        return null;
    }

    static async getBookingsByStatus(status: string) {
        return await Booking.findAll({ where: { status: status } });
    }

}