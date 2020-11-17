import { Button } from '@material-ui/core';
import React from 'react';
import './Login.css';
import { auth, provider } from './firebase';
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';
import axios from './axios';

function Login() {

    const [{user, userId}, dispatch] = useStateValue();

    const createRoomIfNotExists = (user) => {

        axios.get('/rooms')
             .then(response => {
                    if (response.data.length === 0){
                        axios.post('/rooms', {
                            "name": user.displayName,
                            "profilePic": user.photoURL
                        });
                    } else {
                        for(let room = 0; room < response.data.length; room++){
                            if(response.data[room]?.name === user.displayName && response.data[room]?.profilePic === user.photoURL){
                                dispatch({
                                    type: actionTypes.SET_USER_ID,
                                    userId: response.data[room]?._id,
                                });
                                break;
                            } else {
                                if(response.data.length === room + 1){
                                    axios.post('/rooms', {
                                        "name": user.displayName,
                                        "profilePic": user.photoURL
                                    }).then(response => {
                                        dispatch({
                                            type: actionTypes.SET_USER_ID,
                                            userId: response.data?._id,
                                        });
                                    });
                                }
                            }
                        }
                    }
               });
    }


    const signIn = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log(result.user);
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                });
                createRoomIfNotExists(result.user);
                console.log("******************");
            })
            .catch((error) => alert(error.message));
    };

    return (
        <div className="login">
            <div className="login__container">
                <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/800px-WhatsApp.svg.png" 
                 alt="" 
                />

                <div className="login__text">
                    <h1>Sign in to WhatsApp</h1>
                </div>

                <Button onClick={signIn}>
                    Sign In With Google                    
                </Button>
            </div>
        </div>
    )
}

export default Login;
