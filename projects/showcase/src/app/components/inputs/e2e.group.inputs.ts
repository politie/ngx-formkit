import { FieldType, FormFields } from 'formkit';

export type GroupForm = {
  text: string;
  toggle: boolean;
  aapje: {
    aapje22: string;
  };
}

export const groupFormFields:FormFields<GroupForm> = {
  text: {
    type: FieldType.Text
  },
  toggle: {
    type: FieldType.Toggle,
    value: false,
    label: 'Toggle button'
  },
  aapje: {
    type: FieldType.Group,
    blueprint: {
      aapje22: {
        type: FieldType.Text
      }
    }
  }
};
