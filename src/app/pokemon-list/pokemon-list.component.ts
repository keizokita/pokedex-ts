import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { PokemonService } from 'src/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  pokemons: any[] = [];
  page = 1;
  itemsPerPage!: number;
  totalPokemons!: number;
  formSearch!: FormGroup;
  nameSearch = new FormControl();
  readonly SEARCH_URL = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(
    public pokemonService: PokemonService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.formSearch = this.fb.group({
      nameSearch: [null],
    });
  }

  onSearch() {
    console.log(this.SEARCH_URL + this.nameSearch.value);
    this.http
      .get(this.SEARCH_URL + this.nameSearch.value)
      .subscribe();
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
