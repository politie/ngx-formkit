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
