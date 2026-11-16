
import { context,applyContext,audit,OFFER } from './core.js';
import { CATALOG } from './catalog.js';
const ctx=context(location.search,new URLSearchParams(location.search).get('audience'));
applyContext(ctx);
const form=document.querySelector('#birth-form');
const planForm=document.querySelector('#plan-form');
let selectedPlan=null;
let currentStage='birth';
const stages=['birth','results','plans','complete'];
const selected=()=>document.querySelector('input[name="plan"]:checked')?.value||null;
function updateBilling(value){
 selectedPlan=value==='annual'||value==='monthly'?value:null;
 if(!selectedPlan)return;
 const plan=OFFER[selectedPlan];
 document.querySelector('[data-selected-price]').textContent=plan.display;
 document.querySelector('[data-charge]').textContent='If you start a real trial, day '+OFFER.billingDay+' bills $'+plan.charge+' for the '+(selectedPlan==='annual'?'year':'month')+'. It renews '+(selectedPlan==='annual'?'yearly':'monthly')+' until you cancel.';
 document.querySelector('[data-confirm-plan]').textContent=plan.display;
 document.querySelector('[data-confirm-charge]').textContent='In a real trial, this choice would bill $'+plan.charge+' on day '+OFFER.billingDay+' and renew '+(selectedPlan==='annual'?'yearly':'monthly')+' until you cancel.';
}
function show(stage,push=true){
 currentStage=stages.includes(stage)?stage:'birth';
 document.querySelectorAll('[data-stage]').forEach(panel=>panel.hidden=panel.dataset.stage!==currentStage);
 const index=Math.min(stages.indexOf(currentStage),2);
 document.querySelectorAll('.progress li').forEach((item,i)=>{if(i===index)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');});
 const params=new URLSearchParams(ctx.params);params.set('preview_step',currentStage);
 if(selectedPlan)params.set('plan',selectedPlan);
 if(push)history.pushState({stage:currentStage,plan:selectedPlan},'',location.pathname+'?'+params.toString());
 const heading=document.querySelector('[data-stage="'+currentStage+'"] h1');heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView({block:'start',behavior:'auto'});
 audit(ctx,currentStage,selectedPlan);
}
const date=document.querySelector('#birth-date');
const today=new Date();date.max=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
document.querySelector('#unknown-time').addEventListener('change',event=>{
 const time=document.querySelector('#birth-time');time.disabled=event.target.checked;time.required=!event.target.checked;if(event.target.checked)time.value='';
});
document.querySelector('#sample').addEventListener('click',()=>{
 date.value='1990-06-15';document.querySelector('#unknown-time').checked=false;
 const time=document.querySelector('#birth-time');time.disabled=false;time.required=true;time.value='12:00';document.querySelector('#birth-place').value='Boulder, Colorado, United States';
});
form.addEventListener('submit',event=>{
 event.preventDefault();if(!form.reportValidity())return;
 form.reset();const time=document.querySelector('#birth-time');time.disabled=false;time.required=true;
 show('results');
});
const starter=CATALOG.find(t=>t.id===(ctx.audience==='meditation'?'starseed':'astrolith'));
document.querySelector('[data-starter-title]').textContent=starter.name;
document.querySelector('[data-starter-description]').textContent=starter.line;
document.querySelectorAll('[data-go]').forEach(button=>button.addEventListener('click',()=>show(button.dataset.go)));
planForm.addEventListener('change',()=>updateBilling(selected()));
planForm.addEventListener('submit',event=>{
 event.preventDefault();if(!planForm.reportValidity()||!selected())return;
 updateBilling(selected());show('complete');
});
window.addEventListener('popstate',event=>{
 const stage=event.state?.stage||'birth';
 const plan=event.state?.plan;
 document.querySelectorAll('input[name="plan"]').forEach(input=>input.checked=input.value===plan);
 selectedPlan=null;updateBilling(plan);
 if(!selectedPlan){
 document.querySelector('[data-selected-price]').textContent='Choose a plan to review your billing.';
 document.querySelector('[data-charge]').textContent='The real trial requires a card. This preview does not collect payment details.';
 }
 show(stage==='complete'&&!selectedPlan?'plans':stage,false);
});
const initialParams=new URLSearchParams(ctx.params);
initialParams.set('preview_step','birth');
history.replaceState({stage:'birth',plan:null},'',location.pathname+'?'+initialParams.toString());
audit(ctx,'birth',null);
