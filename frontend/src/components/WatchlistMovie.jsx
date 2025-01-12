import { EyeIcon } from "hugeicons-react";
import { Clock01Icon } from "hugeicons-react";
import { Delete01Icon } from "hugeicons-react";
import axios from 'axios';

const WatchlistMovie = ({ title, rating, poster, watched, year, id }) => {

    const updateMovie = async (changes) => {

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;

            if (!token) {
                throw new Error("User is not authenticated.");
            }

            const response = await axios.put(`http://localhost:4000/api/v1/movies/${id}`,
                changes
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

        } catch (err) {
            console.error(err);
        }
    }

    const handleRating = () => {
        const input = document.getElementById(`rating${id}`);
        const newRating = parseInt(input.value);

        if (isNaN(rating)) {
            console.error("rating is not a number for whatever reason");
        }

        updateMovie({ rating: newRating, watched: true })
    }

    const handleWatched = () => {

        if (watched) {
            updateMovie({ watched: false });
        } else {
            updateMovie({ watched: true });
        }

    }

    const handleDelete = async () => {

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;

            if (!token) {
                throw new Error("User is not authenticated.");
            }

            const response = await axios.delete(`http://localhost:4000/api/v1/movies/${id}`,{
                headers: {
                Authorization: `Bearer ${token}`,
                }
            });

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="watchlistMovie">
            <h3>{title}</h3>
            {watched ? (<p>Your rating: {rating}</p>) :
                (<div className="ratingUpdater">
                    <button onClick={handleRating}>Rate</button>
                    <input type="range" min="1" max="5" id={`rating${id}`}></input>
                </div>)}
            <img src={poster} alt="watchlist movie poster" />
            <div className="watchlistMovieStatus">
                {watched ? <EyeIcon className="watchedEyeIcon" onClick={handleWatched} /> : <Clock01Icon className="notWatchedIcon" onClick={handleWatched} />}
                <p>{year}</p>
                <Delete01Icon className="deleteIcon" onClick={handleDelete} />
            </div>
        </div>
    );
}

export default WatchlistMovie;