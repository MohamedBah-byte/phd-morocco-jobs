const mongoose = require("mongoose");

const offerSchema = mongoose.Schema(
  {
    website: {
      type: String,
    },
    source_id: {
      type: String,
    },
    source_id_number: {
      type: Number,
    },
    link: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    offer_date: {
      type: String,
    },
    nb_posts: {
        type: Number,
      },
    config_html_processing: {
      type: Boolean,
      default: false,
    },
    dev_config_html_processing: {
      type: Boolean,
      default: false,
    },
    config_error_processing: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Offer_html", offerSchema);
