import {connect} from "../redux";

const userSelector=state=>{
    return {user:state.user}
}

const userDispatcher=dispatch=>{
    return {
        updateUser:(attrs)=>dispatch({actionType:'updateUser',payload:attrs})
    }
}

export const connectToUser=connect(userSelector,userDispatcher)