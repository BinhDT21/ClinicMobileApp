import { registerRootComponent } from 'expo';

import App from './App';
import WelcomeScreen from './components/home/WelcomeScreen';
import Login from './components/user/Login';





// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
