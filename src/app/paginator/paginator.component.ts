import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Input() current: number = 0
  @Input() first?: number = 0
  @Input() prev?: number = 0
  @Input() next?: number = 0
  @Input() last?: number = 0
  @Input() pages: number = 0

  @Output() goTo: EventEmitter<number> = new EventEmitter<number>()
  
  pageNumbers: number[] = []

  onChangePage(page: number): void {
    this.goTo.emit(page);
  }
}
