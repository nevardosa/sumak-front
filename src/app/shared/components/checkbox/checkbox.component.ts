import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex items-start space-x-3">
      <div class="flex items-center h-5">
        <input
          [id]="id"
          type="checkbox"
          [checked]="checked"
          [disabled]="disabled"
          [class]="checkboxClasses"
          (change)="onCheckboxChange($event)"
          (blur)="onBlur()"
          (focus)="onFocus()">
      </div>
      
      <div class="flex-1">
        <label [for]="id" class="text-sm text-gray-700 cursor-pointer">
          <ng-content></ng-content>
        </label>
        
        <p *ngIf="errorMessage" class="mt-1 text-sm text-sumak-wine">
          {{ errorMessage }}
        </p>
        
        <p *ngIf="helpText && !errorMessage" class="mt-1 text-sm text-gray-500">
          {{ helpText }}
        </p>
      </div>
    </div>
  `
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() id = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  @Input() disabled = false;
  @Input() errorMessage = '';
  @Input() helpText = '';

  checked = false;
  focused = false;

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  get checkboxClasses(): string {
    const baseClasses = 'h-4 w-4 rounded border-gray-300 text-sumak-green focus:ring-sumak-gold focus:ring-2 focus:ring-offset-0 transition-colors duration-200';
    
    if (this.hasError) {
      return `${baseClasses} border-sumak-wine focus:ring-sumak-wine`;
    }
    
    if (this.disabled) {
      return `${baseClasses} opacity-50 cursor-not-allowed`;
    }
    
    return baseClasses;
  }

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.onChange(this.checked);
  }

  onBlur(): void {
    this.focused = false;
    this.onTouched();
  }

  onFocus(): void {
    this.focused = true;
  }

  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}