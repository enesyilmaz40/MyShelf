// User types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

// Book types
export enum BookStatus {
    Owned = 1,
    Wishlist = 2,
    Borrowed = 3,
    Lent = 4,
}

export enum ReadingStatus {
    NotStarted = 1,
    Reading = 2,
    Completed = 3,
    Abandoned = 4,
}

export interface ReadingProgress {
    id: string;
    currentPage: number;
    status: ReadingStatus;
    startedAt?: string;
    completedAt?: string;
    rating?: number;
    notes?: string;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    publisher?: string;
    publicationYear?: number;
    pageCount?: number;
    language: string;
    description?: string;
    coverImageUrl?: string;
    shelfId?: string;
    shelfName?: string;
    position?: number;
    status: BookStatus;
    categories: string[];
    readingProgress?: ReadingProgress;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBookRequest {
    title: string;
    author: string;
    isbn?: string;
    publisher?: string;
    publicationYear?: number;
    pageCount?: number;
    language: string;
    description?: string;
    coverImageUrl?: string;
    shelfId?: string;
    status: BookStatus;
    categoryIds: string[];
}

export interface UpdateBookRequest extends CreateBookRequest {
    position?: number;
}

// Shelf types
export interface Shelf {
    id: string;
    name: string;
    location?: string;
    row?: number;
    description?: string;
    color?: string;
    capacity?: number;
    bookCount: number;
    books: Book[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateShelfRequest {
    name: string;
    location?: string;
    row?: number;
    description?: string;
    color?: string;
    capacity?: number;
}

export interface UpdateShelfRequest extends CreateShelfRequest { }

// Category types
export interface Category {
    id: string;
    name: string;
    color?: string;
}

// Movie types
export enum MovieStatus {
    Owned = 1,
    Watched = 2,
    Watchlist = 3,
    Lost = 4,
}

export enum MovieFormat {
    DVD = 1,
    BluRay = 2,
    UHD4K = 3,
    Digital = 4,
    VHS = 5,
}

export enum WatchingStatus {
    NotStarted = 1,
    Watching = 2,
    Completed = 3,
    Abandoned = 4,
}

export interface WatchingProgress {
    id: string;
    status: WatchingStatus;
    watchCount: number;
    firstWatchedAt?: string;
    lastWatchedAt?: string;
}

export interface Movie {
    id: string;
    title: string;
    originalTitle?: string;
    director: string;
    year?: number;
    duration?: number; // in minutes
    language: string;
    posterUrl?: string;
    imdbId?: string;
    ageRating?: string;
    description?: string;
    personalRating?: number; // 1-10
    notes?: string;
    status: MovieStatus;
    format?: MovieFormat;
    platform?: string;
    shelfId?: string;
    shelfName?: string;
    position?: number;
    categories: string[];
    watchingProgress?: WatchingProgress;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMovieRequest {
    title: string;
    originalTitle?: string;
    director: string;
    year?: number;
    duration?: number;
    language: string;
    posterUrl?: string;
    imdbId?: string;
    ageRating?: string;
    description?: string;
    personalRating?: number;
    notes?: string;
    status: MovieStatus;
    format?: MovieFormat;
    platform?: string;
    shelfId?: string;
    categoryIds: string[];
}

export interface UpdateMovieRequest extends CreateMovieRequest {
    position?: number;
}

