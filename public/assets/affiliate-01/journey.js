
import { context, applyContext, OFFER } from './core.js';
const ctx=context(location.search,new URLSearchParams(location.search).get('audience'));
applyContext(ctx);
const form=document.querySelector('#birth-form');
const planForm=document.querySelector('#plan-form');
const panels=[...document.querySelectorAll('[data-stage]')];
let selectedPlan=null;
function show(stage) {
 for(const panel of panels)panel.hidden=panel.dataset.stage!==stage;
 const step=['birth','results','plans','complete'].indexOf(stage);
 document.querySelectorAll('.progress li').forEach((item,i)=>{
  if(i===Math.min(step,2))item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');
 });
 const params=new URLSearchParams(ctx.params);
 params.set('preview_step',stage);
 if(selectedPlan)params.set('plan',selectedPlan);
 history.replaceState(null,'',location.pathname+'?'+params);
 const heading=document.querySelector('[data-stage="'+stage+'"] h1');
 heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView({block:'start',behavior:'instant'});
 const audit=document.querySelector('[data-audit]');
 if(audit) audit.textContent=JSON.stringify({affiliate_id:ctx.partner?.affiliate_id||null,category:ctx.partner?.category||null,offer_id:OFFER.id,audience:ctx.audience,stage,plan:selectedPlan,parameters:Object.fromEntries(ctx.params),checkout:'disconnected',tracking:'disconnected',birth_details:'never sent or persisted'},null,2);
}
const date=document.querySelector('#birth-date');
date.max=new Date().toLocaleDateString('en-CA');
document.querySelector('#unknown-time').addEventListener('change',e=>{
 const t=document.querySelector('#birth-time');t.disabled=e.target.checked;t.required=!e.target.checked;if(e.target.checked)t.value='';
});
document.querySelector('#sample').addEventListener('click',()=>{
 date.value='1990-06-15';document.querySelector('#unknown-time').checked=false;
 const time=document.querySelector('#birth-time');time.disabled=false;time.required=true;time.value='12:00';
 document.querySelector('#birth-place').value='Boulder, Colorado, United States';
});
form.addEventListener('submit',event=>{
 event.preventDefault();
 if(!form.reportValidity())return;
 form.reset();
 document.querySelector('#birth-time').disabled=false;document.querySelector('#birth-time').required=true;
 show('results');
});
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.go)));
planForm.addEventListener('change',()=>{
 const value=new FormData(planForm).get('plan');
 if(value!=='annual'&&value!=='monthly')return;
 selectedPlan=value;
 const plan=OFFER[value];
 document.querySelector('[data-charge]').textContent='If you start a trial, day 8 bills $'+plan.charge+' for the '+(value==='annual'?'year':'month')+'. It renews '+(value==='annual'?'yearly':'monthly')+' until you cancel.';
 const price=document.querySelector('[data-selected-price]');price.textContent=plan.display;
});
planForm.addEventListener('submit',event=>{
 event.preventDefault();
 if(!planForm.reportValidity()||!selectedPlan)return;
 const plan=OFFER[selectedPlan];
 document.querySelector('[data-confirm-plan]').textContent=plan.display;
 document.querySelector('[data-confirm-charge]').textContent='In the real flow, your selected '+selectedPlan+' plan would bill $'+plan.charge+' on day 8 and renew '+(selectedPlan==='annual'?'yearly':'monthly')+' until you cancel.';
 show('complete');
});
