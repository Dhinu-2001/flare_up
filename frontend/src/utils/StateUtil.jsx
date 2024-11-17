import { clearAuthData, setNewToken } from "@/redux/auth/authSlice"
import { persistor } from "@/redux/Store";
import axiosInstance from '@/axiosconfig';

export const handleLogout = async () => {
    
    try {
        const response = await axiosInstance.post('/logout/')
        console.log(response)
        if (response.status == 200) {
            store.dispatch(clearAuthData());
            await persistor.purge();
        } else {
            console.error('Logout failed on the backend. Status:', response.status);
        }
    } catch (error) {
        console.log('logout failed:', error)
    }

}