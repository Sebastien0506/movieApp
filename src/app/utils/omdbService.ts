import axios from "axios";


const API_KEY = "aeea8a9b";
const BASE_URL = "https://www.omdbapi.com/";

export const getMovies = async (search: string) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {apikey: API_KEY, s: search, type: "movie"},
        });
        return response.data.Search || [];
        
    } catch (error) {
       console.error("Erreur lors de la récupération des films : ", error);
       return [];
    }

};
