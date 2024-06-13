import { apiSlice } from "./apiSlice";


const USERS_URL = '/api/users';
export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'Post',
                body: data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),
        getUser: builder.query({
            query: () => ({
                url: `${USERS_URL}/profile`,
                method: 'GET',
            }),
        }),
    })
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useUpdateUserMutation,
    useGetUserQuery
  } = userApiSlice;