import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
	body: string;
	classname?: string;
	delay?: number;
}

@Injectable({
	providedIn: 'root'
})
export class ToastsService {

	constructor() { }

	toasts: Toast[] = [];

	show(toast: Toast) {
		this.toasts.push(toast);
	}

	showSuccess(message: string) {
		this.show({ body: message, classname: 'bg-success text-light' })
	}

	showError(message: string = "Error occured.  Please try again") {
		this.show({ body: message, classname: 'bg-danger text-light' })
	}

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}
