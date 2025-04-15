
// API service for communicating with C# backend

interface ApiError extends Error {
  status?: number;
}

const API_URL = 'https://your-c-sharp-api-url/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error: ApiError = new Error(`HTTP Error: ${response.status}`);
    error.status = response.status;
    try {
      const errorData = await response.json();
      error.message = errorData.message || `API Error: ${response.status}`;
    } catch (e) {
      // If parsing JSON fails, use status text
      error.message = response.statusText;
    }
    throw error;
  }
  return response.json();
};

// Create auth header with JWT token
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token ? { 'Authorization': `Bearer ${user.token}` } : {};
};

// User API calls
export const userApi = {
  // Get all users (admin only)
  getAll: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: { ...authHeader() }
    });
    return handleResponse(response);
  },
  
  // Create user (admin only)
  create: async (userData: any) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },
  
  // Get user by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: { ...authHeader() }
    });
    return handleResponse(response);
  },
  
  // Update user
  update: async (id: string, userData: any) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },
  
  // Delete user
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { ...authHeader() }
    });
    return handleResponse(response);
  }
};

// Appointment API calls
export const appointmentApi = {
  // Get appointments
  getAppointments: async (filter: any = {}) => {
    const queryString = new URLSearchParams(filter).toString();
    const response = await fetch(`${API_URL}/appointments?${queryString}`, {
      headers: { ...authHeader() }
    });
    return handleResponse(response);
  },
  
  // Create appointment
  createAppointment: async (appointmentData: any) => {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(appointmentData)
    });
    return handleResponse(response);
  },
  
  // Update appointment status
  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_URL}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  }
};

// Services API calls
export const serviceApi = {
  // Get all services
  getAll: async () => {
    const response = await fetch(`${API_URL}/services`);
    return handleResponse(response);
  },
  
  // Create service (admin only)
  create: async (serviceData: any) => {
    const response = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(serviceData)
    });
    return handleResponse(response);
  },
  
  // Update service (admin only)
  update: async (id: string, serviceData: any) => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(serviceData)
    });
    return handleResponse(response);
  },
  
  // Delete service (admin only)
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: { ...authHeader() }
    });
    return handleResponse(response);
  }
};
