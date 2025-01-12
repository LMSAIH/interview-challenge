import { useState } from "react";
import { useSignUp } from "../hooks/useSignup";

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
                <h1> SignUp</h1>
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
                {error && <div className="LoginError"> {error} </div>}
            </form>
        </div>
    );
};

export default SignUp;
