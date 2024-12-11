import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, of, Subscription, switchMap } from 'rxjs';
import { MonsterType } from '../../utils/monster.utils';
import { PlayingCardComponent } from "../../components/playing-card/playing-card.component";
import { Monster } from '../../models/monster.model';
import { MonsterService } from '../../services/monster/monster.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMonsterConfirmationDialogComponent } from '../../components/delete-monster-confirmation-dialog/delete-monster-confirmation-dialog.component';

@Component({
  selector: 'app-monster',
  imports: [ReactiveFormsModule, PlayingCardComponent, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './monster.component.html',
  styleUrl: './monster.component.css'
})
export class MonsterComponent implements OnInit, OnDestroy {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private monsterService = inject(MonsterService);
  private readonly dialog = inject(MatDialog);

  private routeSubscriptions: Subscription | null = null;
  private formValuesSubscriptions: Subscription | null = null;
  private saveSubscription: Subscription | null = null;
  private deleteSubscription: Subscription | null = null;

  formGroup = this.formBuilder.group({
    name: ["", [Validators.required]],
    image: ["", [Validators.required]],
    type: [MonsterType.ELECTRIC, [Validators.required]],
    hp: [0, [Validators.required, Validators.min(1), Validators.max(200)]],
    description: ["", [Validators.required]],
    attackName:  ["", [Validators.required]],
    attackDamage: [0, [Validators.required, Validators.min(1), Validators.max(200)]],
    attackDescription: ["", [Validators.required]]
  });

  monster: Monster = Object.assign(new Monster(), this.formGroup.value);
  monsterTypes = Object.values(MonsterType);
  monsterId = -1;


  ngOnInit(): void {
    this.formValuesSubscriptions = this.formGroup.valueChanges.subscribe(formData => {
      this.monster = Object.assign(new Monster(), formData);
    });
    this.routeSubscriptions = this.route.params.pipe(
      switchMap(params => {
        if (params["id"]){
          this.monsterId = parseInt(params["id"]);
          return this.monsterService.get(this.monsterId);
        }
        return of(null);
      })
    ).subscribe(monster => {
      if (monster){
        this.monster = monster;
        this.formGroup.patchValue(this.monster);
      }
    })
  }

  ngOnDestroy(): void {
    this.formValuesSubscriptions?.unsubscribe();
    this.routeSubscriptions?.unsubscribe();
    this.saveSubscription?.unsubscribe();
    this.deleteSubscription?.unsubscribe();
  }

  next(){
    let nextId = this.monsterId || 0;
    nextId++;
    this.router.navigate(["/monster/" + nextId])
  }

  submit(event: Event){
    event.preventDefault();
    let saveObservable = null;
    if (this.monsterId === -1){
      saveObservable = this.monsterService.add(this.monster);
    } else {
      this.monster.id = this.monsterId;
      saveObservable = this.monsterService.update(this.monster);
    }

    this.saveSubscription = saveObservable.subscribe(_ => this.navigateBack());
    this.navigateBack();
  }

  isFieldValid(name: string){
    const formControl = this.formGroup.get(name);
    return formControl?.valid && (formControl?.dirty || formControl?.touched);
  }

  navigateBack(){
    this.router.navigate(["/home"]);
  }

  deleteMonster(){
    const dialogRef = this.dialog.open(DeleteMonsterConfirmationDialogComponent);

    dialogRef.afterClosed().pipe(
      filter(confirmation => confirmation === true),
      switchMap(_ => this.monsterService.delete(this.monsterId))
    ).subscribe(_ => {
      this.navigateBack();
    });
  }
}
