# ngx-FormKit

FormKit is an Angular Library built to make form handling in Angular a breeze. It allows you to create strongly typed forms in your code, without the hassle of working with templates. FormKit provides a `FormComponent` component that you can use to display the form and respond to events.  It provides methods to call FormKit logic from within your host component, by using the `FormComponent` as a [@ViewChild](https://angular.io/api/core/ViewChild) reference.

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
Add this component to your host component. This component renders a `<formkit-form>` component and `FormFieldComponent` components for every defined field in your `FormKitFields` list.

## `FormFieldComponent`
This component is rendered for each field in your form configuration. The component takes care of all logic after an update is done to the model (the form values). It will hook into the `events$` stream of the `FormComponent` to handle these updates and will call all logic in your field configuration, from state management (required, disabled, hidden, loading) to hooks (onInit).

## `FormKitForm<T>`
This type is used to create objects for `FormKit`. In a `FormKitFields` list, you define the fields that the form should render.

# Import the `FormKitModule`

Add the `FormKitModule` in your `AppModule` and call the `forRoot()` method. You can add configuration as a parameter. When you have multiple modules, you can omit the `forRoot()` method in modules other than `AppModule`.

```ts
@NgModule({
  imports: [
    FormKitModule.forRoot()
  ]
})
export class AppModule { }
```


# Setup
Add the following options to the component where you want to add a `<formkit-form>`.

```ts
import { FormComponent, IFormGroup, FormKitFields } from '@politie/formkit';
import { ViewChild } from '@angular/core';

export class MyComponent {
  form = new FormGroup({}) as IFormGroup<Type>;
  fields: FormKitFields<Type> = {
    ...
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

<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <formkit-form #myFormKitForm [fields]="fields" [form]="formGroup">
    <button
      type="button"
      (click)="onSubmit()"
      [disabled]="form.invalid">
      Save
    </button>
  </formkit-form>
</form>
```

## Create a form
To create a form, you'll need to create a `FormKitFields` list and a `FormGroup`. The `FormKitFields` type expects an object with your field definitions.

```ts
import { FormKitFields, FormComponent } from '@politie/formkit';
import { OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

type MyType = {
  username: string;
}

export class MyComponent implements OnInit {
  formGroup = new FormGroup({});

  /* Use the static option if you'd like to use the form in the OnInit
   * lifecycle
   */
  @ViewChild('form', { static: true }) form: FormComponent<Type>;

  /**
   * The fields for the form in this component. Add a type definition
   * to strongly type check field names in the configuration.
   */
  fields: FormKitFields<MyType> = {
    username: {
      type: FieldType.Text
    }
  }
}

```

The above example will render with one field of type `TextField`, bind to the `username` name.

## `Field` properties
Each field object should at least have a `type` option set:

> The object name should match a key in the provided Type definition. Following the example above, you can use `username` as name for a field object.

Below is a rundown of each option per field object.

### Settings for all fields

| Parameter | Type | Description 
|:---|:---|:---|
| type* | `FieldType` | The type of field. See [Field Types](#field-types) for available field types. |
| component | `any` | If you'd like to render a custom component for this field, add the class here. See See ['Custom components'](#custom-components) for example usage. |
| description | `string` | Description to display above the field |
| disabled | `boolean` / `((values: T) => boolean)` | Should the field be disabled based on values of other fields. See ['Disable fields'](#disable-fields) for example usage. |
| hooks | `{}` | Object with hook definitions for this field. See ['Hooks'](hooks) for example usage. |
| hidden | `boolean` / `((values: T) => boolean)` | Should the field be hidden based on values of other fields. See ['Hide fields'](#hide-fields) for example usage. |
| label | `string` | Label for this field |
| messages | `FieldMessage[]` | Messages for this field. See ['Field messages'](#field-messages) for example usage. |
| required | `boolean` / `((values: T) => boolean)` | Should the field be required based on values of other fields. See ['Required fields'](#required-fields) for example usage.  |
| resetFormOnChange | `false` | If true, all fields in the entire form (except this field) will reset to their default values on change of this field. After the change, one round of `afterUpdateValues` is run, to trigger transform and conditional hooks. Use with caution, since multiple usages of this property in one form may lead to `MAX_CALL_STACK_SIZE_EXCEEDED` errors. |
| title | `string` | Title to display above the field |
| tooltip | `string` | Tooltip to display above the field |
| transform | `(values: T) => T[K]` / `undefined` | Transform the value of this field based on the values of other fields. Takes a function that has the current values as a parameter and should return the type of value given by the generic type in the `FormKitForm` for this field name. See ['Transform field values'](#transform-field-values) for example usage. |
| validators | `ValidatorFn[]` | Optional array of [Validator functions](https://angular.io/api/forms/Validator) |
| value | `any` | Set a default value to the control. |
| width | `1` - `12` | If you want to limit the with of the field, add the `width` property to your field. You can choose a value between `1` and `12` to span your field over the available grid columns. |

### Hooks
You can use hooks to hook into the lifecycle of a `field`. You can use the following hooks:

- `onInit`

To use a hook, define a `hooks` property in the field object and add a function to the hook you want to use:

``` typescript
const fields: FormKitFields<Type> = {
  myField: {
    type: FieldType.Text,
    hooks: {
      onInit: (payload): void => {
        // do something
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
const fields: FormKitFields<Type> = {
  myField: {
    type: FieldType.Text,
    hidden: values => values.configuration !== 'local'
  }
}
```

In this example, the `myField` field will be hidden when the `configuration` field `value` isn't equal to `local`.

### Required fields
With conditional required, you'll make the field `required` based on the `value` (or `values`) of other fields.

``` typescript
const fields: FormKitFields<Type> = {
  myField: {
    type: FieldType.Text,
    required: values => values.configuration !== 'local'
  }
}
```

In this example, the `myField` field will be required when the `configuration` field `value` isn't equal to `local`.

> If you want to make a field that's always required, use the `validators` property with Angular's built in `Validators.required` method.

### Disable fields
You can disable fields based on the values of other fields.

``` typescript
const fields: FormKitFields<Type> = {
  myField: {
    type: FieldType.Text,
    disabled: values => values.configuration !== 'local'
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
const fields: FormKitFields<Type> = {
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
```

#### Use in combination with a Validator

```ts
const fields: FormKitFields<Type> = {
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
```

## `FormComponent` `@Input()` properties

Example:

```angular2html
<formkit-form [fields]="fields"></formkit-form>
```

| Property | Type | Description | Default |
|:---|:---|:---|:---|
| form* | `FormGroup` | The FormGroup to use for this form. | |
| fields* | `FormFields<T>` | The fields configuration for this form | |
| readonly | `boolean` | Render the form in readonly mode | `false` |

*required

## `FormComponent` properties

Example:

```ts
this.myFormKitForm.value$.subscribe();
```

| Property | Type | Description |
|:---|:---|:---|
| events$ | `Subject<FormEvent>` | Subject for hooking into the `FormComponent` lifecycle |
| value$ | `FormValues<T>` | Observable that emits each time the form is updated (and after update checks per field are completed). |
| created | boolean | Will be `true` if the `create()` method is called (automatically or manually). |

## `FormComponent` methods

Example:

```ts
this.myFormKitForm.patch(...);
```

| Method | Payload | Description | Returns |
|:---|:---|:---|:---|
| create | `values (T)` | If you set the `autoCreate` property in `<formkit-form>` to false, you have to call this method yourself. You can provide a object of values to patch the form before all schedulers are set. This allows you to have initial values for resets (in your field definitions) and a different starting value for the form. | |
| patch | `values` | Update the form values with the provided `values`. The values should be a `object` with { name: value } properties | `void` |
| transformValues | `TransformValues<T>` | Get a object with the current form values and transform them. See ['Transforming form values'](#transform-form-values) for example usage. | `T` |

> **Important:** If you want to use properties or methods on the `FormComponent` `ViewChild`, you should trigger them after Angular `AfterViewInit` checks are done, to prevent issues with input properties or methods that aren't defined yet. So, for example:
> ```typescript
> ngAfterViewInit() {
>   this.myFormKitForm.patch(...);
> }
```

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

## Available options for the `forRoot()` method

In the `forRoot()`, you can add a configuration object with the following properties:

| Property | Type | Description | Default |
|:---|:---|:---|:---|
| text | object | Object with properties to override strings used in the form templates | `{ loading: 'loading' }` |
| components | `{...}` | Object with `[FieldType.<name>]` properties to globally override components per `Field type` | `default set, see Field Types` |

*= required

## Content slots

The `<formkit-form>` offers several content slots for you to project content in. 

Example:

```angular2html
<div formDescription>
  Content will be placed in the `formDescription` content slot.
</div>
```

The available slots are:
- `beforeCreated` Visible if the `autoCreate` attribute is set to `false` and before calling `create()`.
- `formDescription` Visible if `create()` is called, placed above the form fields.
- `formDescriptionReadOnly` Visible if `create()` is called and the `readonly` attribute is set to `true`.
- `footer` Visible if `create()` is called, placed below the form fields
- `submitButton` Visible if `create()` is called, placed below the footer and form fields.

## Styling

You can bring your own CSS to style `<formkit-form>` instances. Out of the box, the inputs use the styling provided by Angular Material.

To get the most out of the form, you can use the following starting point for the CSS:

```css
/* will create vertical spacing between fields  */
.formkit-form > * + * {
  margin-top: 2rem
}

/* This will create a grid to place form fields in */
.formkit-fields {
  /* set the default column span to match the full 12 columns */
  --column-span: 12;
  
  /* Create a grid with 12 evenly spaced columns */
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  
  /* Add some spacing between fields in the same group or on the same line. */
  grid-gap: 1rem;
}

.formkit-field {
  /* the --column-span variable will be set per formkit-form-field if you set the width property (defaults to 12). */
  grid-column: auto / span var(--column-span);
}
```

### Tip: Customising the appearance of Angular Material text fields

You can override the appearance of Angular Material text fields used in FormKit by overriding the default options with the `MAT_FORM_FIELD_DEFAULT_OPTIONS` Injection Token:

```ts
@NgModule({
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'legacy' | 'outline' | 'standard' | 'fill'
      }
    }
  ]
})
```

## Custom components

By default, the FormKit uses a set of prebuilt components to build your form. You can add your own custom components. You can choose between updating all fields that match a certain `FieldType` to render your custom component by customising the default set. If you need to update a specific field without changing other fields with the same `FieldType`, you can customise a specific field.

### Customising the default set

Add the `components` property to the `forRoot()` payload object and add components that you want to override per `FieldType`:

```ts
@NgModule({
  imports: [
    FormKitModule.forRoot({
      components: {
        [FieldType.Text]: CustomTextInputComponent
      }
    })
  ]
})
export class AppModule { }
```

> This will update all fields that use the `FieldType.Text` type as field `type` property to use the `CustomTextInputComponent`.

### Customising a component for a specific field

```ts
const formConfig: FormKitFields<Type> = {
  myField: {
    type: FieldType.TextField,
    component: CustomTextInputComponent.
  }
}
```

> This will make sure that field `myField` uses the `CustomTextInputComponent`.

### Creating your custom component

You can extend the `FieldBaseComponent`. This component has all `@Input()` properties set (you can override the types).

You must add a HTML element that has the `[formGroup]` attribute that will be filled with the `formGroup` `@Input()` property. The `[formControlName]` property **must** be mapped to the `name` `@Input()` property in order to get your custom component to work.

```ts
import { FieldBaseComponent, ISingleField, FormKitForm } from '@politie/formkit';

@Component({
  selector: 'app-custom-text-input-component',
  template: `<div [formGroup]="formGroup"><input type="text" [formControlName]="name"></div>`,
})
export class CustomTextInputComponent extends FieldBaseComponent implements OnInit {

  @Input() control!: FormControl | FormArray | FormGroup;
  @Input() events$!: Subject<FormEvent>;
  @Input() field!: ISingleField<any>;
  @Input() name!: string;
  @Input() formGroup!: FormGroup;

  ngOnInit() {}
}
```

> Make sure that you add your component to the `entryComponents` in the module.

## Field Types
The following field types are available (you can [add your own](#custom-components)):

- Checkbox Field
- Date Field
- Email Field
- Hidden Field
- Number Field
- Password Field
- Radiobuttons Field
- Radio Field
- Select Field (with multiple option)
- Text Field
- Textarea Field
- Toggle Field


### Note about using `strictTemplates`

Since all published libraries must use the View Engine compiler, something is off with the recognition of a generic type provided in a [@ViewChild](https://angular.io/api/core/ViewChild) which turns the `[fields]` attribute into a error if you provide `FormFields<YourType>`. 

Until this is fixed, we recommend you set the `strictTemplates` under `angulerCompilerOptions` in `tsconfig.json` to false. 

If no `strictTemplates` property is set in your `tsconfig.json`, you already should be good to go, since the property defaults to `false`.
