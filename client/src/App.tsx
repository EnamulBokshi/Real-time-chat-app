type Props = {}

import { useState } from "react";
import { io } from "socket.io-client"
import Chat from "./componnets/Chat";

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err);
});

function App({}: Props) {

  const [username,setUsername] = useState<string>("")
  const [room,setRoom] = useState<string>("")
  const [joined, setJoined] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleJoin = ()=>{
    if(username && room){
      socket.emit("join", {username,room})
      setJoined(true);
    }
    else{
setError("Please enter username and room id")
    }
  }

  return (
    <main className="bg-gray-100 py-20">
      {!joined ? (
        <div className="flex flex-col  p-5 rounded  h-1/2 w-1/2 mx-auto my-auto shadow-md items-center justify-center space-y-2">
          <h1 className="text-2xl bg-clip-text bg-linear-300 pb-2 font-semibold">Chat App</h1>
          <input  onKeyDown={(e)=>e.key === 'Enter' && handleJoin} className="outline-1 rounded-lg focus-within:outline-3   outline-blue-200 py-3 px-4 mb-1" type="text" placeholder="Username...." value={username} onChange={(e) => setUsername(e.target.value)} />
          <input onKeyDown={(e)=>e.key === 'Enter' && handleJoin} className="outline-1  rounded-lg focus-within:outline-3  outline-blue-200 py-3 px-4"  type="text" placeholder="Room ID..." value={room} onChange={(e) => setRoom(e.target.value)} />
          {
            error && <p className="text-red-400 text-sm bg-gray-400 p-2 rounded-2xl">{error}</p>
          }
          <button className="btn btn-primary mt-2" onClick={handleJoin}>Join</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room}/>
      )}
    </main>
  )
}

export default App