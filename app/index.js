import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { createStore, applyMiddleware, combineReduxers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducer from './reducers';
import AppContainer from './containers/AppContainer';

function  configureStore(initialState) {
    const enhancer = compose(
        applyMiddleware(
            thunkMiddleware
        )
    );

    return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        );
    }
};

export default App;
