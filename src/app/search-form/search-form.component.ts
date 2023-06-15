import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
})
export class SearchFormComponent {
  searchForm: FormGroup;
  @Output() searchCity = new EventEmitter<string>();

  constructor() {
    this.makeForm();
  }
  makeForm() {
    this.searchForm = new FormGroup({
      inputCity: new FormControl<string>('', Validators.required),
    });

    this.searchForm.controls['inputCity'].valueChanges
      .pipe(debounceTime(1000))
      .subscribe((resp: string) => {
        if (!resp) {
          return;
        } else {
          this.searchCity.emit(resp.trim().toLocaleLowerCase());
        }
      });
  }

  onSubmit() {
    const city: string = this.searchForm.controls['inputCity'].value
      .trim()
      .toLocaleLowerCase();
    this.searchCity.emit(city);
  }
}
