import { clearAuthData } from "@/redux/auth/authSlice"
import { persistor, store } from "@/redux/Store";
import axiosInstance from '@/axiosconfig';


export const handleLogout = async () => {
    
    try {
        const response = await axiosInstance.post('/logout/')
        console.log('HANDLE LOGOUT')
        console.log(response)
        if (response.status == 200) {
            store.dispatch(clearAuthData());
            await persistor.purge();
            window.location.href = '/login';

        } else {
            console.error('Logout failed on the backend. Status:', response.status);
        }
    } catch (error) {
        console.log('logout failed:', error)
    }

}