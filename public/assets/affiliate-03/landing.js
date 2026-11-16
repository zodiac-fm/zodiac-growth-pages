import {context,applyContext} from './core.js';
applyContext(context(location.search,document.body.dataset.audience));
