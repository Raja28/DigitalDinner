import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { MdOutlineVerified } from "react-icons/md";
import { MdDangerous } from "react-icons/md";
import { MdOutlineCurrencyRupee } from "react-icons/md";

import { IoIosAdd } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { FiPlus, FiMinus } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { PiShieldCheckFill } from "react-icons/pi";
import { useEffect, useState } from "react";
import handlerRemoveFromCart from "../utils/operation";
import { cartQuantity, checkout, setStatus } from "../features/userSlice";

export default function Cart() {
    const { token, cart, address, status, user } = useSelector(state => state.userSlice)
    const [selectedAddressIndex, setSelectAddressIndex] = useState(0)
    const [totalCost, setTotalCost] = useState(0)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        
        setTotalCost(
            cart?.reduce((acc, curr) => acc + (curr.menuItem.price * curr.quantity), 0)
        )
    }, [cart,status])

    function handlerProductQuantity(action, cartId) {

        dispatch(cartQuantity({ action, cartId }))
    }

    function handlerCheckout() {
        // { total, user, deliveryAddressId }
        const data = {
            total: totalCost,
            user,
            deliveryAddressId: address[selectedAddressIndex]?._id
        }
        dispatch(checkout(data))
    }

    return (
        <section className="container">
            {
                token === null ? (
                    <div className="d-flex justify-content-center align-items-center vh-100">
                        <div className="d-flex flex-column gap-3">
                            <span className="fs-4">Please Login</span>
                            <Link to={"/login"} className="btn btn-primary btn-sm">Login</Link>
                        </div>

                    </div>) :
                    (<>
                        <section className="d-flex flex-wrap flex-lg-nowrap gap-2" >
                            {/* left */}

                            <div className="" style={{ minWidth: "60vw" }}>
                                {
                                    cart?.length == 0 ? (
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center my-4 " >
                                            <span>Add item avialable</span>
                                        </div>
                                    )
                                        :
                                        (
                                            <div className="px-4 my-4">
                                                {/* address */}
                                                <section className="d-flex justify-content-between align-items-center border-bottom">
                                                    <div className="mb-2">
                                                        <p className="m-0">{address[selectedAddressIndex]?.name} ({address[selectedAddressIndex]?.contact})</p>
                                                        <p className="m-0">{address[selectedAddressIndex]?.address}</p>
                                                    </div>
                                                    <p className="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#changeAddress">Change</p>
                                                </section>

                                                {/* Cart */}
                                                <section className="my-3">
                                                    {
                                                        cart?.map(item => (
                                                            <div key={item?._id} className="card mb-3 p-0" >
                                                                <div className="row g-0">
                                                                    <div className="col-md-4" style={{ maxHeight: "15rem" }}>
                                                                        <img src={item.menuItem.image_url} className="img-fluid rounded-start h-100 w-100 object-fit-cover" alt={item.menuItem.name + "image"} />
                                                                    </div>
                                                                    <div className="col-md-8">
                                                                        <div className="card-body">
                                                                            <h4 className="card-title">{item.menuItem?.name}</h4>
                                                                            <div className="card-text">
                                                                                <strong className="fw-semibold">Description:</strong>
                                                                                <p>{item.menuItem?.description}</p>

                                                                            </div>
                                                                            <div className="d-flex justify-content-between align-items-end">
                                                                                <div>
                                                                                    <div className="card-text">
                                                                                        <strong className="fw-semibold">Category: </strong>
                                                                                        {item.menuItem?.category}
                                                                                    </div>
                                                                                    <div className="card-text">
                                                                                        <strong className="fw-semibold">Type: </strong>
                                                                                        {item.menuItem?.type}
                                                                                    </div>

                                                                                    <div className="card-text">
                                                                                        <p className="m-0">
                                                                                            {item.menuItem?.is_vegan ? <MdOutlineVerified /> : <MdDangerous />} Vegan
                                                                                        </p>
                                                                                        <p className="m-0">
                                                                                            {item.menuItem?.is_vegan ? <MdOutlineVerified /> : <MdDangerous />} Gluten free
                                                                                        </p>
                                                                                    </div>
                                                                                </div>

                                                                                <div>
                                                                                    <div className="card-text">
                                                                                        {/* <p className="m-0 fw-semibold mb-2 text-center fs-5">
                                                                                            <MdOutlineCurrencyRupee /> {item?.price}
                                                                                        </p> */}
                                                                                        <div>
                                                                                            <div className="d-flex justify-content-between mb-1 ">
                                                                                                <button

                                                                                                    onClick={() => handlerProductQuantity("decrease", item?._id)}
                                                                                                    disabled={item?.quantity === 1 ? true : false}
                                                                                                    className="py-0 mx-2  btn btn-outline-info btn-sm ">
                                                                                                    <FiMinus className="text-dark" />
                                                                                                </button>

                                                                                                {item?.quantity}
                                                                                                <button
                                                                                                    onClick={() => handlerProductQuantity("increase", item?._id)}
                                                                                                    className="mx-2 py-0  btn btn-outline-info btn-sm">
                                                                                                    <FiPlus className="text-dark" />
                                                                                                </button>
                                                                                            </div>

                                                                                            <button
                                                                                                disabled={status === "loading" ? true : false}
                                                                                                onClick={() => handlerRemoveFromCart(item.menuItem?._id, dispatch, cart)}
                                                                                                className="m-0 btn btn-sm btn-danger float-end w-100">
                                                                                                Remove
                                                                                            </button>


                                                                                        </div>

                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </section>
                                            </div>
                                        )
                                }
                            </div>

                            {/* right */}
                            <div className="container p-0 px-2 my-4" style={{ minWidth: "25vw" }}>
                                <div>
                                    <h3 className="">Order Summery:</h3>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <p> <strong>Price ({cart?.length} {cart?.length <= 1 ? "item" : "items"})</strong></p>
                                        <p> <FaIndianRupeeSign /> {totalCost}</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p> <strong>Discount</strong> </p>
                                        <p>---</p>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p> <strong>Delivery</strong> </p>
                                        <p>---</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <p className=" m-0"> <strong>Total Amount</strong> </p>
                                    <p className=" m-0"> <FaIndianRupeeSign /> {totalCost} </p>
                                </div>
                                <hr />
                                <div
                                    onClick={() => handlerCheckout()}

                                    className=" text-center my-3" >
                                    <button
                                        disabled={status === "loading" ? true : false}
                                        className="btn btn-success w-75 my-auto">
                                        Checkout

                                    </button>
                                </div>
                            </div>
                        </section>
                    </>)
            }

            {/* <!-- Modal --> */}
            <div className="modal fade" id="changeAddress" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <ul className="list-group list-group-flush">
                                {
                                    address?.map((address, index) => (
                                        <li key={address?._id}
                                            onClick={() => setSelectAddressIndex(index)}
                                            data-bs-dismiss="modal"
                                            style={{ cursor: "pointer" }}
                                            className={`list-group-item  ${index !== selectedAddressIndex ? "list-group-item-action" : ""}`}>
                                            <div>
                                                <strong>Name:</strong>
                                                {" " + address.name}
                                            </div>
                                            <div>
                                                <strong>Contact:</strong>
                                                {" " + address.contact}
                                            </div>
                                            <div>
                                                <strong>Address:</strong>
                                                {" " + address.address}
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success btn-sm" data-bs-dismiss="modal">Save</button>
                            {/* <button type="button" className="btn btn-primary">Save changes</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
