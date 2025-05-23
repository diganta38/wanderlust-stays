const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');


// Connect to MongoDB
main()
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));


//root route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

//index page
app.get("/listings", wrapAsync(async(req, res) => {
  const allListing = await Listing.find({});
   res.render("listings/index.ejs", {allListing});
}));

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
})


//Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));


// Create route
app.post("/listings", wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
    console.log(req.body);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  console.log(req.body.listing);
  res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

//Error handling middleware
app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something went wrong"} = err;
 res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
