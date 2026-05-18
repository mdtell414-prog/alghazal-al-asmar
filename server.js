const express = require("express");
const basicAuth = require("express-basic-auth");
const mongoose = require("mongoose");
const helmet = require("helmet");

const app = express();

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname));

/* ===== MONGODB ===== */

mongoose.connect("mongodb+srv://mdtell414_wdalkar09_user:AHmEdIbRahImWDaLKaRMDALrAmlAErISUD111tEll@cluster0.p25yy5n.mongodb.net/test?appName=Cluster0")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

/* ===== SCHEMA ===== */

const bookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: String
});

const Booking = mongoose.model("Booking", bookingSchema);

/* ===== BOOKING FORM ===== */

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

/* ===== ADMIN PROTECTION ===== */

app.use(
    ["/admin", "/bookings", "/delete"],
    basicAuth({
        users: {
            admin: "12345"
        },
        challenge: true
    })
);

/* ===== ADMIN PAGE ===== */

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});

/* ===== GET BOOKINGS ===== */

app.get("/bookings", async (req, res) => {

    const bookings = await Booking.find();

    res.json(bookings);

});

/* ===== DELETE BOOKING ===== */

app.delete("/delete/:id", async (req, res) => {

    await Booking.findByIdAndDelete(req.params.id);

    res.send("Deleted");

});

/* ===== LOGOUT ===== */

app.get("/logout", (req, res) => {

    res.set("WWW-Authenticate", 'Basic realm="Admin Area"');

    return res.status(401).send("Logged out");

});

/* ===== SERVER ===== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("Server running on port " + PORT);

});
