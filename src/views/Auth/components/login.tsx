import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebase from "../../../firebase";
import "firebase/auth";
import "firebase/firestore";
import { AuthContext } from "../../../AuthProvider";
import {Button, Typography, Input} from '@material-ui/core';
import '../.././Dashboard/components/app.css'


interface UserData {
    email: string;
    password: string;
}

const Login = () => {
    const authContext = useContext(AuthContext);
    const {loadingAuthState} = useContext(AuthContext);
    const history = useHistory();
    const [values, setValues] = useState({
        email: "",
        password: ""
    } as UserData);

    const db = firebase.firestore();

    useEffect(() => {
        firebase
        .auth()
        .getRedirectResult()
        .then(result => {
            if (!result || !result.user || !firebase.auth().currentUser) {
                return;
            }

            return setUserProfile().then(() => {
                redirectToTargetPage();
            });
        })
        .catch(error => {
            console.log(error, 'error');
        });

    }, );

    const setUserProfile = async () => {
        if (await isUserExists()) {
            return;
        }

        const currentUser = firebase.auth().currentUser!;
        db
        .collection("Users")
        .doc(currentUser.uid)
        .set({
            username: currentUser.displayName
        })
        .then(() => {
            console.log('Saved');
            return;
        })
        .catch(error => {
            console.log(error.message);
            alert(error.message);
        })
    }

    const isUserExists = async () => {
        const doc = await db
            .collection("users")
            .doc(firebase.auth().currentUser!.uid)
            .get()
        return doc.exists;
    }

    const redirectToTargetPage = () => {
        history.push("/dashboard");
    }

    const handleClick = () => {
       history.push("/auth/signup") 
    }

    const handleChange = (event: any) => {
        event.persist();
        setValues(values => ({
            ...values, 
            [event.target.name]: event.target.value
        }));
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();

        firebase
        .auth()
        .signInWithEmailAndPassword(values.email, values.password)
        .then(res => {
            authContext.setUser(res);
            console.log(res, 'res')
            history.push("/dashboard");
        })
        .catch(error => {
            console.log(error.message);
            alert(error.message);
        });
    }

    const handleSocialClick = (sns: any) => {
        console.log(sns, 'sns');

        let provider: firebase.auth.AuthProvider;
        switch (sns) {
            case "Facebook":
                provider = new firebase.auth.FacebookAuthProvider();
                console.log(provider, 'fbprovider');
                break;
            
            case "Google":
                provider = new firebase.auth.GoogleAuthProvider();
                console.log(provider, 'gprovider');
                break;

            case "Twitter":
                provider = new firebase.auth.TwitterAuthProvider();
                break;
        
            default:
                throw new Error("Unsupported SNS" + sns)
        }

        firebase
        .auth()
        .signInWithRedirect(provider)
        .catch(handleAuthError);
    }

    const handleAuthError = (error: firebase.auth.Error) => {
        console.log(error)
    }

    if (loadingAuthState) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>  
        );
    }

    return (
        <div className = "login">
            <h1>ENYE COHORT IV CHALLENGE</h1>
            <p > In this COVID world that we live in, it is important that people can easily access medical assistance if need be. </p>
            <p>With that in mind, the goal of this challenge is to build an application that can locate all the hospitals within a given area.</p>
            <form onSubmit={handleSubmit}>
               <Typography> <Input type="text" name="email" value={values.email} placeholder="Enter your Email" onChange={handleChange} /><br /><br /></Typography>
                <Input type="password" name="password" value={values.password} placeholder="Enter your Password" onChange={handleChange} /><br /><br />
                <button>Login</button>
                <p>Not logged in yet?</p>
                <Button variant = "outlined" onClick={handleClick}>SignUp</Button> <br/><br/>
            </form>
                
                <p>Social SignUp</p>
                <Button variant = "outlined" onClick={() => handleSocialClick("Facebook")}>SignIn with Facebook</Button><br/><br/>
                <Button variant = "outlined" onClick={() => handleSocialClick("Google")}>SignIn with Google</Button><br/><br/>
                <Button variant = "outlined" onClick={() => handleSocialClick("Twitter")}>SignIn with Twitter</Button><br/><br/>
        </div>
    );
}

export default Login;