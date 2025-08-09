import { useState } from 'react';
import { CreateUser } from "./CreateUser";
import { Login } from "./Login";

export function Landing() {
    const [view, setView] = useState(0);
    return (
        <>
            {!view ? (
                <>
                    <Login />
                    <button onClick={() => setView(!view)}>Create New account</button>
                </>
            ) : (
                <>
                    <button onClick={() => setView(!view)}>Back to Login</button>
                    <CreateUser />
                </>
            )}
        </>
    );
}