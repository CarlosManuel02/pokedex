import {Injectable} from '@nestjs/common';
import axios, {AxiosInstance} from "axios";
import {pokeResponse} from "./interfaces/poke-response.interface";

@Injectable()
export class SeedService {

    private readonly axios: AxiosInstance = axios;

    async populateDB() {
        const {data} = await this.axios.get<pokeResponse>('https://pokeapi.co/api/v2/pokemon?offset=500&limit=1000')

        data.results.forEach(({name, url})=>{

            const segments = url.split('/');
            const no = +segments[segments.length - 2];


        })

        return data.results;
    }

}
