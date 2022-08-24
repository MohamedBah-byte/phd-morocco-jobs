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
    date: {
      type: Date,
    },
    contract_type: {
      type: String,
    },
    post_vacant: {
      type: Number,
    },
    diplome: {
      type: String,
    },
    salary_min: {
      type: Number,
    },
    salary_max: {
      type: Number,
    },
    experience_min: {
      type: Number,
    },
    experience_max: {
      type: Number,
    },
    org: {
      type: String,
    },
    sector: {
      type: String,
    },
    org_size: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Offer_data", offer_dataSchema);
