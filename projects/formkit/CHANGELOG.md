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
