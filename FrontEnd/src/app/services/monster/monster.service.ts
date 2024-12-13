import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Monster } from '../../models/monster.model';
import { IMonster } from '../../interfaces/monster-interface';

@Injectable({
  providedIn: 'root'
})
export class MonsterService {
  
  private http = inject(HttpClient);
  private readonly BASE_URL = "https://localhost:7210/monsters/";

  getAll(): Observable<Monster[]> {
    return this.http.get<IMonster[]>(this.BASE_URL).pipe(
      map(monsters => monsters.map(monster => Monster.fromJson(monster)))
    );
  }

  get(id: number): Observable<Monster> {
    return this.http.get<Monster>(this.BASE_URL + id).pipe(
      map(monster => Monster.fromJson(monster))
    );
  }

  add(monster: Monster): Observable<Monster> {
    return this.http.post<IMonster>(this.BASE_URL, monster).pipe(
      map(monster => Monster.fromJson(monster))
    );
  }

  update(monster: Monster): Observable<Monster> {
    return this.http.put<IMonster>(this.BASE_URL + monster.id, monster).pipe(
      map(monster => Monster.fromJson(monster))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.BASE_URL + id);
  }
}
