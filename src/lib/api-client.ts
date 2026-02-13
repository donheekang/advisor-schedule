const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pethealthplus.onrender.com';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new ApiError(res.status, error.detail || 'Unknown error');
    }

    return res.json();
  }

  async getMe() {
    return this.request('GET', '/api/me');
  }

  async getMeSummary() {
    return this.request('GET', '/api/me/summary');
  }

  async upsertUser() {
    return this.request('POST', '/api/db/user/upsert');
  }

  async listPets() {
    return this.request('GET', '/api/db/pets/list');
  }

  async upsertPet(data: unknown) {
    return this.request('POST', '/api/db/pets/upsert', data);
  }

  async listRecords(petId?: string, includeItems?: boolean) {
    const params = new URLSearchParams();

    if (petId) {
      params.set('petId', petId);
    }

    if (includeItems) {
      params.set('includeItems', 'true');
    }

    const query = params.toString();

    return this.request('GET', `/api/db/records/list${query ? `?${query}` : ''}`);
  }

  async getRecord(recordId: string) {
    return this.request('GET', `/api/db/records/get?recordId=${encodeURIComponent(recordId)}`);
  }

  async searchHospitals(query: string) {
    return this.request('GET', `/api/hospitals/search?q=${encodeURIComponent(query)}`);
  }

  async listClaims(petId?: string) {
    const params = petId ? `?petId=${encodeURIComponent(petId)}` : '';
    return this.request('GET', `/api/claims/list${params}`);
  }

  async listSchedules(petId?: string) {
    const params = petId ? `?petId=${encodeURIComponent(petId)}` : '';
    return this.request('GET', `/api/schedules/list${params}`);
  }

  async getAiCare(petId: string) {
    return this.request('GET', `/api/ai/care?petId=${encodeURIComponent(petId)}`);
  }
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export const apiClient = new ApiClient();
export { ApiError };
