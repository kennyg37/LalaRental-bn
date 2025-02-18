"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      listingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "listings",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      renterId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      checkInDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isAfter: new Date().toISOString(),
        },
      },
      checkOutDate: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isAfterDate(value) {
            if (this.checkInDate && value <= this.checkInDate) {
              throw new Error("Check-out date must be after check-in date.");
            }
          },
        },
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Pending", "Confirmed", "Canceled"),
        allowNull: false,
        defaultValue: "Pending",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex("bookings", ["listingId", "checkInDate", "checkOutDate"], {
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bookings");
  },
};
