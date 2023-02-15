import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { from, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  public pokemons: Pokemon[] = [];
  page = 0;
  itemsPerPage!: number;
  totalPokemons!: number;
  formSearch!: FormGroup;
  readonly SEARCH_URL = 'https://pokeapi.co/api/v2/pokemon/';
  pokemon: any = [];

  constructor(private http: HttpClient, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.getPokemonList();

    this.formSearch = this.fb.group({
      nameSearch: [null],
    });
  }

  Home() {
    this.pokemons = [];
    this.getPokemonList();
  }

  getPokemonList() {
    const URL = 'https://pokeapi.co/api/v2/pokemon/';

    return this.http.get<any>(URL).subscribe((response: any) => {
      this.totalPokemons = response.count;
      // console.table(response.results);
      for (let pokemon of response.results) {
        this.http.get<any>(pokemon.url).subscribe((res: any) => { //constinuar testando paths para popular cards
          console.log('resposta da url pokemon',pokemon.url);
          console.log('pokemon name', pokemon.url.name);
          const myPokemonDetails: Pokemon = {
            image: res.pokemon.sprites.front_default,
            number: res.pokemon.id,
            name: res.pokemon.name,
            types: res.pokemon.types.map((t: { type: { name: any } }) => t.type.name),
          }
          this.pokemons.push(myPokemonDetails);
        });
        const myPokemon: Pokemon = {
          image: '',
          number: 0,
          name: pokemon.name,
          types: [],
        };
        this.pokemons.push(myPokemon);
        // console.log('poke', pokemon);
      }
    });
  }

  onSearch() {
    console.log(this.formSearch.controls['nameSearch'].value);

    this.http
      .get<Pokemon[]>(
        this.SEARCH_URL +
          this.formSearch.controls['nameSearch'].value.toLowerCase() +
          '/?offset='
      )
      .subscribe((results: any) => {
        this.pokemons = [];
        this.totalPokemons = results.count;
        const pokemon: Pokemon = {
          image: results.sprites.front_default,
          number: results.id,
          name: results.name,
          types: results.types.map((t: { type: { name: any } }) => t.type.name),
        };
        this.pokemons.push(pokemon);
      });
    this.formSearch.reset();
  }

  pageChanged($event: number) {
    this.page = $event;
    return this.http
      .get<any>(this.SEARCH_URL + '?offset=' + $event)
      .pipe(
        map((value) => value.results),
        map((value: any) => {
          return from(value).pipe(mergeMap((v: any) => this.http.get(v.url)));
        }),
        mergeMap((value) => value)
      )
      .subscribe((results: any) => {
        this.totalPokemons = results.count;
        const pokemon: Pokemon = {
          image: results.sprites.front_default,
          number: results.id,
          name: results.name,
          types: results.types.map((t: { type: { name: any } }) => t.type.name),
        };
        this.pokemons.push(pokemon);
      });
  }
}

export interface Pokemon {
  image: string;
  number: number;
  name: string;
  types: Type[];
}

enum Type {
  Grass = 'Grass',
  Poison = 'Poison',
  Fire = 'Fire',
}
