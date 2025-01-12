import { AddCircleHalfDotIcon } from "hugeicons-react";
import axios from 'axios';

const Movie = ({ imageSource, title, rating, year, genres }) => {

    const handleAdd = async () => {

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;

            if (!token) {
                throw new Error("User is not authenticated.");
            }

            const watched = false;
            const addRating = 1;
            let genresName = [];

            for (let i = 0; i < genres.length; i++) {
                genresName.push(genres[i].name);
            }

            const response = await axios.post(
                "http://localhost:4000/api/v1/movies/",
                {
                    title,
                    poster: imageSource,
                    rating: addRating,
                    releaseYear: year,
                    genres: genresName,
                    watched: watched,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data);

        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to fetch movies.");
        }

    }
    return (
        <div className="movie">
            <div className="movieInfoContainer">
                <h3> {title} </h3>
                <p> {`Rating: ${rating}/10`}</p>
            </div>
            <img src={imageSource} alt="movie image" />
            <AddCircleHalfDotIcon onClick={handleAdd} />

        </div>
    );
}

export default Movie;