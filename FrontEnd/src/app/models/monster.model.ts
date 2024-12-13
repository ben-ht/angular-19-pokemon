import { IMonster } from "../interfaces/monster-interface";
import { MonsterType } from "../utils/monster.utils";

export class Monster implements IMonster {
    id: number = -1;
    name: string = "Pikachu";
    hp: number = 60;
    attackName: string = "Thunderbolt";
    attackStrength: number = 20;
    attackDescription: string = "Strikes the target with a powerful lightning bolt";
    description: string = "25";
    image: string = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg"
    type: MonsterType = MonsterType.ELECTRIC

    clone(): Monster {
        return Object.assign(new Monster(), this);
    }

    static fromJson(monsterJson: IMonster): Monster {
        return Object.assign(new Monster(), monsterJson);
    }

    toJson(): IMonster {
        const monsterJson: IMonster = Object.assign({}, this);
        delete monsterJson.id;
        return monsterJson;
    }
}