import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { 
  persistReducer, 
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, 
} from "redux-persist"
import storage from "redux-persist/lib/storage" 
import authReducer from "../feature/auth/authslice"
import employeeSessionReducer from "../feature/sessionSlice/employeeSessionSlice"


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "employeeSession"],
}

// 2. Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
  employeeSession: employeeSessionReducer,
})

// 3. Create Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
  
  // @ts-ignore
  store.__persistor = persistStore(store);
  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]