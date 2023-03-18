import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'
import { RootState } from '../store'

export interface CustomError {
    data: {
        message: string
    }
    status: number
}

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://eng-req-tracker-api.onrender.com',
    // baseUrl: 'http://localhost:3500', // for development
    credentials: 'include',
    prepareHeaders: (headers, api) => {
        const accessToken = (api.getState() as RootState)?.auth.token

        if (accessToken) {
            headers.set('authorization', `Bearer ${accessToken}`)
        }
        return headers
    },
})

const customBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
    // console.log('args: ', args);
    // console.log(api)
    // console.log(extraOptions)

    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        if (refreshResult?.data) {
            api.dispatch(setCredentials({ ...refreshResult.data }))

            result = await baseQuery(args, api, extraOptions)
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data = { message: 'Your login has expired' } as { message: string }
            }
            return refreshResult
        }
    }
    return result
}

export const apiSlice = createApi({
    reducerPath: 'api', //default, optional
    baseQuery: customBaseQuery as BaseQueryFn<string | FetchArgs, unknown, CustomError, {}, {}>,
    tagTypes: ['Request', 'User'],
    endpoints: (builder) => ({}),
})
