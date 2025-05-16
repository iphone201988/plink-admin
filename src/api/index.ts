import { getToken } from "@/lib/helper";
import { SignupRequest, SignupResponse } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URl = import.meta.env.VITE_BASE_URL;


export const apis = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URl}/api/v1`,
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        adminLogin: builder.mutation<SignupResponse, SignupRequest>({
            query: (userData) => ({
                url: '/user/login-user',
                method: 'POST',
                body: userData,
            }),
        }),
    }),
});

export const { useAdminLoginMutation } = apis;