import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';
import LockManager from 'react-native-lock-manager';
const Orientation = require('react-native-orientation');

import { ActionCreators } from '../actions';
import Gauge from '../components/Gauge';
import Icon from '../components/Icon';

const {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar
} = ReactNative;

class Dashboard extends Component {
    static TIMEOUT = 5000;

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            rpm: 0,
            speed: 0,
            dataJson: '',

            receiveTimeHistory: [],
            speedHistory: []
        };
    }

    componentDidMount() {
        setInterval(() => {
            LockManager.unlock();

            if (__DEV__) {
              Orientation.lockToLandscapeLeft();
            } else {
              Orientation.lockToLandscapeRight();
            }

            this.forceUpdate();
        }, 1000);
    }

    isConnected() {
        return this.props.receiveTime && ((new Date()).getTime() - this.props.receiveTime) < Dashboard.TIMEOUT;
    }

    render() {
        if (! this.props.isDriverPresent || ! this.isConnected()) {
            return (
                <View style={styles.sleep}>
                    <StatusBar hidden />
                </View>
            )
        }

        return (
            <View style={styles.dashboard}>
                <StatusBar hidden />
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Icon icon='network-wifi' type='info' active={true} font="material-icons" subscript={this.props.ping + 'ms'} />
                        <Icon icon='icon_high_beam' type='info' active={this.props.isHeadlampOn} />
                        <Icon icon='icon_turn_signals' type='success' active={this.props.isTurnLeftOn || this.props.isTurnRightOn} />
                        <Icon icon='icon_doors' type='warning' active={this.props.hasOpenDoor} />
                    </View>
                        
                    <View style={styles.headerRight}>
                        <Icon icon='icon_oil' type='danger' active={this.props.hasOilPressure} />
                        <Icon icon='icon_battery' type='danger' active={this.props.hasOilPressure} />
                        <Icon icon='icon_brakes_warning' type='danger' active={this.props.isParkingBrakeOn} />
                    </View>
                </View>
                <View style={styles.panel}>
                    <View style={styles.panelLeft}>
                        <Text style={styles.textWhite}>{this.props.dataJson}</Text>
                    </View>

                    <View style={styles.panelCenter}>
                        <View style={styles.panelCenterTop}></View>
                        
                        <View style={styles.gaugeContainer}>
                            <Gauge speed={this.props.speed} />
                        </View>
                        
                        <View style={styles.panelCenterBottom}></View>
                    </View>

                    <View style={styles.panelRight}>
                    </View>
                </View>
                <View style={styles.footer} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
  dashboard: {
    flex: 1,
    flexDirection: 'column',

    backgroundColor: '#303030'
  },

  sleep: {
    flex: 1,

    backgroundColor: 'black'
  },

  header: {
    flex: 0.2,
    flexDirection: 'row',

    backgroundColor: '#212121'
  },

  headerLeft: {
    flex: 0.5,
    flexDirection: 'row'
  },

  headerRight: {
    flex: 0.5,
    flexDirection: 'row'
  },

  footer: {
    flex: 0.2,
    flexDirection: 'row',

    backgroundColor: '#212121'
  },

  panel: {
      flexGrow: 1,

      flexDirection: 'row'
  },

  panelLeft: {
    flex: 25
  },

  panelCenter: {
    flex: 50,
    flexDirection: 'column',
    alignItems: 'stretch'
  },

  panelCenterTop: {
    flex: 15,
    flexDirection: 'row'
  },

  gaugeContainer: {
    flex: 70,
    flexDirection: 'column',
    alignItems: 'stretch'
  },

  panelCenterBottom: {
    flex: 15,
    flexDirection: 'row'
  },

  panelRight: {
    flex: 25
  },

  textWhite: {
    color: 'white'
  },

  textDark: {
    color: 'white',

    opacity: 0.7
  },

  textDarker: {
    color: 'white',

    opacity: 0.5
  }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

reactMixin(Dashboard.prototype, TimerMixin);

export default connect((data) => {
    return {
        dataJson: data.receiveData.dataJson,
        engineRpm: data.receiveData.engineRpm,
        speed: data.receiveData.speed,

        isDriverPresent: data.receiveData.isDriverPresent,
        isTurnLeftOn: data.receiveData.isTurnLeftOn,
        isTurnRightOn: data.receiveData.isTurnRightOn,
        isHeadlampOn: data.receiveData.isHeadlampOn,
        hasOpenDoor: data.receiveData.hasOpenDoor,
        hasOilPressure: data.receiveData.hasOilPressure,
        isParkingBrakeOn: data.receiveData.isParkingBrakeOn,
        isKeyOnFirstPos: data.receiveData.isKeyOnFirstPos,
        isKeyAfterFirstPos: data.receiveData.isKeyAfterFirstPos,

        receiveTime: data.receiveData.receiveTime,
        ping: ((data.receiveData.receiveTimeHistory && data.receiveData.receiveTimeHistory.length > 2) ? (data.receiveData.receiveTimeHistory[0] - data.receiveData.receiveTimeHistory[1]) : 0)
    };
}, mapDispatchToProps)(Dashboard);
