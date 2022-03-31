import React from "react";

export type ActionsBase<Value> = { [s in string]: (old: Value, payload : never) => Value }

export class Store<Value, Actions extends ActionsBase<Value>> {
    private listeners: Array<() => void> = []

    public readonly context: React.Context<[Value, (updater: (value:Value) => Value) => void]>

    constructor(private value: Value, private actions: Actions) {
        this.context = React.createContext([value, this.update])
    }

    public subscribe(listener: () => void): () => void {
        this.listeners.push(listener)
        return () => this.listeners = this.listeners.filter(l => l != listener)
    }

    public getValue(): Value {
        return this.value
    }

    public useValue(): Value {
        const [ value ] = React.useContext(this.context)
        return value
    }

    public useSelector<T>(selector: (value: Value) => T): T {
        const [ value ] = React.useContext(this.context)
        return selector(value)
    }

    public useUpdater(): (updater: (value:Value) => Value) => void {
        return u => this.update(u)
    }

    public useDispatch(): typeof this.dispatch {
        return (n, p) => this.dispatch(n, p)
    }

    public useStore(): [Value, typeof this.dispatch] {
        const [ value, _ ] = React.useContext(this.context)
        return [ value, (n, p) => this.dispatch(n, p) ]
    }

    public update(updater: (value:Value) => Value): void {
        this.value = updater(this.value)
        this.listeners.forEach(l => l())
    }

    // expand type definition to allow for no-payload actions without having to pass 'undefined'
    private dispatch<Name extends keyof Actions, Payload extends Parameters<Actions[Name]>[1]>(name: Name, payload: Payload): void { 
        this.update(value => this.actions[name](value, payload))
    }
}