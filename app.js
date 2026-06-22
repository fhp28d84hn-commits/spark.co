/**
 * SPARK.CO - Shared Application Logic
 */

const API_BASE_URL = window.__API_URL__ || 'http://localhost:3001/api';

/**
 * API Helper
 */
async function api(endpoint, options = {}) {
    const token = localStorage.getItem('spark_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Auth Functions
 */
const auth = {
    async login(email, password) {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.token) {
            localStorage.setItem('spark_token', data.token);
            localStorage.setItem('spark_user', JSON.stringify(data.user));
        }
        
        return data;
    },

    async register(userData) {
        const data = await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        if (data.token) {
            localStorage.setItem('spark_token', data.token);
            localStorage.setItem('spark_user', JSON.stringify(data.user));
        }
        
        return data;
    },

    logout() {
        localStorage.removeItem('spark_token');
        localStorage.removeItem('spark_user');
        window.location.href = 'index.html';
    },

    getCurrentUser() {
        const user = localStorage.getItem('spark_user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('spark_token');
    }
};

/**
 * Toast Notification System
 */
const toast = {
    show(message, type = 'success') {
        const container = document.getElementById('toast-container') || this.createContainer();
        const el = document.createElement('div');
        el.className = `toast toast-${type}`;
        el.textContent = message;
        
        container.appendChild(el);
        
        // Trigger reflow for animation
        el.offsetHeight;
        el.classList.add('show');
        
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 300);
        }, 3000);
    },

    createContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
        return container;
    },

    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error'); }
};

/**
 * UI Helpers
 */
const ui = {
    setLoading(btn, isLoading) {
        if (isLoading) {
            btn.dataset.originalText = btn.innerHTML;
            btn.innerHTML = '<span class="loader-spinner"></span>';
            btn.disabled = true;
        } else {
            btn.innerHTML = btn.dataset.originalText;
            btn.disabled = false;
        }
    },

    formatDate(dateStr) {
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(dateStr));
    }
};

// Global export
window.spark = { api, auth, toast, ui };
