import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  readonly SEARCH_URL = 'https://pokeapi.co/api/v2/';
  pokemon: any = [];

  constructor(private http: HttpClient, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.getPokemonList(1); //getPokemonList tem como parametro 1 para iniciar a lista em 1

    this.formSearch = this.fb.group({
      nameSearch: [null],
    });
  }

  getPokemonList($event: any) {
    this.pokemons = []; // zera a lista para nao acumular itens pesquisados anteriormente
    this.page = $event;

    return this.http.get<any>(this.SEARCH_URL + 'pokemon/' + '?offset=' + ($event - 1) * 20).subscribe((response: any) => { 
      //calculo do offset para carregar 20 pokemons por pagina
      this.totalPokemons = response.count;
      // console.table(response.results);
      // console.log(response.results);
      for (let pokemon of response.results) {
        this.http.get<any>(pokemon.url).subscribe((res: any) => { //segunda request para navegar na url de cada pokemon
          const myPokemonDetails: Pokemon = {
            image: res.sprites.front_default,
            number: res.id,
            name: res.name,
            types: res.types.map((t: { type: { name: any } }) => t.type.name),
          }
          this.pokemons.push(myPokemonDetails);
        });
      }
    });
  }

  onSearch() {
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
}

export interface Pokemon {
  [x: string]: any;
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
