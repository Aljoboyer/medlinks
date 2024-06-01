
import { applyMiddleware, combineReducers, configureStore, createImmutableStateInvariantMiddleware, createSerializableStateInvariantMiddleware } from '@reduxjs/toolkit'
import CompleteProfileTabSlice from '../Redux_Slices/CompleteProfileTabSlice'
import DropDownDataSlice from '../Redux_Slices/DropDownDataSlice'
import GlobalSettingSlice from '../Redux_Slices/GlobalSettingSlice'
import ProfileSlice from '../Redux_Slices/ProfileSlice'
import logger from 'redux-logger'
import {persistReducer, persistStore,   FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'
import thunk from 'redux-thunk'
import  JobSlice  from '../Redux_Slices/JobSlice'

const serializableStateInvariant = new createSerializableStateInvariantMiddleware()
const immutableStateInvariant = new createImmutableStateInvariantMiddleware()

const persistConfig={
  key: 'persist-store', 
  storage: AsyncStorage,
  blacklist: ['profiletabstore', 'profilestore', 'dropDownDataStore']
}


const rootReducer = combineReducers({ 
  profiletabstore : CompleteProfileTabSlice,
  profilestore : ProfileSlice,
  dropDownDataStore : DropDownDataSlice,
  globalSettingStore : GlobalSettingSlice,
  JobSliceStore: JobSlice
})

const PersistReducer = persistReducer(persistConfig, rootReducer)
const middlewares = [thunk, immutableStateInvariant, serializableStateInvariant]
export const store = configureStore({
    reducer: PersistReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
      
},applyMiddleware(...middlewares))

export const persistor = persistStore(store);