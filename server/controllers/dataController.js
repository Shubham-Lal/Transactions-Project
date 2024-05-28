const axios = require("axios");
const Product = require("../models/productModel.js");

const getMonthFilter = (month) => {
    const monthIndex = parseInt(month, 10);
    if (isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
        throw new Error("Invalid month");
    }
    return {
        $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthIndex]
        }
    };
};

exports.listTransactions = async (req, res) => {
    try {
        const { month, search, page = 1, perPage = 10 } = req.query;

        let filter = {};

        if (month) {
            const monthFilter = getMonthFilter(month);
            filter = { ...filter, ...monthFilter };
        }
        if (page <= 0) return res.status(400).json({ error: "Page query shouldn't be less than 0" });

        const searchFilter = search
            ? {
                $or: [
                    { title: new RegExp(search, "i") },
                    { description: new RegExp(search, "i") },
                    ...(isNaN(search) ? [] : [{ price: parseFloat(search) }])
                ]
            }
            : {};

        filter = { $and: [filter, searchFilter] };

        const transactions = await Product.find(filter)
            .sort({ _id: 1 })
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        res.json(transactions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) return res.status(400).json({ error: "Month is required" });

        const monthFilter = getMonthFilter(month);

        const totalSaleAmount = await Product.aggregate([
            { $match: monthFilter },
            { $group: { _id: null, totalAmount: { $sum: "$price" } } }
        ]);

        const soldItemsCount = await Product.countDocuments({ ...monthFilter, sold: true });

        const notSoldItemsCount = await Product.countDocuments({ ...monthFilter, sold: false });

        res.json({
            totalSaleAmount: totalSaleAmount[0] ? totalSaleAmount[0].totalAmount : 0,
            soldItemsCount,
            notSoldItemsCount
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getBarChart = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) return res.status(400).json({ error: "Month is required" });

        const monthFilter = getMonthFilter(month);

        const priceRanges = [
            { range: "0 - 100", min: 0, max: 100 },
            { range: "101 - 200", min: 101, max: 200 },
            { range: "201 - 300", min: 201, max: 300 },
            { range: "301 - 400", min: 301, max: 400 },
            { range: "401 - 500", min: 401, max: 500 },
            { range: "501 - 600", min: 501, max: 600 },
            { range: "601 - 700", min: 601, max: 700 },
            { range: "701 - 800", min: 701, max: 800 },
            { range: "801 - 900", min: 801, max: 900 },
            { range: "901-above", min: 901, max: Infinity }
        ];

        const results = await Promise.all(priceRanges.map(async (range) => {
            const count = await Product.countDocuments({
                ...monthFilter,
                price: { $gte: range.min, $lt: range.max }
            });
            return { range: range.range, count };
        }));

        res.json(results);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPieChart = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) return res.status(400).json({ error: "Month is required" });

        const monthFilter = getMonthFilter(month);

        const categories = await Product.aggregate([
            { $match: monthFilter },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $project: { _id: 0, category: "$_id", count: 1 } }
        ]);

        res.json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCombinedData = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) return res.status(400).json({ error: "Month is required" });

        const statsUrl = `${process.env.SERVER_URL}/data/get-statistics?month=${month}`;
        const barChartUrl = `${process.env.SERVER_URL}/data/get-barchart?month=${month}`;
        const pieChartUrl = `${process.env.SERVER_URL}/data/get-piechart?month=${month}`;

        const [statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
            axios.get(statsUrl),
            axios.get(barChartUrl),
            axios.get(pieChartUrl)
        ]);

        const combinedResponse = {
            statistics: statisticsResponse.data,
            barChart: barChartResponse.data,
            pieChart: pieChartResponse.data
        };

        res.json(combinedResponse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};