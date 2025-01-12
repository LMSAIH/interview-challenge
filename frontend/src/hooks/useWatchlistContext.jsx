import { watchlistContext } from "../context/WatchlistContext";
import { useContext } from "react";

export const useWatchlistContext = () => {
    const context = useContext(watchlistContext);

    if(!context){
        throw Error("use workout context must be used inside a workouts context provider");
    }
    
    return context;
}