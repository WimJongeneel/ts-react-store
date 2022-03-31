import * as React from "react"; 

import { Store } from './store'

export interface ProviderProps<T> {
    store: Store<T, any>
}

export class Provider<T> extends React.Component<ProviderProps<T>, {}> {

    private store: Store<T, any > = this.props.store

    private unSubscribe: () => void = () => null

    componentDidMount(): void {
        this.unSubscribe = this.store.subscribe(this.notifyStore)
    }

    notifyStore = () => this.forceUpdate()

    componentWillUnmount(): void {
        this.unSubscribe()
    }

    updateValue = (updater: (value:T) => T) => this.store.update(updater)

    render(): React.ReactNode {
        return (
            <this.store.context.Provider value={[this.store.getValue(), this.updateValue]}>
                {this.props.children}
            </this.store.context.Provider>
        )
    }
}