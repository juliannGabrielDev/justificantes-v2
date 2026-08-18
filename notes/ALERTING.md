THE API IS NOT READY YET, IT IS A WORK IN PROGRESS

# Alert System Guidelines

`reportes-mobile` uses a custom, platform-native cross-platform alert system built on `@expo/ui` instead of React Native's `Alert.alert`.

## What's provided

- **`<AlertProvider />`** — mounted once in `src/app/_layout.tsx`, wraps the whole app.
- **`useCustomAlert()`** — hook to show an alert from any component inside the provider.
- **`src/components/ui/alert-component/`** — one `AlertComponent` with platform-specific implementations resolved by Expo:

  | File                | Platform                                     |
  | :------------------ | :------------------------------------------- |
  | `index.ios.tsx`     | SwiftUI (`@expo/ui/swift-ui`)                |
  | `index.android.tsx` | Jetpack Compose (`@expo/ui/jetpack-compose`) |
  | `index.tsx`         | Fallback / web (React Native `Alert`)        |

## When to use it

| Situation                                        | What to use                                                                                                  |
| :----------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| Global errors from React Query queries/mutations | Set `meta.errorMessage` on the hook. The `QueryClient` caches in `_layout.tsx` show the alert automatically. |
| Inline confirmation / destructive actions        | `useCustomAlert().showAlert(...)`                                                                            |

> Global query/mutation errors are handled automatically via `meta.errorMessage` — do **not** wrap `queryFn`/`mutationFn` in `try/catch`, and don't call `showAlert` there. See `notes/DATA_FETCHING_GUIDELINES.md`.

## Usage

```tsx
import { useCustomAlert } from "@/context/alert-context";

const { showAlert, hideAlert } = useCustomAlert();
```

### Simple message

```tsx
showAlert("No se pudo guardar", {
	message: "Inténtalo de nuevo más tarde.",
});
// shows a single "Aceptar" button (default confirm text)
```

### Confirmation / destructive

```tsx
showAlert("Eliminar reporte", {
	message: "Esta acción no se puede deshacer.",
	confirmText: "Eliminar",
	cancelText: "Cancelar",
	destructive: true,
	onConfirm: () => deleteReport(id),
	onCancel: () => console.log("dismissed"),
});
```

## API

```ts
interface AlertOptions {
  message?: string;
  confirmText?: string;   // default: 'Aceptar'
  cancelText?: string;    // omitted => no cancel button
  onConfirm?: () => void;
  onCancel?: () => void;  // called on cancel/dismiss (back tap or outside)
  destructive?: boolean;
}

showAlert: (title: string, options?: AlertOptions) => void;
hideAlert: () => void;    // hides current + fires onCancel
```

> Notes
>
> - `confirmText` defaults to `'Aceptar'`.
> - `onCancel` fires when the user cancels **or** dismisses the alert (iOS `onIsPresentedChange(false)`, Android back press).
> - The provider renders the `Alert` component once; state is driven by `visible`, so only one alert shows at a time.
