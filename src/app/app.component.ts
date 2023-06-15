import { Component, OnInit } from '@angular/core';
import { WetherService } from './wether.service';
import { IWeather, Wind } from './models/wether.model';
import { converterFtoC } from './utils/temp-converter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
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
          this.weatherData = data;
          this.city = data.name;
          this.cuurentTemp = converterFtoC(data.main.temp);
          this.minTemp = converterFtoC(data.main.temp_min);
          this.maxTemp = converterFtoC(data.main.temp_max);
          this.humidity = data.main.humidity;
          this.windSpeed = data.wind.speed;
          this.load = true;
        },
      });
    }, 1000);
  }
}
