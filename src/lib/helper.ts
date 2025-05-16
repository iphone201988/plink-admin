export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function clearToken(): void {
    localStorage.clear();
}

export function setToken(token: Record<string, string>): void {
    Object.entries(token).forEach(([key, value]) => {
        localStorage.setItem(key, value);
    });
}