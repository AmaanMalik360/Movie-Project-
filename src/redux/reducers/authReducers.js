
const initState = {
    token: null,
    user: {},
    authenticate: false,
    authenticating: false,
    error: null
};

export default (state = initState,  action) =>
{
    switch(action.type)
    { 
        case 'LOGIN_REQUEST':
            state = {
                ...state,
                authenticating: true
            }
        break;

        case 'LOGIN_SUCCESS':
            state = {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                authenticate: true,
                authenticating: false
            }
        break;
        case 'LOGIN_FAILURE':
            state = {
                ...state,
                authenticating: false,
                error: action.payload.error
            }
        break;    

        case 'LOGOUT_REQUEST':
        state = {
            ...initState,
            authenticate: false,
            token: null
        }
        break;
        
        case 'LOGOUT_SUCCESS':
        state = {
            ...initState,
            token: null,
            user: {}
        }
        break;

    }

    return state;
}