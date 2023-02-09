const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("mongoose is connected");

}