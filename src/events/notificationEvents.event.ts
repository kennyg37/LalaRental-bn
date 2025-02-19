import EventEmitter from "events";
import { sendEmail } from "../utils/email.utils";
import { NotificationService } from "../services/notification.service";
import User from "../database/models/user.model";

export const notificationEventEmitter = new EventEmitter();

notificationEventEmitter.on("listingCreated", async (listing) => {
  try {
    const user = await User.findByPk(listing.host_id);
    if (user) {
      const subject = "listing Created successfully";
      const text = `listing with name: ${listing.title} was created successfully`;
      const html = `<p>listing with name: <b>${listing.title}</b> was created successfully</p>`;
      sendEmail(user.email, subject, text, html);

      const notification = {
        notification: "listing added",
        description: `listing: ${listing.listingName} is now available for sale`,
        user_id: listing.host_id,
      };

      await NotificationService.createNotification(notification);
      console.log("listing created notification sent.");
    }
  } catch (error) {
    console.error(`Error sending notification: ${error}`);
  }
});

notificationEventEmitter.on("listingExpired", async (listing) => {
  try {
    const notification = {
      notification: "listing Expired",
      description: `listing: ${listing.listingName} has expired`,
      user_id: listing.host_id,
    };
    await NotificationService.createNotification(notification);
    console.log("listing has Expired.");
  } catch (error) {
    console.error(`Error sending notification: ${error}`);
  }
});

notificationEventEmitter.on("listingDeleted", async (listing) => {
  try {
    const user = await User.findByPk(listing.host_id);
    if (user) {
      const subject = "listing Deleted successfully";
      const text = `listing with name: ${listing.listingName} has been Deleted successfully`;
      const html = `<p>listing with name: <b>${listing.listingName}</b> has been Deleted successfully</p>`;
      sendEmail(user.email, subject, text, html);

      const notification = {
        notification: "listing deleted",
        description: `listing: ${listing.listingName} has been deleted`,
        user_id: listing.host_id,
      };

      await NotificationService.createNotification(notification);
      console.log("listing deleted notification sent.");
    }
  } catch (error) {
    console.error(`Error sending notification: ${error}`);
  }
});

notificationEventEmitter.on(
  "listingBought",
  async (userId, deliveryAddress) => {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        const subject = "listing Bought successfully";
        const text = `Payment for listings successfully processed, Location: ${deliveryAddress.street} ${deliveryAddress.city} ${deliveryAddress.country} ${deliveryAddress.zipCode}`;
        const html = `<p>Payment for listings successfully processed, Location: ${deliveryAddress.street} ${deliveryAddress.city} ${deliveryAddress.country} ${deliveryAddress.zipCode}</p>`;
        sendEmail(user.email, subject, text, html);

        const notification = {
          notification: "listing Bought",
          description: `payment successfully`,
          user_id: userId,
        };

        await NotificationService.createNotification(notification);
        console.log("listing Bought notification sent.");
      }
    } catch (error) {
      console.error(`Error sending notification: ${error}`);
    }
  }
);
