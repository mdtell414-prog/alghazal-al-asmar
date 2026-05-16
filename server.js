const express = require("express");
const basicAuth = require("express-basic-auth");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB connection
mongoose.connect("mongodb+srv://mdtell414_wdalkar09_user:TElLKaSsAlaWdAlKarSD414XsEriMD@cluster0.p25yy5n.mongodb.net/test?appName=Cluster0")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String
});

const Booking = mongoose.model("Booking", bookingSchema);

// POST
app.post("/boka", async (req, res) => {
  const { name, email, date } = req.body;

  const booking = new Booking({ name, email, date });
  await booking.save();

  res.redirect("/success.html");
});

// GET
app.use(
  ["/admin.html", "/bookings", "/delete-booking"],
  basicAuth({
    users: {
      admin: "12345"
    },
    challenge: true
  })
);

app.get("/bookings", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

app.delete("/delete/:id", async (req, res) => {
  await 
  Booking.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

const PORT = process.env.PORT || 3000;
app.get('/logout', (req, res) => {
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Logged out');
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

const helmet = require("helmet");
app.use(helmet());
