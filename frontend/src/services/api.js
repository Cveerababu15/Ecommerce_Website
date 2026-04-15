import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
};

export const productAPI = {
  getAll: (params = {}) => {
    let url = `/products?page=${params.page || 1}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    if (params.category) url += `&category=${encodeURIComponent(params.category)}`;
    if (params.subcategory) url += `&subcategory=${encodeURIComponent(params.subcategory)}`;
    if (params.minPrice) url += `&minPrice=${params.minPrice}`;
    if (params.maxPrice) url += `&maxPrice=${params.maxPrice}`;
    if (params.gender) url += `&gender=${encodeURIComponent(params.gender)}`;
    if (params.size) url += `&size=${encodeURIComponent(params.size)}`;
    return API.get(url);
  },
  getAllAdmin: () => API.get("/products?limit=100"),
  create: (data) => API.post("/products/create", data),
  delete: (id) => API.delete(`/products/${id}`),
};

export const cartAPI = {
  getCart: () => API.get("/cart/getcart"),
  addToCart: (data) => API.post("/cart/addtocart", data),
};

export const orderAPI = {
  create: (data) => API.post("/orders/create", data),
  getAll: () => API.get("/orders/all-orders"),
  getUserOrders: () => API.get("/orders/user-orders"),
  updateStatus: (data) => API.put("/orders/update-status", data),
};

export const paymentAPI = {
  create: (data) => API.post("/payment/create", data),
  verify: (data) => API.post("/payment/verify", data),
};

export const categoryAPI = {
  getAll: () => API.get("/categories/get")
};

export default API;