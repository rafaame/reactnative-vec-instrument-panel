import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ActionCreators } from '../actions';
import colors from '../colors';

import EStyleSheet from 'react-native-extended-stylesheet';

const {
    View,
    Image,
    Text
} = ReactNative;
import { SmoothLine } from 'react-native-pathjs-charts'

class LineChart extends Component {
    constructor(props: any, context: any) {
        super(props, context);

        this.data = [[{x: 0, y: 0}]];
    }

    componentWillReceiveProps(nextProps) {
        this.data[0].splice(0, (nextProps.maxPoints ? Math.max(this.data[0].length - nextProps.maxPoints, 0) : 0));
        this.data[0].push({x: nextProps.x, y: nextProps.y});
    }

    render() {
        let options = {
            width: this.props.width,
            height: this.props.height,
            color: colors[this.props.color].default,

            margin: {
                top: 15,
                left: 30,
                bottom: 20,
                right: 0
            },
            
            animate: {
                type: 'delayed',
                duration: 200
            },
            
            axisX: {
                showAxis: true,
                showLines: false,
                showLabels: false,
                showTicks: false,
                zeroAxis: false,
                orient: 'bottom',
                color: colors[this.props.color].default,
                label: {
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fontWeight: true,
                    fill: colors[this.props.color].default
                }
            },

            axisY: {
                showAxis: true,
                showLines: false,
                showLabels: true,
                showTicks: false,
                zeroAxis: false,
                orient: 'left',
                color: colors[this.props.color].default,
                label: {
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fontWeight: true,
                    fill: colors[this.props.color].default
                }
            }
        };

        return (
            <View style={styles.container}>
                <SmoothLine data={this.data} options={options} xKey="x" yKey="y" />
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    container: {
        
    },

    chart: {
        
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect((data) => {
    return {
        
    };
}, mapDispatchToProps)(LineChart);
