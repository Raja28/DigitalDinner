const BASEURL = import.meta.env.VITE_BASE_URL
export const deliveryMan = "https://res.cloudinary.com/dooxbo8sg/image/upload/v1730985280/ModernMobiles/Others/delivery-man.jpg"

export const SIGNUP_API = BASEURL + "/auth/signup"
export const LOGIN_API = BASEURL + "/auth/login"
export const ADD_TO_CART_API = BASEURL + "/user/add_to_cart"
export const REMOVE_FROM_CART_API = BASEURL + "/user/remove_from_cart"
export const ADDRESS_API = BASEURL + "/user/manage_address"
export const DELETE_ADDRESS_API = BASEURL + "/user/delete_address"
export const CART_QUANITY_API = BASEURL + "/user/manage_quantity"
export const CAPTURE_PAYMENT_API = BASEURL + "/payment/capturePayment"
export const VERIFY_PAYMENT_API = BASEURL + "/payment/verifyPayment"