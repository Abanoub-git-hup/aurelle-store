// Entry point — esbuild bundles everything into a single aurelle.js.
import { register, mountAll } from './core/dom.js';
import { mount as langSwitch } from './components/lang-switch.js';

register('lang-switch', langSwitch);

mountAll();
