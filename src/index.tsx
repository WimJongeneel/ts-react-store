import * as React from "react"; 
import * as ReactDOM from "react-dom";
import { Provider, StoreBuilder } from "../lib";

interface User {
    name: string
    age: number
}

const userStore = StoreBuilder.fromValue({ name: 'wim', age: 25 })
    .withAction('setName', (user: User, name: string) => ({ ...user, name }))
    .withActions({
        '++': (user: User) => ({ ...user, age: user.age + 1 }),
        '--': (user: User) => ({ ...user, age: user.age - 1 })
    })
    .withPropertyActions('name', 'age')
    .buildStore()

const EditForm = () => {

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

const View = () => {

    const user = userStore.useValue()

    return (
        <div>
            <h3>{user.name} {user.age}</h3>
        </div>
    )
}

const App = () => {
    return (
        <>
            <Provider store={userStore}>
                <EditForm />
                <View />
            </Provider>
        
            <Provider store={userStore}>
                <View />
            </Provider>
        </>
    )
}


ReactDOM.render(
    <App />,
    document.getElementById("example")
);