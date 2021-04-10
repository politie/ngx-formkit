import { FieldType, FormFields } from 'formkit';

export type GroupForm = {
  text: string;
  toggle: boolean;
  group: {
    groupInput: string;
    childGroup: {
      childGroupInput: string
    }
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
    fields: {
      groupInput: {
        type: FieldType.Text
      },
      childGroup: {
        type: FieldType.Group,
        fields: {
          childGroupInput: {
            type: FieldType.Text,
            value: 'default value'
          }
        }
      }
    }
  }
};
