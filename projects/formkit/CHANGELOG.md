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
