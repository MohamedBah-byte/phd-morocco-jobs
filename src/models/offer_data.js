const mongoose = require("mongoose");

const offer_dataSchema = mongoose.Schema(
  {
    website: {
      type: String,
    },
    source_id: {
      type: String,
    },
    offre_link: {
      type: String,
    },
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    localisation: {
      type: String,
    },
    district: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    offer_date: {
      type: Date,
    },
    contract_type: {
      type: String,
    },
    nb_posts: {
      type: Number,
    },
    diplome: {
      type: String,
    },
    salary: {
      type: String,
    },
    experience: {
      type: String,
    },
    org: {
      type: String,
    },
    sector: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Offer_data", offer_dataSchema);
