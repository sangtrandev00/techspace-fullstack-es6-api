const mongoose = require("mongoose"); // Erase if already required

const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    cateImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // products: {
    //   items: [
    //     {
    //       productId: {
    //         type: Schema.Types.ObjectId,
    //         ref: "Product",
    //         required: true,
    //       },
    //     },
    //   ],
    // },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Category", categorySchema);
