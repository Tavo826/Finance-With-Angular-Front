import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  template: `
    @if (message) {
      <div class="alert alert-danger alert-dismissible fade show mt-2" role="alert">
        {{ message }}
        <button type="button" class="btn-close" (click)="dismiss()" aria-label="Close"></button>
      </div>
    }
  `
})
export class ErrorAlertComponent {
  @Input() message: string = ""
  @Output() messageChange = new EventEmitter<string>()

  dismiss() {
    this.messageChange.emit('')
  }
}
