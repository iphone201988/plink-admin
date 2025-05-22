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
    tagTypes: ['User', 'User_M',"GROUP_M","COURT_M"],
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
        getDashboardData: builder.query<any, { page?: number, limit?: number } | void>({
            query: (arg) => {
                const page = arg && typeof arg === 'object' && 'page' in arg ? arg.page : 1;
                const limit = arg && typeof arg === 'object' && 'limit' in arg ? arg.limit : 6;
                return {
                    url: `/dashboard?page=${page}&limit=${limit}`,
                    method: 'GET'
                };
            },
        }),
        getUserDatamanagement: builder.query<any, { page?: number, limit?: number } | void>({
            query: (arg) => {
                const page = arg && typeof arg === 'object' && 'page' in arg ? arg.page : 1;
                const limit = arg && typeof arg === 'object' && 'limit' in arg ? arg.limit : 6;
                return {
                    url: `/dashboard/user-management?page=${page}&limit=${limit}`,
                    method: 'GET'
                };
            },
            providesTags: ["User_M"]
        }),
        getGroupData: builder.query<any, { page?: number, limit?: number } | void>({
            query: (arg) => {
                const page = arg && typeof arg === 'object' && 'page' in arg ? arg.page : 1;
                const limit = arg && typeof arg === 'object' && 'limit' in arg ? arg.limit : 6;
                return {
                    url: `/dashboard/group-management?page=${page}&limit=${limit}`,
                    method: 'GET'
                };
            },
            providesTags:["GROUP_M"]
        }),
        deleteSuspendUser: builder.mutation<any, any>({
            query: (userData) => ({
                url: '/dashboard/suspend-delete-user',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ["User_M"]
        }),
        editUser: builder.mutation<any, any>({
            query: ({ id,
                userData
            }) => ({
                url: `/dashboard/update-user/${id}`,
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ["User_M"]
        }),
        deleteGroup: builder.mutation<any, any>({
            query: ({ id
            }) => ({
                url: `/dashboard/delete-group/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags:["GROUP_M"]
        }),
        editGroup: builder.mutation<any, any>({
            query: ({ id,
                body
            }) => ({
                url: `/dashboard/edit-group/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags:["GROUP_M"]
        }),

        getGameEvents: builder.query<any, void>({
            query: () => ({
                url: '/dashboard/all-game-events',
                method: 'GET'
            }),
        }),
        getCourts: builder.query<any, { page?: number } | void>({
            query: ({ page = 1 } = {}) => ({
              url: `/dashboard/all-courts?page=${page}`,
              method: 'GET',
            }),
            providesTags:["COURT_M"]
          })  ,  
        deleteCourt: builder.mutation<any, any>({
            query: (body) => ({
              url: `/dashboard/active-delete-court`,
              method: 'POSt',
              body
            }),
            invalidatesTags:["COURT_M"]
          })    
    }),
});

export const { useAdminLoginMutation, useGetUserDetailsQuery, useUserLogoutMutation, useGetDashboardDataQuery, useGetUserDatamanagementQuery, useDeleteSuspendUserMutation, useEditUserMutation, useGetGroupDataQuery,useDeleteGroupMutation,useEditGroupMutation,useGetGameEventsQuery , useGetCourtsQuery, useDeleteCourtMutation} = apis;