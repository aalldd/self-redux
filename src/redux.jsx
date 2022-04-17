import React, {useContext, useEffect, useState} from "react";

let state = undefined
let reducer = undefined
let eventList = []
const setState = (newData) => {
    state = newData
    eventList.forEach((fn) => fn(newData))
}


const appContext = React.createContext(null)

//我们自己封装一个Provider出去
export const Provider = ({store, children}) => {
    return (
        <appContext.Provider value={store}>
            {children}
        </appContext.Provider>
    )
}

export const createStore = (_reducer, initState) => {
    state = initState
    reducer = _reducer
    return store
}

const store = {
    getState() {
        return state
    },
    getReducer() {
        return reducer
    },
    dispatch(action) {
        setState(reducer(state, action))
    },
    //发布事件
    subscribe(fn) {
        eventList.push(fn)
        return () => {
            const index = eventList.indexOf(fn)
            eventList.splice(index, 1)
        }
    }
}

const isChanged = (oldData, newData) => {
    let changed = false
    for (let key in oldData) {
        if (oldData[key] !== newData[key]) {
            changed = true
        }
    }
    return changed
}

const PrevDispatch = store.dispatch

let dispatch = (action) => {
    if (action instanceof Function) {
        action(dispatch)
    } else {
        if (action.payload instanceof Promise) {
            action.payload.then(data => {
                dispatch({...action, payload: data})
            })
        } else {
            PrevDispatch(action)
        }
    }
}

//payload为promise的action


export const connect = (selector, dispatcherSelector) => (Component) => {
    return (props) => {
        const {subscribe} = useContext(appContext)
        const [, setUpdate] = useState({})

        const data = selector ? selector(state) : {state}
        const dispatchers = dispatcherSelector ? dispatcherSelector(dispatch) : {dispatch}
        useEffect(() => subscribe(() => {
            const newData = selector ? selector(state) : {state}
            if (isChanged(data, newData)) {
                setUpdate({})
            }
        }), [selector])


        return <Component {...dispatchers} {...data} {...props}/>
    }
}