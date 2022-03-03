/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/core/app';
import {buscaTodosDados} from './src/core/synchronize';
import Database from './src/core/database';

AppRegistry.registerComponent(appName, () => {
    Database.initDB();
    buscaTodosDados();
    return App
});
