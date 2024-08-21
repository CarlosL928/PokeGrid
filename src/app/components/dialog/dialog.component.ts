import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, signal } from '@angular/core';
import { AppModule } from '../../module/app/app.module';
import { PokemonService } from '../../services/pokemon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [AppModule, ],
  providers: [PokemonService],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  pokemonData = signal<any>(null);

  pokemon: any;
  animationArray: string[] = [];
  indiceActual: number = 0;
  animating: boolean = false;
  private animationInterval: any; // Intervalo de animación

  constructor(
    private pokemonService: PokemonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {}

  
  imagenActual(): string {
    // Lógica para obtener la imagen actual
    return this.animationArray.length > 0 ? this.animationArray[0] : '';
  }

  ngOnInit(): void {
    this.pokemonService.getPokemon(this.data.id).subscribe({
      next: (response: any) => {
        this.pokemon = response;

        // Configurar animaciones si están disponibles
        if (response.sprites && response.sprites.front_default && response.sprites.back_default) {
          this.animationArray = [
            response.sprites.front_default,
            response.sprites.back_default
          ];
          this.iniciarAnimacion(); // Iniciar animación si hay imágenes
        } else {
          this.animationArray = [];
        }
      },
      error: (err: any) => {
        console.error('Error al obtener Pokémon:', err);
        this.openSnackBarError();
        this.animationArray = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.detenerAnimacion();
  }

  playSound(soundSource: string) {
    if (soundSource) {
      const audio = new Audio(soundSource);
      audio.play().catch(err => console.error('Error al reproducir el sonido:', err));
    }
  }

  openSnackBarError() {
    this._snackBar.open('Nombre o id de pokemon no válido', 'Cerrar', { duration: 3000 });
  }

  iniciarAnimacion() {
    this.indiceActual = 0;
    this.animating = true;
    this.animateFrames();
  }

  animateFrames() {
    if (this.animating) {
      this.animationInterval = setInterval(() => {
        this.indiceActual = (this.indiceActual + 1) % this.animationArray.length;
      }, 300);
    }
  }

  detenerAnimacion() {
    this.animating = false;
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

}
