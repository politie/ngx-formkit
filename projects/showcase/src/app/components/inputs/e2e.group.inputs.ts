import { FieldType, FormFields } from 'formkit';

export type GroupForm = {
  text: string;
  toggle: boolean;
  group: {
    input: string;
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
  group: {
    type: FieldType.Group,
    blueprint: {
      input: {
        type: FieldType.Text
      }
    }
  }
};
