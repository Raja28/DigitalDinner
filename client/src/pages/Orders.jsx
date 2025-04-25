import { useEffect } from "react"
import { setStatus } from "../features/userSlice"
import useFetch from "../hooks/useFetch"
import { MdOutlineCurrencyRupee } from "react-icons/md";

export default function Orders() {
    const { loading, error, data, fetchData } = useFetch()
    useEffect(() => {
        setStatus('idle')
        fetchData()

    }, [])

    return (
        <>
            <section className="container">
                <div className="w-100 text-center my-4">
                    <h2>Orders</h2>
                </div>
                {
                    loading && (
                        <div className="w-100 d-flex justify-content-center align-items-center my-5">
                            <span>Loading...</span>
                        </div>
                    )
                }

                {
                    !loading && error && (
                        <div className="w-100 d-flex justify-content-center align-items-center">
                            <span>{error}</span>
                        </div>
                    )
                }

                {
                    !loading && data && (
                        <div>
                            {
                                data?.map(order => (
                                    <div key={order?._id} className="card mb-3 w-100"  >
                                        <div className="row g-0">
                                            <div className="col-md-4" style={{ maxHeight: "15rem" }}>
                                                <img src={order?.cart?.menuItem?.image_url} className="img-fluid rounded-start h-100 w-100 object-fit-cover" alt="" />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body">

                                                    <h5 className="card-title">{order?.cart?.menuItem?.name}</h5>
                                                    <p className="card-text">{order?.cart?.menuItem?.description}</p>

                                                    <div className="d-flex justify-content-between align-items-end">
                                                        <div>
                                                            <p className="m-0"><strong>Order details:</strong></p>
                                                            <p className="m-0">Name: {order?.address?.name}</p>
                                                            <p className="m-0">Contact: {order?.address?.contact}</p>
                                                            <p className="m-0">Address: {order?.address?.address}</p>
                                                            <p className="m-0">Date: {new Date(order?.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div>
                                                            <div className="d-flex flex-column">
                                                                <div className="fw-semibold">
                                                                    <MdOutlineCurrencyRupee />
                                                                    {order?.totalPrice}
                                                                </div>
                                                                <div>
                                                                    <span>Quantity: {order?.cart?.quantity}</span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </section>
        </>
    )
}