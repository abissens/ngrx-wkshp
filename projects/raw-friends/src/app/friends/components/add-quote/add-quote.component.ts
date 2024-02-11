import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {map, mergeMap, startWith} from 'rxjs';
import {AddQuoteComponentData} from './AddQuoteComponentData';
import {FormBuilder, Validators} from '@angular/forms';
import {QuoteAddRequest} from '../../domain/quote.model';

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

  filteredCharacters$ = this.quoteForm.controls.character.valueChanges.pipe(
    startWith(''),
    mergeMap(value => this.data.allCharacters$.pipe(map(c => c.filter(c => c.name.toLowerCase().includes(value??''.toLowerCase())))))
  );

  filteredEpisodes$ = this.quoteForm.controls.episodeTitle.valueChanges.pipe(
    startWith(''),
    mergeMap(value => this.data.allEpisodes$.pipe(map(e => e.filter(e => e.title.toLowerCase().includes(value??''.toLowerCase())))))
  );

  constructor(
    private dialogRef: MatDialogRef<AddQuoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddQuoteComponentData,
    private formBuilder: FormBuilder
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.quoteForm.valid) {
      this.dialogRef.close(this.quoteForm.value as unknown as QuoteAddRequest);
    }
  }

}
