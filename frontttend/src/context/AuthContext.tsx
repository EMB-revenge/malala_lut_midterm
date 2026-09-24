import { createContext, useReducer, type Dispatch, type ReactNode } from "react";


interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
};

type AuthAction = { type: "LOGIN"; payload: string } | { type: "LOGOUT" };

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token')
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem('token', action.payload); // stores the token localStorage
            return { ...state, token: action.payload, isAuthenticated: true}; // changes the state in the reducer
        case "LOGOUT":
            localStorage.removeItem('token');
            return { ...state, token: null, isAuthenticated: false };
        default: 
        return state;
    }
};

export const AuthContext = createContext<{ state: AuthState; dispatch: Dispatch<AuthAction> } | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};