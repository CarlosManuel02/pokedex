import {Injectable} from '@nestjs/common';
import {pokeResponse} from "./interfaces/poke-response.interface";
// import {PokemonService} from "../pokemon/pokemon.service";
import {InjectModel} from "@nestjs/mongoose";
import {Pokemon} from "../pokemon/entities/pokemon.entity";
import {Model} from "mongoose";
import {AxiosAdapter} from "../common/adapters/axios.adapter";

@Injectable()
export class SeedService {


    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly http: AxiosAdapter,
    ) {
    }

    async populateDB() {
        // borrar todos los registros
        await this.pokemonModel.deleteMany({});
        const data = await this.http.get<pokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=500&offset=0')

        const PromiseArray: { name: string, no: number }[] = [];
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
