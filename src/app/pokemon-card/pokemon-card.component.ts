import { Component, Input, TemplateRef } from '@angular/core';
import {
  Pokemon,
  PokemonListComponent,
} from '../pokemon-list/pokemon-list.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
})
export class PokemonCardComponent {
  @Input('pokemon')
  public pokemon!: Pokemon;
  public pokemons: Pokemon[] = [];
  card__type: any;
  modalRef!: BsModalRef;
  totalPokemonsEvolutions: any;
  evolutions: any[] = [];
  pokemonEvolutionURL: any;
  pokemonEvolution: any;
  evolutionimg: any;

  constructor(
    private modalService: BsModalService,
    public pokemonList: PokemonListComponent,
    private http: HttpClient
  ) {}

  public leadingZero(str: string | number, size: number = 3): string {
    //funcao para acrescentar 00 no id de cada pokemon
    let s = String(str);
    while (s.length < (size || 2)) {
      s = '0' + s;
    }
    return s;
  }

  getPokemonModalStatus() {
    this.pokemons = [];
    return this.http
      .get<Pokemon[]>(
        this.pokemonList.SEARCH_URL + 'pokemon-species/' + this.pokemon.number
      )
      .subscribe((answer: any) => {
        console.log('answer of sub', answer);

        this.pokemonEvolutionURL = answer.evolution_chain;

        console.log('pokemonEvolutionURL', this.pokemonEvolutionURL);

        this.http
          .get<Pokemon[]>(this.pokemonEvolutionURL.url)
          .subscribe((response: any) => {
            console.log('response', response);

            this.evolutions = [];
            this.getPokemonEvolutions(response.chain, this.evolutions);
            console.log(this.evolutions);
          });
      });
  }

  // getPokemonEvolutionsImg(chain: any): any[] {
  //   const evolutions: any[] = [];
  //   do {
  //   this.http
  //       .get<Pokemon[]>(
  //         this.pokemonList.SEARCH_URL + 'pokemon/' + chain.species.name
  //       )
  //       .subscribe((pokemonImg: any) => {
  //         console.log(pokemonImg);
  //         const evolutionimg = {
  //           image: pokemonImg.sprites.front_default,
  //         };
  //         evolutions.push(evolutionimg);
  //       });
  //     } while (!!chain && chain.hasOwnProperty('evolves_to'));
  //     return evolutions;
  // }

  getPokemonEvolutions(chain: any, evolutions: any[]): any {
    // Percorre a arvore de evolucao do pokemon para armazenar as informacoes numa array
    // const evolutions: any[] = [];
    
    if (!!chain && chain.hasOwnProperty('evolves_to')) {
      return this.http
        .get<Pokemon[]>(
          this.pokemonList.SEARCH_URL + 'pokemon/' + chain.species.name
        )
        .subscribe((pokemonEvo: any) => {
          console.log(pokemonEvo);
          const evolution = {
            image: pokemonEvo.sprites.front_default,
            name: pokemonEvo.name,
            number: pokemonEvo.id,
          };
          // console.log('test', typeof this.getPokemonEvolutions(chain.evolves_to)[Symbol.iterator]);
          evolutions.push(evolution);
          // evolutions = [...evolutions];
          // console.log(evolutions)
          this.getPokemonEvolutions(chain.evolves_to[0], evolutions);
        });
    }
    // do {
    //   const evolution = {
    //     name: chain.species.name,
    //     number: chain.species.url.split('/')[6],
    //   };
    //   evolutions.push(evolution);
    //   chain = chain.evolves_to[0];
    // } while (!!chain && chain.hasOwnProperty('evolves_to'));
    // // Verifica se chain existe e contem evolves_to, equanto true, o loop sera executado
    // return evolutions;
  }

  getAsyncEvolutions(): Observable<any[]> {
    return of(this.evolutions)
  }

  openStatusModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.getPokemonModalStatus();
  }
}
