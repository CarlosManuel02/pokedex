import {Injectable} from '@nestjs/common';
import axios, {AxiosInstance} from "axios";
import {pokeResponse} from "./interfaces/poke-response.interface";
// import {PokemonService} from "../pokemon/pokemon.service";
import {InjectModel} from "@nestjs/mongoose";
import {Pokemon} from "../pokemon/entities/pokemon.entity";
import {Model} from "mongoose";

@Injectable()
export class SeedService {

    private readonly axios: AxiosInstance = axios;

    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>
    ) {
    }

    async populateDB() {
        // borrar todos los registros
        await this.pokemonModel.deleteMany({});
        const {data} = await this.axios.get<pokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=500&offset=0')

        const PromiseArray: {name:string, no:number}[] = [];
        for (const {name, url} of data.results) {

            const segments = url.split('/')
            const no = +segments[segments.length - 2];
            // await this.pokemonModel.create({name, no})
            PromiseArray.push({name, no})
        }
        // await Promise.all(PromiseArray);
        await this.pokemonModel.insertMany(PromiseArray);

        return 'Seed executed';
    }

}
