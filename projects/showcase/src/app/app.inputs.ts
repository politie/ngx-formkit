import { FieldMessageType, FieldType, FormKitForm } from '../../../formkit/src/lib';
import { FormControl, Validators } from '@angular/forms';

export type ShowcaseFormType = {
  checkbox: boolean;
  label: string;
  array: {
    text: string,
    checkbox: boolean
  }[];
  group: {
    text: string;
    checkbox: boolean;
  };
  name: string;
  disableRadio: boolean;
  radio: number;
  radioButton: number;
}

export const formConfig: FormKitForm<ShowcaseFormType> = {
  fields: {
    label: {
      type: FieldType.Text,
      control: () => new FormControl(),
      title: 'Label',
      tooltip: 'Add a label to identify this target',
      icon: 'label'
    },

    name: {
      type: FieldType.Text,
      control: () => new FormControl(),
      transform: (values) => {
        if (values.label === 'aapje') {
          return 'beestje';
        }

        return;
      },
      title: 'Investigation name',
      tooltip: 'Add a investigation name to this target'
    },

    checkbox: {
      type: FieldType.Checkbox,
      control: () => new FormControl(true),
      option: {
        id: 1,
        label: 'Check m aan'
      }
    },

    group: {
      type: FieldType.Group,
      title: 'Group',
      blueprint: {
        text: {
          type: FieldType.Text,
          control: () => new FormControl()
        },
        checkbox: {
          type: FieldType.Checkbox,
          control: () => new FormControl(true),
          option: {
            id: 1,
            label: 'Checkboxje voor group'
          }
        }
      }
    },

    array: {
      type: FieldType.Array,
      buttonLabel: '+ Add LIID',
      tooltip: `
      The LIID is the unique identifier for this target.
      The LIID should contain 50 characters. You can add multiple LLIDs at once, separated by a newline.
    `,
      title: 'LIID',
      // required: values => values.label === 'aapje',
      blueprint: {
        text: {
          type: FieldType.Text,
          control: () => new FormControl(null, [Validators.required, Validators.minLength(2)]),
          messages: [
            {
              show: ({ control, errors }) => {
                console.log({control, errors});

                return control.touched && errors?.required;
              },
              type: FieldMessageType.Error,
              text: 'This field is required.'
            },
            {
              show: ({ control, errors }) => (control.value && errors?.minlength),
              text: ({ errors}) => `LIID length: ${errors?.minlength.actualLength} / ${errors?.minlength.requiredLength} characters.`
            }
          ]
        },
        checkbox: {
          type: FieldType.Checkbox,
          control: () => new FormControl(),
          option: {
            id: 1,
            label: 'Hoppa'
          }
        }
      }
    },

    // disableRadio: {
    //   value: false,
    //   type: FieldType.Checkbox,
    //   option: {
    //     id: 1,
    //     label: 'Disable radio buttons'
    //   }
    // },
    //
    radio: {
      type: FieldType.Radio,
      control: () => new FormControl(1, [Validators.required]),
      value: 2,
      options: [
        {
          id: 1,
          label: 'Label 1'
        },
        {
          id: 2,
          label: 'Label 2'
        }
      ],
      disabled: values => values.disableRadio === true,
      title: 'Radio'
    },

    radioButton: {
      type: FieldType.RadioButton,
      control: () => new FormControl(2, [Validators.required]),
      options: [
        {
          id: 1,
          label: 'Label 1',
          description: 'Extra description'
        },
        {
          id: 2,
          label: 'Label 2',
          description: 'Extra description'
        }
      ],
      disabled: values => values.disableRadio === true,
      title: 'Radio button'
    }
  }
};
