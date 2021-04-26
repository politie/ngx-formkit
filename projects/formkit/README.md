# ngx-FormKit

Current version: 2.1.2

FormKit is an Angular Library built to make form handling in Angular a breeze. It allows you to create strongly typed forms in your code, without the hassle of working with templates. FormKit provides a `FormComponent` component that you can use to display the form and respond to events.  It provides methods to call FormKit logic from within your host component, by using the `FormComponent` as a [@ViewChild](https://angular.io/api/core/ViewChild) reference.

Since the FormKit library is built on top of [Angular Reactive Forms](https://angular.io/guide/reactive-forms), you can use all the built in [Validators](https://angular.io/api/forms/Validators) as well as [custom validator functions](https://angular.io/guide/form-validation#adding-custom-validators-to-reactive-forms). FormKit has dynamic and conditional callback functions per defined `Field`, like:

- Conditional transformation of field values (based on the values of other fields in the form)
- Conditional visibility (based on the values of other fields in the form)
- Conditional required property (based on the values other fields in the form).

# Installation

```
npm i @politie/formkit
```

This will install the FormKit library as a dependency in your project.

## Import the `FormKitModule`

Add the `FormKitModule` in your `AppModule` and call the `forRoot()` method. You can add a [optional configuration object](#module-configuration) as a parameter. When you have multiple modules, you can omit the `forRoot()` method in modules other than `AppModule`.

```ts
@NgModule({
  imports: [
    FormKitModule.forRoot()
  ]
})
export class AppModule { }
```

You can now use the `<formkit-form>` component in your project.

## Create a form
Add the following options to the component where you want to add a `<formkit-form>`.

```ts
import { FormComponent, IFormGroup, FieldType, FormKitFormConfig } from '@politie/formkit';
import { ViewChild } from '@angular/core';

type UserForm = {
  username: string;
}

export class MyComponent {

  /**
   * The IFormGroup interface extends the regular FormGroup by adding strict typings.
   * You pass this form property to the <formkit-form> in the template.
   */
  form = new FormGroup({}) as IFormGroup<UserForm>;

  /**
   * The fields object contains all your field definitions. You pass this config
   * object to the [config] attribute for <formkit-form> in the template.
   */
  config: FormKitFormConfig<UserForm> = {
    fields: {
      username: {
        type: FieldType.Text
      }
    }
  };
  /**
   * By using ViewChild, we can use the methods provided in the FormComponent
   * directly in this component class by calling this.form.<method-name>()
   */
  @ViewChild('userForm', {static: true}) formComponent: FormComponent<UserForm>;

  /**
   * Method for handling submits
   */
  onSubmit() {
    // do something with the this.form.values() here
  }
}
```

In your Component template, add the form by adding the `formkit-form` selector. Give it the reference name you've assigned in the `@ViewChild`, for this example: `#userForm`. In the `[form]` property, you add the empty `FormGroup`, in the `[config]` property, you add your `FormKitFormConfig` definition.

```html

<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <formkit-form #myFormKitForm [form]="form" [config]="config"></formkit-form>
  <button
    type="button"
    (click)="onSubmit()"
    [disabled]="form.invalid">
    Save
  </button>
</form>
```

That's it! You can now dive in the extensive set of configuration options and properties to alter the behavior of the form and form fields.

## `Field` properties
Each field object should at least have a `type` option set. The type property must be of type `FieldType` which is a enum provided by the `FormKitModule`.

> The object name should match a key in the provided Type definition. Following the example above, you can use `username` as name for a field object.

Below is a rundown of each option per field object.

### Settings for all fields

| Parameter | Type | Description 
|:---|:---|:---|
| type* | `FieldType` | The type of field to render. See [Field Types](#field-types) for available field types. |
| class | `string[]` | Add additional CSS classes which will be placed on the `<formkit-form-field>` in the HTML. |
| component | `any` | If you'd like to render a custom component for this field, add the class here. See See [Custom components](#custom-components) for example usage. |
| header | `{ title?: string, description?: string, tooltip?: string }` | Object with properties to add a title, description or tooltip above the field. |
| footer | `{ description?: string }` | Object with properties to add a description below the field (below the field messages). |
| messages | `false` or `FieldMessagesFunction<T>` | A function that returns dynamic messages for this field. See [Field messages](#field-messages) for example usage. |
| placeholder | `string` | Optional placeholder text for input fields (when the user sets focus on a field and the field value is empty, the placeholder is shown). |
| resetFormOnChange | `false` | If true, all fields in the entire form (except this field) will reset to their default values on change of this field. After the change, one round of `afterUpdateValues` is run, to trigger transform and conditional hooks. Use with caution, since multiple usages of this property in one form may lead to `MAX_CALL_STACK_SIZE_EXCEEDED` errors. You can't use this property inside a Array Field type. |
| status | `FieldStatusFunction<T>` | A function that should return a object with boolean properties for `hidden`, `disabled`, `required` status. See [Status](#status) for examples. |
| validators | `ValidatorFn[]` | Optional array of [Validator functions](https://angular.io/api/forms/Validator). |
| value | `any` | Set a default value to the control. |
| width | `1` - `12` | If you want to limit the with of the field, add the `width` property to your field. You can choose a value between `1` and `12` to span your field over the available grid columns. |

### Status
You can use the `status` property on a field to alter the status of a field dynamically, based on form values or `control` properties. The `status` property asks for a function that returns a object with `disabled`, `hidden` and `required` properties (all optional) that are of type `boolean`. The function has a `payload` paramater with the following properties:

```ts
type payload = {
  control: AbstractControl | FormControl | FormArray | FormGroup, // The FormControl for this field
  errors: ValidationErrors, // the errors on this field (will be a empty object if there aren't any 
  values: FormValues<T> // the current values on the form (object)
}
```

#### Example

```ts
import { FormKitFormConfig, FieldType } from '@politie/ngx-formkit';

type UserForm = {
  username: string;
  toggle: boolean;
}

const config: FormKitFormConfig<UserForm> = {
  fields: {
    toggle: {
      type: FieldType.Toggle,
      value: false,
      label: 'Toggle me to show/hide the username field'
    },
    username: {
      type: FieldType.Text,
      status: (payload) => ({
        disabled: !payload.values.toggle,
        hidden: payload.values.toggle
      })
    }
  }
}
```

In this example, the `username` field will be `hidden` if the `toggle` field value is truthy. You can use object destructuring as well, to only get the properties needed from the payload object.

```ts
import { FormKitFormConfig, FieldType } from '@politie/ngx-formkit';

type UserForm = {
  username: string;
  toggle: boolean;
}

const config: FormKitFormConfig<UserForm> = {
  fields: {
    toggle: {
      type: FieldType.Toggle,
      value: false,
      label: 'Toggle me to show/hide the username field'
    },
    username: {
      type: FieldType.Text,
      status: ({ values }) => ({
        disabled: !values.toggle,
        required: values.toggle
      })
    }
  }
}
```

> If you want to make a field always required, it's better to use the `validators` property with Angular built in `Validators.required` method.

### Field messages
To add messages to a field, add a function to the `messages` property that returns an array with `FieldMessage` type objects in it. The function has a payload parameter with the following properties:

```ts
type payload = {
  control: AbstractControl | FormControl | FormArray | FormGroup, // The FormControl for this field
  errors: ValidationErrors, // the errors on this field (will be a empty object if there aren't any 
  values: FormValues<T> // the current values on the form (object)
}
```

Each message in the returned messages array should have the following properties. Asterisk marked properties are required.

| Property | Type | Description |
|:---|:---|:---|
| show* | `boolean` | Wether to show this message. |
| type | `FieldMessageType` | Type of message (defaults to `FieldMessageType.Information`) |
| text* | `string` | The text for this message. |

#### Always show a message

```ts
import { FormKitFormConfig, FieldType } from '@politie/ngx-formkit';

type UserForm = {
  username: string;
  toggle: boolean;
}

const config: FormKitFormConfig<UserForm> = {
  fields: {
    username: {
      type: FieldType.Text,
      messages: (payload) => ([
        {
          show: true,
          text: 'Hello world'
        }
      ])
    }
  }
}
```

#### Use in combination with a Validator

```ts
import { FormKitFormConfig, FieldType } from '@politie/ngx-formkit';
import { Validators } from '@angular/forms';

type UserForm = {
  username: string;
  toggle: boolean;
}

const config: FormKitFormConfig<UserForm> = {
  fields: {
    username: {
      type: FieldType.Text,
      validators: [Validators.minLength(10)],
      messages: ({control, errors, values}) => ([
        {
          show: Boolean(control.value && errors.minlength),
          type: FieldType.Error,
          text: `You've entered ${errors.minlength.actualLength} / ${errors.minlength.requiredLength} characters.`
        }
      ])
    }
  }
}
```

#### Disable all messages

If you want to disable all messages (including default messages) for a field, simply pass `messages: false` to the field configuration:

```ts
import { FormKitFormConfig, FieldType } from '@politie/ngx-formkit';
import { Validators } from '@angular/forms';

type UserForm = {
  username: string;
  toggle: boolean;
}

const config: FormKitFormConfig<UserForm> = {
  fields: {
    username: {
      type: FieldType.Text,
      validators: [Validators.minLength(10)],
      messages: false
    }
  }
}
```

## `FormComponent` `@Input()` properties

Example:

```html
<formkit-form [config]="config" [form]="form"></formkit-form>
```

| Property | Type | Description | Default |
|:---|:---|:---|:---|
| form* | `FormGroup` | The FormGroup to use for this form. | |
| config* | `FormKitFormConfig<T>` | The configuration for this form. The configuration object for a form has the following properties: `fields`, where you add all fields to render for this form and `transforms`. Read more about [Transforming field values](#transforming-field-values). | |
| readonly | `boolean` | Render the form in readonly mode | `false` |
| fieldsTemplate | `TemplateRef` | If you want to render all the fields yourself, you can pass a `TemplateRef` to this input. See [Custom Forms](#custom-forms) for an example. | `DefaultFieldsTemplate` |

*required

### Transforming field values

Sometimes, you need to transform the value of a input based on the value(s) of other input(s). You can do this on a per-form basis with FormKit. In your `config` add the `transforms` property to start. This property takes a function that receives the current `values` of the form as a parameter. The `values` will be typed as your provided Type in the config (in the example below: `UserForm`). The function should return a object with the keys of the fields you want to transform.

```ts
import { FormKitFormConfig, FieldType } from '@politie/ngx-formkit';
import { Validators } from '@angular/forms';

type UserForm = {
  username: string;
  toggle: boolean;
}

const config: FormKitFormConfig<UserForm> = {
  transforms: values => ({
    ...(values.toggle && { username: 'default' })
  }),

  /**
   * 'Oldschool' syntax:
   * 
   * transforms: (values) => {
   *   return {
   *     username: values.toggle ? 'default' : undefined
   *   }
   * }
   */

  fields: {
    toggle: {
      type: FieldType.Toggle,
      value: false,
      label: 'Toggle to change username to default'
    },
    username: {
      type: FieldType.Text
    }
  }
}
```

The above example uses a shorthand to spread the object into the returned object. You can also use a different approach, as long as the key you want to transform returns either any value (including `null` or `''`) or `undefined`. If you return `undefined` for a key, the transform will be ignored, and the current value of the field will be untouched. In the example above, if the toggle is set to `false`, the `username` field value isn't touched.,

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

> Use any of these properties in `ngAfterViewInit` lifecycle hook of your host component to prevent `undefined` properties.

## `FormComponent` methods

Example:

```ts
this.myFormKitForm.patch(...);
```

| Method | Payload | Description | Returns |
|:---|:---|:---|:---|
| create | `values (T)` | If you set the `autoCreate` property in `<formkit-form>` to false, you have to call this method yourself. You can provide a object of values to patch the form before all schedulers are set. This allows you to have initial values for resets (in your field definitions) and a different starting value for the form. | |
| patch | `values` | Update the form values with the provided `values`. The values should be a `object` with { name: value } properties. This method is useful if you have fields set with the `resetFormOnChange` property, to bypass reset behaviour if you call `patchValue` on the `FormGroup` directly. | `void` |

> **Important:** If you want to use properties or methods on the `FormComponent` `ViewChild`, you should trigger them after Angular `AfterViewInit` checks are done, to prevent issues with input properties or methods that aren't defined yet. So, for example:
> ```typescript
> ngAfterViewInit() {
>   this.myFormKitForm.patch(...);
> }
> ```

## Available options for the `forRoot()` method

In the `forRoot()`, you can add a configuration object with the following properties:

| Property | Type | Description | Default |
|:---|:---|:---|:---|
| text | object | Object with properties to override strings used in the form templates | `{ loading: 'loading' }` |
| messages | object | Object with default messages for common validator errors | `{...}` |
| components | `{...}` | Object with `[FieldType.<name>]` properties to globally override components per `Field type` | `default set, see Field Types` |

*= required

## Content slots

The `<formkit-form>` offers several content slots for you to project content in. 

Example:

```html
<div formDescription>
  Content will be placed in the `formDescription` content slot.
</div>
```

The available slots are:
- `formDescription` Placed above the form fields.
- `formDescriptionReadOnly` Visible if the `readonly` attribute is set to `true`.
- `footer` Placed below the form fields.

## Styling

You can bring your own CSS to style `<formkit-form>` instances. Out of the box, the inputs use no styling at all, to be styled by Tailwind or something similar.

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

## Module configuration

You can add a optional configuration object to the `FormKitModule` when importing. This object has a few optional properties you can set:

### Debounce time
Add a `updateDebounceTime` property in the object to edit the amount of milliseconds it takes before FormKit calls the update logic per field. Defaults to `200`.

### Default messages

You can edit default messages for common `Validators` errors if you import the `FormKit` Module. Update the `messages` object in the `forRoot()` payload object:

```ts
@NgModule({
  imports: [
    FormKitModule.forRoot({
      messages: {
        required: 'This field is required',
        min: error => `Value should be at least ${error.min}.`
      }
    })
  ]
})
export class AppModule { }
```

You can also use the provided `FORMKIT_DEFAULT_MESSAGES_NL` object for a Dutch translated set of default messages.

```ts
import { FORMKIT_DEFAULT_MESSAGES_NL } from '@politie/ngx-formkit';

@NgModule({
  imports: [
    FormKitModule.forRoot({
      messages: FORMKIT_DEFAULT_MESSAGES_NL
    })
  ]
})
export class AppModule { }
```

### Custom components

By default, the FormKit uses a set of prebuilt components to build your form. You can add your own custom components. You can choose between updating all fields that match a certain `FieldType` to render your custom component by customising the default set. If you need to update a specific field without changing other fields with the same `FieldType`, you can customise a specific field.

#### Customising the default set

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

#### Customising a component for a specific field

```ts
import { FormKitFormConfig, FieldType } from '@politie/ngx-formkit';
import { Validators } from '@angular/forms';

type UserForm = {
  username: string;
  toggle: boolean;
}

const config: FormKitFormConfig<UserForm> = {
  fields: {
    username: {
      type: FieldType.TextField,
      component: CustomTextInputComponent
    }
  }
}
```

> This will make sure that field `myField` uses the `CustomTextInputComponent`.

##### Creating your custom component

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
  @Input() field!: ISingleField<any>;
  @Input() name!: string;
  @Input() form!: FormGroup;

  ngOnInit() {}
}
```

> Make sure that you add your component to the `entryComponents` in your  AppModule.

## Custom Forms

By default, `FormKit` renders all your fields automatically. If you want to have more control, you can supply a `TemplateRef` to the `fieldsTemplate` `@Input` property in `<formkit-form></formkit-form>`. Example:

```html
<formkit-form [form]="form" [config]="config" [fieldsTemplate]="#myCustomFieldsTemplate">
  <ng-template #customFieldsTemplate let-fields="fields" let-keys="keys">
    <formkit-form-field
      *ngFor="let name of keys"
      [form]="form"
      [control]="form.controls[name]"
      [name]="name"
      [field]="$any(fields[name])">
    </formkit-form-field>
  </ng-template>
</formkit-form>
```

Inside the template, you'll have access to two variables: `fields` and `keys`. The `fields` variable is the object with your `Field` definitions. The `keys` variable is a array containing all the `keys` in your `fields` definition, so you can easily loop over the fields with `*ngFor`. 

> Make sure that your `<ng-template>` with the templateRef is placed within the `<formkit-form>`.

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

Since all published libraries must use the View Engine compiler, something is off with the recognition of a generic type provided in a [@ViewChild](https://angular.io/api/core/ViewChild) which turns the `[config]` attribute into a error if you provide `FormKitFormConfig<YourType>`. 

Until this is fixed, we recommend you set the `strictTemplates` under `angulerCompilerOptions` in `tsconfig.json` to false. 

If no `strictTemplates` property is set in your `tsconfig.json`, you already should be good to go, since the property defaults to `false`.
