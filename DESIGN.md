# Design System & Styling Guide — justificantes-v2

Welcome to the **justificantes-v2** design system specification. This document outlines our UI philosophy, styling guidelines, color palette, design rules, and core components.

---

## 1. Design Philosophy & Brutalist Rules

The application uses a **Modern Neo-Brutalist** mobile aesthetic characterized by bold high-contrast borders, solid offset shadows, rich vibrant accent colors, crisp typography, and micro-haptic interactions.

### Preferred Styling Method

- **`StyleSheet` is PREFERRED**: Using React Native `StyleSheet.create` together with our custom hook `useStyles((colors) => createStyles(colors))` is the recommended approach for writing component styles. It guarantees clean theme token resolution, type safety, and optimal performance.
- **Tailwind CSS (Uniwind) as Alternative**: You may use Tailwind classes (`className`) if a style is complex, tedious, or hard to express cleanly with `StyleSheet`.

#### Best Practice for Component Styles (`useStyles` & `createStyles`)

The standard and cleanest way to write styles in components is using the `createStyles` factory pattern:

1. **Define `createStyles` outside the component**:
   Pass `colors: ThemeColors` to resolve theme tokens directly inside `StyleSheet.create`:

   ```typescript
   import { ThemeColors, useStyles } from "@/hooks/use-theme";
   import { StyleSheet } from "react-native";

   const createStyles = (colors: ThemeColors) =>
   	StyleSheet.create({
   		container: {
   			flex: 1,
   			backgroundColor: colors.surfaceContainer,
   		},
   		circleContainer: {
   			width: 48,
   			height: 48,
   			borderRadius: 24,
   			borderWidth: 2,
   			borderColor: colors.outline,
   			backgroundColor: colors.surfaceContainer,
   			alignItems: "center",
   			justifyContent: "center",
   		},
   		spinnerIcon: {
   			color: colors.onSurface,
   		},
   	});
   ```

2. **Consume `useStyles` inside the component**:

   ```typescript
   export function MyComponent() {
     const styles = useStyles((c) => createStyles(c));

     return (
       <View style={styles.container}>
         <View style={styles.circleContainer}>
           <Button.Spinner size={24} color={styles.spinnerIcon.color} />
         </View>
       </View>
     );
   }
   ```

3. **Why this pattern?**:
   - `useStyles` automatically injects the active theme's `colors` object (`ThemeColors`), so you **do NOT need** to manually call `const { colors } = useThemeColors()` in components just for styling.
   - `useStyles` memoizes the `StyleSheet` compilation so styles are only recalculated when the color scheme (`isDark`) changes, optimizing render performance.
