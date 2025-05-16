const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2017/02/25/18/31/bulgaria-2098435_1280.jpg",
        set: function(v) {
        return v === undefined || v === "" ? "https://cdn.pixabay.com/photo/2017/02/25/18/31/bulgaria-2098435_1280.jpg" : v;
    }
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;