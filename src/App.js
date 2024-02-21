// react
import { useEffect, useState } from "react";

// redux
import { useSelector, useDispatch } from "react-redux";
import { fetchCartData, sendCartData } from "./components/store/cart-actions";

// components
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";

let isInitialLoad = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.isCartVisable);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  // fetch existing cart data on load
  useEffect(() => {
    dispatch(fetchCartData())
  }, [dispatch])

  // save changes to cart in firebase
  useEffect(() => {
    if (isInitialLoad) {
      isInitialLoad = false;
      return;
    }

    if (cart.changed) {
      dispatch(sendCartData(cart))
    }
  }, [cart, dispatch]);

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
