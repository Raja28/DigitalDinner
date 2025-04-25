import { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { userLogin } from "../features/userSlice"

export default function Login() {
    const [loginData, setLoginData] = useState({
        email: "", password: ""
    })
    const dispatch = useDispatch()
    function onChangeHandler(e) {
        const { name, value } = e.target

        setLoginData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    function submitHandler(e) {
        e.preventDefault()
        if (!loginData.email || !loginData.password) {
            toast.error("Email & Password required")
            return
        }
        dispatch(userLogin(loginData))
    }
    function guestLogin() {
        dispatch(userLogin({ email: "rajadavid03@gmail.com", password: "1234" }))
    }
    return (
        <section className="container my-5" style={{ maxWidth: "30rem" }}>
            <form onSubmit={submitHandler}>
                <h3 className="text-center mb-3">
                    Login
                </h3>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        onChange={onChangeHandler}
                    />
                    <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Password"
                        onChange={onChangeHandler}
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <div className="mb-3 text-end">
                    <Link to={"/signup"}>signup</Link>
                </div>

                <div className="mx-auto text-center w-75 my-4">
                    <button type="submit" className="btn btn-warning w-100 ">Login</button>
                    
                </div>
            </form>
            <div className="mx-auto w-75" >
                <button onClick={guestLogin} className="btn btn-warning w-100 my-3 w-100">Guest Login</button>
            </div>
        </section>
    )
}