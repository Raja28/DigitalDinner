import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import toast, { Toaster } from 'react-hot-toast';
import { Provider } from "react-redux"
import { store } from './app/store.js';
import OpenRoute from './components/auth/OpenRoute.jsx';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Cart from './pages/Cart.jsx';
import AddressManager from './pages/AddressManager.jsx';
import Orders from './pages/Orders.jsx';

const router = createBrowserRouter([
  {
    path: '/', element: <App />, children: [
      { path: "/", element: <Home /> },
      { path: "signup", element: <OpenRoute><Signup /></OpenRoute> },
      { path: "login", element: <OpenRoute><Login /></OpenRoute> },
      { path: "/dashboard", element: <PrivateRoute><Dashboard /></PrivateRoute> },
      { path: "/cart", element: <Cart /> },
      { path: "/address", element:<PrivateRoute><AddressManager /> </PrivateRoute> },
      { path: "/orders", element:<PrivateRoute><Orders /> </PrivateRoute> },
    ]
  },
  // {
  //   path: '/', element: <Outlet />, children: [
  //     { path: "/", element: <Home /> }
  //   ]
  // },
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Toaster position="top-center" />
    <RouterProvider router={router}>
    </RouterProvider>,
  </Provider>
)
