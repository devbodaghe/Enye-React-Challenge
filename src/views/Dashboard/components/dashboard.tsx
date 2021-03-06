import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../../firebase";
import "firebase/firestore";
import App from "./app"

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
        <div style={{textAlign: 'center'}}>
            <h1>Dashboard</h1>
            <h2>Welcome to Dashboard!</h2>
            <h3>{userName}</h3>
            <button onClick={handleClick}>Logout</button>
            <App userID={userID} userName={userName}/>
        </div>
    );
}

export default Dashboard;