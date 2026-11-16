
import { context,applyContext,matchesFilter } from './core.js';
import { CATALOG } from './catalog.js';
const ctx=context(location.search,document.body.dataset.audience);
applyContext(ctx);
const buttons=[...document.querySelectorAll('[data-filter]')];
const rows=[...document.querySelectorAll('[data-track]')];
function filter(kind){
 const allowed=['all','short','nine','long'];
 const key=allowed.includes(kind)?kind:'all';
 buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===key)));
 rows.forEach(row=>{const track=CATALOG.find(t=>t.id===row.dataset.track);row.hidden=!track||!matchesFilter(track,key);});
 const visible=CATALOG.filter(t=>matchesFilter(t,key));
 const status=document.querySelector('[data-catalog-status]');
 if(status)status.textContent=visible.length+' compositions'+(key==='short'?' · These three stay free.':key==='all'?' · Three short compositions stay free. Five longer compositions come with membership.':' · Included with membership.');
}
buttons.forEach(button=>button.addEventListener('click',()=>filter(button.dataset.filter)));
filter(ctx.audience==='meditation'?'nine':'short');
