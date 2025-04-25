import { useDispatch, useSelector } from "react-redux"
import { clearReducer } from "../features/userSlice"
import { Link } from "react-router-dom"

export default function Dashboard() {
    const { user } = useSelector(state => state.userSlice)
    const dispatch = useDispatch()
    function logoutHandler() {
        sessionStorage.clear()
        dispatch(clearReducer())
    }
    return (
        <section className="container">
            <div className="my-5 d-flex gap-3 justify-content-center ">
                {/* left-profile Pic & logout Btn */}
                <div className="card p-2" style={{ width: "25rem" }}>
                    <div className="border-0 mx-auto" style={{ maxWidth: "8rem" }}>
                        <img src={user?.profileImage} alt="user profile image"
                            className="rounded-circle w-100 h-100 card-img-top"
                        />
                    </div>
                    <div className="card-body my-3 d-flex flex-column align-items-center gap-3 w-100 fs-5">
                        <div className="d-flex gap-2 mb-2">
                            <strong>Name:</strong>
                            {user?.name}
                        </div>
                        <div className="d-flex gap-2 mb-2">
                            <strong>Number:</strong>
                            {user?.number}
                        </div>
                        <div className="d-flex gap-2 mb-2">
                            <strong>Email:</strong>
                            {user?.email}
                        </div>
                        <div className="d-flex gap-3 flex-column">
                            <p onClick={logoutHandler} className="btn btn-danger my-2">Logout</p>
                            <div className="d-flex gap-3">

                            <Link to={"/address"} className="btn btn-warning my-2 w-100"> Address</Link>
                            <Link to={"/orders"} className="btn btn-warning my-2 w-100">Order</Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}