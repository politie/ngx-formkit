import { FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type GroupForm = {
  text: string;
  toggle: boolean;
}

export const groupFormFields:FormFields<GroupForm> = {
  text: {
    type: FieldType.Text,
    control: () => new FormControl()
  },
  toggle: {
    type: FieldType.Toggle,
    control: () => new FormControl(false),
    toggleLabel: 'Toggle button'
  }
};
