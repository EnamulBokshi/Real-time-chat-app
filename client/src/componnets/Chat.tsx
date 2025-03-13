import React, { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import  ScrollToBottom from 'react-scroll-to-bottom'
function Chat({ socket, username, room }: { socket: Socket, username: string, room: string }) {
    //   console.log(socket)

    const [currentMessage, setCurrentMessage] = React.useState<string>("")
    const [messages, setMessages] = React.useState<any[]>([]);

    const sendMessage = async () => {
        if (currentMessage) {
            const message = {
                room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit("message", message)
            setMessages((prevMessages) => [...prevMessages, message]);
            setCurrentMessage("");
        }
    }

    useEffect(() => {
        socket.on("recive_message", (message: any) => {
            console.log("Message: ", message)
            setMessages((prevMessages) => [...prevMessages, message]);
        })
    }, [socket])

    return (
        <section className='bg-gray-100 p-3 rounded-lg w-1/2 mx-auto  shadow-md '>
            <div className='bg-lime-500 p-3 border-b border-gray-500'>
                <p className='text-center'>Live chat @{username}</p>
            </div>
            <div className='bg-gray-200 p-3 h-96 overflow-y-auto'>
                <ScrollToBottom className='h-full' initialScrollBehavior='auto'> 
                {messages.map((msg, index) => (
                    <div key={index}>
                        {
                            (msg.author === username) ?

                                <div className=' p-3 bg-gray-300 rounded-lg mb-2' >
                                    <p className='text-right text-xl leading-tight '> {msg.message} </p>
                                    <span className='text-right items-end flex justify-end text-sm'>
                                        <strong className='text-sm me-2'>You</strong> {" "} <em>{msg.time}</em>
                                    </span>
                                </div> :
                                <div className=' p-3 bg-violet-300 rounded-2xl mb-2' >
                                    <p className='text-left text-xl'> {msg.message} </p>
                                    <span className='text-left'>
                                        <strong>{msg.author}</strong>, <em>{msg.time}</em>
                                    </span>
                                </div>
                                

                        }
                    </div>
                ))}
                </ScrollToBottom>
            </div>
            <div className='p-3 flex justify-between bg-gray-300 gap-x-3'>
                <input onKeyDown={(e) => e.key === 'Enter' && sendMessage()} type="text" onChange={(event) => setCurrentMessage(event.target.value)} value={currentMessage} placeholder='type.....' className='px-3 py-3  active:outline-0 w-full' />
                <button className='btn btn-primary' onClick={sendMessage}>&#9658;</button>
            </div>
        </section>
    )
}

export default Chat