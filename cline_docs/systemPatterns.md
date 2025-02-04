# System Architecture Patterns

## Form Components
1. Class-based Form Component (FormNative.tsx)
   - Manages form state internally
   - Uses lifecycle methods for updates
   - Handles validation and submission
   - Integrates with native widgets and templates
   - Implements robust error handling with boundaries
   - Uses status tracking for form lifecycle

2. Functional Form Component (FormNativeFunctional.tsx)
   - Uses hooks for state management
   - Leverages useForm hook for form logic
   - Provides same functionality as class component
   - More modular and easier to test

## State Management
- Form state handled through useForm hook
- Validation state tracked with isValidating flag
- Form status tracked (initial, editing, submitting, submitted, error)
- Modification state tracked with isDirty flag
- Error state tracked and displayed as needed
- Submit state handled through callbacks
- Timestamps tracked for validation events

## Component Patterns
1. Native Widgets
   - TextWidget: Basic text input with styling
   - SelectWidget: Platform-specific picker implementation
   - CheckboxWidget: Switch-based boolean input
   - TextareaWidget: Multiline text input
   - RadioWidget: Custom radio button implementation
   - DateTimeWidget: Native date/time picker
   - RangeWidget: Native slider implementation
   - EmailWidget: Email-specific keyboard and validation
   - URLWidget: URL-specific keyboard and validation
   - PasswordWidget: Secure text entry with toggle

2. Widget Implementation Patterns
   - Each widget is a standalone component
   - Consistent prop interface through NativeWidgetProps
   - Platform-specific styling with StyleSheet
   - Proper keyboard handling
   - Accessibility support
   - Error state handling
   - Focus and blur management
   - Value type safety

3. Templates
   - Complete ButtonTemplates implementation
   - Proper fallbacks for all template components
   - NativeFieldTemplate for field layout
   - NativeSubmitButton for form submission
   - NativeErrorList for error display

## Data Flow
1. Form Data
   - Top-down props flow
   - State updates through callbacks
   - Validation on change/submit
   - Safe error handling with boundaries

2. Error Handling
   - Try/catch blocks for validation
   - Validation errors tracked in state
   - Display controlled by showErrorList prop
   - Custom error transformations supported
   - Safe scrolling to errors with boundaries

## TypeScript Patterns
- Generic types for form data (T)
- Schema type constraints (S)
- Form context type (F)
- Type guards for runtime checks
- Enhanced type safety for templates
- FormStatus type for state tracking
- Proper type inference throughout
- Complete ButtonTemplates typing

## React Native Patterns
- Platform-specific components
- Native event handling
- Touch interactions
- Keyboard management
- Accessibility implementation
- Platform-specific styling
- Safe scrolling behavior
