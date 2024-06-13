import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery  = fetchBaseQuery({baseUrl:`${window.location.origin}/`})

export const apiSlice = createApi({
    baseQuery,
    tagTypes:['User'],
    endpoints:(builder) => ({})
});