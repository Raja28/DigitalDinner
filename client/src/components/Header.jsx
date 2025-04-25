import { Link } from "react-router-dom";
import DigitalDinerLogo from '../assets/Digital-Diner-Logo-1.png'
import { CgProfile } from "react-icons/cg";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useSelector } from "react-redux";

export default function Header() {
    const { token, user } = useSelector(state => state.userSlice)

    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg bg-body-tertiary border">
                    <div className="container">
                        <Link to="/" className="navbar-brand p-0 rounded"
                            style={{ maxWidth: "7rem", overflow: "hidden" }}>
                            <img
                                src={DigitalDinerLogo}

                                alt="Digital Diner Logo Image"
                                className="object-fit-cover w-100 h-100 rounded"
                            />
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarText">

                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100 gap-3 d-flex justify-content-lg-end  align-items-center">
                                <li className="nav-item" >
                                    <Link to={token ? "dashboard" : "login"}
                                        className="nav-link "
                                        style={{ maxWidth: "2rem" }}>
                                        {
                                            token ? (<img src={user?.profileImage} alt="user profile image" className="w-100 h-100 rounded-circle" style={{ scale: "1.7" }}  />)
                                                : (

                                                    <CgProfile className="w-100 h-100" style={{ scale: "1.7" }} />

                                                )
                                        }
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart" style={{ maxWidth: "2rem" }}>
                                        <PiShoppingCartSimpleBold className="w-100 h-100" style={{ scale: "2" }} />
                                    </Link>
                                </li>

                            </ul>

                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}