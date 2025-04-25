import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { userSignup } from "../features/userSlice"


export default function Signup() {
    const [userDetail, setUserDetail] = useState({
        email: "", name: "", password: "", number: ""
    })

    const { status } = useSelector(state => state.userSlice)


    const dispatch = useDispatch()

    function onChangeHandler(e) {
        const { name, value } = e.target

        setUserDetail(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function formHandler(e) {
        e.preventDefault()
        dispatch(userSignup(userDetail))
        console.log(userDetail);

    }
    return (
        <>
            <section className="container my-5">
                <form onSubmit={formHandler} className="mx-auto" style={{ maxWidth: "30rem" }}>
                    <h3 className="text-center mb-3">
                        Signup
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
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Name"
                            onChange={onChangeHandler}
                        />
                        <label htmlFor="name">Name</label>
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
                    <div className="form-floating mb-2">
                        <input
                            type="text"
                            className="form-control"
                            id="number"
                            name="number"
                            placeholder="Number"
                            onChange={onChangeHandler}
                        />
                        <label htmlFor="number">Number</label>
                    </div>
                    <div className="mb-3 text-end">
                        <Link to={"/login"}>Login</Link>
                    </div>

                    <div className="mx-auto text-center w-75 my-4">
                        <button
                            type="submit"
                            disabled={status === "loading" ? true : false}
                            className="btn btn-warning w-100">
                            Signup

                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}