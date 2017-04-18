import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { Router, Scene, ActionConst } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';

import KeepAwake from 'react-native-keep-awake';
import EStyleSheet from 'react-native-extended-stylesheet';

import { ActionCreators } from '../actions';

import Dashboard from './Dashboard';

const {
    View
} = ReactNative;

class AppContainer extends Component {
    constructor(props: any, context: any) {
        super(props, context);

        EStyleSheet.build({});
    }

    componentDidMount() {
        KeepAwake.activate();

        this.props.initSocket();

        // if (! __DEV__) {
        //     this.props.checkWifiConnection();
        // }
	}

    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="dashboard" component={Dashboard} type={ActionConst.REPLACE} initial={true} hideNavBar={true} />
                </Scene>
            </Router>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(() => { return {}; }, mapDispatchToProps)(AppContainer);
