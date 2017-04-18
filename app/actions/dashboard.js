import * as types from './types';
import config from '../config';

const net = require('react-native-tcp');
const wifi = require('react-native-android-wifi');

export function initSocket() {
    return (dispatch, getState) => {
        let client = net.createConnection({
            host: config.serverIpAddr,
            port: config.serverPort,
            timeout: config.tcpTimeout,
            dataReceiverMode: true
        });

        let retrying = false;
        let errorHandler = (error) => {
            if (retrying) {
                return;
            }

            retrying = true;
            setTimeout(() => {
                console.log('Retrying connection with server...');

                dispatch(initSocket());
            }, 1000);
        };

        client.on('connect', function () {
            client.retrieveLastData();
        });

        client.on('close', errorHandler);
        client.on('error', errorHandler);
        client.on('data', (payload) => {
            console.log('received lastdata');
            let message = String.fromCharCode.apply(null, payload);

            try {
                message = JSON.parse(message);
                dispatch(receiveData(message));
            } catch (e) {
                console.log('Discarding message: ', message, e);
            }

            client.retrieveLastData();
        });
    };
}

export function checkWifiConnection() {
    return (dispatch, getState) => {
        console.log('Checking wifi connection...');

        wifi.isEnabled((isEnabled) => {
            console.log('isEnabled', isEnabled);

            if (! isEnabled) {
                wifi.setEnabled(true);
                console.log('Not enabled, enabling...');
                return;
            }

            wifi.connectionStatus((isConnected) => {
                console.log('isConnected', isConnected);

                if (! isConnected) {
                    console.log('Not connected, connecting...');

                    wifi.findAndConnect(config.serverApSsid, config.serverApPassword, (found) => {
                        console.log('found', found);
                    });
                }

                wifi.getSSID((currentSsid) => {
                    if (currentSsid !== config.serverApSsid) {
                        console.log('Not correct SSID...');

                        wifi.disconnect();
                        wifi.findAndConnect(config.serverApSsid, config.serverApPassword, (found) => {
                            console.log('found', found);
                        }); 
                    }
                });
            });
        });

        setTimeout(() => {
            dispatch(checkWifiConnection());
        }, 5000);
    };
}

export function receiveData(data) {
    return {
        type: types.RECEIVE_DATA,
        data
    };
}
