import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreatePokemonDto} from './dto/create-pokemon.dto';
import {UpdatePokemonDto} from './dto/update-pokemon.dto';
import {Pokemon} from "./entities/pokemon.entity";
import {isValidObjectId, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {PaginationDto} from "../common/dto/pagination.dto";
import * as process from "process";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class PokemonService {

    private defaultLimit;

    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly config: ConfigService,
    ) {
        this.defaultLimit = this.config.get<number>('default_limit');
    }

    async create(createPokemonDto: CreatePokemonDto) {
        createPokemonDto.name = createPokemonDto.name.toLowerCase();

        try {
            const pokemon = await this.pokemonModel.create(createPokemonDto)
            return pokemon;
        } catch (e) {
            this.handleExeptions(e);
        }
    }


    findAll(query: PaginationDto) {

        const {limit = this.defaultLimit, offset = 0} = query;

        return this.pokemonModel.find()
            .limit(limit)
            .skip(offset)
            .sort({no: 1})
            .select('-__v')
    }

    async findOne(term: string) {
        let condition: object = {name: term.toLowerCase().trim()}; // buscar por nombre

        if (!isNaN(+term)) {
            condition = {no: term}; // buscar por no (numero)
        } else if (isValidObjectId(term)) {
            condition = {_id: term}; // buscar por id (mongo)
        }

        const pokemon: Pokemon = await this.pokemonModel.findOne(condition);
        if (!pokemon) throw new BadRequestException(`Pokemon not found`);

        return pokemon
    }

    async update(term: string, updatePokemonDto: UpdatePokemonDto) {

        const pokemon: Pokemon = await this.findOne(term);

        if (updatePokemonDto.name)
            updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

        // comprobar que el pokemon.no no existe
        // try {
        //     await pokemon.updateOne(updatePokemonDto, {new: true});
        //     return {...pokemon.toJSON(), ...updatePokemonDto};
        // } catch (e) {
        //     this.handleExeptions(e);
        // }

        if (updatePokemonDto.no) {
            const pokemonByNo: Pokemon = await this.pokemonModel.findOne({no: updatePokemonDto.no});
            if (pokemonByNo && pokemonByNo._id != pokemon._id) {
                throw new BadRequestException(`Pokemon no ${updatePokemonDto.no} already exists`);
            }
        }

        await pokemon.updateOne(updatePokemonDto, {new: true});

        return {...pokemon.toJSON(), ...updatePokemonDto};

    }

    async remove(_id: string) {
        // const pokemon: Pokemon = await this.findOne(term);
        // return pokemon.deleteOne();
        // return this.pokemonModel.findByIdAndDelete(term);

        const result = await this.pokemonModel.deleteOne({_id});
        if (result.deletedCount === 0) {
            throw new BadRequestException(`Pokemon not with id ${_id} not found`);
        }
        return;
    }


    private handleExeptions(e: any) {
        if (e.code === 11000) {
            throw new BadRequestException(`Duplicate key error: ${JSON.stringify(e.keyValue)}`)
        }
        console.log(e)
        throw new InternalServerErrorException('Cannot create pokemon -- check server logs');
    }
}
