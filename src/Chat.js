import React, { useEffect, useState } from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined, Send } from '@material-ui/icons';
import axios from './axios';
import { useParams } from 'react-router-dom';
import { useStateValue } from './StateProvider';

function Chat({ messages }) {

    const [{ user, userId }, dispatch] = useStateValue();
    const [input, setInput] = useState("");
    const [filteredMessages, setFilteredMessages] = useState();
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [roomPic, setRoomPic] = useState("");

    useEffect(() => {
        
        if (roomId) {
            axios.get(`/rooms/${roomId}`)
                 .then(response => {
                  setRoomName(response.data.name);
                  setRoomPic(response.data.profilePic)
                 });
        }
        setFilteredMessages(messages.map((message) => {
            if(message.from === userId || message.to === userId)
              return message;
        }));
    }, [roomId]);

    const sendMessage = async (e) => {
        e.preventDefault();

        await axios.post('/messages', {
            "message": input,
            "name": user.displayName,
            "timestamp": new Date(),
            "from": userId,
            "to": roomId
        });

        setInput('');
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar 
                 src={ roomPic }
                />
                <div className="chat__headerInfo">
                    <h3>{ roomName }</h3>
                    <p>Last seen at...</p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                { messages?.map((message) => (
                    <p className={`chat__message ${message?.to === userId && "chat__receiver"}`}>
                    <span className="chat__name">{message?.name}</span>
                    { message?.message }
                    <span className="chat__timestamp">
                        { message?.timestamp }
                    </span>
                    </p>
                ))}
            </div>
            <div className="chat__footer">
                <IconButton>
                    <InsertEmoticon />
                </IconButton>
                <form>
                    <input 
                     value={input}
                     onChange={e => setInput(e.target.value)}
                     placeholder="Type a message"
                     type="text"
                    />
                    <button onClick={sendMessage} type="submit">
                        Send a message
                    </button>
                </form>
                <IconButton>
                    {
                        input === ""? <Mic /> : <Send onClick={sendMessage} />
                    }
                </IconButton>
            </div>
        </div>
    )
}

export default Chat;

