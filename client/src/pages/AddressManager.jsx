import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Header from "../components/Header"
// import Footer from "../components/Footer"
import { deliveryMan } from "../utils/api";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
// import { addUserAddress, deleteUserAddress, updateUserAddress } from "../features/userSlice"
import toast from "react-hot-toast"
import { addressManager, deleteUserAddress } from "../features/userSlice";

export default function ManageAddress() {
    const { user, status, address: originalAddress } = useSelector(state => state.userSlice)
    const dispatch = useDispatch()

    // const { address: originalAddress } = userSlice

    const [editAddress, setEditAddress] = useState(false);
    const [editBtnIdentifyNum, setEditBtnIdentifierNum] = useState("");
    const [addressIndex, setAddressIndex] = useState(-1)

    const [userAddress, setUserAddress] = useState({
        name: "",
        address: "",
        contact: "",
        addressId: ""
    });

    function handlerOnChange(e) {
        const { name, value } = e.target

        setUserAddress(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handlerEditAddress(addressId) {
        setEditAddress(prev => !prev)

        if (!editAddress) {

            setEditBtnIdentifierNum(addressId)
            const addressIdx = originalAddress.findIndex(add => add._id === addressId)
            setAddressIndex(addressIdx)
            const { name, address, contact } = originalAddress[addressIdx]
            setUserAddress({
                name, address, contact
            })

        } else {
            setUserAddress({
                name: "",
                address: "",
                contact: ""
            })
            setEditBtnIdentifierNum("")
        }
    }

    function handlerOnSubmitAddEditAddress() {
        // console.log(userAddress)
        // return

        // if edit is true - update data
        if (editAddress) {

            // check wheather user made any changes in the existing data or not, If changes made by 
            // the user make call, else show toast to the user and return

            const { name, address, contact } = originalAddress[addressIndex]

            if (name === userAddress.name && contact === userAddress.contact &&
                address === userAddress.address
            ) {
                toast.error("No changes so far")
                return
            }
            const updatedData = userAddress
            updatedData.addressId = editBtnIdentifyNum
            dispatch(addressManager(userAddress))

        } else {
            // add new addresss
            if (!userAddress.name || !userAddress.contact || !userAddress.address) {
                toast.error("All Fields Required")
                return
            }
            dispatch(addressManager(userAddress))

        }

        setUserAddress({
            name: "",
            address: "",
            state: "",
            contact: ""
        })
        setEditAddress(false)
        setEditBtnIdentifierNum("")
    }

    function handlerDeleteAddress(addressId) {
        dispatch(deleteUserAddress({addressId}))

    }

    return (
        <>
            <div className="container " >
                <h3 className=" text-center">MANAGE ADDRESS</h3>
                <div className="d-flex mt-4 gap-2 flex-wrap-reverse flex-lg-nowrap" style={{ minHeight: "calc(100vh - 8.5rem)" }}>
                    {/* left part */}
                    <div className="w-100" style={{ minWidth: "50%", }}>

                        {
                            originalAddress.length == 0 ?
                                (
                                    <div className="text-center d-flex flex-column align-items-center justify-content-center  "
                                        style={{ minHeight: "" }}>

                                        <img src={deliveryMan}
                                            alt="delivery-man"
                                            className="img-fluid  object-fit-contain"
                                            style={{ height: "20rem" }}
                                        />

                                        <p className="fw-semibold my-2">No Address Found</p>
                                    </div>
                                ) :
                                (
                                    <div className="overflow-auto vh-auto"  >
                                        <ul className="list-group list-group-flush list-group-numbered">
                                            {
                                                originalAddress?.map((address, index) => (
                                                    <li key={index} className="list-group-item d-flex flex-wrap justify-content-between 
                                                     my-2 shadow-sm">
                                                        <div className="card-body">
                                                            <p className="m-0"><strong>Name: </strong> {address?.name}</p>
                                                            <p className="m-0"><strong>Phone: </strong>{address?.contact}</p>
                                                            <p className="m-0"><strong>Address: </strong>
                                                                {address?.address}
                                                            </p>
                                                        </div>

                                                        <div className="d-flex flex-sm-column my-2  
                                                          gap-2">
                                                            {
                                                                editAddress && editBtnIdentifyNum === address?._id ? (

                                                                    <button type="button"
                                                                        onClick={() => handlerEditAddress()}
                                                                        className="btn btn-warning btn-sm"
                                                                        disabled={status === "loading" || editAddress && editBtnIdentifyNum !== address?._id ? true : false}
                                                                    >
                                                                        Canel Edit
                                                                    </button>
                                                                )
                                                                    : (<button
                                                                        onClick={() => handlerEditAddress(address?._id)}
                                                                        className="btn btn-warning btn-sm "
                                                                        disabled={status === "loading" || editAddress && editBtnIdentifyNum !== address?._id ? true : false}
                                                                    >
                                                                        Edit
                                                                        <CiEdit className="mx-2" />
                                                                    </button>)
                                                            }
                                                            <button
                                                                onClick={() => handlerDeleteAddress(address?._id)}
                                                                className="btn btn-danger btn-sm"
                                                                disabled={status === "loading" ? true : false}
                                                            >
                                                                Delete
                                                                <RiDeleteBin6Line className="mx-2" />
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                )
                        }

                    </div>

                    {/* right */}
                    <div className="w-100  p-4" style={{ minWidth: "50%", height: "100%" }}>
                        <div className="card
                         border mx-auto  shadow" style={{ minWidth: "90%", minHeight: "85%" }}>
                            <div className="card-body ">

                                {/* first */}
                                <div className="mb-3 w-100">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        required={true}
                                        value={userAddress.name}
                                        onChange={handlerOnChange}
                                        placeholder="Name" />
                                </div>


                                {/* phone  */}

                                <div className="w-100">
                                    <label htmlFor="phone">Phone</label>
                                    <input type="text"

                                        className="form-control"
                                        id="phone"
                                        name="contact"
                                        required={true}
                                        value={userAddress.contact}
                                        onChange={handlerOnChange}
                                        placeholder="1234567890" />
                                </div>



                                <div className="my-2 w-100">
                                    <label htmlFor="address">Address</label>
                                    <textarea type="text"
                                        rows={2}
                                        cols={22}
                                        required={true}
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        value={userAddress.address}
                                        onChange={handlerOnChange}
                                        placeholder="1234 Main St" />
                                </div>

                                {
                                    editAddress ? (
                                        <div className="d-flex gap-2 mt-3 justify-content-end">

                                            <button type="button"
                                                disabled={status === "loading" ? true : false}
                                                onClick={() => handlerOnSubmitAddEditAddress()}
                                                className="btn btn-success btn-sm">
                                                Save
                                            </button>

                                            <button type="button"
                                                disabled={status === "loading" ? true : false}
                                                onClick={() => handlerEditAddress()}
                                                className="btn btn-warning btn-sm">
                                                Canel Edit
                                            </button>
                                        </div>
                                    )
                                        : (
                                            <div className="mt-3 ">

                                                <button
                                                    onClick={() => handlerOnSubmitAddEditAddress()}
                                                    type="buton"
                                                    disabled={status === "loading" ? true : false}
                                                    className="btn btn-primary btn-sm float-end">
                                                    Add New Address
                                                </button>
                                            </div>
                                        )
                                }

                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}