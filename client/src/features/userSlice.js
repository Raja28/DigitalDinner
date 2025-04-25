import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { ADD_TO_CART_API, ADDRESS_API, CAPTURE_PAYMENT_API, CART_QUANITY_API, DELETE_ADDRESS_API, LOGIN_API, REMOVE_FROM_CART_API, SIGNUP_API, VERIFY_PAYMENT_API } from "../utils/api"
import toast from "react-hot-toast"
import logo from "../assets/Digital-Diner-Logo-1.png"
const logoLink = "https://res.cloudinary.com/dooxbo8sg/image/upload/v1745510220/Digital%20Diner/Logo/Digital-Diner-Logo-1_c67tcx.png"

// Razorpay payment modal script
function loadScript(src) {

    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src

        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }

        document.body.appendChild(script)
    })
}

export const userSignup = createAsyncThunk("posts/userSignup", async (data, { rejectWithValue }) => {
    try {
        console.log(SIGNUP_API, data);

        const resp = await axios.post(SIGNUP_API, data)

        if (resp?.data?.success) {
            toast.success("Signup successful")
        }
        return resp?.data
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error);
        return rejectWithValue(error.response.data.message)
    }
})

export const userLogin = createAsyncThunk("posts/userLogin", async (data, { rejectWithValue }) => {
    try {
        const resp = await axios.post(LOGIN_API, data)

        if (resp?.data?.success) {
            toast.success("Login successful")
        }
        return resp?.data
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error);
        return rejectWithValue(error.response.data.message)
    }
})

export const addToCart = createAsyncThunk('posts/addToCart', async (data, { rejectWithValue }) => {
    try {
        const resp = await axios.post(ADD_TO_CART_API, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`
            }
        })

        if (resp?.data?.success) {
            toast.success("Added to cart")
        }
        return resp?.data.newItem
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error);
        return rejectWithValue(error.response.data.message)
    }
})

export const removeFromCart = createAsyncThunk('posts/removeFromCart', async (data, { rejectWithValue }) => {
    try {
        const resp = await axios.post(REMOVE_FROM_CART_API, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`
            }
        })

        if (resp?.data?.success) {
            toast.success("Removed from cart")
        }

        return resp?.data?.removedItem
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error);
        return rejectWithValue(error.response.data.message)
    }
})

export const addressManager = createAsyncThunk("posts/addressManager", async (data, { rejectWithValue }) => {
    try {
        const resp = await axios.post(ADDRESS_API, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`
            }
        })
        if (resp?.data?.success) {
            toast.success(resp?.data?.message)
        }
        return resp?.data?.address
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error);
        return rejectWithValue(error.response.data.message)
    }
})

export const deleteUserAddress = createAsyncThunk("posts/deleteUserAddress", async (data, { rejectWithValue }) => {
    try {
        const resp = await axios.post(DELETE_ADDRESS_API, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        })
        if (resp?.data?.success) {
            toast.success("Address deleted successfully")
        }
        return resp?.data?.address
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error);
        return rejectWithValue(error.response.data.message)
    }
})

export const cartQuantity = createAsyncThunk('posts/cartQuantity', async (data, { rejectWithValue }) => {
    try {
        const resp = await axios.post(CART_QUANITY_API, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        })
        return resp?.data?.updatedItem
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error);
        return rejectWithValue(error.response.data.message)
    }
})

export const checkout = createAsyncThunk("posts/checkout", async ({ total, user, deliveryAddressId }, { dispatch, rejectWithValue }) => {

    const toastId = toast.loading("Please wait...")
    try {
        const tokenPayload = {
            headers: {
                "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        }
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if (!res) {
            toast.dismiss(toastId)
            toast.error("RazorPay SDK failed to load")
            return
        }
        const orderResponse = await axios.post(CAPTURE_PAYMENT_API, { total }, tokenPayload)

        if (!orderResponse.data.success) {
            toast.dismiss(toastId)
            toast.error(orderResponse.data.message)
            return
        }

        const receipt = orderResponse.data.data.receipt
        // open razorpay sdk
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            curreny: orderResponse.data.data.curreny,
            amount: orderResponse.data.data.amount,
            order_id: orderResponse.data.data.id,
            name: "ModernMobiles",
            description: "Thank you for Purchasing",
            image: logo,
            prefill: {
                name: `${user?.name}`,
                email: user?.email,
                contact: user?.number
            },

            handler: function (response) {
                const amount = total
                toast.dismiss(toastId)
                dispatch(verifyPayment({ ...response, deliveryAddressId, amount, receipt }))
            }
        }
        toast.dismiss(toastId)
        const paymentObject = new window.Razorpay(options)

        paymentObject.open()
        paymentObject.on("payment.failed", function (response) {
            toast.dismiss(toastId)
            toast.error("Oops! Payment Failed")
            console.log(response.error);
        })

    } catch (error) {
        toast.dismiss(toastId)
        console.log("PAYMENT API ERROR", error);

        toast.error("Could Not Make Payment")
    }
})

export const verifyPayment = createAsyncThunk("posts/verifyPayment", async (bodyData, { rejectWithValue }) => {

    const toastId = toast.loading("Verifying Payment...")
    try {
        const tokenPayload = {
            headers: {
                "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`
            }
        }
        const response = await axios.post(VERIFY_PAYMENT_API, bodyData, tokenPayload)

        if (!response?.data?.success) {
            toast.dismiss(toastId)
            toast.error(response?.data?.message)
        }

        toast.dismiss(toastId)
        toast.success("Payment Successful, Your Order is Placed")


    } catch (error) {
        toast.dismiss(toastId)
        console.log("PAYMENT VERIFY ERROR............", error)
        toast.error(error.response.data.message)
        return rejectWithValue(error.response.data.message)
    }
})

const initialState = {
    user: sessionStorage.getItem('user') !== null ? JSON.parse(sessionStorage.getItem('user')) : [],
    orders: sessionStorage.getItem('orders') !== null ? JSON.parse(sessionStorage.getItem('orders')) : [],
    cart: sessionStorage.getItem('cart') !== null ? JSON.parse(sessionStorage.getItem('cart')) : [],
    token: sessionStorage.getItem('token') !== null ? JSON.parse(sessionStorage.getItem('token')) : null,
    address: sessionStorage.getItem('address') !== null ? JSON.parse(sessionStorage.getItem('address')) : [],
    status: "idle",
    error: null
}

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        clearReducer: (state) => {
            state.user = []
            state.orders = []
            state.cart = []
            state.token = null
        },
        setStatus: (state, {payload})=>{
            state.status = payload
        },
        setOrders: (state, {payload})=>{
            state.orders = payload
            state.user.order = payload
            sessionStorage.setItem('orders', JSON.stringify(payload))
        }
    },

    extraReducers: (builder) => {
        builder.addCase(userSignup.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(userSignup.fulfilled, (state, { payload }) => {

            state.user = payload?.user
            state.token = payload?.token
            sessionStorage.setItem("user", JSON.stringify(state.user))
            sessionStorage.setItem("token", JSON.stringify(state.token))
            state.status = 'success'
        })
        builder.addCase(userSignup.rejected, (state, { payload }) => {

            state.status = 'error'
            state.error = payload
        })
        builder.addCase(userLogin.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(userLogin.fulfilled, (state, { payload }) => {

            state.user = payload?.user
            state.orders = payload?.user?.orders
            state.cart = payload?.user?.cart
            state.token = payload?.token
            state.address = state.user.address
            sessionStorage.setItem("user", JSON.stringify(state.user))
            sessionStorage.setItem("token", JSON.stringify(state.token))
            sessionStorage.setItem("orders", JSON.stringify(state.orders))
            sessionStorage.setItem("cart", JSON.stringify(state.cart))
            sessionStorage.setItem("address", JSON.stringify(state.address))
            state.status = 'success'
        })
        builder.addCase(userLogin.rejected, (state, { payload }) => {

            state.status = 'error'
            state.error = payload
        })
        builder.addCase(addToCart.pending, (state,) => {
            state.status = 'pending'
        })
        builder.addCase(addToCart.fulfilled, (state, { payload }) => {
            state.cart.unshift(payload)
            state.user.cart = state.cart
            sessionStorage.setItem('cart', JSON.stringify(state.cart))
            state.status = 'success'
        })
        builder.addCase(addToCart.rejected, (state, { payload }) => {
            state.status = 'error'
            state.error = payload
        })
        builder.addCase(removeFromCart.pending, (state,) => {
            state.status = 'pending'
        })
        builder.addCase(removeFromCart.fulfilled, (state, { payload }) => {
            // payload has the _id of removed item

            state.cart = state.cart.filter(item => item._id !== payload);
            state.user.cart = state.cart
            sessionStorage.setItem('cart', JSON.stringify(state.cart));
            state.status = 'success';
        })
        builder.addCase(removeFromCart.rejected, (state, { payload }) => {
            state.status = 'error'
            state.error = payload
        })
        builder.addCase(addressManager.pending, (state,) => {
            state.status = 'pending'
        })
        builder.addCase(addressManager.fulfilled, (state, { payload }) => {

            const oldAddressIndex = state.address.findIndex(address => address._id === payload._id)
            if (oldAddressIndex !== -1) {
                state.address[oldAddressIndex] = payload
            } else {
                state.address.unshift(payload)
            }
            state.user.address = state.address
            sessionStorage.setItem('address', JSON.stringify(state.address));
            state.status = 'success';
        })
        builder.addCase(addressManager.rejected, (state, { payload }) => {
            state.status = 'error'
            state.error = payload
        })
        builder.addCase(deleteUserAddress.pending, (state,) => {
            state.status = 'pending'
        })
        builder.addCase(deleteUserAddress.fulfilled, (state, { payload }) => {

            state.address = state.address.filter(address => address._id !== payload._id)
            state.user.address = state.address
            sessionStorage.setItem('address', JSON.stringify(state.address));
            state.status = 'success';
        })
        builder.addCase(deleteUserAddress.rejected, (state, { payload }) => {
            state.status = 'error'
            state.error = payload
        })
        builder.addCase(cartQuantity.pending, (state,) => {
            state.status = 'pending'
        })
        builder.addCase(cartQuantity.fulfilled, (state, { payload }) => {

            const cartIndex = state.cart.findIndex(cart => cart._id === payload._id)
            state.cart[cartIndex] = payload
            state.user.cart = state.cart
            sessionStorage.setItem('cart', JSON.stringify(state.cart));
            state.status = 'success';
        })
        builder.addCase(cartQuantity.rejected, (state, { payload }) => {
            state.status = 'error'
            state.error = payload
        })
        builder.addCase(checkout.pending, (state) => {
            state.status = "loading"
        });
        builder.addCase(checkout.fulfilled, (state) => {
            state.status = "idle"
        });
        builder.addCase(checkout.rejected, (state, { payload }) => {
            state.status = "error"
            state.error = payload
        });

        builder.addCase(verifyPayment.pending, (state) => {
            state.status = "loading"

        });

        builder.addCase(verifyPayment.fulfilled, (state, { payload }) => {
            state.cart = []
            state.user.cart = []
            state.status = "success"
            localStorage.setItem("cart", JSON.stringify([]))
        });
        builder.addCase(verifyPayment.rejected, (state, { payload }) => {

            state.status = "error"
            state.error = payload
        });
    }
})

export const { clearReducer, setStatus, setOrders } = userSlice.actions
export default userSlice.reducer