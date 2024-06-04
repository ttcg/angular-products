import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from '../services/loader/loader.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-spinner',
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [ CommonModule ]
})
export class SpinnerComponent {
  constructor(public loader: LoaderService) { }
}