import { Continent } from "./continent";
import { Country } from "./country";

export interface Territory {
    name: Country,
    continent: 'North America' | 'South America' | 'Europe' | 'Africa' | 'Asia' | 'Australia';
}