import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/sign-in/SignIn";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import RootLayout from "./pages/RootLayout";
import AuthLayout from "./pages/AuthLayout";
import Home from "./pages/home/Home";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setUser } from "./redux/userSlice";
import api from "./utils/axios";

function App() {
 
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userId = localStorage.getItem('user_id')
  const isLoading = useSelector((state) => state.user.isLoading);
  const error = useSelector((state) => state.user.error);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      dispatch(setLoading(true));
      try {
        const response = await api.get(`/users/${userId}`);
      
        dispatch(setUser(response.data));
      } catch (err) {
        dispatch(setError(err.toString()));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUserDetails();
  }, [dispatch, userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      {/* <Navbar /> */}
      <Toaster />

      <div className="mt-0">
      <Routes>
        {user ? (
         
            <Route element={<RootLayout />}>
              <Route index path="/home" element={<Home />} />
              {/* <Route  path="*" element={<Home />} /> */}
              <Route path="*" element={<Navigate to="/home" />} />

            </Route>
         
        ) : (
          
            <Route element={<AuthLayout />}>

              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="*" element={<Navigate to="/sign-up" />} />
            </Route>
        
        )}
      </Routes>
      </div>
    </div>
  );
}

export default App;