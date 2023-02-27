import { Component, Input, TemplateRef } from '@angular/core';
import {
  Pokemon,
  PokemonListComponent,
} from '../pokemon-list/pokemon-list.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';

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
  pokemonEvolution: any;
  pokemonEvolutionURL: any;
  pokemonEvolution2: any;
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

        // this.pokemonEvolution = res.chain.evolves_to.species;
        this.pokemonEvolutionURL = answer.evolution_chain;

        console.log('pokemonEvolutionURL', this.pokemonEvolutionURL);

        // quando pega a evolucao do pokemon, sempre vira o primeiro da lisa evolution_chain
        this.http
          .get<Pokemon[]>(this.pokemonEvolutionURL.url)
          .subscribe((response: any) => {
            console.log('response', response);
            for (let pokemonEvolutionModal of response.chain.evolves_to) {
              console.log(
                'response.chain.evolves_to',
                response.chain.evolves_to
              );
              this.http
                .get<Pokemon[]>(
                  this.pokemonList.SEARCH_URL +
                    'pokemon/' +
                    pokemonEvolutionModal.species.name
                )
                .subscribe((res: any) => {
                  console.log(pokemonEvolutionModal.species.name);
                  console.log('res(dados do pokemon)', res);
                  // console.log('response of totalPokemonsEvolutions', res);
                  const myPokemonDetailsModal: Pokemon = {
                    image: res.sprites.front_default,
                    number: res.id,
                    name: res.name,
                    types: res.types.map(
                      (t: { type: { name: any } }) => t.type.name
                    ),
                  };
                  // if (pokemonEvolutionModal.species.name == res.name) {
                  //   // condicional para evolucao igual a primeira evolucao da lista for igual, exibir a proxima evolucao
                  //   this.http
                  //     .get<Pokemon[]>(this.pokemonEvolutionURL.url)
                  //     .subscribe((resIf: any) => {
                  //       console.log(
                  //         resIf.chain.evolves_to[0].evolves_to[0].species.name
                  //       );
                  //       // resIf.evolves_to[0].evolves_to
                  //       this.http
                  //         .get<Pokemon[]>(
                  //           this.pokemonList.SEARCH_URL +
                  //             'pokemon/' +
                  //             resIf.chain.evolves_to[0].evolves_to[0].species.name
                  //         )
                  //         .subscribe((res: any) => {
                  //           console.log(pokemonEvolutionModal.species.name);
                  //           console.log('res(dados do pokemon)', res);
                  //           // console.log('response of totalPokemonsEvolutions', res);
                  //           const myPokemonDetailsModal: Pokemon = {
                  //             image: res.sprites.front_default,
                  //             number: res.id,
                  //             name: res.name,
                  //             types: res.types.map(
                  //               (t: { type: { name: any } }) => t.type.name
                  //             ),
                  //           };
                  //           this.pokemons.push(myPokemonDetailsModal);
                  //         });
                  //     });
                  // }
                  console.log('pokemonEvolutionModal', pokemonEvolutionModal);
                  this.pokemons.push(myPokemonDetailsModal);
                  console.log('myPokemonDetailsModal', myPokemonDetailsModal);
                });
            }
          });
      });
  }

  openStatusModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.getPokemonModalStatus();
  }
}
