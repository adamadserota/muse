# Frontend Boilerplate

## Code Quality — ESLint + Prettier

Add to `package.json`:
```json
{
    "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "lint": "eslint .",
        "lint:fix": "eslint . --fix",
        "format": "prettier --write .",
        "test": "vitest run",
        "test:watch": "vitest",
        "test:coverage": "vitest run --coverage"
    },
    "dependencies": {
        "react-router-dom": "^7.0.0"
    },
    "devDependencies": {
        "eslint": "^9.0.0",
        "@eslint/js": "^9.0.0",
        "typescript-eslint": "^8.0.0",
        "eslint-plugin-react-hooks": "^5.0.0",
        "prettier": "^3.0.0",
        "tailwindcss": "^4.0.0",
        "@tailwindcss/vite": "^4.0.0",
        "vitest": "^3.0.0",
        "@vitest/coverage-v8": "^3.0.0",
        "@testing-library/react": "^16.0.0",
        "@testing-library/jest-dom": "^6.0.0",
        "@testing-library/user-event": "^14.0.0",
        "jsdom": "^25.0.0"
    }
}
```

Create `eslint.config.js` and `.prettierrc` per `rules/code-style.md`.

## Vite Config

```typescript
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./test-setup.ts",
    },
});
```

Create `test-setup.ts`:
```typescript
import "@testing-library/jest-dom/vitest";
```

## Routing — React Router

Wrap `<App />` with `BrowserRouter` in `index.tsx`:
```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
```

Set up routes in `App.tsx`:
```typescript
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HomePage } from "./pages/HomePage";

export function App() {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </ErrorBoundary>
    );
}
```

Create `pages/HomePage.tsx` as the default route component.

## Tailwind CSS Setup

Create `index.css` in the source root:
```css
@import "tailwindcss";
@import url("https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&display=swap");

@theme {
    --font-sans: "Chakra Petch", sans-serif;

    --color-primary-100: #33FFFF;
    --color-primary-80: #29CFD1;
    --color-primary-60: #1FA0A3;
    --color-primary-40: #147076;
    --color-primary-20: #0A4148;
    --color-primary-10: #052931;
    --color-primary-5: #031D25;

    --color-secondary-100: #33BBFF;
    --color-secondary-80: #2999D1;
    --color-secondary-60: #1F77A3;
    --color-secondary-40: #145576;
    --color-secondary-20: #0A3348;
    --color-secondary-10: #052231;
    --color-secondary-5: #031925;

    --color-warning-100: #FF8133;
    --color-warning-80: #CC6B2E;
    --color-warning-60: #995429;
    --color-warning-40: #663E24;
    --color-warning-20: #33271F;
    --color-warning-10: #191C1C;

    --color-error-100: #FF3333;
    --color-error-80: #CC2C2E;
    --color-error-60: #992529;
    --color-error-40: #661F24;
    --color-error-20: #33181F;
    --color-error-10: #19141C;

    --color-white-100: #F5F5F5;
    --color-white-80: #CCCFD1;
    --color-white-60: #99A0A3;
    --color-white-40: #667076;
    --color-white-20: #334148;
    --color-white-10: #192931;
    --color-white-5: #0D1D25;

    --color-neutral-100: #00111A;
    --color-neutral-200: #313F46;
    --color-neutral-300: #626C72;
    --color-neutral-400: #939A9D;
    --color-neutral-500: #C4C7C9;

    --color-premium-100: #6B6BD6;
    --color-premium-80: #5759AA;
    --color-premium-60: #414786;
    --color-premium-40: #2D3562;
    --color-premium-20: #18233E;
    --color-premium-10: #0F1A2C;
    --color-premium-5: #091622;

    --radius-none: 0;
}
```

Import in `index.tsx`:
```typescript
import "./index.css";
```

## Error Handling

Create `components/ErrorBoundary.tsx` per `rules/error-handling.md`.
Create `services/apiClient.ts` with `ApiError` class and `apiFetch` helper per `rules/error-handling.md`.
