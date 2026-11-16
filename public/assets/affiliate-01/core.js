
import { PARTNERS } from './partners.js';
import { OFFER } from './offers.js';
export { OFFER };
export const ACQUISITION_FIELDS = [
'utm_source','utm_medium','utm_campaign','utm_term','utm_content',
'gclid','gbraid','wbraid','fbclid','ttclid','msclkid','twclid','li_fat_id',
'infclid','oid','sub1','sub2','sub3','sub4','sub5','uid','source_id','creative_id'
];
export function clean(value, max=250) {
 return String(value || '').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,max);
}
export function context(search, audience) {
 const query = new URLSearchParams(search);
 const id = clean(query.get('affiliate_id') || query.get('aid'),40);
 const partner = PARTNERS.find(p => p.affiliate_id === id) || null;
 const params = new URLSearchParams();
 for (const key of ACQUISITION_FIELDS) {
  const value = clean(query.get(key));
  if (value) params.set(key,value);
 }
 if (partner) {
  params.set('affiliate_id', partner.affiliate_id);
  params.set('aid', partner.affiliate_id);
  params.set('coupon', partner.coupon_code);
 }
 params.set('offer_id', OFFER.id);
 params.set('audience', audience === 'meditation' ? 'meditation' : 'astrology');
 params.set('template_version','01');
 return { partner, params, audience:params.get('audience'), unknownPartner:!!id&&!partner };
}
export function localURL(path, ctx) {
 return path + '?' + ctx.params.toString();
}
export function approvedAsset(partner,key) {
 if (!partner || !partner.approved_branding.includes(key)) return null;
 const value=partner.branding[key];
 if (!value || typeof value !== 'string') return null;
 if (value.startsWith('/assets/affiliate-01/') && !value.includes('..')) return value;
 try {
  const u = new URL(value);
  return u.protocol==='https:' && u.hostname==='zodiac-pages.vercel.app' && !u.username && !u.password ? u.href : null;
 } catch { return null; }
}
export function renderPartner(ctx) {
 const partner=ctx.partner;
 const line=document.querySelector('[data-partner-line]');
 const disclosure=document.querySelector('[data-disclosure]');
 if(line) line.textContent=partner ? 'For readers and listeners of '+partner.partner_name : 'A listening invitation from the Zodiac.fm affiliate community';
 if(disclosure) disclosure.textContent=partner ? partner.partner_name+' is listed as a Zodiac.fm affiliate and may earn a commission if you become a paying member through their link.' : 'The referring affiliate may earn a commission if you become a paying member.';
 const story=document.querySelector('[data-partner-story]');
 if(!partner || !story)return;
 // Permission is per field, never inferred from a name, category, or query string.
 const allowed=partner.approved_branding;
 const intro=allowed.includes('introduction') ? clean(partner.branding.introduction,1200) : '';
 const quote=allowed.includes('endorsement') ? clean(partner.branding.endorsement,1200) : '';
 const logo=approvedAsset(partner,'logo_url');
 const portrait=approvedAsset(partner,'portrait_url');
 const captions=approvedAsset(partner,'video_captions_url');
 const transcript=allowed.includes('video_transcript') ? clean(partner.branding.video_transcript,12000) : '';
 const video=captions && transcript ? approvedAsset(partner,'video_url') : null;
 if(logo && line) {
  const img=document.createElement('img');img.src=logo;img.alt=partner.partner_name;img.width=120;img.height=60;
  img.addEventListener('error',()=>img.remove());line.prepend(img);
 }
 if(!intro && !quote && !video)return;
 story.hidden=false;
 const title=document.createElement('h2');title.textContent='From '+partner.partner_name;story.append(title);
 if(portrait) { const img=document.createElement('img');img.src=portrait;img.alt=partner.partner_name;img.width=150;img.height=180;img.loading='lazy';img.addEventListener('error',()=>img.remove());story.append(img); }
 if(intro) { const p=document.createElement('p');p.textContent=intro;story.append(p); }
 if(quote) { const q=document.createElement('blockquote');q.textContent='“'+quote+'”';const cite=document.createElement('cite');cite.textContent=partner.partner_name;q.append(cite);story.append(q); }
 if(video) { const v=document.createElement('video');v.controls=true;v.preload='none';v.src=video;v.setAttribute('aria-label','Interview with '+partner.partner_name);const track=document.createElement('track');track.kind='captions';track.src=captions;track.srclang='en';track.label='English';track.default=true;v.append(track);story.append(v);const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Read the interview transcript';const text=document.createElement('p');text.textContent=transcript;details.append(summary,text);story.append(details); }
}
export function applyContext(ctx) {
 renderPartner(ctx);
 for(const a of document.querySelectorAll('[data-begin]')) a.href=localURL('/pages/affiliate-preview/birth-details-01/',ctx);
 for(const a of document.querySelectorAll('[data-return]')) a.href=localURL('/pages/'+ctx.audience+'-affiliate/landing-01/',ctx);
 const audit=document.querySelector('[data-audit]');
 if(audit) audit.textContent=JSON.stringify({affiliate_id:ctx.partner?.affiliate_id||null,category:ctx.partner?.category||null,vanity_url:ctx.partner?.vanity_url||null,offer_id:OFFER.id,audience:ctx.audience,parameters:Object.fromEntries(ctx.params),unknown_partner:ctx.unknownPartner,checkout:'disconnected',tracking:'disconnected',birth_details:'never sent or persisted'},null,2);
}
