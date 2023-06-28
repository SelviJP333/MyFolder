import {createStore, combineReducers} from 'redux';
import Reducer from './reducers/Reducer';
import Temp_Reducer from './reducers/Temp_Reducer';
import Date_pending from './reducers/Date_pending';
import Copy_data from './reducers/Copy_data';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SyncReducer from './reducers/SyncReducer';
import menu_save_time_reducer from './reducers/menu_save_time_reducer';
import Approve_Hold from './reducers/Approve_Hold';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // whitelist: [`Temp_Reducer`]
};

const rootReducer = combineReducers({
  count: Reducer,
  Temp_Reducer: Temp_Reducer,
  Date_pending: Date_pending,
  Copy_data: Copy_data,
  SyncReducer:SyncReducer,
  menu_save_time_reducer:menu_save_time_reducer,
  Approve_Hold:Approve_Hold
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

// export const store = createStore(rootReducer);
