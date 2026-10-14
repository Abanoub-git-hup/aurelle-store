// Entry point — esbuild bundles everything into a single aurelle.js.
import { register, mountAll } from './core/dom.js';
import { mount as langSwitch } from './components/lang-switch.js';
import { mount as productCard } from './components/product-card.js';
import { mount as deptTabs } from './components/dept-tabs.js';
import { initMotion } from './motion/index.js';

register('lang-switch', langSwitch);
register('product-card', productCard);
register('dept-tabs', deptTabs);

mountAll();
initMotion();
