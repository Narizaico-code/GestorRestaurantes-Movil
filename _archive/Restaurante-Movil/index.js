import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent llama AppRegistry.registerComponent('main', () => App)
// y asegura que el entorno (Expo Go o build nativo) quede bien configurado.
registerRootComponent(App);
