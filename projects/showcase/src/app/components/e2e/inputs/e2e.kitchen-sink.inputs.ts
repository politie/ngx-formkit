import { FieldMessageType, FieldType, FormFields } from 'formkit';
import { FormControl } from '@angular/forms';

export type BasicForm = {
  hidden: string;
  input: string;
  checkbox: boolean;
  array: {
    text: string;
  }[],
  group: {
    text: string;
    checkbox: boolean
  };
  radioButtons: number;
  radio: number;
  select: any;
  selectMultiple: any[];
  textarea: string;
  toggle: boolean;
}

export const kichenSinkFormFields: FormFields<BasicForm> = {
  hidden: {
    type: FieldType.Hidden,
    disabled: (values) => false,
    control: () => new FormControl(),
    transform: values => {
      if (values.checkbox) {
        return 'filled';
      } {
        return undefined;
      }
    }
  },

  input: {
    type: FieldType.Text,
    control: () => new FormControl(null),
    title: 'Text'
  },

  checkbox: {
    type: FieldType.Checkbox,
    control: () => new FormControl(false),
    title: 'Checkbox',
    option: {
      id: 'basic-1',
      label: 'Checkbox'
    }
  },

  array: {
    type: FieldType.Array,
    title: 'Array',
    buttonLabel: '+ Add field',
    blueprint: {
      text: {
        type: FieldType.Text,
        control: () => new FormControl()
      }
    }
  },

  group: {
    type: FieldType.Group,
    title: 'Group',
    blueprint: {
      text: {
        type: FieldType.Text,
        required: values => values.group.checkbox === true,
        control: () => new FormControl(),
        messages: [
          {
            show: ({ control }) => control.errors && control.errors.required,
            type: FieldMessageType.Error,
            text: 'This field is required'
          }
        ]
      },
      checkbox: {
        type: FieldType.Checkbox,
        control: () => new FormControl(),
        option: {
          id: 'messages-1',
          label: 'Make the above textfield required'
        }
      }
    }
  },

  radioButtons: {
    type: FieldType.RadioButton,
    control: () => new FormControl(1),
    title: 'Radio Button',
    options: [
      {
        id: 1,
        label: 'Label 1',
        description: 'Description 1'
      },
      {
        id: 2,
        label: 'Label 2',
        description: 'Description 2'
      }
    ]
  },

  radio: {
    type: FieldType.Radio,
    control: () => new FormControl(2),
    title: 'Radio',
    options: [
      {
        id: 1,
        label: 'Label 1',
        description: 'Description 1'
      },
      {
        id: 2,
        label: 'Label 2',
        description: 'Description 2'
      }
    ]
  },

  select: {
    type: FieldType.Select,
    control: () => new FormControl({
      id: 1,
      label: 'Label 1',
      description: 'Description 1'
    }),
    label: 'Select an option',
    title: 'Select',
    // multiple: true,
    options: [
      {
        id: 1,
        label: 'Label 1',
        description: 'Description 1'
      },
      {
        id: 2,
        label: 'Label 2',
        description: 'Description 2'
      }
    ]
  },

  selectMultiple: {
    type: FieldType.Select,
    control: () => new FormControl([{
      id: 1,
      label: 'Label 1',
      description: 'Description 1'
    }]),
    label: 'Select an option',
    title: 'Select',
    multiple: true,
    options: [
      {
        id: 1,
        label: 'Label 1',
        description: 'Description 1'
      },
      {
        id: 2,
        label: 'Label 2',
        description: 'Description 2'
      },
      {
        id: 3,
        label: 'Label 3',
        description: 'Description 3'
      }
    ]
  },

  textarea: {
    type: FieldType.Textarea,
    control: () => new FormControl(),
    title: 'Textarea'
  },

  toggle: {
    type: FieldType.Toggle,
    control: () => new FormControl(false),
    title: 'Toggle',
    toggleLabel: 'Toggle me'
  }
};
