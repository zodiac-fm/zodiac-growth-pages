
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const root='public/assets/affiliate-01/';
function record(file,name) {
 const text=read(root+file); const marker='export const '+name+' = ';
 return JSON.parse(text.slice(text.indexOf(marker)+marker.length).trim().replace(/;$/,''));
}
const PARTNERS=record('partners.js','PARTNERS'),OFFER=record('offers.js','OFFER');
const core=read(root+'core.js').replace(/^import .*?;\n/gm,'').replace(/^export \{ OFFER \};\n/m,'').replaceAll('export function ','function ').replaceAll('export const ','const ');
const {context,localURL,approvedAsset}=new Function('PARTNERS','OFFER',core+'\nreturn {context,localURL,approvedAsset};')(PARTNERS,OFFER);
let checks=0;
function check(value,msg){assert.ok(value,msg);checks++;}
for(const partner of PARTNERS)for(const audience of ['astrology','meditation']){
 const ctx=context('?affiliate_id='+partner.affiliate_id+'&coupon=WRONG&affiliate_name=Imposter&utm_source=test&infclid=sample-click&sub5=sample-sub&gclid=sample-gclick',audience);
 check(ctx.partner===partner,'Resolve the canonical record');
 check(ctx.partner.category===partner.category,'Do not reclassify a partner');
 check(ctx.params.get('affiliate_id')===partner.affiliate_id && ctx.params.get('aid')===partner.affiliate_id,'Preserve stable IDs');
 check(ctx.params.get('coupon')===partner.coupon_code,'Canonical coupon beats query override');
 check(ctx.params.get('infclid')==='sample-click'&&ctx.params.get('sub5')==='sample-sub'&&ctx.params.get('gclid')==='sample-gclick','Carry attribution fields');
 check(ctx.params.get('audience')===audience,'Explicit messaging direction');
 check(!ctx.params.has('affiliate_name'),'Do not forward unverified names');
 const link=new URL(localURL('/pages/affiliate-preview/birth-details-01/',ctx),'https://preview.invalid');
 check(link.origin==='https://preview.invalid'&&link.searchParams.get('offer_id')===OFFER.id,'Local journey and constant offer');
}
const unknown=context('?affiliate_id=unknown&coupon=INJECTED&offer_id=paid&affiliate_name=Fake','meditation');
check(!unknown.partner&&unknown.unknownPartner,'Unknown partner fallback');
check(!unknown.params.has('coupon')&&!unknown.params.has('affiliate_id'),'Unknown partner cannot acquire a coupon or attribution ID');
check(unknown.params.get('offer_id')==='affiliate-free-7-day','Offer cannot be overridden');
check(context('?aid=51502','astrology').partner.affiliate_id==='51502','Support existing aid alias');
check(context('?affiliate_id=51502&aid=18301','astrology').partner.affiliate_id==='51502','Canonical ID wins conflicting alias');
check(context('?utm_source='+encodeURIComponent('x'.repeat(300)),'astrology').params.get('utm_source').length===250,'Bound query values');
check(context('?birth_date=1990-01-01&birth_place=private&email=private','astrology').params.size===3,'Never carry birth or account data');
const fixture={branding:{portrait_url:'/assets/affiliate-01/example.png'},approved_branding:[]};
check(approvedAsset(fixture,'portrait_url')===null,'Unapproved assets stay hidden');
fixture.approved_branding=['portrait_url'];
check(approvedAsset(fixture,'portrait_url')==='/assets/affiliate-01/example.png','Allow approved local asset');
fixture.branding.portrait_url='javascript:alert(1)';
check(approvedAsset(fixture,'portrait_url')===null,'Reject unsafe URLs');
fixture.branding.portrait_url='https://unapproved.invalid/face.png';
check(approvedAsset(fixture,'portrait_url')===null,'Reject unapproved asset host');
check(OFFER.annual.display==='$7.33/mo · $88 billed yearly'&&OFFER.monthly.display==='$14/mo','Current offer display');
check(OFFER.trialDays===7&&OFFER.billingDay===8,'Current trial timing');
check(OFFER.monthlyYearTotal===OFFER.monthly.charge*12,'Annual comparison arithmetic');
for(const name of ['landing.js','journey.js']) {
 new Function(read(root+name).replace(/^import .*?;\n/gm,''));
 checks++;
}
const paths=['astrology-affiliate/landing-01','meditation-affiliate/landing-01','affiliate-preview/birth-details-01','affiliate-preview/review-01'];
for(const path of paths){
 const html=read('public/pages/'+path+'/index.html');
 check(!html.includes('{{'),'No unrendered offer tokens');
 check(!/20%\s*Off|XXXXXX|https:\/\/(?:staging\.)?zodiac\.fm\/begin|checkout\.stripe\.com|googletagmanager|fbq\(/i.test(html),'No obsolete offers, real funnel links, or live pixels');
 check(!html.includes('—'),'No em dashes in page copy');
 check(html.includes('noindex,nofollow'),'No search indexing');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 check(ids.length===new Set(ids).size,'Unique element IDs');
 for(const image of html.matchAll(/<img\b[^>]*>/g))check(/\balt="/.test(image[0])&&/\bwidth="/.test(image[0])&&/\bheight="/.test(image[0]),'Images reserve dimensions and have alternatives');
 for(const href of html.matchAll(/\bhref="([^"]+)"/g)){
  const value=href[1];
  if(value.startsWith('#')&&value.length>1)check(ids.includes(value.slice(1)),'Existing section anchor '+value);
  if(value.startsWith('/pages/')){
   const target=value.split('?')[0];
   check(existsSync('public'+target+'index.html'),'Existing local route '+target);
  }
 }
 if(path.includes('landing-01')){
  check((html.match(/<h1\b/g)||[]).length===1,'One landing-page H1');
  check(html.includes(OFFER.annual.display)&&html.includes(OFFER.monthly.display)&&html.includes('No refunds.'),'Complete offer and refund disclosure');
  check((html.match(/data-begin/g)||[]).length===2,'Two deliberate birth-entry points');
  const above=html.slice(0,html.indexOf('</h1>'));
  check(!/\bCore\b|\bVitality\b|\bAbundance\b/.test(above),'No opening taxonomy');
 }
}
const journey=read('public/pages/affiliate-preview/birth-details-01/index.html');
check(journey.includes("connect-src 'none'")&&journey.includes("form-action 'none'"),'Journey blocks outgoing connections and form submissions');
check(!/<input[^>]*type="radio"[^>]*checked/.test(journey),'Neither plan is preselected');
check(journey.includes('required')&&journey.includes('No trial has started.'),'Validation and honest completion');
const registry=JSON.parse(read('pages.json'));
for(const path of paths)check(registry.some(x=>x.path===path&&x.status==='draft'),'Draft page is registered');
console.log('Affiliate 01: '+checks+' checks passed. Browser rendering and interaction still require review.');
