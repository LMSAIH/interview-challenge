import axios from 'axios';
import { useState, useEffect } from 'react';
import { CircleArrowLeft01Icon, CircleArrowRight01Icon } from 'hugeicons-react';
import { Link } from 'react-router-dom';
import { useWatchlistContext } from '../hooks/useWatchlistContext';
import WatchlistMovie from './WatchlistMovie';

const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery",
    "Romance", "Science Fiction", "TV Movie", "Thriller", "War", "Western"
];

const WatchlistMovieContainer = () => {

    const {movies, dispatch} = useWatchlistContext();
    const [metaData, setMetaData] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [queryParams, setQueryParams] = useState({ watched: '', minRating: '', genre: "" });

    useEffect(() => {

        const getMovies = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const token = user?.token;

                if (!token) {
                    throw new Error("User is not authenticated.");
                }

                const response = await axios.get("http://localhost:4000/api/v1/movies/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { ...queryParams, page: currentPage }
                });

                dispatch({ type: "SET_MOVIES", payload: response.data.data });
                setMetaData(response.data.meta || {});
                setError(null);
            } catch (err) {
                console.error(err);
                dispatch({ type: "SET_MOVIES", payload: [] });
                setError(err.message || "Failed to fetch movies.");
            }
        }

        getMovies();
    }, [currentPage, queryParams]);

    const handleNextPage = () => {
        if (metaData?.currentPage < metaData?.totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (metaData?.currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleWatchedChange = (e) => {
        const { value } = e.target;

        setQueryParams((prev) => ({
            ...prev,
            watched: value,
        }));

        setCurrentPage(1);
    };

    const handleRatingChange = (e) => {
        const { value } = e.target;

        const newRating = value === "" ? null : parseInt(value, 10);

        setQueryParams((prev) => ({
            ...prev,
            minRating: newRating,
        }));

        setCurrentPage(1);
    };

    const handleGenreChange = (e) => {
        const { value } = e.target;

        if (value === "") {
            setQueryParams((prev) => ({
                ...prev,
                genre: "",
            }));
        } else {
            setQueryParams((prev) => ({
                ...prev,
                genre: value,
            }));
        }
    };


    return (
        <div className="watchlistMovieContainer">
            <div className="filterMenuContainer">
                <div className="filterContainer">
                    <label htmlFor="watchStatus" >Filter by watch status</label>
                    <select
                        id="watchStatus"
                        value={queryParams.watched}
                        onChange={handleWatchedChange}
                    >
                        <option value="">All</option>
                        <option value="true">Watched</option>
                        <option value="false">Unwatched</option>
                    </select>
                </div>
                <div className="filterContainer">
                    <label htmlFor="rating">Filter by rating</label>
                    <select
                        id="rating"
                        name="rating"
                        value={queryParams.minRating}
                        onChange={handleRatingChange}

                    >
                        <option value="">All</option>
                        <option value="1">1 and above</option>
                        <option value="2">2 and above</option>
                        <option value="3">3 and above</option>
                        <option value="4">4 and above</option>
                        <option value="5">5 only</option>
                    </select>
                </div>
                <div className="filterContainer">
                    <label>Filter by Genre</label>
                    <select value={queryParams.genre} onChange={handleGenreChange}>
                        <option value="">All</option>
                        {genres.map((genre) => (
                            <option key={genre} value={genre}>
                                {genre}
                            </option>
                        ))}
                    </select>


                </div>
            </div>
            <h2 className="watchlistTitle">Watchlist</h2>

            <div className="watchlistMovies">
                {error && <p className="errorMessage">{error}</p>}

                {movies && movies.length > 0 ? (
                    movies.map((movie) => (
                        <WatchlistMovie
                            key={movie._id}
                            title={movie.title}
                            poster={movie.poster}
                            rating={movie.rating}
                            watched={movie.watched}
                            year={movie.releaseYear}
                            genres ={movie.genres}
                            id={movie._id}
                        />
                    ))
                ) : (
                    !error && <p className="movieError">We are sorry! No movies found.</p>
                )}
            </div>

            {metaData && (
                <div className="movieListFooter">
                    <div className="movieListNextAfter">
                        <div className="arrowContainer">
                            <div
                                className={`iconArrowContainer ${metaData.currentPage === 1 ? "disabled" : ""}`}
                                onClick={handlePreviousPage}
                            >
                                <CircleArrowLeft01Icon />
                                <p>Previous</p>
                            </div>
                            <div className='text-white'>{`Page: ${metaData.currentPage}/${metaData.totalPages}`}</div>
                            <div
                                className={`iconArrowContainer ${metaData.currentPage === metaData.totalPages ? "disabled" : ""
                                    }`}
                                onClick={handleNextPage}
                            >
                                <CircleArrowRight01Icon />
                                <p>Next</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="addSection">
                <p className='addSectionText'> Want to add a movie to your watchlist but can't seem to find it? We got you! </p>
                <div className="addSectionLinkContainer">
                    <Link to="/createNew"> Add movie </Link>
                </div>
            </div>
        </div>
    );
}

export default WatchlistMovieContainer;