import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5001", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// API calls for user authentication
export const signup = (formData) => axiosInstance.post('/signup', formData);
export const login = (formData) => axiosInstance.post('/login', formData);

// API calls for managing favorites
export const addFavorite = (recipeId) => axiosInstance.post('/favorites', { recipeId });
export const getFavorites = () => axiosInstance.get('/favorites');
export const removeFavorite = (recipeId) => axiosInstance.delete(`/favorites/${recipeId}`);

export default axiosInstance;
