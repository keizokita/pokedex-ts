// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { from, map, mergeMap } from 'rxjs';
// import { Pokemon } from './app/pokemon-list/pokemon-list.component';

// @Injectable({
//     providedIn: 'root',
// })
// export class PokemonService {
//     public pokemons: Pokemon[] = [];
//     page = 1;
//     totalPokemons: number | undefined;
    
//     constructor(private http: HttpClient) {
//         const allPokemonsUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=107';
        
//         this.http
//             .get<any>(allPokemonsUrl)
//             .pipe(
//                 map((value) => value.results),
//                 map((value: any) => {
//                     return from(value).pipe(
//                         mergeMap((v: any) => this.http.get(v.url))
//                     );
//                 }),
//                 mergeMap((value) => value)
//             )
//             .subscribe((result: any) => {
//                 this.totalPokemons = result.count;
//                 const pokemon: Pokemon = {
//                     image: result.sprites.front_default,
//                     number: result.id,
//                     name: result.name,
//                     types: result.types.map((t: { type: { name: any } }) => t.type.name),
//                 };
//                 this.pokemons[result.id] = pokemon;
//             });
//     }

//     // getPokemonList() {
//     //     return this.http.get<Pokemon[]>(`${this.allPokemonsUrl}`).subscribe((result: any) => {
//     //         this.totalPokemons = result.count;
//     //         const pokemon: Pokemon = {
//     //             image: result.sprites.front_default,
//     //             number: result.id,
//     //             name: result.name,
//     //             types: result.types.map((t: { type: { name: any } }) => t.type.name),
//     //         };

//     //         this.pokemons[result.id] = pokemon;
//     //     });
//     // }

//     // getPokemonsByName(name: string) {
//     //     return this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`).subscribe((result: any) => {
//     //         this.totalPokemons = result.count;
//     //         const pokemon: Pokemon = {
//     //             image: result.sprites.front_default,
//     //             number: result.id,
//     //             name: result.name,
//     //             types: result.types.map((t: { type: { name: any } }) => t.type.name),
//     //         };

//     //         this.pokemons[result.id] = pokemon;
//     //     });
//     // }
// }
