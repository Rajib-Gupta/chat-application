const express = require("express");

const app = express();
const path = require("path");
const { Socket } = require("socket.io");
const port = 9000 || process.env.PORT;
const server = app.listen(9000, () => {
  console.log(`Chat application is running on ${port}`);
});
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let socketConnected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketConnected.add(socket.id);

  io.emit("clients-total", socketConnected.size);
  socket.on('disconnect', () => {
    console.log("Socket disconnected", socket.id);
    socketConnected.delete(socket.id);
    io.emit("clients-total", socketConnected.size);
  });

  socket.on('message',(data)=>{
    //   console.log(data)
      socket.broadcast.emit('message',data)
  })
  socket.on('feedback',(data)=>{
    // console.log(data)
    socket.broadcast.emit('feedback',data)
})
}
