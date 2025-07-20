const API_BASE_URL = "http://localhost:3001/api";

async function register(userData: { name: string; email: string; password: string; role: string }) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Registration failed");
  }
  return await response.json();
}

async function login(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed");
  }
  const data = await response.json();
  // Save user data to localStorage for session persistence
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return { user: JSON.parse(userStr) };
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem('user');
}

export default {
  register,
  login,
  getCurrentUser,
  logout,
};
