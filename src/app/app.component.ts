import { Component, OnInit } from '@angular/core';
import { WetherService } from './wether.service';
import { IWeather, Wind } from './models/wether.model';
import { converterFtoC } from './utils/temp-converter';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  searchForm: FormGroup;
  load = false;
  title = 'angular-wether-app';
  weatherData: IWeather;
  city: string = '';
  cuurentTemp: number;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  windSpeed: number;
  time: string;
  latitude: string;
  longitude: string;
  constructor(private wetherService: WetherService) {
    this.time = new Date().toLocaleString('ru-Ru', {
      hour: '2-digit',
      minute: 'numeric',
    });
    this.makeForm();
  }
  makeForm() {
    this.searchForm = new FormGroup({
      inputCity: new FormControl('', Validators.required),
    });

    this.searchForm.controls['inputCity'].valueChanges
      .pipe(debounceTime(1000))
      .subscribe((resp: string) => {
        if (!resp) {
          return;
        } else {
          const city = resp.trim().toLocaleLowerCase();
          console.log(city);
          this.wetherService.getCityWeather(city).subscribe({
            next: (data: IWeather) => {
              this.writeData(data);
            },
          });
        }
      });
  }

  onSubmit() {
    console.log(this.searchForm);
  }
  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      this.longitude = longitude.toString();
      this.latitude = latitude.toString();
    });
    setTimeout(() => {
      this.wetherService.getWether(this.longitude, this.latitude).subscribe({
        next: (data: IWeather) => {
          this.writeData(data);
        },
      });
    }, 1500);
  }

  writeData(data: IWeather) {
    this.weatherData = data;
    this.city = data.name;
    this.cuurentTemp = converterFtoC(data.main.temp);
    this.minTemp = converterFtoC(data.main.temp_min);
    this.maxTemp = converterFtoC(data.main.temp_max);
    this.humidity = data.main.humidity;
    this.windSpeed = data.wind.speed;
    this.load = true;
  }
}
