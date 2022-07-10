const mongoose = require("mongoose");
// const StarCraft2API = require('starcraft2-api');

const { Schema } = mongoose;

// const regionIds = StarCraft2API.getAllRegionIds().map(regionId => regionId.toString());
// const realmIds = StarCraft2API.getAllAvailableSc2Realms().map(realmId => realmId.toString());

const PlayerProfileSchema = new Schema(
  {
    regionId: {
      type: String,
      required: true,
    },
    realmId: {
      type: String,
      required: true,
    },
    profileId: {
      type: String,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
  },
  {
    id: false,
    timestamps: false,
  }
);

const ChannelConfigSchema = new Schema(
  {
    channelId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    profiles: [PlayerProfileSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

module.exports = ChannelConfigSchema;
