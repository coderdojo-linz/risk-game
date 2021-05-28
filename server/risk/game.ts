import { Continent } from "./continent";
import { Country } from "./country";
import { Player } from "./player";
import { Territory } from "./territory";

export class Game {
    static maxId: number = 0;

    static territories: Territory[] = [
        { name: 'Alaska', continent: 'North America' },
        { name: 'Alberta', continent: 'North America' },
        { name: 'Central America', continent: 'North America' },
        { name: 'Eastern United States', continent: 'North America' },
        { name: 'Greenland', continent: 'North America' },
        { name: 'Northwest Territory', continent: 'North America' },
        { name: 'Ontario', continent: 'North America' },
        { name: 'Quebec', continent: 'North America' },
        { name: 'Western United States', continent: 'North America' },
        { name: 'Argentina', continent: 'South America' },
        { name: 'Brazil', continent: 'South America' },
        { name: 'Peru', continent: 'South America' },
        { name: 'Venezuela', continent: 'South America' },
        { name: 'Great Britain', continent: 'Europe' },
        { name: 'Iceland', continent: 'Europe' },
        { name: 'Northern Europe', continent: 'Europe' },
        { name: 'Scandinavia', continent: 'Europe' },
        { name: 'Southern Europe', continent: 'Europe' },
        { name: 'Ukraine', continent: 'Europe' },
        { name: 'Western Europe', continent: 'Europe' },
        { name: 'Congo', continent: 'Africa' },
        { name: 'East Africa', continent: 'Africa' },
        { name: 'Egypt', continent: 'Africa' },
        { name: 'Madagascar', continent: 'Africa' },
        { name: 'North Africa', continent: 'Africa' },
        { name: 'South Africa', continent: 'Africa' },
        { name: 'Afghanistan', continent: 'Asia' },
        { name: 'China', continent: 'Asia' },
        { name: 'India', continent: 'Asia' },
        { name: 'Irktusk', continent: 'Asia' },
        { name: 'Japan', continent: 'Asia' },
        { name: 'Kamchatka', continent: 'Asia' },
        { name: 'Middle East', continent: 'Asia' },
        { name: 'Mongolia', continent: 'Asia' },
        { name: 'Siam', continent: 'Asia' },
        { name: 'Siberia', continent: 'Asia' },
        { name: 'Ural', continent: 'Asia' },
        { name: 'Yakutsk', continent: 'Asia' },
        { name: 'Eastern Australia', continent: 'Australia' },
        { name: 'Indonesia', continent: 'Australia' },
        { name: 'New Guinea', continent: 'Australia' },
        { name: 'Western Australia', continent: 'Australia' }
    ];

    static countryPairs: [Country, Country][] = [
        ['Greenland', 'Iceland'],
        ['Greenland', 'Quebec'],
        ['Greenland', 'Ontario'],
        ['Greenland', 'Northwest Territory'],
        ['Northwest Territory', 'Alaska'],
        ['Northwest Territory', 'Alberta'],
        ['Northwest Territory', 'Ontario'],
        ['Alaska', 'Alberta'],
        ['Alaska', 'Kamchatka'],
        ['Alberta', 'Ontario'],
        ['Alberta', 'Western United States'],
        ['Ontario', 'Quebec'],
        ['Ontario', 'Western United States'],
        ['Ontario', 'Eastern United States'],
        ['Quebec', 'Eastern United States'],
        ['Western United States', 'Eastern United States'],
        ['Western United States', 'Central America'],
        ['Eastern United States', 'Central America'],
        ['Central America', 'Venezuela'],
        ['Venezuela', 'Peru'],
        ['Venezuela', 'Brazil'],
        ['Peru', 'Brazil'],
        ['Peru', 'Argentina'],
        ['Brazil', 'Argentina'],
        ['Brazil', 'North Africa'],
        ['North Africa', 'Western Europe'],
        ['North Africa', 'Southern Europe'],
        ['North Africa', 'Egypt'],
        ['North Africa', 'East Africa'],
        ['North Africa', 'Congo'],
        ['Congo', 'South Africa'],
        ['Congo', 'East Africa'],
        ['South Africa', 'East Africa'],
        ['South Africa', 'Madagascar'],
        ['Madagascar', 'East Africa'],
        ['East Africa', 'Egypt'],
        ['East Africa', 'Middle East'],
        ['Egypt', 'Middle East'],
        ['Egypt', 'Southern Europe'],
        ['Western Europe', 'Southern Europe'],
        ['Western Europe', 'Great Britain'],
        ['Western Europe', 'Northern Europe'],
        ['Northern Europe', 'Great Britain'],
        ['Northern Europe', 'Scandinavia'],
        ['Northern Europe', 'Southern Europe'],
        ['Northern Europe', 'Ukraine'],
        ['Great Britain', 'Iceland'],
        ['Great Britain', 'Scandinavia'],
        ['Iceland', 'Scandinavia'],
        ['Scandinavia', 'Ukraine'],
        ['Southern Europe', 'Ukraine'],
        ['Southern Europe', 'Middle East'],
        ['Ukraine', 'Ural'],
        ['Ukraine', 'Afghanistan'],
        ['Ukraine', 'Middle East'],
        ['Ural', 'Siberia'],
        ['Ural', 'China'],
        ['Ural', 'Afghanistan'],
        ['Siberia', 'Yakutsk'],
        ['Siberia', 'Irktusk'],
        ['Siberia', 'Mongolia'],
        ['Siberia', 'China'],
        ['Yakutsk', 'Kamchatka'],
        ['Yakutsk', 'Irktusk'],
        ['Kamchatka', 'Irktusk'],
        ['Kamchatka', 'Japan'],
        ['Irktusk', 'Mongolia'],
        ['Mongolia', 'Japan'],
        ['Mongolia', 'China'],
        ['China', 'Siam'],
        ['China', 'India'],
        ['China', 'Afghanistan'],
        ['Afghanistan', 'Middle East'],
        ['Afghanistan', 'India'],
        ['Middle East', 'India'],
        ['India', 'Siam'],
        ['Siam', 'Indonesia'],
        ['Indonesia', 'New Guinea'],
        ['Indonesia', 'Western Australia'],
        ['New Guinea', 'Western Australia'],
        ['New Guinea', 'Eastern Australia'],
        ['Western Australia', 'Eastern Australia'],
    ];

    id: number;
    players: Player[] = [];
    state: 'waitingForPlayers' | 'allocatingTerritories' | 'placeReinforcements' | 'attack' | 'moveArmies';
    currentPlayer = -1;
    attackedPlayer = -1;
    attackingCountry: Country | null = null;
    attackingArmies: 1 | 2 | 3 = 1;
    defendingCountry: Country | null = null;
    attackWarning: string = '';
    defendWarning: string = '';
    attackResult: {
        attackingCountry: Country,
        defendingCountry: Country,
        attack: number[],
        defend: number[],
        attackerLostArmies: number,
        targetLostArmies: number,
        targetLostTerritory: boolean
    } | null = null;

    constructor(public name: string, player: Player) {
        this.id = Game.maxId;
        this.state = 'waitingForPlayers';
        this.players.push(player);
        Game.maxId++;
    }

    start() {
        this.currentPlayer = Math.floor(Math.random() * this.players.length);

        Game.territories.sort(() => 0.5 - Math.random()).forEach((territory, index) => {
            this.players[this.currentPlayer].territories.push({ name: territory.name, armies: 1 });
            this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        });

        let initialArmies = 0;

        switch (this.players.length) {
            case 2:
                initialArmies = 40;
                break;
            case 3:
                initialArmies = 35;
                break;
            case 4:
                initialArmies = 30;
                break;
            case 5:
                initialArmies = 25;
                break;
            case 6:
                initialArmies = 20;
                break;
        }

        this.players.forEach(player => {
            player.availableArmies = initialArmies - player.territories.length;
        });

        this.state = 'allocatingTerritories';
    }

    distributeArmies() {
        while (this.players[this.currentPlayer].availableArmies) {
            const territories = this.players[this.currentPlayer].territories
            territories[Math.floor(Math.random() * territories.length)].armies++;
            this.players[this.currentPlayer].availableArmies--;
            this.setNextPlayer();
        }

        this.startMove();
    }

    allocateTerritory(player: Player, country: Country) {
        if (this.state == 'allocatingTerritories' && player == this.players[this.currentPlayer]) {
            let territory = player.territories.find(t => t.name == country);
            if (territory) {
                player.availableArmies--;
                territory.armies++;

                this.setNextPlayer();
                if (!this.players.find(p => p.availableArmies > 0)) {
                    this.startMove();
                }
            }
        }
    }

    placeReinforcement(player: Player, country: Country) {
        if (this.state == 'placeReinforcements' && player == this.players[this.currentPlayer]) {
            let territory = player.territories.find(t => t.name == country);
            if (territory) {
                player.availableArmies--;
                territory.armies++;

                if (!player.availableArmies) {
                    this.state = 'attack';
                }
            }
        }
    }

    attack(player: Player, attackingCountry: Country, defendingCountry: Country, armies: 1 | 2 | 3) {
        const attackingTerritory = player.territories.find(t => t.name == attackingCountry);
        this.attackWarning = '';
        this.attackResult = null;

        if (this.state == 'attack'
            && player == this.players[this.currentPlayer]
            && attackingTerritory
            && !player.territories.find(t => t.name == defendingCountry)) {
            this.attackWarning = '';
            this.attackedPlayer = -1;

            // check if numberOfArmies is allowed
            if (armies >= attackingTerritory.armies) {
                this.attackWarning = `${attackingCountry} kann nicht mit ${armies} Armeen angreifen.`;
                return;
            }

            // check if countries are neighbours
            const countryPair = Game.countryPairs.filter(p => (p[0] == attackingCountry && p[1] == defendingCountry) || (p[1] == attackingCountry && p[0] == defendingCountry));

            // TODO: check target country

            console.log('attack country pair', countryPair, countryPair.length);

            if (countryPair.length) {
                this.attackingCountry = attackingCountry;
                this.defendingCountry = defendingCountry;
                this.attackingArmies = armies;

                this.attackedPlayer = this.players.findIndex(p => p.territories.find(t => t.name == defendingCountry));
            } else {
                this.attackWarning = `${defendingCountry} kann nicht von ${attackingCountry} angegriffen werden.`;
            }
        }
    }

    defend(player: Player, armies: 1 | 2) {
        const targetTerritory = player.territories.find(t => t.name == this.defendingCountry);
        const attackingTerritory = this.players[this.currentPlayer].territories.find(t => t.name == this.attackingCountry);
        this.defendWarning = '';

        if (this.state == 'attack'
            && player == this.players[this.attackedPlayer]
            && targetTerritory
            && attackingTerritory) {

            // check if numberOfArmies is allowed
            if (armies > targetTerritory.armies) {
                this.defendWarning = `${this.defendingCountry} kann sich nicht mit ${armies} Armeen verteidigen.`;
                return;
            }

            if (!this.attackingCountry || !this.defendingCountry) {
                this.defendWarning = `Das attackierende oder verteidigende Land ist nicht gesetzt.`;
                return;
            }

            console.log('attack', 'defend', this.attackingArmies, armies);

            // dice
            const attack = Array.from({ length: this.attackingArmies }, () => Math.floor(Math.random() * 6)).sort().reverse();
            console.log('attack', attack);
            const defend = Array.from({ length: armies }, () => Math.floor(Math.random() * 6)).sort().reverse();
            console.log('defend', defend);

            console.log('dice', attack, defend);
            let attackerLostArmies = 0;
            let targetLostArmies = 0;
            let targetLostTerritory = false;

            defend.forEach((d, i) => {
                if (attack.length > i) {
                    if (d < attack[i]) {
                        targetTerritory.armies--;
                        targetLostArmies++;
                    } else {
                        attackingTerritory.armies--;
                        attackerLostArmies++;
                    }
                }
            });

            if (targetTerritory.armies === 0) {
                const index = this.players[this.attackedPlayer].territories.indexOf(targetTerritory);
                this.players[this.attackedPlayer].territories.splice(index, 1);

                targetTerritory.armies = this.attackingArmies - attackerLostArmies;
                attackingTerritory.armies -= this.attackingArmies - attackerLostArmies;
                this.players[this.currentPlayer].territories.push(targetTerritory);

                targetLostTerritory = true;
            }

            this.attackResult = {
                attackingCountry: this.attackingCountry,
                defendingCountry: this.defendingCountry,
                attack: attack,
                defend: defend,
                attackerLostArmies: attackerLostArmies,
                targetLostArmies: targetLostArmies,
                targetLostTerritory: targetLostTerritory
            };

            this.attackingCountry = null;
            this.attackingArmies = 1;
            this.defendingCountry = null;
            this.attackedPlayer = -1;
        }
    }

    endAttack(player: Player) {
        if (this.state == 'attack'
            && player == this.players[this.currentPlayer]) {
            this.attackWarning = '';
            this.attackResult = null;
            this.attackingCountry = null;
            this.attackingArmies = 1;
            this.defendingCountry = null;
            this.attackedPlayer = -1;

            this.setNextPlayer();
            this.startMove();
        }
    }

    private startMove() {
        this.state = 'placeReinforcements';

        // calculate new territories
        const player = this.players[this.currentPlayer];
        player.availableArmies += Math.floor(player.territories.length / 3)

        if (this.hasAllCountriesinContinent(player, 'Africa')) player.availableArmies += 3;
        if (this.hasAllCountriesinContinent(player, 'Asia')) player.availableArmies += 7;
        if (this.hasAllCountriesinContinent(player, 'Australia')) player.availableArmies += 2;
        if (this.hasAllCountriesinContinent(player, 'Europe')) player.availableArmies += 5;
        if (this.hasAllCountriesinContinent(player, 'North America')) player.availableArmies += 5;
        if (this.hasAllCountriesinContinent(player, 'South America')) player.availableArmies += 2;
    }

    private setNextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    }

    private hasAllCountriesinContinent(player: Player, continent: Continent) {
        return Game.territories.filter(t => t.continent === continent).filter(t => !player.territories.find(p => p.name === t.name)).length === 0;
    }
}