import express from 'express';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware';
import { userRole } from '../utils/variable.utils';
import { createListing } from '../controllers/listing.controller';
import { upload } from '../utils/multer.utils';

const listingRoutes = express.Router();

listingRoutes.post('/create', protectRoute, restrictTo(userRole.host),upload, createListing);


export default listingRoutes;