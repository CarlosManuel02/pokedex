import {Injectable} from '@nestjs/common';
import axios, {AxiosInstance} from "axios";
import {pokeResponse} from "./interfaces/poke-response.interface";
import {PokemonService} from "../pokemon/pokemon.service";

@Injectable()
export class SeedService {

    private readonly axios: AxiosInstance = axios;
    constructor(private readonly pokemonService: PokemonService) {
    }

    async populateDB() {
        const {data} = await this.axios.get<pokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0')

        data.results.forEach(({name, url})=>{

            const segments = url.split('/');
            const no = +segments[segments.length - 2];

            this.pokemonService.create({
                name,
                no
            })
        })

        return 'Seed executed';
    }

}
