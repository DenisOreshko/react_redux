import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import ReudxThunk from 'redux-thunk';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

// const stringMiddleware = (store) => (dispatch) => (action) => {
// const stringMiddleware = ({dispatch, getState}) => (dispatch) => (action) => {
const stringMiddleware = () => (next) => (action) => {
    if(typeof action === 'string'){
        return next({
            type:action
        });
    }
    return next(action);
}

const enhancer = (createStore) => (...args) => {
    const store = createStore(...args);

    const oldDispatch = store.dispatch;
    store.dispatch = (action) => {
        if(typeof action === 'string'){
            return oldDispatch({
                type:action
            });
        }
        return oldDispatch(action);
    }

    return store;
}

const store = createStore(
                combineReducers({heroes, filters}),
                compose(applyMiddleware(ReudxThunk, stringMiddleware),
                        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
                );

export default store;
