import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ActionCreators } from '../actions';
import colors from '../colors';

import { CircularProgress, AnimatedCircularProgress } from 'react-native-circular-progress';
import EStyleSheet from 'react-native-extended-stylesheet';

const {
    StyleSheet,
    View,
    Text,
    Dimensions,
    PixelRatio,
    Animated
} = ReactNative;

import Svg, {
    Defs,
    RadialGradient,
    Stop,
    Circle,
    Rect,
    G,
    ClipPath
} from 'react-native-svg';

class GaugeIndicator extends Component {
    constructor(props: any, context: any) {
        super(props, context);
        const angle = this.calculateAngle(props.progress);
        const pos = this.calculatePos(angle);

        this.angle = new Animated.Value(angle);
        this.x = new Animated.Value(pos.x);
        this.y = new Animated.Value(pos.y);
    }

    calculateAngle(progress) {
        return this.props.startAngle + Math.max(Math.min(this.props.progress * 360 + this.props.minAngle, this.props.maxAngle), this.props.minAngle) * (this.props.direction === 'clockwise' ? 1 : -1);
    }

    calculatePos(angle) {
        return {
            x: this.props.origin.x - this.props.radius * Math.cos(angle * Math.PI / 180),
            y: this.props.origin.y - this.props.radius * Math.sin(angle * Math.PI / 180)
        }
    }

    componentWillReceiveProps(nextProps) {
        const newAngle = this.calculateAngle(nextProps.progress);
        const newPos = this.calculatePos(newAngle);

        this.angle = new Animated.Value(newAngle);
        this.x = new Animated.Value(newPos.x);
        this.y = new Animated.Value(newPos.y);
        /*Animated.spring(this.angle, {
            toValue: newAngle,
            bounciness: 0,
            useNativeDriver: true
        }).start();

        Animated.spring(this.x, {
            toValue: newPos.x,
            bounciness: 0,
            useNativeDriver: true
        }).start();

        Animated.spring(this.y, {
            toValue: newPos.y,
            bounciness: 0,
            useNativeDriver: true
        }).start();*/
    }

    render() {
        const angle = this.angle.interpolate({
          inputRange: [0, 360],
          outputRange: ['0deg', '360deg']
        });

        return (
            <Animated.View style={[{
                position: 'absolute',

                width: 80,
                height: 3,

                backgroundColor: this.props.color,

                transform: [
                    {translateX: this.x},
                    {translateY: this.y},
                    {rotate: angle}
                ],

                zIndex: 5000
            }]}></Animated.View>
        );
    }
}

class Gauge extends Component {
    static MAX_RPM = 8000;
    static MAX_SPEED = 180;
    static MAX_PROGRESS = 0.415;

    static MIN_UPDATE_ENGINE_RPM = 100;
    static MIN_UPDATE_SPEED = 4;

    constructor(props: any, context: any) {
        super(props, context);

        this.props.engineRpm = 0;
        this.props.speed = 0;
        this.props.engineRpmProgress = 0.0;
        this.props.speedProgress = 0.0;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
        
        if (__DEV__) {
            return true;
        }

        if (Math.abs(nextProps.engineRpm - this.props.engineRpm) < Gauge.MIN_UPDATE_ENGINE_RPM) {
            return false;
        }

        if (Math.abs(nextProps.speed - this.props.speed) < Gauge.MIN_UPDATE_SPEED) {
            return false;
        }

        return true;
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.backgroundContainer}>
                    <Svg height="552" width="552">
                        <Defs>
                            <RadialGradient id="gradPrimary" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" fr="0%">
                                <Stop
                                    offset="0.56"
                                    stopColor={colors.grey.light}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="0.575"
                                    stopColor={colors.grey.dark}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="0.60"
                                    stopColor={colors.grey.dark}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="0.87"
                                    stopColor={colors.primary.dark}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="0.88"
                                    stopColor={colors.primary.light}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="0.90"
                                    stopColor={colors.primary.default}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="1"
                                    stopColor={colors.primary.default}
                                    stopOpacity="1"
                                />
                            </RadialGradient>
                            <RadialGradient id="gradInfo" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" fr="0%">
                                <Stop
                                    offset="0.56"
                                    stopColor={colors.grey.light}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="0.575"
                                    stopColor={colors.grey.dark}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="0.60"
                                    stopColor={colors.grey.dark}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="0.87"
                                    stopColor={colors.info.dark}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="0.88"
                                    stopColor={colors.info.light}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="0.90"
                                    stopColor={colors.info.default}
                                    stopOpacity="1"
                                />
                                <Stop
                                    offset="1"
                                    stopColor={colors.info.default}
                                    stopOpacity="1"
                                />
                            </RadialGradient>
                            <ClipPath id="clipPrimary">
                                <Rect x="50%" y="0" width="50%" height="100%" />
                            </ClipPath>
                            <ClipPath id="clipInfo">
                                <Rect x="0" y="0" width="50%" height="100%" />
                            </ClipPath>
                        </Defs>
                        <Circle cx="50%" cy="50%" r="50%" fill="url(#gradPrimary)" clipPath="url(#clipPrimary)">
                        </Circle>
                        <Circle cx="50%" cy="50%" r="50%" fill="url(#gradInfo)" clipPath="url(#clipInfo)">
                        </Circle>
                    </Svg>
                </View>
                <View style={styles.contentWrapper}>
                    <View style={styles.innerWrapper}>
                        <Text style={styles.speedText}>
                            {Math.ceil(this.props.speed)}
                        </Text>
                        <Text style={styles.speedTextUnit}>
                            km/h
                        </Text>

                        <Text style={styles.fuelLevel}>
                            
                        </Text>

                        <Text style={styles.engineRpmText}>
                            {(this.props.engineRpm / 1000).toFixed(1)}
                        </Text>
                        <Text style={styles.engineRpmTextUnit}>
                            x1000 rpm
                        </Text>
                    </View>

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

                    <AnimatedCircularProgress
                        size={553}
                        width={114}
                        rotation={0}
                        prefill={Gauge.MAX_PROGRESS * 100}
                        fill={this.props.engineRpmProgress ? this.props.engineRpmProgress : 0}
                        tintColor={colors.grey.dark}
                        backgroundColor='transparent'
                        endDelimiterColor={colors.primary.light}
                        style={styles.engineRpmProgress} />
                    <AnimatedCircularProgress
                        size={554}
                        width={114}
                        rotation={0}
                        direction='counter-clockwise'
                        prefill={Gauge.MAX_PROGRESS * 100}
                        fill={this.props.speedProgress ? this.props.speedProgress : 0}
                        tintColor={colors.grey.dark}
                        backgroundColor='transparent'
                        endDelimiterColor={colors.info.light}
                        style={styles.speedProgress} />

                    <CircularProgress
                        size={553}
                        width={114}
                        rotation={0}
                        fill={18}
                        tintColor={colors.grey.dark}
                        backgroundColor='transparent'
                        style={styles.dummyProgress} />
                </View>
            </View>
        )
    }
}

const scaleRadius = 230;
const scaleOrigin = {x: 266, y: 264};

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },

    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 42,

        width: 552,
        height: 552,

        zIndex: 1000
    },

    contentWrapper: {
        width: 556,
        height: 556,

        backgroundColor: 'transparent',
        borderRadius: 556 / 2,
        
        zIndex: 2000
    },

    innerWrapper: {
        position: 'absolute',

        width: 302,
        height: 302,

        left: 125,
        top: 125,

        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: colors.grey.default,

        borderRadius: 480
    },

    engineRpmProgress: {
        position: 'absolute',
        top: -1,
        left: 0,

        transform: [
            {rotate: '-0.5deg'}
        ]
    },

    speedProgress: {
        position: 'absolute',
        top: -1,
        left: -1,

        transform: [
            {rotate: '0.5deg'}
        ]
    },

    dummyProgress: {
        position: 'absolute',
        top: 0,
        left: 0,

        transform: [
            {rotate: '148deg'}
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
        color: colors.text.light,

        zIndex: 2000
    },

    scaleIndicator: {
        position: 'absolute',

        width: 20,
        height: 3,

        backgroundColor: colors.text.light,

        zIndex: 2000
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

export default connect((data) => {
    return {
        engineRpm: data.receiveData.engineRpm,
        speed: data.receiveData.speed,
        
        engineRpmProgress: Gauge.MAX_PROGRESS * 100 * (1 - ((data.receiveData.engineRpmHistory.length > 1 ? data.receiveData.engineRpmHistory[0] : data.receiveData.engineRpm)) / Gauge.MAX_RPM),

        speedIndicatorProgress: Math.min(Gauge.MAX_PROGRESS, Gauge.MAX_PROGRESS * (data.receiveData.speed / Gauge.MAX_SPEED)),
        speedProgress: Gauge.MAX_PROGRESS * 100 * (1 - (data.receiveData.speedHistory.length > 1 ? data.receiveData.speedHistory[0] : data.receiveData.speed) / Gauge.MAX_SPEED)
    };
}, mapDispatchToProps)(Gauge);
