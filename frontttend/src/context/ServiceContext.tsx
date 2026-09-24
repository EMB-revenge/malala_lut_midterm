import { createContext, useReducer, type Dispatch, type ReactNode , useContext} from "react";
import type { Microservice } from "../types";
import type { Environment } from "../types";

export interface State {
user: { id: string; email: string; role: string } | null;
token: string | null;
services: Microservice[];
selectedEnvironment: Environment;
loading: boolean;
error: string | null;
}


export type Action =
| { type: 'SET_AUTH'; payload: { user: { id: string; email: string; role: string } ; token: string } }
| { type: 'LOGOUT' }
| { type: 'SET_ENV_FILTER'; payload: Environment }
| { type: 'FETCH_SERVICES_SUCCESS'; payload: Microservice[] }
| { type: 'CREATE_SERVICE_SUCCESS'; payload: Microservice }
| { type: 'UPDATE_SERVICE_SUCCESS'; payload: Microservice }
| { type: 'DELETE_SERVICE_SUCCESS'; payload: string }
| { type: 'SET_ERROR'; payload: string | null };

const initialState: State = {
  user: null,
  token: localStorage.getItem('token'), // stay logged in after a page refresh
  services: [],
  selectedEnvironment: "STAGING",
  loading: false,
  error: null,
};



// assume reducer is the result after
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_AUTH':
            localStorage.setItem('token', action.payload.token);
            return { ...state, user: action.payload.user, token: action.payload.token, error: null };
            
        case "SET_ENV_FILTER":
            return { ...state, selectedEnvironment: action.payload, error: null};
        case "FETCH_SERVICES_SUCCESS":
            return { ...state, services: action.payload, loading: false, error: null };

        case 'CREATE_SERVICE_SUCCESS':
            return { ...state, services: [action.payload, ...state.services], error: null };

        case 'UPDATE_SERVICE_SUCCESS':
            return {
                ...state,
                services: state.services.map((i) => (i.id === action.payload.id ? action.payload : i)),
                error: null,};
        
        case 'DELETE_SERVICE_SUCCESS':
            return {
                ...state,
                services: state.services.filter((i) => i.id !== action.payload), // payload = the id
                error: null,};
        
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'LOGOUT':
            localStorage.removeItem('token');
            return { ...state, user: null, token: null, services: [], error: null };
        default: 
        return state;   
    }
};

    const ServiceContext = createContext<{ state: State; dispatch: Dispatch<Action> } | undefined>(undefined,);

    export const ServiceProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ServiceContext.Provider value={{ state, dispatch }}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error('useServices must be used inside <ServiceProvider>');
  return context;
};  