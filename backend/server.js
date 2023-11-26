const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require('cors');

dotenv.config();
connectDB();
const app = express();

app.use(express.json());// to accept json data

app.use(cors({
  origin: 'localhost:3000/'
}))
app.get('/', (req, res) => {
    res.send("API is running");
});


app.use('/api/user', userRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(5000, console, console.log(`Server Started on PORT ${PORT}`.yellow.bold));