import React from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

function SidebarChat({ id, name, profilePic }) {

  return (
        <Link to={`/rooms/${id}`}>
        <div className="sidebarChat">
        <Avatar 
        src={profilePic}
        />
        <div className="sidebarChat__info">
            <h2>{ name }</h2>
            <p>This is the last message</p>
        </div>
        </div>
        </Link>
      )
};

export default SidebarChat;
