import { Country } from "./country";

export class Player {
    public territories: { name: Country, armies: number }[];
    public availableArmies: number = 0;

    constructor(public name: string, public color: string) {
        this.territories = [];
    }
}