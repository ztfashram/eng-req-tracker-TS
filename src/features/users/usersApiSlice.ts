import { createSelector, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'
import { RootState } from '../../app/store'

export interface User {
    _id: number
    id?: number
    username: string
    roles: string | string[]
    active: boolean
}

const usersAdapter = createEntityAdapter<User>({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<EntityState<User>, void | string>({
            query: () => ({
                url: '/users',
                validateStatus: (response: Response, result: any) => {
                    return response.status === 200 && !result.isError
                },
            }),
            // keepUnusedDataFor: 5,
            transformResponse: (responseData: User[]) => {
                const loadedUsers = responseData.map((user) => {
                    user.id = user._id
                    return user
                })
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) =>
                result?.ids
                    ? [{ type: 'User', id: 'LIST' }, ...result.ids.map((id) => ({ type: 'User' as const, id }))]
                    : [{ type: 'User', id: 'LIST' }],
        }),
        addNewUser: builder.mutation({
            query: (initialUserData) => ({
                url: '/users',
                method: 'POST',
                body: { ...initialUserData },
            }),
            invalidatesTags: [{ type: 'User', id: 'LIST' }],
        }),
        updateUser: builder.mutation({
            query: (initialUserData) => ({
                url: '/users',
                method: 'PATCH',
                body: { ...initialUserData },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'User', id: arg.id }],
        }),
    }),
})

export const { useGetUsersQuery, useAddNewUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApiSlice

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    (usersResult) => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds,
    selectEntities,
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors((state: RootState) => selectUsersData(state) ?? initialState)
