import { inject, Injectable } from '@angular/core';
import { Monster } from '../../models/monster.model';
import { HttpClient } from '@angular/common/http';
import { IMonster } from '../../interfaces/monster.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonsterService {
  
  private http = inject(HttpClient);
  private readonly BASE_URL = "https://localhost:7210/monsters/";

  getAll(): Observable<Monster[]> {
    return this.http.get<IMonster[]>(this.BASE_URL).pipe(
      map(monsterListJson => {
        return monsterListJson.map<Monster>(monsterJson => Monster.fromJson(monsterJson));
    }))
  }

  get(id: number): Observable<Monster> {
    return this.http.get<IMonster>(this.BASE_URL + id).pipe(
      map(monsterJson => Monster.fromJson(monsterJson))
    );
  }

  add(monster: Monster): Observable<Monster> {
    return this.http.post<IMonster>(this.BASE_URL, monster.toJson()).pipe(
      map(monsterJson => Monster.fromJson(monsterJson))
    );
  }

  update(monster: Monster): Observable<Monster> {
    return this.http.put<IMonster>(this.BASE_URL + monster.id, monster.toJson()).pipe(
      map(monsterJson => Monster.fromJson(monsterJson))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.BASE_URL + id);
  }


  /*private init(){
    const monster1 = new Monster();
    monster1.id = this.currentIndex++;
    monster1.name = "Salamèche";
    monster1.description = "N° 4";
    monster1.hp = 40;
    monster1.attackName = "Flamethrower";
    monster1.attackDamage = 20;
    monster1.attackDescription = "Spits fire and burns the enemy.";
    monster1.image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/5.svg";
    monster1.type = MonsterType.FIRE;
    this.monsters.push(monster1);

    const monster2 = new Monster();
    monster2.id = this.currentIndex++;
    monster2.name = "Car";
    monster2.hp = 20;
    monster2.description = "N° 3";
    monster2.image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/3.svg";
    monster2.type = MonsterType.WATER;
    monster2.attackName = "Venomous flower"
    monster2.attackDescription = "Poisons the enemy with an even stronger unknown poison."
    this.monsters.push(monster2);

    const monster3 = new Monster();
    monster3.id = this.currentIndex++;
    monster3.name = "Bulbizar";
    monster3.hp = 40;
    monster3.description = "N° 1";
    monster3.image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg";
    monster3.type = MonsterType.WATER;
    monster3.attackName = "Venomous flower"
    monster3.attackDescription = "Poisons the enemy with an unknown poison."
    this.monsters.push(monster3);

    const monster4 = new Monster();
    monster4.id = this.currentIndex++;
    monster4.name = "Dracaufeu";
    monster4.hp = 100;
    monster4.description = "N° 6";
    monster4.image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/6.svg";
    monster4.type = MonsterType.FIRE;
    monster4.attackName = "Burning Hell"
    monster4.attackDescription = "Burns an area around him destroying everything"
    this.monsters.push(monster4);
  }*/
}
