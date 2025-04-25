import { useState, useEffect, useCallback } from "react";
import { setOrders } from "../features/userSlice";
import { useDispatch } from "react-redux";

const BASEURL = import.meta.env.VITE_BASE_URL;

export default function useFetch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const dispatch = useDispatch()
    const fetchData = useCallback(async (query) => {

        setLoading(true);
        setError(null);
        setData(null);
        try {
            let res
            if (query) {
                res = await fetch(`${BASEURL}/user/menu/${query}`, {
                    method: 'GET',
                    credentials: 'include',
                });
            } else {
                res = await fetch(`${BASEURL}/user/menu/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`
                    },

                }
                );
            }

            if (!res.ok) throw new Error("Failed to fetch data");
            if (res.ok) {
                const json = await res.json();
                if (!query) {

                    dispatch(setOrders(json?.data))
                }
                setData(json?.data);
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, []);


    return { loading, error, data, fetchData };
}

