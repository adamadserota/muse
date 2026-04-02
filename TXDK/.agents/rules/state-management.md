# State Management Rules

## Decision Tree

```
Is the state used by 1 component only?
  → useState

Is the state shared by 2-3 nearby components?
  → Lift state up to parent + pass via props

Is the state shared across many components / deep tree?
  → React Context

Is the state complex (many fields, many update patterns)?
  → useReducer (local) or Context + useReducer (shared)

Is the state server data (fetched from API)?
  → Custom hook with fetch + cache pattern (see below)
```

**Do NOT install a state management library** (Redux, Zustand, Jotai, etc.) unless the user explicitly requests it. React's built-in tools handle 90% of cases.

## Patterns

### Local State (useState)
```typescript
// Simple values, toggles, form fields
const [isOpen, setIsOpen] = useState(false);
const [name, setName] = useState("");
```

### Lifted State (props)
```typescript
// Parent owns the state, children receive + update via props
function ParentPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    return (
        <>
            <Sidebar items={items} selectedId={selectedId} onSelect={setSelectedId} />
            <Detail itemId={selectedId} />
        </>
    );
}
```

### Context (shared across tree)
```typescript
// contexts/AuthContext.tsx
interface AuthState {
    user: User | null;
    token: string | null;
}

const AuthContext = createContext<AuthState & { login: (t: string) => void; logout: () => void }>(
    null!,
);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({ user: null, token: null });

    const login = (token: string) => {
        const user = decodeToken(token);
        setState({ user, token });
    };
    const logout = () => setState({ user: null, token: null });

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
```

### Custom Hook for API Data
```typescript
// hooks/useItems.ts
export function useItems() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await listItems();
            setItems(res.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load items");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    return { items, loading, error, refetch: fetchItems };
}

// Usage in component
function ItemList() {
    const { items, loading, error, refetch } = useItems();
    // ...
}
```

## Rules

1. **State lives as close to its consumers as possible** — don't hoist state "just in case"
2. **Props are the default** — don't reach for Context until props become unwieldy (3+ levels)
3. **One Context per domain** — `AuthContext`, `ThemeContext`, not one giant `AppContext`
4. **Custom hooks encapsulate logic** — components should not contain fetch/parse/transform logic
5. **Derived values are not state** — if you can compute it from existing state, use `useMemo`
6. **Never store API response structure directly** — transform to your internal types in the service/hook layer

```typescript
// ❌ Bad — derived value stored as state
const [items, setItems] = useState<Item[]>([]);
const [filteredItems, setFilteredItems] = useState<Item[]>([]);

// ✅ Good — derived value computed
const [items, setItems] = useState<Item[]>([]);
const [filter, setFilter] = useState("");
const filteredItems = useMemo(
    () => items.filter(i => i.name.includes(filter)),
    [items, filter],
);
```
