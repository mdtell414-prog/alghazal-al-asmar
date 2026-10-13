const express = require("express");
const basicAuth = require("express-basic-auth");
const mongoose = require("mongoose");
const helmet = require("helmet");

const app = express();

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb+srv://mdtell414_wdalkar09_user:AHmEdIbRahImWDaLKaRMDALrAmlAErISUD111tEll@cluster0.p25yy5n.mongodb.net/test?appName=Cluster0")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));


const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: String
});

const Booking = mongoose.model("Booking", bookingSchema);

app.post("/boka", async (req, res) => {

    const { name, email, date } = req.body;

    const booking = new Booking({
        name,
        email,
        date
    });

    await booking.save();

    res.redirect("/success.html");

});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/public/admin.html");
});

app.get("/bookings", async (req, res) => {

    const bookings = await Booking.find();

    res.json(bookings);

});

app.delete("/delete/:id", async (req, res) => {

    await Booking.findByIdAndDelete(req.params.id);

    res.send("Deleted");

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("Server running on port " + PORT);

});
