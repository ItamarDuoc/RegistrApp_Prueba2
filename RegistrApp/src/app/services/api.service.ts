import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://registr-api.fly.dev/user';

  constructor(private http: HttpClient) {}

  login(username: string, password: string, groupId: number) {
    return this.http.post(`${this.baseUrl}/login`, { username, password, groupId });
  }

  register(name: string, username: string, password: string, email: string, groupId: number) {
    return this.http.post(`${this.baseUrl}/create`, { name, username, password, email, groupId });
  }
}
