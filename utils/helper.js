const Product = require("../models/product");

exports.updateStockQty = updateStockQty = (productList) => {
  productList.forEach(async (product) => {
    const { prodId, qty } = product;
    console.log("update stock qty at database!!!");
    const productItem = await Product.findById(prodId);
    productItem.stockQty = productItem.stockQty - qty;
    productItem.save();
  });
};
