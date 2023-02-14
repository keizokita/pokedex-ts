import { Component, Input } from '@angular/core';
import { Pokemon } from '../pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  
  @Input('pokemon')
  public pokemon!: Pokemon;
card__type: any;

  public leadingZero(str: string | number, size: number = 3): string {
    let s = String(str);
    while (s.length < (size || 2)) {
      s = '0' + s;
    }
    return s
  }
}


