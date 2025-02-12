"use client";
import React, { useState, useEffect } from "react";
import CategoryFilter from "./Filter";

// On définit l'interface pour un film
interface Movie {
    imdbID: string;
    Title: string;
    Poster: string;
    Year: string;
    Genre: string;
    Likes: number;
    Dislikes: number;
}

const API_KEY = "aeea8a9b"; 
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=movie`;

const MovieList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [loading, setLoading] = useState(false);

    //  Fonction pour récupérer la liste des films et ensuite récupérer les détails
    useEffect(() => {
        setLoading(true);
        fetch(API_URL)
            .then((res) => res.json())
            .then(async (data) => {
                if (data.Search) {
                    // Liste de films avec seulement ID et titre
                    const movieList = data.Search;

                    // Récupérer les détails pour chaque film avec un deuxième appel API
                    const detailedMovies: Movie[] = await Promise.all(
                        movieList.map(async (movie: any) => {
                            const detailsRes = await fetch(
                                `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
                            );
                            const details = await detailsRes.json();

                            return {
                                imdbID: movie.imdbID,
                                Title: movie.Title,
                                Poster: movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200",
                                Year: movie.Year,
                                Genre: details.Genre || "Unknown", 
                                Likes: 0,
                                Dislikes: 0,
                            };
                        })
                    );

                    setMovies(detailedMovies);
                    extractCategories(detailedMovies);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    //  Extraire les catégories uniques
    const extractCategories = (moviesList: Movie[]) => {
        const movieCategories: string[] = Array.from(new Set(moviesList.map((movie) => movie.Genre)));
        setCategories(movieCategories);
    };

    //  Filtrer les films par catégorie
    const filteredMovies = movies.filter(
        (movie) => selectedCategories.length === 0 || selectedCategories.includes(movie.Genre)
    );

    //  Pagination
    const paginatedMovies = filteredMovies.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    //  Supprimer un film
    const handleDelete = (imdbID: string) => {
        const newMovies = movies.filter((movie) => movie.imdbID !== imdbID);
        setMovies(newMovies);
        extractCategories(newMovies);
    };

    // Toggle Like/Dislike
    const toggleLikeDislike = (imdbID: string, type: "like" | "dislike") => {
        setMovies((prevMovies) =>
            prevMovies.map((movie) =>
                movie.imdbID === imdbID
                    ? {
                          ...movie,
                          Likes: type === "like" ? movie.Likes + 1 : movie.Likes,
                          Dislikes: type === "dislike" ? movie.Dislikes + 1 : movie.Dislikes,
                      }
                    : movie
            )
        );
    };

    

    // On gèrer la pagination
    const handlePageChange = (direction: "next" | "prev") => {
        setPage((prevPage) => (direction === "next" ? prevPage + 1 : prevPage - 1));
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            {/* Filtre par catégorie */}
            <div>
                <label>Filtrer par catégorie: </label>
                <CategoryFilter 
    categories={categories} 
    selectedCategories={selectedCategories} 
    setSelectedCategories={setSelectedCategories} 
/>
            </div>

            {/* Liste des films */}
            {loading ? (
                <p>Chargement des films...</p>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                    {paginatedMovies.map((movie) => (
                        <div
                            key={movie.imdbID}
                            style={{
                                width: "200px",
                                textAlign: "center",
                                border: "1px solid #ddd",
                                padding: "10px",
                                borderRadius: "10px",
                            }}
                        >
                            <img src={movie.Poster} alt={movie.Title} style={{ width: "100%", borderRadius: "10px" }} />
                            <h3 style={{ fontWeight: "bold" }}>{movie.Title}</h3>
                            <p>📅 {movie.Year}</p>
                            <p>Catégorie: {movie.Genre}</p>

                            {/*  Bouton supprimer */}
                            <button onClick={() => handleDelete(movie.imdbID)}>Supprimer</button>

                            {/* Like/Dislike */}
                            <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                                <button onClick={() => toggleLikeDislike(movie.imdbID, "like")}>👍 {movie.Likes}</button>
                                <button onClick={() => toggleLikeDislike(movie.imdbID, "dislike")}>👎 {movie.Dislikes}</button>
                            </div>

                            {/* Jauge de ratio likes/dislikes */}
                            <div style={{ marginTop: "10px", width: "100%", backgroundColor: "#ccc", height: "5px", borderRadius: "10px" }}>
                                <div
                                    style={{
                                        width: `${movie.Likes + movie.Dislikes > 0 ? (movie.Likes / (movie.Likes + movie.Dislikes)) * 100 : 0}%`,
                                        backgroundColor: "green",
                                        height: "100%",
                                        borderRadius: "10px",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/*  Pagination */}
            <div>
                <button onClick={() => handlePageChange("prev")} disabled={page === 1}>
                    Précédent
                </button>
                <button onClick={() => handlePageChange("next")} disabled={page * itemsPerPage >= filteredMovies.length}>
                    Suivant
                </button>
                <select onChange={(e) => setItemsPerPage(Number(e.target.value))} value={itemsPerPage}>
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={12}>12</option>
                </select>
            </div>
        </div>
    );
};

export default MovieList;