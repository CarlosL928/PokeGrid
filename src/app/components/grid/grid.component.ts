import { Component, computed, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { HttpClientModule } from '@angular/common/http';
import { AppModule } from '../../module/app/app.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonEngine } from '@angular/ssr';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    AppModule,
    CommonModule,
  ],
  providers: [PokemonService],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements OnInit{
  pokemonNameOrId = signal('');
  loading = signal(false);
  pokemons = signal<any[]>([]);  // Lista de Pokémon que se va a mostrar
  animationArray = signal<string[]>([]);
  indiceActual = signal(0);
  animating = signal(false);
  contador = signal<number[]>([]);



  imagenActual = computed(() => {
    const array = this.animationArray();
    return array.length > 0 ? array[this.indiceActual()] : '';
  });


  constructor(
    private dialog: MatDialog,
    private pokemonService: PokemonService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPokemon();
  };

  playSound(soundSource: string) {
    const audio = new Audio();
    audio.src = soundSource;
    audio.load();
    audio.play();
  }

loadPokemon() {
  this.loading.set(true);
  this.pokemonService.getPokemons().subscribe((response: any) => {
    const pokemons = response.results;
    const requests = pokemons.map((pokemon: any) => this.pokemonService.getPokemon(pokemon.name));
    forkJoin(requests).subscribe((pokemonsData: any) => {
      this.pokemons.set(pokemonsData);
      this.loading.set(false);
    });
  }, () => {
    this.openSnackBarError();
    this.loading.set(false);
  });
}

 
  
  handlePokemonClick(pokemon: any): void {
  this.playSound(pokemon?.cries?.latest);
  this.openDialog(pokemon.id);
}


  generateRandomPokemonId(): number {
    return Math.floor(Math.random() * 649) + 1; // Asumiendo que hay 898 Pokémon
  }

  openSnackBarError() {
    this._snackBar.open('Error al cargar los Pokémon. Inténtalo de nuevo.', 'Cerrar', { duration: 3000 });
  }

  openSnackSinData() {
    this._snackBar.open('Escriba una cantidad válida para cargar Pokémon', 'Cerrar', { duration: 3000 });
  }

  iniciarAnimacion() {
    this.indiceActual.set(0);
    this.animating.set(true);
    this.animateFrames();
  }

  animateFrames() {
    setTimeout(() => {
      if (this.animating()) {
        this.indiceActual.update(index => (index + 1) % this.animationArray().length);
        this.animateFrames();
      }
    }, 300);
  }

  detenerAnimacion() {
    this.animating.set(false);
  }

  updateName(name: string) {
    this.pokemonNameOrId.set(name.toLowerCase());
  }

  playSoundOnClick() {
    this.pokemons().forEach(pokemon => {
      if (pokemon.cries?.latest) {
        this.playSound(pokemon.cries.latest);
      }
    });
  }
  isLast(item: any, list: any[]): boolean {
    return list[list.length - 1] === item;
  }

  openDialog(id: any): void {
    this.dialog.open(DialogComponent, {
      data: {
        id,
        
      },
    });
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}