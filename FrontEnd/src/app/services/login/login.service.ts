import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { map, Observable, tap } from 'rxjs';

export interface Credentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private httpClient = inject(HttpClient);
  private readonly BASE_URL = "https://localhost:7210";

  user = signal<User | null | undefined>(undefined);

  constructor() { }

  login(credentials: Credentials) : Observable<User | null | undefined> {
    return this.httpClient.post<string>(this.BASE_URL + "/login", credentials).pipe(
      tap((token: string) => {
        localStorage.setItem("token", token);
        this.getUser();
      }),
      map(() => {
        return this.user();
      })
    );
  }

  getUser(): Observable<User | null | undefined> {
    return this.httpClient.get<User>(this.BASE_URL + "/me").pipe(
      tap((result: User) => {
        const user = Object.assign(new User(), result);
        this.user.set(user);
      }),
      map(() => {
        return this.user();
      })
    );
  }

  logout(): Observable<null> {
    return this.httpClient.post(this.BASE_URL + "/logout", {}).pipe(
      tap(() => {
        localStorage.removeItem("token");
        this.user.set(null);
      }),
      map(() => null)
    );
  }

}
