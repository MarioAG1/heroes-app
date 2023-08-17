import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Publisher, Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(""),
    superhero: new FormControl<string>("", { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(""),
    first_appearance: new FormControl<string>(""),
    characters: new FormControl<string>(""),
    alt_img: new FormControl<string>(""),
  });

  public publishers = [
    { id: "Dc Comics", desc: "Dc - Comics" },
    { id: "Marvel Comics", desc: "Marvel - Comics" }
  ]

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    if (!this.router.url.includes("edit")) return

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.heroesService.getHeroesById(id)),
      ).subscribe(hero => {

        if (!hero) return this.router.navigateByUrl("/")
        this.heroForm.reset(hero)
        return
      })

  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero
    return hero
  }

  onSubmit(): void {

    if (!this.heroForm.valid) {
      this.showSnackbar(`Comprueba que todos los datos estan introducidos`)
      return
    }

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        // Permite actualizarlo
        .subscribe(hero => {
          this.router.navigate(['/heroes/list'])
          this.showSnackbar(`${hero.superhero} actualizado`)
        })
      return
    }
    this.heroesService.addHero(this.currentHero)
      // Permite crearlo
      .subscribe(hero => {
        this.router.navigate(['/heroes/list'])
        this.showSnackbar(`${hero.superhero} creado`)
      })
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error("Hero is required")

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) result
      this.heroesService.deleteHeroById(this.currentHero.id)
        // Esto hacer que se pueda borrar
        .subscribe(wasDeleted => {
          if (wasDeleted)
            this.router.navigate(['/heroes/list'])
        })
    })
  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, "Vale", {
      duration: 2500
    })
  }
}
