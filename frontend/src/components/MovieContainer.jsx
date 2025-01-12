import axios from "axios";
import { useEffect, useState } from "react";
import Movie from "./Movie";
import { CircleArrowLeft01Icon } from "hugeicons-react";
import { CircleArrowRight01Icon } from "hugeicons-react";

const MovieContainer = ({params, title}) => {
  const [movies, setMovies] = useState([]);
  const [metaData, setMetaData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [queryParams, setQueryParams] = useState(params || {});

  useEffect(() => {
    const getMovies = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (!token) {
          throw new Error("User is not authenticated.");
        }

        const response = await axios.get("http://localhost:4000/api/v1/displayMovies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {...queryParams, page:currentPage}
        });

        setMovies(response.data.data || []);
        setMetaData(response.data.meta || {});
        setError(null); 
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch movies.");
      }
    };

    getMovies();
  }, [currentPage]); 

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

  return (
    <div className="movieContainer">
      <h2 className="movieContainerTitle">{title}</h2>

      <div className="movieList">
        {error && <p className="errorMessage">{error}</p>}

        {movies.length > 0 ? (
          movies.map((movie) => (
            <Movie
              key={movie.title}
              title={movie.title}
              imageSource={movie.poster}
              rating={movie.rating}
              year={movie.releaseYear}
              genres={movie.genres}
            />
            
          ))
        ) : (
          !error && <p className = "movieError">We are sorry! No movies found.</p>
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
              <div>{`Page: ${metaData.currentPage}/${metaData.totalPages}`}</div>
              <div
                className={`iconArrowContainer ${
                  metaData.currentPage === metaData.totalPages ? "disabled" : ""
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
    </div>
  );
};

export default MovieContainer;
