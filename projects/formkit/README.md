# ngx-FormKit

{{TOC}}

FormKit is an Angular Library built to make form handling in Angular a breeze. It's built on top of [Angular Reactive Forms](https://angular.io/guide/reactive-forms) and allows you to create strongly typed forms in your code, without the hassle of working with templates. FormKit provides a `FormKitForm` component that you can use to display the form and respond to events.  It provides methods to call FormKit logic from within your host component, by using the FormComponent as a [@ViewChild](https://angular.io/api/core/ViewChild) reference.

Since the FormKit library is built on top of [Angular Reactive Forms](https://angular.io/guide/reactive-forms), you can use all the built in [Validators](https://angular.io/api/forms/Validators) as well as [custom validator functions](https://angular.io/guide/form-validation#adding-custom-validators-to-reactive-forms). FormKit has dynamic and conditional callback functions per defined `Field`, like:

- Conditional transformation of field values (based on the values of other fields in the form)
- Conditional visibility (based on the values of other fields in the form)
- Conditional required property (based on the values other fields in the form).

# Installation

```
npm i @politie/formkit
```

This will install the FormKit library as a dependency in your project. You can now use the `FormComponent` component in your project.

# Building blocks

## `FormComponent`
Add this component to your host component. This component renders a `<form>` component and `FormFieldComponent` components for every defined field in your `FormKitForm` configuration.

## `FormFieldComponent`
This component is rendered for each field in your form configuration. The component takes care of all logic after an update is done to the model (the form values). It will hook into the `events$` stream of the `FormKitFormComponent` to handle these updates and will call all logic in your field configuration, from state management (required, disabled, hidden, loading) to hooks (onInit, onAfterUpdateValue).

## `FormKitForm<T>`
This type is used to create objects for `FormKit`. In a `FormKitForm`, you define the settings for the form and the fields that the form should render.

# Setup

Add the following options to the component where you want to add a `FormKitForm`.

```ts
import { FormComponent } from '@politie/formkit';
import { ViewChild } from '@angular/core';

export class MyComponent {
  config: FormKitForm<Type> = {
    fields: {
      ...
    }
  };
  /**
   * By using ViewChild, we can use the methods provided in the FormComponent
   * directly in this component class by calling this.form.<method-name>()
   */
  @ViewChild('myFormKitForm', { static: true }) formComponent: FormComponent<Type>;

  /**
   * Method for handling submits
   */
  onSubmit() {
    // do something with the this.form.values() here
  }
}
```

In the template, add the form by adding the `formkit-form` selector. Give it the reference name you've assigned in the `@ViewChild`, for this example: `#myFormKitForm`.

The Form component has a `@Output() EventEmitter` set for the `ngSubmit` event which you can use to call your own method in the host component. In the `[form]` property, you add a `FormKitForm` configuration.

```angular2html

<formkit-form #myFormKitForm [form]="formConfig" (ngSubmit)="onSubmit()">
  <button
    type="button"
    (click)="onSubmit()"
    [disabled]="myFormKitForm.root?.invalid">
    Save
  </button>
</formkit-form>
```

## Create a form
To create a form, you'll need to create a `FormKitForm`. This type expects an object with configuration, as wel as a `fields` object, with your field definitions.

```ts
import { FormKitForm, FormComponent } from '@politie/formkit';
import { OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

type MyType = {
  username: string;
}

export class MyComponent implements OnInit {

  /* Use the static option if you'd like to use the form in the OnInit
   * lifecycle
   */
  @ViewChild('form', {static: true}) form: FormComponent<Type>;

  /**
   * The configuration for the form in this component. Add a type definition
   * to strongly type check field names in the configuration.
   */
  formConfig: FormKitForm<MyType> = {
    fields: {
      username: {
        type: FieldType.Text,
        control: () => new FormControl()
      }
    }
  }

  ngOnInit() {
    /**
     * We can call the `create()` method on the form reference directly,
     * to build our form. The method requires the config as first parameter,
     * and a set of initial values as optional second parameter.
     */
    this.form.create(this.formConfig);
  }
}

```

The above example will render with one field of type `TextField`, bind to the `username` name.

## Available options for the `FormKitForm` configuration

In the `FormKitForm`, the following properties are available:

| Property | Type | Description | Default |
|:---|:---|:---|:---|
| readonly | boolean | Should the form render in 'readonly' mode (all controls will be disabled) | `false` |
| text | object | Object with properties to override strings used in the form templates | `{ loading: 'loading' }` |
| components.default | `{...}` | Object with `[FieldType.<name>]` properties to globally override components per `Field type` | `default set, see Field Types` |
| fields* | object | object with your field definitions | `{}` |

*= required

## `Field` properties
The `fields` property in a `FormKitForm` configuration requires an object of field names with an object describing the field properties. Each field object should at least have a `type` option set:

```ts
import { FieldType } from '@politie/formkit';

const form: FormKitForm<MyType> = {
  fields: {
    username: {
      type: FieldType.Textfield,
    }
  }
}
```

> The object name should match a key in the provided Type definition. Following the example above, you can use `username` as name for a field object.

Below is a rundown of each option per field object.

### Settings for all fields

| Parameter | Type | Description 
|:---|:---|:---|
| type* | `FieldType` | The type of field. See [Field Types](#field-types) for available field types. |
| control* | `() => FormControl(value?, [Validator]?)` | A function that returns a `FormControl`. You can add a default value as the first parameter, [Validator functions](https://angular.io/api/forms/Validator) as optional second parameter. If you use multiple validator functions, add them as an array. |
| hooks | `{}` | Object with hook definitions for this field. See ['Hooks'](hooks) for example usage. |
| component | `undefined` | If you'd like to render a custom component for this field, add the class here. See See ['Custom components'](#custom-components) for example usage. |
| required | `boolean` / `((values: T) => boolean)` | Should the field be required based on values of other fields. See ['Required fields'](#required-fields) for example usage.  |
| disabled | `boolean` / `((values: T) => boolean)` | Should the field be disabled based on values of other fields. See ['Disable fields'](#disable-fields) for example usage. |
| hidden | `boolean` / `((values: T) => boolean)` | Should the field be hidden based on values of other fields. See ['Hide fields'](#hide-fields) for example usage. |
| transform | `(values: T) => T[K]` / `undefined` | Transform the value of this field based on the values of other fields. Takes a function that has the current values as a parameter and should return the type of value given by the generic type in the `FormKitForm` for this field name. See ['Transform field values'](#transform-field-values) for example usage. |
| resetFormOnChange | `false` | If true, all fields in the entire form (except this field) will reset to their default values on change of this field. After the change, one round of `afterUpdateValues` is run, to trigger transform and conditional hooks. Use with caution, since multiple usages of this property in one form may lead to `MAX_CALL_STACK_SIZE_EXCEEDED` errors. |
| component | `any` | Override the default component to render with the one provided in the component property. |
| messages | `FieldMessage[]` | Messages for this field. See ['Field messages'](#field-messages) for example usage. |

### Hooks
You can use hooks to hook into the lifecycle of a `field`. You can use the following hooks:

- `onInit`

To use a hook, define a `hooks` property in the field object and add a function to the hook you want to use:

``` typescript
const config: FormKitForm<Type> = {
  fields: {
    myField: {
      type: FieldType.Text,
      hooks: {
        onInit: (payload): void => {
          // do something
        }
      }
    }
  }
}
```

The `payload` object has the following properties:

| Property | Type | description |
|:---|:---|:---|
| control | `FormControl | FormArray | FormGroup` | The `FormControl` assigned to this field. This `FormControl` is added to the root form and is watched by Angular Reactive Forms. |
| errors | `ValidationErrors | null` | The current `errors` for the assigned `FormControl`. Will be `null` if there are no errors.
| values | `Values<T>` | The current values of the root form. This is an object with `{ fieldname: value }` notation. |

> The function shouldn't return anything (`void`).

### Hide fields
With conditional hiding, you can hide a field based on the value (or values) of other fields.

``` typescript
const config: FormKitForm<Type> = {
  fields: {
    myField: {
      type: FieldType.Text,
      hidden: values => values.configuration !== 'local'
    }
  }
}
```

In this example, the `myField` field will be hidden when the `configuration` field `value` isn't equal to `local`.

### Required fields
With conditional required, you'll make the field `required` based on the `value` (or `values`) of other fields.

``` typescript
const config: FormKitForm<Type> = {
  fields: {
    myField: {
      type: FieldType.Text,
      required: values => values.configuration !== 'local'
    }
  }
}
```

In this example, the `myField` field will be required when the `configuration` field `value` isn't equal to `local`.

> If you want to make a field that's always required, use the `validators` property with Angular's built in `Validators.required` method.

### Required fields
With conditional required, you'll make the field `required` based on the `value` (or `values`) of other fields.

``` typescript
const config: FormKitForm<Type> = {
  fields: {
    myField: {
      type: FieldType.Text,
      required: values => values.configuration !== 'local'
    }
  }
}
```

In this example, the `myField` field will be required when the `configuration` field `value` isn't equal to `local`.

> If you want to make a field that's always required, use the `validators` property with Angular's built in `Validators.required` method.

### Disable fields
You can disable fields based on the values of other fields.

``` typescript
const config: FormKitForm<Type> = {
  fields: {
    myField: {
      type: FieldType.Text,
      disabled: values => values.configuration !== 'local'
    }
  }
}
```

In this example, the `myField` field will be disabled when the `configuration` field `value` isn't equal to `local`.

### Field messages
To add messages, create an array with `FieldMessage` type objects in it. Each message has the following properties:

| Property | Type | Description |
|:---|:---|:---|
| show | `boolean` or `‌(payload : FieldMessageFunctionPayload<T>) => boolean` | Choose when to show your message. |
| type | `FieldMessageType` | Choose a type of message (defaults to `FieldMessageType.Information` |
| text | `string` or `‌(payload : FieldMessageFunctionPayload<T>) => string` | Add your text. The function should return a string. |

#### Always show a message

```ts
const config: FormKitForm<T> = {
  fields: {
    myField: {
      type: FieldType.Text,
      messages: [
        {
          show: true,
          text: 'Hello world'
        }
      ]
    }
  }
}
```

#### Use in combination with a Validator

```ts
const config: FormKitForm<T> = {
  fields: {
    myField: {
      type: FieldType.Text,
      messages: [
        {
          show: ({ control, errors }) => (control.value && errors.minlength),
          text: ({errors}) => {
            return `Input length: ${errors.minlength.actualLength} / ${errors.minlength.requiredLength} characters.`
          }
        }
      ]
    }
  }
}
```

## `FormComponent` properties

Example:

```ts
this.myFormKitForm.value$.subscribe();
```

| Property | Type | Description |
|:---|:---|:---|
| fields | `FormKitForm` | the object with fields configurations |
| events$ | `Subject<FormEvent>` | Subject for hooking into the `FormComponent` lifecycle |
| value$ | `FormValues<T>` | Observable that emits each time the form is updated (and after update checks per field are completed). |
| root | `FormGroup` | The 'root' `FormGroup`. You can use root to access controls and listen to `valueChanges` on specific controls.

## `FormComponent` methods

Example:

```ts
this.myFormKitForm.setValues(...);
```

| Method | Payload | Description | Returns |
|:---|:---|:---|:---|
| setValues | `values` | Update the form values with the provided `values`. The values should be a `object` with { name: value } properties | `void` |
| transformValues | `TransformValues<T>` | Get a object with the current form values and transform them. See ['Transforming form values'](#transform-form-values) for example usage. | `T` |

### Transform form values
Use the `transformValues` method to transform form values, for example to match a certain (backend) schema.

Considering the following values in the form:

```ts
{
  username: 'user',
  id: 1,
  groups: [
   'group-1',
   'group-2'
  ],
  isAdmin: true,
  preferences: {
    email: true
  }
}
```

Let's say the API / backend implementation has a `updateUser` endpoint, where you shouldn't send the `isAdmin` property. We can use transformValues:

```ts
const values = myFormKitForm.transformValues({
  omit: ['isAdmin']
});
```

`values` now contains each property of the original values except `isAdmin`. If we need to transform a key, we can do it like this:

```ts
const values = myFormKitForm.transformValues({
  transform: values => ([{
    from: 'preferences',
    to: { 'emailPreference': values.preferences?.email }
  }])
})
```

or

```ts
const values = myFormKitForm.transformValues({
  transform: values => ([{
    from: 'preferences',
    to: 'updatePreferences'
  }])
})
```

The transform property in the `transformValues` payload takes a function that receives the current form values. It should return an array with transforms. The `to` property can take either a `string` or `object`. If you pass a `string`, the value set in the property `from` is copied to the key you define in `to`. If you set a `object`, you define a new key / value pair. You can use the `values` to look up a specific value in the form values.

## Custom components

By default, the FormKit uses a set of prebuilt components to build your form. You can add your own custom components. You can choose between updating all fields that match a certain `FieldType` to render your custom component by customising the default set. If you need to update a specific field without changing other fields with the same `FieldType`, you can customise a specific field.

### Customising the default set

Add the `components` property to your `FormConfig` object and add components that you want to override per `FieldType`:

```ts
const formConfig: FormKitForm<Type> = {
  fields: { ... },
  components: {
    [FieldType.Text]: CustomTextInputComponent
  }
}
```

> This will update all fields that use the `FieldType.Text` type as field `type` property to use the `CustomTextInputComponent`.

### Customising a component for a specific field

```ts
const formConfig: FormKitForm<Type> = {
  fields: { ... },
  components: {
    field: {
      'field-name': CustomTextInputComponent
    }
  }
}
```

> This will make sure that field `field-name` uses the `CustomTextInputComponent`.

### Creating your custom component

You can extend the `CustomFieldComponent`. This component has all `@Input()` properties set (you can override the types).

You must add a HTML element that has the `[formGroup]` attribute that will be filled with the `formGroup` `@Input()` property. The `[formControlName]` property **must** be mapped to the `name` `@Input()` property in order to get your custom component to work.

```ts
import { CustomFieldComponent, ICustomField, FormKitForm } from '@politie/formkit';

@Component({
  selector: 'app-custom-text-input-component',
  template: `<div [formGroup]="formGroup"><input type="text" [formControlName]="name"></div>`,
})
export class CustomTextInputComponent extends CustomFieldComponent implements OnInit {

  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() form!: Required<FormKitForm<any>>;
  @Input() field!: ICustomField<any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;

  ngOnInit() {}
}
```

> Make sure that you add your component to the `entryComponents` in the module.

## Field Types
The following field types are available (you can [add your own](#custom-components)):

- Checkbox Field
- Hidden Field
- Password Field
- Radio Field
- Radiobuttons Field
- Select
- Text Field
- Textarea Field
