const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobs_nomenclatureSchema = mongoose.Schema(
  {
    idmetier: {
      type: Number
    },
    nom: {
      type: String
    },
    description: {
      type: String
    },
    idsecteurs: [{
      type: Number
    }],
    sector_nomenclatures: [{
      type: Schema.Types.ObjectId,
      ref: 'sector_nomenclature',
    }],
    condition_acces: {
      type: String
    },
    condition_exercice: {
      type: String
    },
    lieu_exercice: {
      type: String
    },
    condition_travail: {
      type: String
    },
    capacite_generale: {
      type: String
    },
    perspectives_emploi: {
      type: String
    },
    perspectives_evolution: {
      type: String
    },
    savoirfaires: [{
      type: Schema.Types.ObjectId,
      ref: 'savoirfaire',
    }],
    savoirs: [{
      type: Schema.Types.ObjectId,
      ref: 'savoir',
    }],
    activites: [{
      type: Schema.Types.ObjectId,
      ref: 'activite',
    }],
    connaissanceprocedurales: [{
      type: Schema.Types.ObjectId,
      ref: 'connaissanceprocedurale',
    }],
    connaissancetheoriques: [{
      type: Schema.Types.ObjectId,
      ref: 'connaissancetheorique',
    }],
    tagsavoiretres: [{
      type: Schema.Types.ObjectId,
      ref: 'tagsavoiretre',
    }],
    tagsavoirpratiques: [{
      type: Schema.Types.ObjectId,
      ref: 'tagsavoirpratique',
    }],
    tagsavoirs: [{
      type: Schema.Types.ObjectId,
      ref: 'tagsavoir',
    }]

  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("jobs_nomenclature", jobs_nomenclatureSchema);
