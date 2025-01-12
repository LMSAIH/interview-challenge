import { useState } from "react";
import { useSignUp } from "../hooks/useSignup";
import { Link } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup, isLoading, error } = useSignUp();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await signup(email, password);

    };

    return (
        <div className="signupwrapper">
            <form className="signup" onSubmit={handleSubmit}>
                <h1> Sign<span classname="signupUp">Up</span></h1>
                <label> Email </label>
                <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                ></input>
                <label>Password</label>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                ></input>
                <button disabled={isLoading}> Sign Up</button>
                {error && <div className="loginError"> {error} </div>}
                <p>Already have an account? <Link to="/login"> login </Link></p>
            </form>
        </div>
    );
};

export default SignUp;
