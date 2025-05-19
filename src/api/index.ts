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
        getUserDetails: builder.query<any, void>({
            query: () => ({
                url: '/user/get-user',
                method: 'GET'
            }),
            providesTags: ['User'],
        }),
        userLogout: builder.mutation<any, void>({
            query: () => ({
                url: '/user/logout-user',
                method: 'POST'
            }),
        }),
        getDashboardData: builder.query<any, { page?: number,limit?:number } | void>({
            query: (arg) => {
                const page = arg && typeof arg === 'object' && 'page' in arg ? arg.page : 1;
                const limit = arg && typeof arg === 'object' && 'limit' in arg ? arg.limit : 6;
                return {
                    url: `/dashboard?page=${page}&limit=${limit}`,
                    method: 'GET'
                };
            },
        }),
        getUserDatamanagement :builder.query<any, { page?: number,limit?:number } | void>({
            query: (arg) => {
                const page = arg && typeof arg === 'object' && 'page' in arg ? arg.page : 1;
                const limit = arg && typeof arg === 'object' && 'limit' in arg ? arg.limit : 6;
                return {
                    url: `/dashboard/user-management?page=${page}&limit=${limit}`,
                    method: 'GET'
                };
            },  
        })
    }),
});

export const { useAdminLoginMutation,useGetUserDetailsQuery,useUserLogoutMutation , useGetDashboardDataQuery,useGetUserDatamanagementQuery } = apis;