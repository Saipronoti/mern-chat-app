const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require('cors');

dotenv.config();
connectDB();
const app = express();

app.use(express.json());// to accept json data

app.use(cors({
  origin: 'localhost:3000/*'
}))
app.get('/', (req, res) => {
    res.send("API is running");
});


app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(5000, console, console.log(`Server Started on PORT ${PORT}`.yellow.bold));

const io = require("socket.io")(server, {
  pingTimeout: 6000,// if user doesnt send message in 6 sec connection will be closed to save network bandwidth
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
});

