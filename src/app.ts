import express from "express";
import { Request, Response } from "express";
import userRoutes from "./routes/user.routes";
import morgan from "morgan";
import cors from 'cors';
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import LoginByGoogleRoute from "./routes/Login-by-google.routes";
import dotenv from "dotenv";
import { initSocket } from "./socketio";
import http from "http";
import listingRoutes from "./routes/listing.routes";
import bookingRouter from "./routes/booking.routes";
dotenv.config();

const app = express();

const server = http.createServer(app);
// Initialize Socket.IO
initSocket(server);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(session({ secret: process.env.GOOGLE_SECRET2 as string }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World");
  return;
});
app.use("/api/users", userRoutes);
app.use("/api", LoginByGoogleRoute);
app.use("/api/listing", listingRoutes)
app.use("/api/booking", bookingRouter )


export default app;
export { server };