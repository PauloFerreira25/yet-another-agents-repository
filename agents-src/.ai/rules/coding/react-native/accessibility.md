---
name: react-native-accessibility
Scope: When creating interactive components, forms, modals, or screen layouts
description: RN accessibility props replace ARIA/semantic HTML; gluestack-ui handles most patterns automatically
---

## No semantic HTML — use accessibility props explicitly

React Native has no `<button>`, `<nav>`, or ARIA. Every interactive element must declare its accessibility role and state explicitly:

```tsx
// correct
<Pressable accessibilityRole="button" accessibilityLabel="Salvar" onPress={handleSave}>
  <Text>Salvar</Text>
</Pressable>

// wrong — no role, screen readers announce nothing useful
<Pressable onPress={handleSave}>
  <Text>Salvar</Text>
</Pressable>
```

Common `accessibilityRole` values: `button`, `link`, `header`, `image`, `search`, `text`, `adjustable` (sliders), `checkbox`, `radio`.

## Labels

Use `accessibilityLabel` when the visible text does not fully convey the action, or the element is icon-only:

```tsx
// icon-only — no visible text
<Pressable accessibilityRole="button" accessibilityLabel="Fechar menu" onPress={close}>
  <XIcon />
</Pressable>

// visible text already describes the action — no accessibilityLabel needed
<Pressable accessibilityRole="button" onPress={handleSave}>
  <Text>Salvar</Text>
</Pressable>
```

Decorative icons next to a labeled action get `accessibilityElementsHidden` (iOS) and `importantForAccessibility="no"` (Android) — gluestack-ui's `Icon` component sets these by default when used inside a labeled `Button`.

## State

Convey dynamic state via `accessibilityState`, not via visual styling alone:

```tsx
<Pressable
  accessibilityRole="checkbox"
  accessibilityState={{ checked: isSelected, disabled: isLoading }}
  onPress={toggle}
>
```

## Forms

gluestack-ui's `FormControl`, `FormControlLabel`, and `FormControlError` wire label association and error announcement automatically — use them for all forms, the same way the web stack relies on shadcn's `<FormField>`.

For custom inputs outside gluestack-ui, set `accessibilityLabel` on the input and `accessibilityLiveRegion="polite"` on the error text so screen readers announce validation errors as they appear.

## Focus and screen order

There is no DOM focus-on-navigation concern — Expo Router screens mount fresh and screen readers read from the top automatically. Do not port the web stack's "focus `<main>` on route change" pattern; it has no RN equivalent and is unnecessary.

## Images

Every meaningful `Image` needs `accessibilityLabel` describing its content. Decorative images get `accessibilityElementsHidden` / `importantForAccessibility="no"` rather than an empty label:

```tsx
<Image source={chart} accessibilityLabel="Receita Q1 2026 por região: Norte 45%, Sul 30%, Oeste 25%" />
<Image source={divider} importantForAccessibility="no" accessibilityElementsHidden />
```

## Testing

Verify with the OS screen reader — VoiceOver (iOS) and TalkBack (Android) behave differently enough that testing on one platform does not guarantee the other works. There is no keyboard-only pass on mobile; the equivalent check is navigating the entire flow with a screen reader enabled and no visual reference.
