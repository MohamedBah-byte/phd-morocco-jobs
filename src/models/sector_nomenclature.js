const mongoose = require("mongoose");

const sector_nomenclatureSchema = mongoose.Schema(
  {
   
    
idsecteur: {
      type: Number,
    },
    nom: {
      type: String,
    },
    description: {
      type: String
    },
    actif: {
      type: Number
    },
    porteur: {
      type: Number
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("sector_nomenclature", sector_nomenclatureSchema);
