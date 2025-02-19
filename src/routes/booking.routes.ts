import { createBooking } from "../controllers/booking.controller";
import { Router } from "express";import { protectRoute, restrictTo } from "../middlewares/auth.middleware";
;

const bookingRouter = Router();

bookingRouter.post("/create", protectRoute, restrictTo("renter"), createBooking);

export default bookingRouter;