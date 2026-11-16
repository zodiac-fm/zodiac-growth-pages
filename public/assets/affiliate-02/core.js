
import { PARTNERS } from './partners.js';
import { OFFER } from './offers.js';
import { EVIDENCE } from './evidence.js';
export { OFFER };
export const ACQUISITION_FIELDS=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid','ttclid','msclkid','twclid','li_fat_id','infclid','oid','sub1','sub2','sub3','sub4','sub5','uid','source_id','creative_id'];
export function clean(value,max=250){return String(value||'').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,max);}
export function context(search,audience){
 const q=new URLSearchParams(search);
 const id=clean(q.get('affiliate_id')||q.get('aid'),40);
 const partner=PARTNERS.find(p=>p.affiliate_id===id)||null;
 const params=new URLSearchParams();
 for(const key of ACQUISITION_FIELDS){const value=clean(q.get(key));if(value)params.set(key,value);}
 if(partner){params.set('affiliate_id',partner.affiliate_id);params.set('aid',partner.affiliate_id);params.set('coupon',partner.coupon_code);}
 params.set('offer_id',OFFER.id);params.set('audience',audience==='meditation'?'meditation':'astrology');params.set('template_version','02');
 return {partner,params,audience:params.get('audience'),unknownPartner:!!id&&!partner};
}
export function localURL(path,ctx){return path+'?'+ctx.params.toString();}
export function proofFor(ctx){
 const p=ctx.partner;
 if(p&&p.approved_branding.includes('endorsement')&&p.approved_branding.includes('endorsement_author')&&p.branding.endorsement&&p.branding.endorsement_author){
  return {author:p.branding.endorsement_author,quote:p.branding.endorsement,byline:p.approved_branding.includes('endorsement_byline')?p.branding.endorsement_byline:'',heading:'How '+p.branding.endorsement_author+' listens',relationship:p.branding.endorsement_author+' is a Zodiac.fm affiliate. These are their own words.',partnerSpecific:true};
 }
 return EVIDENCE[ctx.audience];
}
export function approvedAsset(partner,key){
 if(!partner||!partner.approved_branding.includes(key))return null;
 const raw=partner.branding[key];if(typeof raw!=='string'||!raw)return null;
 try{
 const u=new URL(raw,'https://preview.invalid');
 if(u.username||u.password)return null;
 if(u.origin==='https://preview.invalid'&&u.pathname.startsWith('/assets/affiliate-02/')&&!/%2e|%2f|%5c/i.test(raw)&&!raw.includes('..')&&!raw.includes('\\'))return u.pathname+u.search;
 if(u.protocol==='https:'&&u.hostname==='zodiac-pages.vercel.app')return u.href;
 }catch{}
 return null;
}
export function setText(selector,text){const el=document.querySelector(selector);if(el)el.textContent=text;}
export function applyContext(ctx){
 setText('[data-partner-line]',ctx.partner?'An invitation through '+ctx.partner.partner_name:'Explore Zodiac.fm through our affiliate community.');
 setText('[data-disclosure]',ctx.partner?ctx.partner.partner_name+' is a Zodiac.fm affiliate and may earn a commission if you become a paying member through their link.':'The referring affiliate may earn a commission if you become a paying member.');
 const proof=proofFor(ctx);
 setText('[data-proof-heading]',proof.heading);setText('[data-proof-quote]','“'+proof.quote+'”');setText('[data-proof-author]',proof.author);setText('[data-proof-byline]',proof.byline);setText('[data-proof-relationship]',proof.relationship);
 for(const a of document.querySelectorAll('[data-begin]'))a.href=localURL('/pages/affiliate-preview/birth-details-02/',ctx);
 for(const a of document.querySelectorAll('[data-return]'))a.href=localURL('/pages/'+ctx.audience+'-affiliate/landing-02/',ctx);
 const p=ctx.partner;
 for(const [key,selector]of [['logo_url','[data-partner-logo]'],['portrait_url','[data-partner-portrait]']]){
  const el=document.querySelector(selector);if(!el)continue;const src=key==='portrait_url'&&!proof.partnerSpecific?null:approvedAsset(p,key);
  if(src){el.src=src;el.alt=p.partner_name;el.hidden=false;el.addEventListener('error',()=>{el.hidden=true;el.removeAttribute('src');});}
 }

 const intro=document.querySelector('[data-partner-introduction]');
 if(intro&&p?.approved_branding.includes('introduction')&&p.branding.introduction){intro.textContent=clean(p.branding.introduction,1500);intro.hidden=false;}
 const slot=document.querySelector('[data-partner-video]');
 const video=approvedAsset(p,'video_url'),captions=approvedAsset(p,'video_captions_url');
 const transcript=p?.approved_branding.includes('video_transcript')?clean(p.branding.video_transcript,12000):'';
 if(slot&&video&&captions&&transcript){
  slot.replaceChildren();slot.hidden=false;
  const player=document.createElement('video');player.controls=true;player.preload='none';player.crossOrigin='anonymous';player.src=video;player.setAttribute('aria-label','Interview with '+p.partner_name);
  const track=document.createElement('track');track.kind='captions';track.srclang='en';track.label='English';track.src=captions;track.default=true;player.append(track);
  const details=document.createElement('details'),summary=document.createElement('summary'),text=document.createElement('p');summary.textContent='Read the interview transcript';text.textContent=transcript;details.append(summary,text);slot.append(player,details);
 }
 audit(ctx);
}
export function audit(ctx,step='landing',plan=null){
 const el=document.querySelector('[data-audit]');
 if(el)el.textContent=JSON.stringify({affiliate_id:ctx.partner?.affiliate_id||null,category:ctx.partner?.category||null,vanity_url:ctx.partner?.vanity_url||null,coupon:ctx.partner?.coupon_code||null,parameters:Object.fromEntries(ctx.params),step,plan,unknown_partner:ctx.unknownPartner,checkout:'disconnected',tracking:'disconnected',birth_data:'not submitted or stored'},null,2);
}
export function matchesFilter(track,filter){
 if(filter==='short')return track.free;
 if(filter==='nine')return track.minutes===9;
 if(filter==='long')return track.minutes>=25;
 return true;
}
