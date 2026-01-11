import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-1">
      <label *ngIf="label" [for]="id" class="block text-sm font-medium text-gray-700">
        {{ label }}
        <span *ngIf="required" class="text-sumak-wine">*</span>
      </label>
      
      <select
        [id]="id"
        [value]="value"
        [disabled]="disabled"
        [class]="selectClasses"
        (change)="onSelectionChange($event)"
        (blur)="onBlur()"
        (focus)="onFocus()">
        
        <option value="" disabled>{{ placeholder }}</option>
        <option 
          *ngFor="let option of options" 
          [value]="option.value"
          [disabled]="option.disabled">
          {{ option.label }}
        </option>
      </select>
      
      <p *ngIf="errorMessage" class="text-sm text-sumak-wine">
        {{ errorMessage }}
      </p>
      
      <p *ngIf="helpText && !errorMessage" class="text-sm text-gray-500">
        {{ helpText }}
      </p>
    </div>
  `
})
export class SelectComponent implements ControlValueAccessor {
  @Input() id = `select-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label = '';
  @Input() placeholder = 'Seleccionar...';
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorMessage = '';
  @Input() helpText = '';
  @Input() options: SelectOption[] = [];

  value = '';
  focused = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  get selectClasses(): string {
    const baseClasses = 'block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 font-garet text-sm bg-white';
    
    if (this.hasError) {
      return `${baseClasses} border-sumak-wine/30 text-sumak-wine focus:ring-sumak-wine/20 focus:border-sumak-wine`;
    }
    
    if (this.disabled) {
      return `${baseClasses} border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed`;
    }
    
    return `${baseClasses} border-gray-200 focus:ring-sumak-gold/20 focus:border-sumak-gold`;
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
  }

  onFocus(): void {
    this.focused = true;
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}