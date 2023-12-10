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
const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());// to accept json data

app.use(cors({
  origin: 'localhost:3000/*'
}))



app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

//----------------Deployment--------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));//establishing path from pwd to build folder

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
  })
} else {
  app.get('/', (req, res) => {
    res.send("API is running");
});
}
//----------------Deployment--------------


app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(5000, console, console.log(`Server Started on PORT ${PORT}`.yellow.bold));

const io = require("socket.io")(server, {
  pingTimeout: 60000,// if user doesnt send message in 60 sec connection will be closed to save network bandwidth
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => { // call back
  console.log("connected to socket.io");

  socket.on("setup", (userData) => { //user data is sent from frontend and user will join room
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {  // creating a socket
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing")); // create a new socket by the name "typing"
  socket.on("stop typing", (room) => socket.in(room).emit(" stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined"); // FIX FOR REAL TIME MESSAGES/NOTIFICATIONS TO BE DEBUGGED FROM HERE

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return; //in grp chat messages should be emitted only to users apart from sender,else return

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

