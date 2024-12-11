import { Component, computed, input, Input, InputSignal, OnChanges, Signal, SimpleChanges } from '@angular/core';
import { Monster } from '../../models/monster.model';
import { MonsterTypeProperties } from '../../utils/monster.utils';

@Component({
  selector: 'app-playing-card',
  imports: [],
  templateUrl: './playing-card.component.html',
  styleUrl: './playing-card.component.css'
})
export class PlayingCardComponent {

  monster = input(new Monster());
  monsterTypeIcon: Signal<string> = computed(() => {
    return MonsterTypeProperties[this.monster().type].imageUrl;
  });
  backgroundColor: Signal<string> = computed(() => {
    return MonsterTypeProperties[this.monster().type].color;
  })
}
