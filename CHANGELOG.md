# 2.2.2
- FIXED: Placeholders derived from the field name are now Title cased.
- ADDED: A `<formkit-form-field>` now adds a `is-disabled` class if the control inside the field is disabled.
- ADDED: a `reset` method on the `<formkit-form>` component to reset the form to the initial values.
- ADDED a page with examples: [FormKit examples](https://politie.github.io/ngx-formkit/).
- UPDATED: Since all default error messages would check if the control is touched before adding the message, this behavior is added to the custom messages as well. If you want to force messages, even on untouched controls, you can use `showMessagesIfControlIsUntouched` for default messages and custom messages.

# 2.2.1
- UPDATED: Updated the logic of `standalone` field check inside the `FormFieldComponent`. This will fix issues when using a standalone control inside a `FormGroup` that isn't created with `FormKitForm`.
- UPDATED: Checkboxes field should be provided with array type value.

# 2.2.0
- UPDATED: The `checkboxes` field value now returns the `option id` value on checked, or `null` when the option at that index is not checked. This means you don't have to map the values to the `field option` values in your own code. Example: `['my-id-1', null, null, 'my-id-4']`. 
- UPDATED: The `arrayMinChecked` and `arrayMaxChecked` validators are updated to validate the length of the array instead of length of truthy values in the array.
- UPDATED: The `checkbox` field no longer requires a `option` property to be set. Instead, you can add a `label` and optional `description`. This change is made to allow the checkbox to have three states: `intermediate / null`, `checked / true` `unchecked / false`.
- UPDATED: The Repeatable field type now uses `[string]: IField` for its `fields` property due to some limitations in the Typescript checker.
- ADDED option to use `<formkit-form-field>` as standalone field. This way you don't need to use a `<formkit-form>` to use a single field (with validation & status updates).

# 2.1.10
- Fixed bug with `readonly` to be set if `formkit-form` is used inside `*ngIf`.

# 2.1.9
- Added `onSubmitClick()` method that return a boolean indicating if a form is valid. This method marks all child fields as `touched`, forcing validation states on each field. You can call this method on submit to test if the form is valid and force error states if a field isn't valid.
- Added `submitClickedFormInvalid` content slot. In this content slot, you can add a form wide error message if something is wrong if a user clicks the submit button.
- These two fixes are done in accordance with the rule of thumb to not disable submit buttons when there are no cues that something is wrong in the form.
- RENAMED: `cy-formkit-field-notification` to `data-cy-formkit-field-notification`.

# 2.1.8
- HOTFIX: Also export `CheckboxField`.

# 2.1.7
- UPDATED: FormKitModule now exports all field types, so you can use these components without using a `<formkit-form>`.
- UPDATED: Select field now has a `placeholder` option that sets a disabled option to the `null` value.

# 2.1.6
- UPDATED: Placeholder now uses the `placeholder` property, with a fallback (in order) to `header.title`, `name` or a empty string.

# 2.1.5
- FIXED: Issue where a Select field with a option list observable that has a single option and `autoSelectFirstOption` to true would trigger a `value$` update due to emitting a new value. This could result in a endless loop of updates, if you use the `value$` observable to change the form again in your own logic.
- ADDED: Manual `triggerUpdateChecks` method to run all after update checks per field.

# 2.1.4
- Added Validators class, starting with validator methods for checkboxes field

# 2.1.3
- Added option to add multiple checkboxes

# 2.1.2
- Updated textarea field with `rows` property to set height instead of `minRows` and `maxRows`.

# 2.1.1
- Fixed timing issue with initializing the form with default values and running updateChecks where the checks received the wrong values.

# 2.1.0
- BREAKING: Moved `transform` logic from field to `transforms` for a per-form basis of value transforms.
- BREAKING: `<formkit-form>` now requires a `[config]` attribute with `fields` instead of `[fields]`.
- Added: Option for text type fields to have a `autofocus` property. Use this property in your field definition to add the focus directly to this field.

# 2.0.4
- Fixed: Field with type `Hidden` is now represented in the form raw values.

# 2.0.3
- Fixed: Empty messages list if no messages or messages: false is now hidden.

# 2.0.0 - 2.0.2
This release has a lot of breaking changes:

- Removed `hooks` property for fields.
- Removed `icon` property  for fields.
- Removed `multiple` option for select field.
- Removed `transformValues` method.
- Reworked the entire logic of updating and resetting the values within the form.
- Added option to use a `templateOutlet` to individually render root form fields using the `[fieldsTemplate]` `@Input()` property.
- Added the option to nest `Group` and `Array` type fields.
- Updated all field types to not use `Material` components.
- Updated input names to prevent `ng-` classes bubbling up the entire DOM tree inside the `formkit-form`.
- Updated `Array` field to `Repeatable`.
- Moved `required`, `disabled` and `hidden` properties to a single `status` function that returns the status per property.
- Updated: `messages` property is now a function that returns a array of messages.

# 1.0.3
- Hotfix for the NGCC compiler giving errors for `Required` type usage.

# 1.0.2
- Removed `[autoCreate]` `@Input()` property
- Removed `created` slot in template
- Added more reliable `patch` method on the `FormComponent` if you work with controls with `resetFormOnChange` properties set.
- Refactored the logic for updating and resetting the form.
- Refactored the logic for `resetFormOnChange` properties to allow child controls to have this option set as well.
- Added option for setting the `debounce` before running afterUpdate checks. This only applies to updates done by a User, not for Reset and Patch updates.

# 1.0.1
- **BUGFIX**: Updated the one time `detectChanges` after `create()` to `markForCheck()` since unit tests could break with error `view.root.sanitizer.sanitize is not a function`.

# 1.0.0
- **BREAKING CHANGE**: the `control` property should not be used anymore. `FormKit` will assign `FormControl` properties for your field definitions. You can add `value` and `validators` properties to your field definitions if you need a default value or validator functions.
- **BUGFIX**: Updated required functions by merging errors and removing error by key instead of replacing the entire error object.
- Added `CreateFormControl` helper function.
- Added `Utilities` functions.
- Updated all demo forms in the showcase project.
- Disabled `strictTemplates` and added readme section about this decision.

# 0.0.7
- Implemented `createFormGroupFromBlueprint` helper to be used inside FormKit and for custom components.
- Removed `setValues` method. You can use `patchValue` directly on the form, triggering the schedulers for after update checks as well.
- Added `ToggleFieldComponent` to use with a Toggle
- Updated showcase project with clearer examples
- Updated imports (`FormsModule` isn't required if we import `ReactiveFormsModule`)

# 0.0.6
- Updated package name to `ngx-formkit`.
- Added option to add `values` to form `create()` method to patch form before the `afterUpdateValueScheduler$` is active. This will give the option to have initial values set in your field definitions for resets and initialize your form with different values.
- Added checks for missing `[form]` and `[fields]` attributes and throw `Error` accordingly.
- Added `formkit-form-root` and `formkit-form-sub` classes for `<formkit-form>` instances.
- Removed `[appearance]` attributes from Material controls so controls can be overriden by project.
- Added docs on `<ng-content>` slots.
- Added docs on styling.

# 0.0.5
- Fixed issue where `SelectField` value returns `[object object]` as string instead of actual object.
- Updated logic for `resetFormOnChange` control listener in `FormComponent`.

# 0.0.4
- Fixed issue where a control lookup could return `undefined`.

# 0.0.3
- Added configuration options for `FormKitModule`.
- Reworked configuration logic in `FormComponent` and `FormFieldComponent`.
- Updated `GroupField` and `ArrayField` implementations to render `<formkit-form>` components.
- Updated `CustomFieldComponent` field type for easier overrides. 
- Removed the need for `FieldIteratorPipe`.
- Added the logic to manually call the form `create()` method.
- Added license.
- Added repository URL.

# 0.0.2
- Added changelog
- Updated `ChangeDetection` strategy for `FormFieldComponent`
- Updated `FormkitModule` to `FormKitModule`.

# 0.0.1
- Initial update
