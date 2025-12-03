import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    Book,
    CreateBookRequest,
    UpdateBookRequest,
    Shelf,
    CreateShelfRequest,
    UpdateShelfRequest,
    Category,
    Movie,
    CreateMovieRequest,
    UpdateMovieRequest,
} from '../types';

const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const api = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['Auth', 'Books', 'Shelves', 'Categories', 'Movies'],
    endpoints: (builder) => ({
        // Auth endpoints
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
        }),
        getCurrentUser: builder.query<User, void>({
            query: () => '/auth/me',
            providesTags: ['Auth'],
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),

        // Book endpoints
        getBooks: builder.query<Book[], { search?: string; shelfId?: string }>({
            query: (params) => ({
                url: '/books',
                params,
            }),
            providesTags: ['Books'],
        }),
        getBook: builder.query<Book, string>({
            query: (id) => `/books/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Books', id }],
        }),
        createBook: builder.mutation<Book, CreateBookRequest>({
            query: (book) => ({
                url: '/books',
                method: 'POST',
                body: book,
            }),
            invalidatesTags: ['Books'],
        }),
        updateBook: builder.mutation<Book, { id: string; book: UpdateBookRequest }>({
            query: ({ id, book }) => ({
                url: `/books/${id}`,
                method: 'PUT',
                body: book,
            }),
            invalidatesTags: ['Books'],
        }),
        deleteBook: builder.mutation<void, string>({
            query: (id) => ({
                url: `/books/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Books'],
        }),

        // Shelf endpoints
        getShelves: builder.query<Shelf[], { includeBooks?: boolean }>({
            query: (params) => ({
                url: '/shelves',
                params,
            }),
            providesTags: ['Shelves'],
        }),
        getShelf: builder.query<Shelf, string>({
            query: (id) => `/shelves/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Shelves', id }],
        }),
        createShelf: builder.mutation<Shelf, CreateShelfRequest>({
            query: (shelf) => ({
                url: '/shelves',
                method: 'POST',
                body: shelf,
            }),
            invalidatesTags: ['Shelves'],
        }),
        updateShelf: builder.mutation<Shelf, { id: string; shelf: UpdateShelfRequest }>({
            query: ({ id, shelf }) => ({
                url: `/shelves/${id}`,
                method: 'PUT',
                body: shelf,
            }),
            invalidatesTags: ['Shelves'],
        }),
        deleteShelf: builder.mutation<void, string>({
            query: (id) => ({
                url: `/shelves/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Shelves'],
        }),

        // Category endpoints
        getCategories: builder.query<Category[], void>({
            query: () => '/categories',
            providesTags: ['Categories'],
        }),
        createCategory: builder.mutation<Category, { name: string; color?: string }>({
            query: (category) => ({
                url: '/categories',
                method: 'POST',
                body: category,
            }),
            invalidatesTags: ['Categories'],
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories'],
        }),

        // Movie endpoints
        getMovies: builder.query<Movie[], { search?: string; shelfId?: string }>({
            query: (params) => ({
                url: '/movies',
                params,
            }),
            providesTags: ['Movies'],
        }),
        getMovie: builder.query<Movie, string>({
            query: (id) => `/movies/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Movies', id }],
        }),
        createMovie: builder.mutation<Movie, CreateMovieRequest>({
            query: (movie) => ({
                url: '/movies',
                method: 'POST',
                body: movie,
            }),
            invalidatesTags: ['Movies'],
        }),
        updateMovie: builder.mutation<Movie, { id: string; movie: UpdateMovieRequest }>({
            query: ({ id, movie }) => ({
                url: `/movies/${id}`,
                method: 'PUT',
                body: movie,
            }),
            invalidatesTags: ['Movies'],
        }),
        deleteMovie: builder.mutation<void, string>({
            query: (id) => ({
                url: `/movies/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Movies'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetCurrentUserQuery,
    useLogoutMutation,
    useGetBooksQuery,
    useGetBookQuery,
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useGetShelvesQuery,
    useGetShelfQuery,
    useCreateShelfMutation,
    useUpdateShelfMutation,
    useDeleteShelfMutation,
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useGetMoviesQuery,
    useGetMovieQuery,
    useCreateMovieMutation,
    useUpdateMovieMutation,
    useDeleteMovieMutation,
} = api;
