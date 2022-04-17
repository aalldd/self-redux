// 请从课程简介里下载本代码
import React from 'react'
import {createStore, connect, Provider} from './redux.jsx'
import {connectToUser} from './connectors/connectToUser'

const initState = {
    user: {name: 'frank', age: 18},
    group: {name: '前端组'}
}

const reducer = (state, {actionType, payload}) => {
    if (actionType === 'updateUser') {
        return {
            ...state,
            user: {
                ...state.user,
                ...payload
            }
        }
    } else {
        return state
    }
}

const store = createStore(reducer, initState)

export const App = () => {
    return (
        <Provider store={store}>
            <大儿子/>
            <二儿子/>
            <幺儿子/>
        </Provider>
    )
}

const 大儿子 = () => {
    console.log('大儿子执行了')
    return <section>大儿子<User/></section>
}
const 二儿子 = () => {
    console.log('二儿子执行了')
    return <section>二儿子<UserModifier/></section>
}
const 幺儿子 = () => {
    console.log('幺儿子执行了')
    return <section>幺儿子 <Group></Group></section>
}

const User = connectToUser(
    ({user}) => {
        return <div>User:{user.name}</div>
    }
)

const ajax = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({data: {name: '3s后的frank'}})
        }, 3000)
    })
}

const fetchUser = (dispatch) => {
    ajax('/getName').then(response => {
        dispatch({actionType: 'updateUser', payload: response.data})
    })
}

const UserModifier = connect(null, null)(({state, dispatch}) => {
    const onClick = () => {
        dispatch(fetchUser)
    }
    return <div>
        <div>User:{state.user.name}</div>
        <button onClick={onClick}>异步获取userName</button>
        {/*<input value={user.name}*/}
        {/*       onChange={onChange}/>*/}
    </div>
})

const Group = connect()(({dispatch, state, children}) => {
    return <div>{state.group.name}</div>
})



