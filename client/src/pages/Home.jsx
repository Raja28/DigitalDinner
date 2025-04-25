import carousel_1 from "../assets/carousel-1.png"
import carousel_2 from "../assets/carousel-2.png"
import carousel_3 from "../assets/carousel-3.jpg"
import carousel_4 from "../assets/carousel-4.jpg"
import carousel_5 from "../assets/carousel-5.jpeg"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import c1 from "../assets/c1.jpg"
import c2 from "../assets/c2.jpg"
import c3 from "../assets/c3.jpg"
import c4 from "../assets/c4.jpg"
import c5 from "../assets/c5.jpg"
import useFetch from "../hooks/useFetch"
import { useEffect, useState } from "react"
import { MdOutlineVerified } from "react-icons/md";
import { MdDangerous } from "react-icons/md";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, removeFromCart, setStatus } from "../features/userSlice"
import handlerRemoveFromCart from "../utils/operation"
import toast from "react-hot-toast"

const carouselImageList = [c1, c2, c3, c4, c5]
const carouselImageList2 = [carousel_1, carousel_2, carousel_3, carousel_4, carousel_5]
const menu = ["Appetizer", "Main Course", "Dessert", "Drink"]

export default function Home() {
    const { loading, error, data: menuItems, fetchData } = useFetch()
    const [currentMenu, setCurrentMenu] = useState("Appetizer")
    const { cart, token: userToken, status } = useSelector(state => state.userSlice)
    const dispatch = useDispatch()

    useEffect(()=>{
        if(status === "success"){
            dispatch(setStatus("idle"))
        }
    },[status])

    useEffect(() => {
        if (currentMenu) {
            fetchData(currentMenu)
        }
    }, [currentMenu, fetchData])

    function onChangeHandler(e) {
        const { value } = e.target
        setCurrentMenu(value)
    }

    function handlerAddToCart(menuItem) {
        const token = JSON.parse(sessionStorage.getItem("token")) || userToken
        if (!token) {
            toast.error("Login to add in cart")
            return
        }
        const data = {
            menuItem,
        }
        dispatch(addToCart(data))
    }


    // console.log(menuItems)
    return (
        <>

            <section className="container my-4" >
                <Carousel
                    autoPlay={true}
                    showThumbs={false}
                    infiniteLoop={true}
                    dynamicHeight={true}
                    interval={3000}
                    showArrows={true}
                    className="border border-danger"
                    style={{ maxHeight: "20rem" }}

                >
                    {carouselImageList.map((img) => (
                        <div key={img} style={{ height: "20rem" }}>
                            <img
                                src={img}
                                key={img}
                                alt="img-banner"
                                className="h-100 w-100 object-fit-cover"

                            />
                        </div>
                    ))}
                </Carousel>

                {/* <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner object-fit-contain" style={{ height: "20rem" }}>
                        {
                            carouselImageList.map(img => (
                                <div key={img} className="carousel-item active h-100 w-100 object-fit-contain" data-bs-interval="10000" >
                                    <img src={img} className="d-block w-100 h-100" alt="carousel-Image" />
                                </div>
                            ))
                        }

                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div> */}
            </section>

            <section className="my-3 container d-flex justify-content-end">
                <select
                    className="form-select"
                    style={{ maxWidth: "10rem" }}
                    onChange={onChangeHandler}
                >
                    {
                        menu?.map(menu => (
                            <option key={menu} value={menu} >{menu}</option>
                        ))
                    }

                </select>
            </section>

            <section className="container my-4">
                {
                    error ? (
                        <div>
                            <span>{error}</span>
                        </div>
                    ) : (
                        <>
                        {
                            status === "loading" && <div className="w-100 my-5 text-center">
                            <span>Loading...</span>
                        </div>
                    }
                    </>
                )
                }
                {
                    menuItems?.length === 0 && !error ? (
                        <div>
                            <span>No Items Available</span>
                        </div>
                    ) : (
                        menuItems?.map(item => (
                            <div key={item?._id} className="card mb-3 w-100" >
                                <div className="row g-0">
                                    <div className="col-md-4" style={{ maxHeight: "15rem" }}>
                                        <img src={item?.image_url} className="img-fluid rounded-start h-100 w-100 object-fit-cover" alt="..." />
                                    </div>
                                    <div className="col-md-8 ">
                                        <div className="card-body">
                                            <h4 className="card-title">{item?.name}</h4>
                                            <div className="card-text">
                                                <strong className="fw-semibold">Description:</strong>
                                                <p>{item?.description}</p>

                                            </div>
                                            <div className="d-flex justify-content-between align-items-end">
                                                <div>
                                                    <div className="card-text">
                                                        <strong className="fw-semibold">Category: </strong>
                                                        {item?.category}
                                                    </div>
                                                    <div className="card-text">
                                                        <strong className="fw-semibold">Type: </strong>
                                                        {item?.type}
                                                    </div>

                                                    <div className="card-text">
                                                        <p className="m-0">
                                                            {item?.is_vegan ? <MdOutlineVerified /> : <MdDangerous />} Vegan
                                                        </p>
                                                        <p className="m-0">
                                                            {item?.is_vegan ? <MdOutlineVerified /> : <MdDangerous />} Gluten free
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="card-text">
                                                        <p className="m-0 fw-semibold mb-2 text-center fs-5">
                                                            <MdOutlineCurrencyRupee /> {item?.price}
                                                        </p>
                                                        <div>
                                                            {
                                                                cart.some(cartItem => cartItem?.menuItem._id === item?._id) ? (
                                                                    <p
                                                                        onClick={() => handlerRemoveFromCart(item?._id, dispatch, cart)}
                                                                        className="m-0 btn btn-sm btn-danger">
                                                                        Remove
                                                                    </p>
                                                                ) : (
                                                                    <p
                                                                        onClick={() => handlerAddToCart(item?._id)}
                                                                        className="m-0 btn btn-sm btn-primary">
                                                                        Add to Cart
                                                                    </p>
                                                                )
                                                            }

                                                        </div>

                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                }
            </section >
        </>
    )
}