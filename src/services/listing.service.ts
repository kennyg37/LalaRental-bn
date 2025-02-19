import Listing from "../database/models/listing.model"
import { AddListingAttributes } from "../types/listing.types"

export class ListingService{
    static async createListing(listing: AddListingAttributes){
        return await Listing.create(listing)
    }

    static async updateListing(listing: Listing){
        return await listing.save()
    }

    static async getListingById(id: string){
        return await Listing.findOne({where: {id: id}})
    }

    static async getAllListings(){
        return await Listing.findAll()
    }

    static async getListingByHostId(hostId: string){
        return await Listing.findAll({where: {hostId: hostId}})
    }

    static async getListingByCategory(category: string){
        return await Listing.findAll({where: {category: category}})
    }

    static async getListingByLocation(location: string){
        return await Listing.findAll({where: {location: location}})
    }

    static async getListingByAvailabilityStatus(availabilityStatus: boolean){
        return await Listing.findAll({where: {availabilityStatus: availabilityStatus}})
    }

    static async updateAvailabilityStatus(id: string, availabilityStatus: boolean){
        const listing = await ListingService.getListingById(id)
        if(listing){
            listing.availabilityStatus = availabilityStatus
            await listing.save()
            return listing
        }
        return null
    }

    static async deleteListing(id: string){
        const listing = await ListingService.getListingById(id)
        if(listing){
            await listing.destroy()
            return listing
        }
        return null
    }
}