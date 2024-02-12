import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

import {map, mergeMap, startWith} from 'rxjs';
import {FormBuilder, Validators} from '@angular/forms';
import {QuoteAddRequest} from '../../domain/quote.model';
import {Store} from '@ngrx/store';
import {selectCharacters} from '../../store/characters/characters.store';
import {selectEpisodes} from '../../store/episodes/episodes.store';

@Component({
  selector: 'app-add-quote',
  templateUrl: './add-quote.component.html',
  styleUrls: ['./add-quote.component.less']
})
export class AddQuoteComponent {

  quoteForm = this.formBuilder.group({
    character: ['', Validators.required],
    season: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
    episodeTitle: ['', Validators.required],
    text: ['', Validators.required]
  });

  private allCharacters$ = this.store.select(selectCharacters);

  private allEpisodes$ = this.store.select(selectEpisodes);

  filteredCharacters$ = this.quoteForm.controls.character.valueChanges.pipe(
    startWith(''),
    mergeMap(value => this.allCharacters$.pipe(map(c => c.filter(c => c.name.toLowerCase().includes(value ?? ''.toLowerCase())))))
  );

  filteredEpisodes$ = this.quoteForm.controls.episodeTitle.valueChanges.pipe(
    startWith(''),
    mergeMap(value => this.allEpisodes$.pipe(map(e => e.filter(e => e.title.toLowerCase().includes(value ?? ''.toLowerCase())))))
  );


  constructor(
    private dialogRef: MatDialogRef<AddQuoteComponent>,
    private store: Store,
    private formBuilder: FormBuilder
  ) {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.quoteForm.valid) {
      this.dialogRef.close(this.quoteForm.value as unknown as QuoteAddRequest);
    }
  }

}
