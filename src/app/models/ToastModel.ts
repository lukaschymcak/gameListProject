import { TemplateRef } from '@angular/core';

export interface ToastMessage {
  body: TemplateRef<any> | null;
  parameters?: any;
  appearance?: ToastAppearance;
  textBody?: string;
  delay?: number;
  customClass?: string;
}

export type ToastAppearance = 'standard' | 'danger' | 'success';
