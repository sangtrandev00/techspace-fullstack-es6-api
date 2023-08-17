const mongoose = require("mongoose"); // Erase if already required

const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model

const orderSchema = new Schema(
  {
    // Id: auto genrate!!!
    shippingFee: { type: Number },
    vatFee: {
      type: Number,
    },
    paymentMethod: { type: String, required: true, default: "COD" },
    note: {
      type: String,
    },
    status: { type: String, required: true, default: "Waiting to Confirm" },
    user: {
      email: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
      },
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      shippingAddress: {
        type: String,
      },
    },
    products: {
      items: [
        {
          prodId: {
            type: String,
            // ref: "Product",
            // required: true,
          },
          qty: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
        },
      ],
      totalPrice: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
