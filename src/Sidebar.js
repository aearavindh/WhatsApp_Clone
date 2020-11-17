import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { Chat, DonutLarge, MoreVert, SearchOutlined } from '@material-ui/icons';
import { Avatar, IconButton } from '@material-ui/core';
import SidebarChat from './SidebarChat';
import { useStateValue } from './StateProvider';
import axios from './axios';

function Sidebar() {

    const [{ user, userId }, dispatch] = useStateValue();
    const [rooms, setRooms] = useState();

    useEffect(() => {
        axios.get('/rooms')
             .then(response => {
             setRooms(response.data);
            });
    }, []);

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user?.photoURL} />
                <div className="sidebar_headerRight">
                    <IconButton>
                        <DonutLarge />
                    </IconButton>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input 
                     placeholder="Search or start new chat"
                     type="text"
                    />
                </div>
            </div>
            <div className="sidebar__chats">
                {
                    rooms?.map(room => {
                        if(room._id !== userId){
                            return <SidebarChat key={room._id} id={room._id} name={room.name} profilePic={room.profilePic} />;
                        }
                    })
                }
            </div>
        </div>
    )
}

export default Sidebar;
