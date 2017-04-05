import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ActionCreators } from '../actions';

import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const {
    View,
    Image,
    Text
} = ReactNative;

const colors = {
    success: '#64DD17',
    info: '#2196F3',
    warning: '#FFC107',
    danger: '#F44336'
};

class Icon extends Component {
    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        if (! this.props.active) {
            return (<View style={styles.container} />)
        }

        switch (this.props.font) {
            case 'material-icons':
                return (
                    <View style={styles.container}>
                        <MaterialIcon name={this.props.icon} size={32} color={colors[this.props.type]} style={styles.image} />
                        <Text style={styles.subscript}>{this.props.subscript}</Text>
                    </View>
                )
                break;

            default:
                return (
                    <View style={styles.container}>
                        <Image
                          style={[styles.image, {tintColor: colors[this.props.type]}]}
                          source={{ uri: this.props.icon }}
                        />
                    </View>
                )
        }
    }
}

const styles = EStyleSheet.create({
    container: {
        width: 48,
        height: 48,

        marginLeft: 8,
        marginRight: 8
    },

    image: {
        width: 32,
        height: 32,

        alignSelf: 'center'
    },

    subscript: {
        alignSelf: 'center',

        marginRight: 2,

        color: 'white'
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect((data) => {
    return {
        
    };
}, mapDispatchToProps)(Icon);
