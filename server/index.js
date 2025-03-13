const express = require('express');
const app = express();
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io');
const { Socket } = require('dgram');


app.use(cors());
const server = http.createServer(app);


const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

io.on('connection',(socket)=>{
    console.log('User connected',socket.id)
    
    socket.on('message',(message)=>{
        console.log(message)
        socket.to(message.room).emit('recive_message',message)
    })
    socket.on('join',(data)=>{
        console.log(data.username)
        socket.join(data.room);
    })

    socket.on('disconnect',()=>{
        console.log('User disconnected',socket.id)
    })
})

server.listen(3001,()=>{
    console.log('Server running on port 3001')
})