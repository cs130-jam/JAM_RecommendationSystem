import React, {useState, useRef} from 'react';
import '../App.css';
import {Link} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert'
import InputField from '../util/inputField';

const linkStyle = {
    color: 'black'
};

const linkContainer = {
    textAlign: "center",
    width: "100%",
    display: "inline-block",
};

const alertStyle = {
    top: '0'
};

const Login = (props) => {
    const setSessionToken = props.setSessionToken;
    const apiService = props.apiService;
    
    const [isInvalid, setIsInvalid] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(loginData) {
        let response = await apiService.current.login(loginData);
        if (response.ok) {
            let json = await response.json();
            setSessionToken(json.token);
        } else {
            let error = await response.json();
            if (error.status === 401) {
                setIsInvalid(true);
            } else {
                console.log(error);
            }
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        handleLogin({
            username: username,
            password: password
        });
    };

    function onPassword(password) {
        setPassword(password);
        setIsInvalid(false);
    }

    function onUsername(username) {
        setUsername(username);
        setIsInvalid(false);
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <form className="jam-form" onSubmit={handleSubmit}>
                {isInvalid && <Alert style={alertStyle} variant="danger">Invalid Credentials! Try again</Alert>}
                <p className="jam-title-text">Login</p>
                <InputField label="Username: " type="text" value={username} onInput={onUsername}/>
                <InputField label="Password: " type="password" value={password} onInput={onPassword}/>
                <div>
                    <button className="jam-submit-button" type="submit">Submit</button>
                </div>
                <div style={linkContainer}>
                    <Link style={linkStyle} to="/sign-up">Create Account</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;