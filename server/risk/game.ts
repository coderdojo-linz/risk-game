
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

    id: number;
    players: Player[] = [];
    state: 'waitingForPlayers' | 'allocatingTerritories' | 'placeReinforcements' | 'attack' | 'moveArmies';
    currentPlayer = -1;

    constructor(public name: string, player: Player) {
        this.id = Game.maxId;
        this.state = 'waitingForPlayers';
        this.players.push(player);
        Game.maxId++;
    }

    start() {
        //set current player
        this.currentPlayer = Math.floor(Math.random() * this.players.length);

        const territories = Game.territories.sort((a, b) => {
            return Math.random() - 0.5;
        });

        for(let i = 0; i < territories.length; i++) {
            this.players[this.currentPlayer].territories.push({name: territories[i].name, armies: 1});
            this.currentPlayer++;
            if(this.currentPlayer >= this.players.length) {
                this.currentPlayer = 0;
            } 
        }

        // TODO: set initial armies
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
            default:
        }

        for(let player of this.players) {
            player.availableArmies = initialArmies - player.territories.length;
        }
        
        // TODO: set state
        this.state = "allocatingTerritories";
    }

    allocateTerritory(player: Player, country: Country) {
        if (
            player &&
            country &&
            this.state === 'allocatingTerritories' &&
            player === this.players[this.currentPlayer] &&
            player.availableArmies > 0
        ) {
            const territory = player.territories.find(territory => territory.name === country);
            if (territory) {
                player.availableArmies--;
                territory.armies++;
                this.setNextPlayer();
            }
        }
    }
    private setNextPlayer(): void {
        if (this.currentPlayer === this.players.length - 1) {
            this.currentPlayer = 0;
        } else {
            this.currentPlayer++;
        }
    }
}