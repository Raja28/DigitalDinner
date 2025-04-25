import { removeFromCart } from "../features/userSlice"



export default function handlerRemoveFromCart(itemId, dispatch, cart) {
    const data = {
        cartItemId: cart?.find(cart => cart?.menuItem._id === itemId)._id
    }
    
    dispatch(removeFromCart(data))
}