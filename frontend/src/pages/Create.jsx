import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const genresList = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
    "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"
];

const Create = () => {

    const [formData, setFormData] = useState({
        title: "",
        rating: 1,
        watched: "",
        releaseYear: "",
        poster: "https://resizing.flixster.com/jve6PoL2ST_xL8G8Kx_30ca-5qk=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzRmY2NmODZkLWVhYjYtNGE3MC1hMTRlLWM0MTJhNDBkMDM0YS53ZWJw",
        genres: [],
    });

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        console.log(value);

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                genres: checked
                    ? [...prev.genres, value]
                    : prev.genres.filter((genre) => genre !== value),
            }));
        } else if (type === "radio") {
            setFormData((prev) => ({
                ...prev,
                [name]: value === "true",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: ["releaseYear", "rating"].includes(name)
                    ? parseInt(value, 10)
                    : value,
            }));
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !formData.title ||
            !formData.rating ||
            formData.watched === "" ||
            !formData.releaseYear ||
            !formData.poster ||
            formData.genres.length === 0
        ) {
            setError("All fields are mandatory.");
            return;
        }

        try {

            const user = JSON.parse(localStorage.getItem("user"));
            const token = user?.token;

            if (!token) {
                throw new Error("User is not authenticated.");
            }

            const response = await axios.post(`http://localhost:4000/api/v1/movies/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            navigate("/watchlist");
            setError("");

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="create">
            <h2>Add a movie to your watchlist! </h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="createForm">

                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="rating">Rating (1-5): if not watched, leave it at 1</label>
                <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a rating</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>

                <label>Watched:</label>
                <div className="watchedRadios">
                    <label>
                        <input
                            type="radio"
                            name="watched"
                            value="true"
                            onChange={handleChange}
                        />
                        Yes
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="watched"
                            value="false"
                            onChange={handleChange}
                        />
                        No
                    </label>
                </div>

                <label htmlFor="releaseYear">Release Year:</label>
                <input
                    type="number"
                    id="releaseYear"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                />

                <label htmlFor="poster">Poster URL: -it has a default url, in case you don't have one- </label>
                <input
                    type="url"
                    id="poster"
                    name="poster"
                    value={formData.poster}
                    onChange={handleChange}
                    required
                />

                <label>Genres:</label>
                <div className="genresCheckboxes">
                    {genresList.map((genre) => (
                        <label key={genre}>
                            <input
                                type="checkbox"
                                name="genres"
                                value={genre}
                                checked={formData.genres.includes(genre)}
                                onChange={handleChange}
                            />
                            {genre}
                        </label>
                    ))}
                </div>

                <button type="submit" className="createSubmit">Create Movie</button>
            </form>
        </div>
    );
};

export default Create;
