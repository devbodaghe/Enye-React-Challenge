import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../../firebase";
import "firebase/auth";
import "firebase/firestore";
import { AuthContext } from "../../../AuthProvider";
import '../.././Dashboard/components/app.css'
import {Button, Input} from '@material-ui/core';


interface FormItems {
    username: string;
    phone: string;
    email: string;
    password: string;
}

const SignUp = () => {
    const authContext = useContext(AuthContext);
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        phone: ""
    } as FormItems);

    const history = useHistory();

    const handleClick = () => {
       history.push("/auth/login") 
    }

    const handleChange = (event: any) => {
        event.persist();
        setValues(values => ({
            ...values,
            [event.target.name]: event.target.value
        }));

    }

    const handleSubmit = (event: any) => {
        event?.preventDefault();
        console.log(values, 'values');
        firebase
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password)
        .then((userCredential : firebase.auth.UserCredential) => {
            authContext.setUser(userCredential);
            const db = firebase.firestore();
            db.collection("Users")
            .doc(userCredential.user!.uid)
            .set({
                email: values.email,
                username: values.username,
                phone: values.phone
            })
            .then(() => {
                console.log('ok');
                history.push("/dashboard");
            })
            .catch(error => {
                console.log(error.message);
                alert(error.message);
            });
        
        })
        .catch(error => {
            console.log(error.message);
            alert(error.message);
        });

    }
    return (
        <div  className = "signup">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <Input type="text" name="username" placeholder="Username" onChange={handleChange} /><br /><br />
                <Input type="text" name="phone" placeholder="Phone" onChange={handleChange}/><br /><br />
                <Input type="text" name="email" placeholder="Enter your Email" onChange={handleChange}/><br /><br />
                <Input type="password" name="password" placeholder="Enter your Password" onChange={handleChange}/><br /><br />
                <Button variant = "outlined" type="submit">Sign Up</Button>
                <p>Already have account?</p>
                <Button variant = "outlined" onClick={handleClick}>Login</Button>
            </form>
        </div>
    );
}

export default SignUp;