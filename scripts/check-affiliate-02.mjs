
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const root='public/assets/affiliate-02/';
const read=p=>readFileSync(p,'utf8');
function record(path,name){const s=read(path),marker='export const '+name+' = ';return JSON.parse(s.slice(s.indexOf(marker)+marker.length).trim().replace(/;$/,''));}
const PARTNERS=record(root+'partners.js','PARTNERS'),CATALOG=record(root+'catalog.js','CATALOG'),EVIDENCE=record(root+'evidence.js','EVIDENCE');
const OFFER=record('public/assets/affiliate-01/offers.js','OFFER');
const strip=s=>s.replace(/^import .*?;\n/gm,'').replace(/^export \{.*?\};\n/gm,'').replaceAll('export function ','function ').replaceAll('export const ','const ');
const api=new Function('PARTNERS','OFFER','EVIDENCE','URL','URLSearchParams',strip(read(root+'core.js'))+'\nreturn {context,localURL,proofFor,approvedAsset,matchesFilter,applyContext,audit};')(PARTNERS,OFFER,EVIDENCE,URL,URLSearchParams);
let checks=0;
function check(v,m){assert.ok(v,m);checks++;}
for(const partner of PARTNERS)for(const audience of ['astrology','meditation']){
 const ctx=api.context('?affiliate_id='+partner.affiliate_id+'&aid=wrong&coupon=wrong&affiliate_name=Fake&offer_id=paid&utm_source=sample&infclid=sample-click&sub1=sample-sub',audience);
 check(ctx.partner===partner,'Canonical identity');
 check(ctx.params.get('coupon')===partner.coupon_code,'Canonical coupon');
 check(ctx.partner.category===partner.category,'Category remains unchanged');
 check(ctx.params.get('template_version')==='02'&&ctx.params.get('audience')===audience,'Explicit concept version and audience');
 check(ctx.params.get('infclid')==='sample-click'&&ctx.params.get('sub1')==='sample-sub','Attribution fields carry');
 check(!ctx.params.has('affiliate_name')&&ctx.params.get('offer_id')===OFFER.id,'No name or offer injection');
 const proof=api.proofFor(ctx);
 check(!!proof.author&&!!proof.quote&&!!proof.relationship,'Named proof with relationship');
 const dest=new URL(api.localURL('/pages/affiliate-preview/birth-details-02/',ctx),'https://preview.invalid');
 check(dest.origin==='https://preview.invalid'&&dest.searchParams.get('affiliate_id')===partner.affiliate_id,'Local referral-preserving destination');
}
const unknown=api.context('?affiliate_id=unknown&coupon=BAD&birth_date=private&email=private','meditation');
check(!unknown.partner&&unknown.unknownPartner,'Unknown partner fallback');
check(unknown.params.size===3&&!unknown.params.has('coupon'),'No private data or unknown coupon carried');
check(api.proofFor(unknown).author==='Katie Wells','Unknown partner uses named supporting proof, not a fabricated endorsement');
check(api.context('?aid=52145','astrology').partner.partner_name==='Molly McCord','Existing aid alias');
check(api.proofFor(api.context('?affiliate_id=52145','astrology')).author==='Molly McCord','Approved Molly account');
check(api.proofFor(api.context('?affiliate_id=14085','meditation')).author==='David McEwen','Approved McEwen account while partner name stays Heartspace');
const fixture={branding:{portrait_url:'/assets/affiliate-02/face.png'},approved_branding:[]};
check(!api.approvedAsset(fixture,'portrait_url'),'No unapproved portrait');
fixture.approved_branding=['portrait_url'];
check(api.approvedAsset(fixture,'portrait_url')==='/assets/affiliate-02/face.png','Approved local asset');
for(const bad of ['javascript:alert(1)','https://unapproved.invalid/face.png','/assets/affiliate-02/../private.png','/assets/affiliate-02/%2e%2e/private.png','/assets/affiliate-02/face%2fprivate.png']){
 fixture.branding.portrait_url=bad;check(!api.approvedAsset(fixture,'portrait_url'),'Reject unsafe or unapproved URL');
}
check(CATALOG.length===8&&CATALOG.filter(t=>t.free).length===3,'Eight compositions with three free');
check(CATALOG.filter(t=>api.matchesFilter(t,'short')).length===3,'Short filter');
check(CATALOG.filter(t=>api.matchesFilter(t,'nine')).length===2,'Nine-minute filter');
check(CATALOG.filter(t=>api.matchesFilter(t,'long')).length===3,'Long filter');
check(CATALOG.find(t=>t.id==='temple-space').line===null,'Do not invent open Temple Space description');
check(CATALOG.find(t=>t.id==='cosmic-drift').minutes===25&&CATALOG.find(t=>t.id==='cosmic-drift').durationNote.includes('27:59'),'Keep app label and duration caveat');
check(!CATALOG.some(t=>/Elysian Sky|Galactic Slumber/.test(t.name)),'Current public song names');
for(const script of ['core.js','landing.js','journey.js']){new Function(strip(read(root+script)));checks++;}
const pages=['astrology-affiliate/landing-02','meditation-affiliate/landing-02','affiliate-preview/birth-details-02','affiliate-preview/review-02'];
const registry=JSON.parse(read('pages.json'));
for(const page of pages){
 const html=read('public/pages/'+page+'/index.html');
 check(!html.includes('{{'),'No unresolved template fields');
 check(!/20%\s*off|XXXXXX|checkout\.stripe\.com|googletagmanager|fbq\(|https:\/\/(?:staging\.)?zodiac\.fm\/begin/i.test(html),'No obsolete offer, live checkout, or live tracking');
 check(!html.includes('—'),'No em dashes in page copy');
 check(html.includes('noindex,nofollow')&&html.includes("connect-src 'none'")&&html.includes("form-action 'none'"),'Preview boundaries');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 check(ids.length===new Set(ids).size,'No duplicate IDs');
 for(const img of html.matchAll(/<img\b[^>]*>/g))check(/\balt="/.test(img[0])&&/\bwidth="/.test(img[0])&&/\bheight="/.test(img[0]),'Image alternatives and reserved dimensions');
 for(const a of html.matchAll(/\bhref="([^"]+)"/g)){
  const value=a[1];
  if(value.startsWith('#'))check(ids.includes(value.slice(1)),'Anchor exists');
  if(value.startsWith('/pages/'))check(existsSync('public'+value.split('?')[0]+'index.html'),'Local route exists');
 }
 check(registry.some(x=>x.path===page&&x.status==='draft'),'Registered draft');
 if(page.includes('landing-02')){
  check((html.match(/<h1\b/g)||[]).length===1,'One H1');
  check((html.match(/data-begin/g)||[]).length===3,'Hero, membership, and post-FAQ actions');
  check((html.match(/data-track="/g)||[]).length===8,'Full static catalog without JavaScript');
  check(html.includes(OFFER.annual.display)&&html.includes(OFFER.monthly.display)&&html.includes('No refunds.'),'Offer consistency');
  check(html.includes('25 minutes')&&html.includes('27:59'),'Visible duration clarification');
  check(!/<audio\b/.test(html),'No unverified audio or dead sample player');
  check(!/\bCore\b|\bLove\b|\bVitality\b|\bAbundance\b/.test(html.slice(0,html.indexOf('</section>'))),'No opening frequency taxonomy');
  check(html.includes('https://zodiac.fm/privacy')&&html.includes('https://zodiac.fm/terms'),'Verified legal routes');
 }
}
const journey=read('public/pages/affiliate-preview/birth-details-02/index.html');
check(!/<input[^>]*type="radio"[^>]*checked/.test(journey),'No preselected plan');
check(!journey.includes('terms-check'),'No redundant preview agreement checkbox');
check(journey.includes('Example profile only.')&&journey.includes("weren't calculated"),'Honest example results');
check(journey.includes('recognizing')||journey.includes('Recognizing'),'Meanings accompany numbers');
const controller=read(root+'journey.js');
check(controller.includes('popstate')&&controller.includes('history.pushState'),'Browser-back controller present');
check(controller.includes('form.reset()')&&!/localStorage|sessionStorage|fetch\(|sendBeacon|XMLHttpRequest/.test(controller),'No birth-data persistence or requests');
for(const font of ['Switzer-Regular.otf','Switzer-Semibold.otf','Cormorant-600.ttf'])check(existsSync(root+'fonts/'+font),'Local licensed font');

function mockElement(dataset={}){
 return {dataset,value:'',checked:false,disabled:false,required:false,hidden:false,textContent:'',attributes:{},handlers:{},setAttribute(k,v){this.attributes[k]=v;},removeAttribute(k){delete this.attributes[k];},addEventListener(k,fn){this.handlers[k]=fn;},focus(){},scrollIntoView(){}};
}
const elements={};
for(const id of ['birth-form','plan-form','birth-date','birth-time','birth-place','unknown-time','sample'])elements['#'+id]=mockElement();
for(const key of ['selected-price','charge','confirm-plan','confirm-charge','starter-title','starter-description'])elements['[data-'+key+']']=mockElement();
const panels=['birth','results','plans','complete'].map(stage=>mockElement({stage}));
const progress=[mockElement(),mockElement(),mockElement()];
const radios=['annual','monthly'].map(value=>({...mockElement(),value}));
const goButtons=['birth','results','plans'].map(go=>mockElement({go}));
for(const panel of panels)elements['[data-stage="'+panel.dataset.stage+'"] h1']=mockElement();
let formValid=true,resets=0;
elements['#birth-form'].reportValidity=()=>formValid;
elements['#birth-form'].reset=()=>{resets++;for(const key of ['birth-date','birth-time','birth-place'])elements['#'+key].value='';elements['#unknown-time'].checked=false;};
elements['#plan-form'].reportValidity=()=>radios.some(r=>r.checked);
const documentMock={
 querySelector(s){if(s==='input[name="plan"]:checked')return radios.find(r=>r.checked)||null;return elements[s]||null;},
 querySelectorAll(s){return s==='[data-stage]'?panels:s==='.progress li'?progress:s==='input[name="plan"]'?radios:s==='[data-go]'?goButtons:[];}
};
const windowMock={handlers:{},addEventListener(k,fn){this.handlers[k]=fn;}};
const historyMock={entries:[],pushState(state,_,url){this.entries.push({state,url});},replaceState(state,_,url){this.entries=[{state,url}];}};
const locationMock={search:'?affiliate_id=52145&infclid=sample-ref&birth_date=DO-NOT-CARRY',pathname:'/pages/affiliate-preview/birth-details-02/'};
const auditCalls=[];
new Function('context','applyContext','audit','OFFER','CATALOG','document','window','history','location','URLSearchParams',strip(read(root+'journey.js')))(
api.context,()=>{},(...args)=>auditCalls.push(args),OFFER,CATALOG,documentMock,windowMock,historyMock,locationMock,URLSearchParams);
const event=()=>({preventDefault(){}});
const current=()=>panels.find(p=>!p.hidden)?.dataset.stage;
elements['#unknown-time'].handlers.change({target:{checked:true}});
check(elements['#birth-time'].disabled&&!elements['#birth-time'].required,'Unknown-time path does not require time input');
elements['#sample'].handlers.click();
check(elements['#birth-date'].value==='1990-06-15'&&elements['#birth-time'].value==='12:00'&&!elements['#birth-time'].disabled,'Sample details restore a usable form');
formValid=false;elements['#birth-form'].handlers.submit(event());
check(historyMock.entries.length===1&&resets===0,'Invalid birth input does not advance');
formValid=true;elements['#birth-form'].handlers.submit(event());
check(current()==='results'&&resets===1&&elements['#birth-date'].value==='','Continue to labeled sample results and clear birth data');
check(historyMock.entries.every(e=>!e.url.includes('1990')&&!e.url.includes('DO-NOT-CARRY')&&!e.url.includes('Boulder')),'Birth data never enters history');
goButtons.find(b=>b.dataset.go==='plans').handlers.click();
check(current()==='plans'&&radios.every(r=>!r.checked),'Plans open without a default choice');
elements['#plan-form'].handlers.submit(event());
check(current()==='plans','No plan means no confirmation');
radios[0].checked=true;elements['#plan-form'].handlers.change();
check(elements['[data-selected-price]'].textContent===OFFER.annual.display&&elements['[data-charge]'].textContent.includes('$88'),'Annual price and first charge');
elements['#plan-form'].handlers.submit(event());
check(current()==='complete'&&elements['[data-confirm-plan]'].textContent===OFFER.annual.display,'Selected annual plan survives confirmation');
windowMock.handlers.popstate({state:{stage:'plans',plan:'annual'}});
check(current()==='plans'&&radios[0].checked,'Browser back restores plan review');
radios[0].checked=false;radios[1].checked=true;elements['#plan-form'].handlers.change();elements['#plan-form'].handlers.submit(event());
check(current()==='complete'&&elements['[data-confirm-charge]'].textContent.includes('$14')&&elements['[data-confirm-charge]'].textContent.includes('monthly'),'Monthly choice and billing remain correct');
windowMock.handlers.popstate({state:{stage:'birth',plan:null}});
check(current()==='birth'&&radios.every(r=>!r.checked),'Back to birth clears plan selection');
check(auditCalls.every(args=>args[0].params.get('affiliate_id')==='52145'&&args[0].params.get('infclid')==='sample-ref'),'Referral identity persists through controller steps');

console.log('Affiliate 02: '+checks+' checks passed. These are code/content checks, not browser or conversion validation.');
