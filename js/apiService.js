const API_BASE_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

function getHeaders(includeAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();

  if (includeAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: getHeaders(options.includeAuth !== false)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

const apiService = {
  login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      includeAuth: false
    });
  },

  register(name, email, password) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      includeAuth: false
    });
  },

  fetchDashboard() {
    return request('/dashboard');
  },

  fetchLeads(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);

    const query = params.toString();
    return request(query ? `/leads?${query}` : '/leads');
  },

  createLead(lead) {
    return request('/leads', {
      method: 'POST',
      body: JSON.stringify(lead)
    });
  },

  updateLead(id, lead) {
    return request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lead)
    });
  },

  deleteLead(id) {
    return request(`/leads/${id}`, { method: 'DELETE' });
  },

  fetchNotes(leadId) {
    return request(`/leads/${leadId}/notes`);
  },

  createNote(leadId, content) {
    return request(`/leads/${leadId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }
};
