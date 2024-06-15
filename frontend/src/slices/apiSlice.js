import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
console.log(window.location.origin)
const baseQuery  = fetchBaseQuery({baseUrl:`${window.location.origin}/`})
console.log(baseQuery)
export const apiSlice = createApi({
    baseQuery,
    tagTypes:['User'],
    endpoints:(builder) => ({})
});
