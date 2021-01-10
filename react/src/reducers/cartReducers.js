import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD, CART_EMPTY } from "../constants/cartConstants";

export const cartReducer = (
    state = {cartItems:[]},
    action
) => {
    switch(action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;
            const existItem = state.cartItems.find(x => x.product === item.product);
            if(existItem){ // if product is exist
                return{
                    ...state,
                    cartItems: state.cartItems.map(x => x.product === existItem.product? item : x)
                }
            } else { // if product is new
                return{
                    ...state,
                    cartItems: [...state.cartItems, item] // add item to cartItems
                }
            }
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload) // filter out the product which id is same to payload id (delete item)
            }
        case CART_SAVE_SHIPPING_ADDRESS:
            return {...state, shippingAddress: action.payload}
        case CART_SAVE_PAYMENT_METHOD:
            return {...state, paymentMethod: action.payload}
        case CART_EMPTY:
            return {...state, cartItems:[]}
        default:
            return state;
    }
}