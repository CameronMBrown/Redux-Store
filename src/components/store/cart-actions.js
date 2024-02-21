import { cartActions } from "./cart-slice";
import { uiActions } from "./ui-slice";

const DB_URL = "https://redux-store-bf576-default-rtdb.firebaseio.com/cart.json"

// "Thunk" action creator
// this pattern is used to get around the redux rule that prevents 
// us running asyncronous code inside an action
export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "sending cart data",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        DB_URL,
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity
          }),
        }
      );
    
      if (!response.ok) {
        console.log(response)
        throw new Error("Sending cart data failed!");
      }
    }

    try {
      await sendRequest()

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent cart data successfully!",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart data failed!",
        })
      )
    }
  }
}

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(DB_URL)

      if (!response.ok) {
        throw new Error('Could not fetch cart data!')
      }

      const data = await response.json()
      return data
    }

    try {
      const cartData = await fetchData()
      dispatch(cartActions.replaceCart({
        items: cartData.items || [],
        totalQuantity: cartData.totalQuantity
      }))
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Fetching cart data failed!",
        })
      )
    }
  }
}