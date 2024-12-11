import { Component, computed, inject, model, signal, WritableSignal } from '@angular/core';
import { MonsterService } from '../../services/monster/monster.service';
import { Monster } from '../../models/monster.model';
import { PlayingCardComponent } from '../../components/playing-card/playing-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-monster-list',
  imports: [PlayingCardComponent, SearchBarComponent],
  templateUrl: './monster-list.component.html',
  styleUrl: './monster-list.component.css'
})
export class MonsterListComponent {
  private router = inject(Router);
  private monsterService: MonsterService = inject(MonsterService);
  monsters = toSignal(this.monsterService.getAll());
  query = model("");
  filteredMonsters = computed(() => {
    return this.monsters()?.filter(monster => monster.name.toLowerCase().includes(this.query().toLowerCase())) ?? [];
  });

  addMonster(){
    this.router.navigate(["monster"])

  }

  openMonster(monster: Monster){
    this.router.navigate(["monster", monster.id])
  }
}
