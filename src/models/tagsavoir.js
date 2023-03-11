const mongoose = require("mongoose");

const tagsavoirSchema = mongoose.Schema(
  {
   
    number: {
      type: Number,
    },
    nom: {
      type: String,
    },
    syntax_process: {
      type: Boolean
    },
    purge_process: {
      type: Boolean
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("tagsavoir", tagsavoirSchema);
