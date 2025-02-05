"use client";
import React, { useState, useEffect } from "react";

// Définir l'interface pour les films
interface Movie {
    imdbID: string;
    Title: string;
    Poster: string;
    Year: string;
    Category: string;
    Likes: number;
    Dislikes: number;
}

// Dictionnaire d'images pour chaque film
const movieImages: { [key: string]: string } = {
    Titanic: "/img/titanic.jpg",
    Deadpool: "/img/deadpool.jpg",
    "Film 3": "/img/film3.jpg",
    // Ajouter d'autres films et leurs images ici
};

const initialMovies: Movie[] = [
    { imdbID: "1", Title: "Titanic", Poster: "https://via.placeholder.com/200", Year: "2022", Category: "Action", Likes: 0, Dislikes: 0 },
    { imdbID: "2", Title: "Deadpool", Poster: "https://via.placeholder.com/200", Year: "2021", Category: "Drama", Likes: 0, Dislikes: 0 },
    { imdbID: "3", Title: "Film 3", Poster: "https://via.placeholder.com/200", Year: "2020", Category: "Comedy", Likes: 0, Dislikes: 0 },
    // Ajoute d'autres films ici
];

const MovieList = () => {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    // Extraire les catégories uniques des films
    const extractCategories = () => {
        const movieCategories: string[] = Array.from(new Set(movies.map((movie) => movie.Category)));
        setCategories(movieCategories);
    };

    // Filtrer les films par catégorie sélectionnée
    const filteredMovies = movies.filter((movie) =>
        selectedCategories.length === 0 || selectedCategories.includes(movie.Category)
    );

    // Pagination
    const paginatedMovies = filteredMovies.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Fonction pour supprimer un film
    const handleDelete = (imdbID: string) => {
        const newMovies = movies.filter((movie) => movie.imdbID !== imdbID);
        setMovies(newMovies);
        // Mettre à jour les catégories si nécessaire
        extractCategories();
    };

    // Fonction pour toggler like/dislike
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

    // Fonction pour gérer la sélection/désélection des catégories
    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(category)
                ? prevSelected.filter((cat) => cat !== category)
                : [...prevSelected, category]
        );
    };

    // Fonction pour changer la page
    const handlePageChange = (direction: "next" | "prev") => {
        setPage((prevPage) => (direction === "next" ? prevPage + 1 : prevPage - 1));
    };

    // Exécuter l'extraction des catégories au démarrage
    useEffect(() => {
        extractCategories();
    }, [movies]);

    return (
        <div style={{ textAlign: "center" }}>
            {/* Filtre par catégorie */}
            <div>
                <label>Filtrer par catégorie: </label>
                <select multiple onChange={(e) => handleCategoryChange(e.target.value)}>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Liste des films */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                {paginatedMovies.map((movie) => {
                    // Vérifier si une image est associée dans movieImages, sinon utiliser une image par défaut
                    const posterPath = movieImages[movie.Title] || "https://via.placeholder.com/200";
                    return (
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
                            <img
                                src={posterPath}
                                alt={movie.Title}
                                style={{ width: "100%", borderRadius: "10px" }}
                            />
                            <h3 style={{ fontWeight: "bold" }}>{movie.Title}</h3>
                            <p>📅 {movie.Year}</p>
                            <p>Catégorie: {movie.Category}</p>

                            {/* Boutons de suppression et like/dislike */}
                            <div>
                                <button onClick={() => handleDelete(movie.imdbID)}>Supprimer</button>
                            </div>
                            <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                                <button onClick={() => toggleLikeDislike(movie.imdbID, "like")}>👍 {movie.Likes}</button>
                                <button onClick={() => toggleLikeDislike(movie.imdbID, "dislike")}>👎 {movie.Dislikes}</button>
                            </div>

                            {/* Jauge de ratio likes/dislikes */}
                            <div style={{ marginTop: "10px", width: "100%", backgroundColor: "#ccc", height: "5px", borderRadius: "10px" }}>
                                <div
                                    style={{
                                        width: `${(movie.Likes / (movie.Likes + movie.Dislikes)) * 100}%`,
                                        backgroundColor: "green",
                                        height: "100%",
                                        borderRadius: "10px",
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div>
                <button onClick={() => handlePageChange("prev")} disabled={page === 1}>
                    Précédent
                </button>
                <button onClick={() => handlePageChange("next")} disabled={page * itemsPerPage >= filteredMovies.length}>
                    Suivant
                </button>

                <div>
                    <label>Nombre d'éléments par page: </label>
                    <select onChange={(e) => setItemsPerPage(Number(e.target.value))} value={itemsPerPage}>
                        <option value={4}>4</option>
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default MovieList;