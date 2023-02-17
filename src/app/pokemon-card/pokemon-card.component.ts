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
  card__type: any;
  modalRef!: BsModalRef;
  totalPokemonsEvolutions: any;

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
    return this.http
      .get<Pokemon[]>(
        this.pokemonList.SEARCH_URL + 'evolution-chain/' + this.pokemon.number
      )
      .subscribe((res: any) => {
        console.log(res);
        this.totalPokemonsEvolutions = res.chain.evolves_to[0].species;
        console.log(this.totalPokemonsEvolutions);
        for (let pokemon of res.totalPokemonsEvolutions) {
          
        }
      });
  }

  openStatusModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.getPokemonModalStatus();
  }
}
