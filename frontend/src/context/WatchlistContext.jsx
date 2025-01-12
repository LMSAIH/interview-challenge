import { createContext, useReducer } from "react";

export const watchlistContext = createContext();

export const watchlistReducer = (state, action) => {
  switch (action.type) {
    case "SET_MOVIES":
      return {
        movies: action.payload,
      };
    case "CREATE_MOVIE": 
      return {
        movies: [action.payload, ...state.movies], 
      };
    case "DELETE_MOVIE":
      return {
        movies: state.movies.filter((movie) => movie._id !== action.payload._id),
      };
    case "UPDATE_MOVIE":
      return {
        movies: state.movies.map((movie) =>
          movie._id === action.payload._id ? action.payload : movie
        ),
      };
    default:
      return state;
  }
};

export const WatchlistContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(watchlistReducer, {
    movies: null, 
  });

  return (
    <watchlistContext.Provider value={{ ...state, dispatch }}>
      {children}
    </watchlistContext.Provider>
  );
};
