const mongoose = require("mongoose"); // Erase if already required

const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      // index:true,
    },
    oldPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    images: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    shortDesc: {
      type: String,
    },
    fullDesc: {
      type: String,
    },
    stockQty: {
      type: Number,
    },
    categoryId: {
      // type: String,
      type: Schema.Types.ObjectId,
      ref: "Category",
      // required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
