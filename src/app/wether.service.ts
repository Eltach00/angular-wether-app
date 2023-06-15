import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IWeather } from './models/wether.model';

@Injectable({
  providedIn: 'root',
})
export class WetherService {
  constructor(private http: HttpClient) {}

  getWether(lon: string, lat: string): Observable<IWeather> {
    return this.http
      .get<IWeather>(environment.wetherUrl + `${lat}/${lon}`, {
        headers: environment.headers,
      })
      .pipe(debounce(() => timer(3000)));
  }
}
