const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
}, { collection: "Product" });

module.exports = mongoose.model("Product", productSchema);