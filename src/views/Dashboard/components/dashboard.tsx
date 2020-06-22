import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../../firebase";
import "firebase/firestore";
import './app.css'
import App from "./app"
import {Button} from '@material-ui/core'

const Dashboard = () => {
    const [userName, setUserName] = useState("");
    const [userID , setUserID] = useState("");
    const history = useHistory();

    const handleClick = (event: any) => {
        event.preventDefault();

        firebase
        .auth()
        .signOut()
        .then(res => {
            history.push("/auth/login");
        })
    }

    useEffect(() => { 
        const db = firebase.firestore();
            db
            .collection("Users")
            .doc(firebase.auth().currentUser!.uid)
            .get()
            .then(res => {
                const user = res.data();
                if (user) {
                    setUserID(firebase.auth().currentUser!.uid)
                    setUserName(user['username'])
                }
            })
    }, []);

    return (
        <div >
            <Button className = 'logout' variant = "outlined" onClick={handleClick}>Logout</Button>
            <div className = "dashboard">
            <h1>ENYE FINDER </h1>
            {/* <h2>Welcome {userName.toUpperCase()}</h2> */}
            {/* <h3>{userName}</h3> */}
            <App userID={userID} userName={userName}/>

            </div>
        </div>
    );
}

export default Dashboard;