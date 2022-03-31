# ts-react-store

A store-based statemanagement library for React.

## Creating stores

Stores are created with the `StoreBuilder` via the static `create` or `fromValue` methods.

```ts
const userStore = StoreBuilder.fromValue({ name: 'wim', age: 25 })
    .buildStore()
```

Next to a value a store does contain the actions that can be invoked via the dispatcher. To add a single action the `withAction` method is used. An action has a `name` and an `action`, which is the function that creates a new value from the old value and the (optional) payload.

```ts
const userStore = StoreBuilder.fromValue({ name: 'wim', age: 25 })
    .withAction('setName', (user: User, name: string) => ({ ...user, name }))
    .buildStore()
```

```ts
const userStore = StoreBuilder.fromValue({ name: 'wim', age: 25 })
    .withAction('incAge', (user: User) => ({ ...user, age: user.age + 1 }))
    .buildStore()
```

Alternatively, multiple actions can be added with the `withActions` method, this method takes an object where the keys are the `name` and the values the `action`.

```ts
const userStore = StoreBuilder.fromValue({ name: 'wim', age: 25 })
    .withActions({
        '++': (user: User) => ({ ...user, age: user.age + 1 }),
        '--': (user: User) => ({ ...user, age: user.age - 1 })
    })
    .buildStore()
```

The final way of adding actions is the `withPropertyActions` method. This method adds basic setter actions for a list of properties of the `Value`.

```ts
const userStore = StoreBuilder.fromValue({ name: 'wim', age: 25 })
    .withPropertyActions('name', 'age')
    .buildStore()
```

## The provider component

The `Provider` component adds a `Store` to the `React` context. You have to render a `Provider` for a `Store` above the components in which you want to use the hooks of that store. Multiple stores can be provided by nesting multiple providers, one for each `Store`. Nesting providers for the same `Store` is possible, but not recommended.

```tsx
<Provider store={userStore}>
    <UserForm />
</Provider>
```

## Hooks

A `Store` defines several hooks that be be used to read and update its value from React components.

- `useValue` returns the current value of the `Store`
- `useSelector` returns the current result of a mapping of the current value of the `Store`
- `useDispatch` returns the dispatch function to which actions can be dispatched
- `useStore` returns a tupple of the current value of the `Store` and the dispatch function
- `useUpdater` returns a function with which the value of the `Store` can directly be updated

```tsx
const UserName = () => {
    const name = userStore.useSelector(user => user.name)
    return (<span>{name}</span>)
}
```

```tsx
const UserForm = () => {
    const [ user, dispatch ] = userStore.useStore()

    return (
        <form>
            <input 
                value={user.name}
                onChange={e => dispatch('name', e.currentTarget.value)}
            />
            <input 
                value={user.age}
                type="number"
                onChange={e => dispatch('age', e.currentTarget.valueAsNumber)}
            />
        </form>
    )
}
```

