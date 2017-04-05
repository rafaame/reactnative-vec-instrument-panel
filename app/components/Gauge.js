import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TimerMixin from 'react-timer-mixin';
import reactMixin from 'react-mixin';

import { ActionCreators } from '../actions';
import colors from '../colors';

import * as Progress from 'react-native-progress';
import EStyleSheet from 'react-native-extended-stylesheet';

const {
    StyleSheet,
    View,
    Text,
    Dimensions,
    PixelRatio
} = ReactNative;

class Gauge extends Component {
    static MAX_RPM = 8000;
    static MAX_SPEED = 180;
    static MAX_PROGRESS = 0.415;

    constructor(props: any, context: any) {
        super(props, context);

        this.interpolation = null;
        this.interpolatedEngineRpm = 0;
        this.interpolatedSpeed = 0;
        this.engineRpmProgress = 0;
        this.speedProgress = 0;
    }

    componentWillReceiveProps(nextProps) {
        if (this.interpolation) {
            this.clearInterval(this.interpolation);
        }

        let interpolatedEngineRpm = nextProps.engineRpm;
        let interpolatedSpeed = nextProps.speed;

        if (nextProps.receiveTimeHistory.length >= 2) {
            this.interpolatedEngineRpm = nextProps.engineRpmHistory[1];
            this.interpolatedSpeed = nextProps.speedHistory[1];

            let lastTimeUpdated = (new Date()).getTime();
            let engineRpmDerivative = (nextProps.engineRpm - nextProps.engineRpmHistory[1]) / (nextProps.receiveTime - nextProps.receiveTimeHistory[1]);
            let speedDerivative = (nextProps.speed - nextProps.speedHistory[1]) / (nextProps.receiveTime - nextProps.receiveTimeHistory[1]);
            
            let interpolationFunc = () => {
                let delay = (new Date()).getTime() - lastTimeUpdated;
                lastTimeUpdated += delay;

                this.interpolatedEngineRpm += engineRpmDerivative * delay;
                this.interpolatedSpeed += speedDerivative * delay;

                this.engineRpmProgress = Math.min(Gauge.MAX_PROGRESS, Gauge.MAX_PROGRESS * (this.interpolatedEngineRpm / Gauge.MAX_RPM));
                this.speedProgress = Math.min(Gauge.MAX_PROGRESS, Gauge.MAX_PROGRESS * (this.interpolatedSpeed / Gauge.MAX_SPEED));

                this.forceUpdate();
            };

            this.interpolation = this.setInterval(interpolationFunc, 10);
            interpolationFunc();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.innerWrapper}>
                    <Text style={styles.speedText}>
                        {Math.ceil(this.interpolatedSpeed)}
                    </Text>
                    <Text style={styles.speedTextUnit}>
                        km/h
                    </Text>

                    <Text style={styles.fuelLevel}>
                        
                    </Text>

                    <Text style={styles.engineRpmText}>
                        {(this.interpolatedEngineRpm / 1000).toFixed(1)}
                    </Text>
                    <Text style={styles.engineRpmTextUnit}>
                        x1000 rpm
                    </Text>

                    <Text style={[styles.scaleText, styles.scaleSpeed20Text]}>20</Text>
                    <View style={[styles.scaleIndicator, styles.scaleSpeed20Indicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleSpeed40Text]}>40</Text>
                    <View style={[styles.scaleIndicator, styles.scaleSpeed40Indicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleSpeed60Text]}>60</Text>
                    <View style={[styles.scaleIndicator, styles.scaleSpeed60Indicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleSpeed80Text]}>80</Text>
                    <View style={[styles.scaleIndicator, styles.scaleSpeed80Indicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleSpeed100Text]}>100</Text>
                    <View style={[styles.scaleIndicator, styles.scaleSpeed100Indicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleSpeed120Text]}>120</Text>
                    <View style={[styles.scaleIndicator, styles.scaleSpeed120Indicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleSpeed140Text]}>140</Text>
                    <View style={[styles.scaleIndicator, styles.scaleSpeed140Indicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleSpeed160Text]}>160</Text>
                    <View style={[styles.scaleIndicator, styles.scaleSpeed160Indicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleEngineRpm1kText]}>1</Text>
                    <View style={[styles.scaleIndicator, styles.scaleEngineRpm1kIndicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleEngineRpm2kText]}>2</Text>
                    <View style={[styles.scaleIndicator, styles.scaleEngineRpm2kIndicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleEngineRpm3kText]}>3</Text>
                    <View style={[styles.scaleIndicator, styles.scaleEngineRpm3kIndicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleEngineRpm4kText]}>4</Text>
                    <View style={[styles.scaleIndicator, styles.scaleEngineRpm4kIndicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleEngineRpm5kText]}>5</Text>
                    <View style={[styles.scaleIndicator, styles.scaleEngineRpm5kIndicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleEngineRpm6kText]}>6</Text>
                    <View style={[styles.scaleIndicator, styles.scaleEngineRpm6kIndicator]}></View>

                    <Text style={[styles.scaleText, styles.scaleEngineRpm7kText]}>7</Text>
                    <View style={[styles.scaleIndicator, styles.scaleEngineRpm7kIndicator]}></View>
                </View>

                <Progress.Circle
                    progress={this.engineRpmProgress}
                    direction={'counter-clockwise'}
                    size={440}
                    thickness={20}
                    borderWidth={0}
                    style={styles.engineRpmProgress}
                    color={colors.primary.default} />

                <Progress.Circle
                    progress={this.speedProgress}
                    size={440}
                    thickness={20}
                    borderWidth={0}
                    style={styles.speedProgress}
                    color={colors.info.default} />
            </View>
        )
    }
}

const scaleRadius = 178;
const scaleOrigin = {x: 135, y: 86};

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },

    innerWrapper: {
        flex: 1,
        aspectRatio: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: colors.grey.default,

        borderWidth: 80,
        borderRadius: 480,
        borderStyle: 'solid',
        borderColor: colors.grey.dark
    },

    engineRpmProgress: {
        position: 'absolute',
        top: 3,
        left: 100,

        transform: [
            {rotate: '-210deg'}
        ]
    },

    speedProgress: {
        position: 'absolute',
        top: 3,
        left: 100,

        transform: [
            {rotate: '210deg'}
        ]
    },

    engineRpmText: {
        color: colors.text.light,

        fontSize: 36
    },

    engineRpmTextUnit: {
        color: colors.text.light,

        fontSize: 16
    },

    speedText: {
        color: colors.text.light,

        fontSize: 48
    },

    speedTextUnit: {
        color: colors.text.light,

        fontSize: 18
    },

    fuelLevel: {
        height: 40,

        color: colors.text.light,

        fontSize: 48
    },

    scaleText: {
        position: 'absolute',

        width: 30,
        height: 20,

        fontSize: 18,
        color: colors.text.light
    },

    scaleIndicator: {
        position: 'absolute',

        width: 20,
        height: 3,

        backgroundColor: colors.text.light
    },

    scaleSpeed20Text: {transform: [{translateX: scaleOrigin.x - scaleRadius * Math.cos(-40.5 * Math.PI / 180)}, {translateY: scaleOrigin.y - scaleRadius * Math.sin(-40.5 * Math.PI / 180)}]},
    scaleSpeed20Indicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 28) * Math.cos(-40.5 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 12) - (scaleRadius + 28) * Math.sin(-40.5 * Math.PI / 180)}, {rotate: '-40deg'}]},

    scaleSpeed40Text: {transform: [{translateX: scaleOrigin.x - scaleRadius * Math.cos(-24.25 * Math.PI / 180)}, {translateY: scaleOrigin.y - scaleRadius * Math.sin(-24.25 * Math.PI / 180)}]},
    scaleSpeed40Indicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 28) * Math.cos(-24.25 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 12) - (scaleRadius + 28) * Math.sin(-24.25 * Math.PI / 180)}, {rotate: '-28deg'}]},

    scaleSpeed60Text: {transform: [{translateX: scaleOrigin.x - scaleRadius * Math.cos(-8 * Math.PI / 180)}, {translateY: scaleOrigin.y - scaleRadius * Math.sin(-8 * Math.PI / 180)}]},
    scaleSpeed60Indicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 28) * Math.cos(-8 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 12) - (scaleRadius + 28) * Math.sin(-8 * Math.PI / 180)}, {rotate: '-11deg'}]},

    scaleSpeed80Text: {transform: [{translateX: scaleOrigin.x - scaleRadius * Math.cos(8.25 * Math.PI / 180)}, {translateY: scaleOrigin.y - scaleRadius * Math.sin(8.25 * Math.PI / 180)}]},
    scaleSpeed80Indicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 28) * Math.cos(8.25 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 12) - (scaleRadius + 28) * Math.sin(8.25 * Math.PI / 180)}, {rotate: '7deg'}]},

    scaleSpeed100Text: {transform: [{translateX: scaleOrigin.x - scaleRadius * Math.cos(24.5 * Math.PI / 180)}, {translateY: scaleOrigin.y - scaleRadius * Math.sin(24.5 * Math.PI / 180)}]},
    scaleSpeed100Indicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 28) * Math.cos(24.5 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 12) - (scaleRadius + 28) * Math.sin(24.5 * Math.PI / 180)}, {rotate: '22deg'}]},

    scaleSpeed120Text: {transform: [{translateX: scaleOrigin.x - scaleRadius * Math.cos(40.75 * Math.PI / 180)}, {translateY: scaleOrigin.y - scaleRadius * Math.sin(40.75 * Math.PI / 180)}]},
    scaleSpeed120Indicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 28) * Math.cos(40.75 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 12) - (scaleRadius + 28) * Math.sin(40.75 * Math.PI / 180)}, {rotate: '40deg'}]},

    scaleSpeed140Text: {transform: [{translateX: scaleOrigin.x - scaleRadius * Math.cos(57 * Math.PI / 180)}, {translateY: scaleOrigin.y - scaleRadius * Math.sin(57 * Math.PI / 180)}]},
    scaleSpeed140Indicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 28) * Math.cos(57 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 12) - (scaleRadius + 28) * Math.sin(57 * Math.PI / 180)}, {rotate: '59deg'}]},

    scaleSpeed160Text: {transform: [{translateX: scaleOrigin.x - scaleRadius * Math.cos(73.25 * Math.PI / 180)}, {translateY: scaleOrigin.y - scaleRadius * Math.sin(73.25 * Math.PI / 180)}]},
    scaleSpeed160Indicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 28) * Math.cos(73.25 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 12) - (scaleRadius + 28) * Math.sin(73.25 * Math.PI / 180)}, {rotate: '75deg'}]},

    scaleEngineRpm1kText: {transform: [{translateX: scaleOrigin.x - (scaleRadius + 4) * Math.cos(221 * Math.PI / 180)}, {translateY: scaleOrigin.y - (scaleRadius + 5) * Math.sin(221 * Math.PI / 180)}]},
    scaleEngineRpm1kIndicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 30) * Math.cos(221 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 11) - (scaleRadius + 30) * Math.sin(221 * Math.PI / 180)}, {rotate: '40deg'}]},

    scaleEngineRpm2kText: {transform: [{translateX: scaleOrigin.x - (scaleRadius + 4) * Math.cos(202 * Math.PI / 180)}, {translateY: scaleOrigin.y - (scaleRadius + 5) * Math.sin(202 * Math.PI / 180)}]},
    scaleEngineRpm2kIndicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 30) * Math.cos(202 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 11) - (scaleRadius + 30) * Math.sin(202 * Math.PI / 180)}, {rotate: '24deg'}]},

    scaleEngineRpm3kText: {transform: [{translateX: scaleOrigin.x - (scaleRadius + 4) * Math.cos(183 * Math.PI / 180)}, {translateY: scaleOrigin.y - (scaleRadius + 5) * Math.sin(183 * Math.PI / 180)}]},
    scaleEngineRpm3kIndicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 30) * Math.cos(183 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 11) - (scaleRadius + 30) * Math.sin(183 * Math.PI / 180)}, {rotate: '4.5deg'}]},

    scaleEngineRpm4kText: {transform: [{translateX: scaleOrigin.x - (scaleRadius + 4) * Math.cos(164 * Math.PI / 180)}, {translateY: scaleOrigin.y - (scaleRadius + 5) * Math.sin(164 * Math.PI / 180)}]},
    scaleEngineRpm4kIndicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 30) * Math.cos(164 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 11) - (scaleRadius + 30) * Math.sin(164 * Math.PI / 180)}, {rotate: '-16deg'}]},

    scaleEngineRpm5kText: {transform: [{translateX: scaleOrigin.x - (scaleRadius + 4) * Math.cos(145 * Math.PI / 180)}, {translateY: scaleOrigin.y - (scaleRadius + 5) * Math.sin(145 * Math.PI / 180)}]},
    scaleEngineRpm5kIndicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 30) * Math.cos(145 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 11) - (scaleRadius + 30) * Math.sin(145 * Math.PI / 180)}, {rotate: '-31deg'}]},

    scaleEngineRpm6kText: {transform: [{translateX: scaleOrigin.x - (scaleRadius + 4) * Math.cos(126 * Math.PI / 180)}, {translateY: scaleOrigin.y - (scaleRadius + 5) * Math.sin(126 * Math.PI / 180)}]},
    scaleEngineRpm6kIndicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 30) * Math.cos(126 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 11) - (scaleRadius + 30) * Math.sin(126 * Math.PI / 180)}, {rotate: '-52deg'}]},

    scaleEngineRpm7kText: {transform: [{translateX: scaleOrigin.x - (scaleRadius + 4) * Math.cos(107 * Math.PI / 180)}, {translateY: scaleOrigin.y - (scaleRadius + 5) * Math.sin(107 * Math.PI / 180)}]},
    scaleEngineRpm7kIndicator: {transform: [{translateX: (scaleOrigin.x - 2) - (scaleRadius + 30) * Math.cos(107 * Math.PI / 180)}, {translateY: (scaleOrigin.y + 11) - (scaleRadius + 30) * Math.sin(107 * Math.PI / 180)}, {rotate: '-71deg'}]}
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

reactMixin(Gauge.prototype, TimerMixin);

export default connect((data) => {
    return {
        engineRpm: data.receiveData.engineRpm,
        speed: data.receiveData.speed,
        receiveTime: data.receiveData.receiveTime,
        
        engineRpmHistory: data.receiveData.engineRpmHistory,
        speedHistory: data.receiveData.speedHistory,
        receiveTimeHistory: data.receiveData.receiveTimeHistory
    };
}, mapDispatchToProps)(Gauge);
