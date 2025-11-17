require("dotenv").config();   // <-- You MUST load .env here

const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require('../Models/listing.js');

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connected to DB");
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map(obj => ({
        ...obj,
        owner: "691324ea641168aa7200ae0f"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data is saved");
};

main()
    .then(initDB)
    .catch(err => {
        console.error("DB connection error:", err);
    });
