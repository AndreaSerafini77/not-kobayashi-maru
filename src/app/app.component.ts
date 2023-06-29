import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Not a Kobayashi-Maru (apparently)';
  foundEnd = false;
  apiError = false;
}
