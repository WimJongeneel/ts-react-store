import { ActionsBase, Store } from "./store"

export class StoreBuilder<Value = unknown, Actions extends ActionsBase<Value> = {}> {

    private constructor(
        private value: Value,
        private actions: Actions = {} as any
    ){}

    public static create<T>(): StoreBuilder<T> {
        return new StoreBuilder<T>(undefined)
    }

    public static fromValue<T>(value: T): StoreBuilder<T> {
        return new StoreBuilder<T>(value)
    }

    public withAction<Name extends string, Action extends (old: Value, payload : never) => Value>(name: Name, action: Action): StoreBuilder<Value, Actions & { [n in Name]: Action }> {
        return new StoreBuilder<Value, Actions & { [n in Name]: Action }>(this.value, { ... this.actions, [name]: action })
    }

    public withActions<NewActions extends ActionsBase<Value>>(actions: NewActions): StoreBuilder<Value, Actions & NewActions> {
        return new StoreBuilder<Value, Actions & NewActions>(this.value, { ... this.actions, ... actions })
    }

    public withPropertyActions<Props extends keyof Value>(...props: Props[]) {
        return new StoreBuilder<Value, Actions & { [ p in Props] : (v: Value, p: Value[p]) => Value }>(this.value, {
            ... this.actions,
            ... props
                .map<[keyof Value, (v: Value, p: any) => Value]>(k => [k, (v, p) => ({ ... v, [k] : p })])
                .reduce((r, c) => ({ ... r, [c[0]] : c[1] }), { }) as { [ p in Props] : (v: Value, p: Value[p]) => Value }
        })
    }

    public withDefault(value: Value): StoreBuilder<Value, Actions> {
        return new StoreBuilder<Value, Actions>(value, this.actions)
    }

    public buildStore(): Store<Value, Actions> {
        return new Store(this.value, this.actions)
    }
}