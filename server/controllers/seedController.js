const axios = require("axios");
const Product = require("../models/productModel.js");

const seedData = async (req, res) => {
    try {
        const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
        const transactions = response.data;

        const existingProducts = await Product.find({});
        const existingIds = existingProducts.map(product => product.id);

        const newTransactions = transactions.filter(transaction =>!existingIds.includes(transaction.id));

        if (newTransactions.length > 0) {
            await Product.insertMany(newTransactions);
            res.send({ message: `${newTransactions.length} new data saved successfully` });
        } else {
            res.send({ message: "No new data to add. Data already in database." });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch and save data" });
    }
};

module.exports = seedData;