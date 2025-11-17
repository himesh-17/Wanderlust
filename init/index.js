const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require('../Models/listing.js');
async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj, owner : '691324ea641168aa7200ae0f'
    }))
    await Listing.insertMany(initData.data);
};

initDB().then(()=>{
    console.log("Data is saved");
})