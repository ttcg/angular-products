import { Component, inject } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsService } from './toasts.service';


@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule],
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.css'
})
export class ToastsComponent {
	toastService = inject(ToastsService);
}
