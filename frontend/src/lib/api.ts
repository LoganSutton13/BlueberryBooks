/**
 * API client for BlueberryBooks backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        return { error: errorData.detail || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Authentication
  async register(username: string, password: string) {
    return this.request<{ access_token: string; token_type: string; user_id: number; username: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
  }

  async login(username: string, password: string) {
    return this.request<{ access_token: string; token_type: string; user_id: number; username: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
  }

  // Books
  async searchBooks(query: string, limit: number = 20) {
    return this.request<{ results: BookSearchResult[] }>(
      `/books/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  async getBook(bookId: number) {
    return this.request<Book>(`/books/${bookId}`);
  }

  async addBook(openLibraryId: string) {
    return this.request<{ book_id: number; message: string }>(
      `/books/add?open_library_id=${encodeURIComponent(openLibraryId)}`,
      { method: 'POST' }
    );
  }

  async markBookAsRead(bookId: number) {
    return this.request<{ message: string }>(
      `/books/${bookId}/read`,
      { method: 'POST' }
    );
  }

  async getUserReadBooks() {
    return this.request<Book[]>('/books/user/read');
  }

  // Diary Entries
  async getDiaryEntries() {
    return this.request<DiaryEntryWithBook[]>('/diary');
  }

  async getDiaryEntry(bookId: number) {
    return this.request<DiaryEntryWithBook>(`/diary/${bookId}`);
  }

  async createDiaryEntry(bookId: number, entryText: string) {
    return this.request<DiaryEntry>(
      '/diary',
      {
        method: 'POST',
        body: JSON.stringify({ book_id: bookId, entry_text: entryText }),
      }
    );
  }

  async updateDiaryEntry(entryId: number, entryText: string) {
    return this.request<DiaryEntry>(
      `/diary/${entryId}`,
      {
        method: 'PUT',
        body: JSON.stringify({ entry_text: entryText }),
      }
    );
  }

  async deleteDiaryEntry(entryId: number) {
    return this.request<{ message: string }>(
      `/diary/${entryId}`,
      { method: 'DELETE' }
    );
  }

  // Ratings
  async getRatings() {
    return this.request<RatingWithBook[]>('/ratings');
  }

  async getTop10Ratings() {
    return this.request<RatingWithBook[]>('/ratings/top10');
  }

  async getRating(bookId: number) {
    return this.request<RatingWithBook>(`/ratings/${bookId}`);
  }

  async createOrUpdateRating(bookId: number, rating: number) {
    return this.request<Rating>(
      '/ratings',
      {
        method: 'POST',
        body: JSON.stringify({ book_id: bookId, rating }),
      }
    );
  }

  async deleteRating(ratingId: number) {
    return this.request<{ message: string }>(
      `/ratings/${ratingId}`,
      { method: 'DELETE' }
    );
  }
}

// Type definitions
export interface BookSearchResult {
  open_library_id: string;
  title: string;
  author: string;
  isbn?: string;
  cover_image_url?: string;
  published_year?: number;
}

export interface Book {
  id: number;
  open_library_id: string;
  title: string;
  author?: string;
  isbn?: string;
  cover_image_url?: string;
  description?: string;
  published_year?: number;
}

export interface DiaryEntry {
  id: number;
  user_id: number;
  book_id: number;
  entry_text: string;
  created_at: string;
  updated_at?: string;
}

export interface DiaryEntryWithBook extends DiaryEntry {
  book?: {
    id: number;
    title: string;
    author?: string;
    cover_image_url?: string;
  };
}

export interface Rating {
  id: number;
  user_id: number;
  book_id: number;
  rating: number;
  created_at: string;
  updated_at?: string;
}

export interface RatingWithBook extends Rating {
  book?: {
    id: number;
    title: string;
    author?: string;
    cover_image_url?: string;
  };
}

export const apiClient = new ApiClient(API_BASE_URL);

