import { useAuthContext } from "./useAuthContext"
import { useWatchlistContext } from "./useWatchlistContext";

export const useLogout = () => {

    const {dispatch} = useAuthContext();
    const {dispatch: watchlistDispatch} = useWatchlistContext();

    const logout = () => {
        localStorage.removeItem('user')
        dispatch({type:'LOGOUT'})
        watchlistDispatch({type: 'SET_WORKOUTS', payload:null})
    }

    return { logout }
    
}