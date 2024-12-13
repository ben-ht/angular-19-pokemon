import { MonsterType } from "../utils/monster.utils";

export interface IMonster {
    id?: number;

    name: string;
    hp: number;
    description: string;
    image: string;
    type: MonsterType;

    attackName: string;
    attackStrength: number;
    attackDescription: string;
}