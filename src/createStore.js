import { compose, applyMiddleware, createStore } from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist'
import { AsyncStorage } from 'react-native';
import reducer from './redux/reducer';

const store = createStore(
    reducer,
    undefined,
);

persistStore(store, { storage: AsyncStorage });

export default store;