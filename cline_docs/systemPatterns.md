# System Architecture Patterns

## Form Components
1. Class-based Form Component (FormNative.tsx)
   - Manages form state internally
   - Uses lifecycle methods for updates
   - Handles validation and submission
   - Integrates with native widgets and templates

2. Functional Form Component (FormNativeFunctional.tsx)
   - Uses hooks for state management
   - Leverages useForm hook for form logic
   - Provides same functionality as class component
   - More modular and easier to test

## State Management
- Form state handled through useForm hook
- Validation state managed separately
- Error state tracked and displayed as needed
- Submit state handled through callbacks

## Component Patterns
1. Native Widgets
   - TextWidget for text input
   - SelectWidget for dropdown/picker
   - Custom styling through React Native StyleSheet

2. Templates
   - NativeFieldTemplate for field layout
   - NativeSubmitButton for form submission
   - NativeErrorList for error display

## Data Flow
1. Form Data
   - Top-down props flow
   - State updates through callbacks
   - Validation on change/submit

2. Error Handling
   - Validation errors tracked in state
   - Display controlled by showErrorList prop
   - Custom error transformations supported

## TypeScript Patterns
- Generic types for form data (T)
- Schema type constraints (S)
- Form context type (F)
- Proper type inference throughout
