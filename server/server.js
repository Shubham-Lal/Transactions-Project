require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const seedData = require("./controllers/seedController.js");
const {
    listTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData
} = require("./controllers/dataController.js");

const server = express();
server.use(express.json());
server.use(cors({
    origin: [process.env.CLIENT_URL],
    optionsSuccessStatus: 200
}));

connectDB();

server.get("/seed/data", seedData);
server.get("/data/list-transactions", listTransactions);
server.get("/data/get-statistics", getStatistics);
server.get("/data/get-barchart", getBarChart);
server.get("/data/get-piechart", getPieChart);
server.get("/data/get-combined", getCombinedData);

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});