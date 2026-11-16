
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
function record(path,name){const text=read(path),marker='export const '+name+' = ';return JSON.parse(text.slice(text.indexOf(marker)+marker.length).trim().replace(/;$/,''));}
const OFFER=record('public/assets/affiliate-01/offers.js','OFFER');
const PARTNERS=record('public/assets/affiliate-02/partners.js','PARTNERS');
const EVIDENCE=record('public/assets/affiliate-02/evidence.js','EVIDENCE');
const root='public/assets/affiliate-03/';
const strip=s=>s.replace(/^import .*?;\n/gm,'').replace(/^export \{.*?\};\n/gm,'').replaceAll('export function ','function ').replaceAll('export const ','const ');
const api=new Function('PARTNERS','OFFER','EVIDENCE',strip(read(root+'core.js'))+'\nreturn {context,localURL,proofFor};')(PARTNERS,OFFER,EVIDENCE);
let checks=0;
function check(v,m){assert.ok(v,m);checks++;}
for(const partner of PARTNERS)for(const audience of ['astrology','meditation']){
 const ctx=api.context('?affiliate_id='+partner.affiliate_id+'&coupon=BAD&affiliate_name=Fake&infclid=example-click',audience);
 check(ctx.partner===partner&&ctx.partner.category===partner.category,'Stable partner and category');
 check(ctx.params.get('coupon')===partner.coupon_code,'Canonical coupon');
 check(ctx.params.get('infclid')==='example-click'&&ctx.params.get('template_version')==='03','Attribution and version');
 check(ctx.params.get('offer_id')===OFFER.id&&!ctx.params.has('affiliate_name'),'Trusted offer and name');
 check(!!api.proofFor(ctx).author&&!!api.proofFor(ctx).quote,'Approved named proof');
}
const unknown=api.context('?affiliate_id=unknown&coupon=BAD&birth_date=private&email=private','meditation');
check(unknown.unknownPartner&&!unknown.partner&&unknown.params.size===3,'Generic unknown-partner path without personal query fields');
for(const name of ['core.js','landing.js','journey.js']){new Function(strip(read(root+name)));checks++;}
const pages=['astrology-affiliate/landing-03','meditation-affiliate/landing-03','affiliate-preview/birth-details-03','affiliate-preview/review-03'];
const registry=JSON.parse(read('pages.json'));
for(const path of pages){
 const html=read('public/pages/'+path+'/index.html');
 check(!html.includes('{{'),'Rendered offer fields');
 check(!html.includes('—'),'No em dashes in page copy');
 check(html.includes('noindex,nofollow')&&html.includes("connect-src 'none'")&&html.includes("form-action 'none'"),'Disconnected preview');
 check(!/checkout\.stripe\.com|googletagmanager|fbq\(|20%\s*off|XXXXXX/i.test(html),'No real checkout, tracking, or obsolete offer');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 check(ids.length===new Set(ids).size,'Unique IDs');
 for(const a of html.matchAll(/\bhref="([^"]+)"/g)){
  const href=a[1];if(href.startsWith('#'))check(ids.includes(href.slice(1)),'Existing section anchor');
  if(href.startsWith('/pages/'))check(existsSync('public'+href.split('?')[0]+'index.html'),'Existing local route');
 }
 for(const image of html.matchAll(/<img\b[^>]*>/g))check(/\balt="/.test(image[0])&&/\bwidth="/.test(image[0])&&/\bheight="/.test(image[0]),'Image alternatives and dimensions');
 check(registry.some(p=>p.path===path&&p.status==='draft'),'Registered draft');
 if(path.includes('landing-03')){
  check((html.match(/<h1\b/g)||[]).length===1,'One H1');
  check((html.match(/data-begin/g)||[]).length===3,'Three deliberate next actions');
  check(html.includes(OFFER.annual.display)&&html.includes(OFFER.monthly.display)&&html.includes('No refunds.'),'Current offer terms');
  check(!html.includes('27:59')&&!html.includes('data-filter='),'No production notes or catalog shopping task');
  check(!/\bCore\b|\bLove\b|\bVitality\b|\bAbundance\b/.test(html.slice(0,html.indexOf('</section>'))),'No opening taxonomy');
  check(!/Mormon|Hormozi|church|scripture/i.test(html),'Style reference is not customer doctrine');
  check(html.includes('Nāda Brahma')&&html.includes('rather than scientific proof'),'Metaphysical origin and boundary');
 }
}
const journey=read('public/pages/affiliate-preview/birth-details-03/index.html');
check(!/<input[^>]*type="radio"[^>]*checked/.test(journey),'No preselected plan');
check(journey.includes('Example profile only.')&&journey.includes("weren't calculated"),'Labeled example results');
check(read(root+'journey.js').includes('popstate')&&read(root+'journey.js').includes('form.reset()'),'Back navigation and field clearing retained');
check(read(root+'core.js').includes('/birth-details-03/')&&read(root+'core.js').includes('/landing-03/'),'Version 03 journey continuity');
console.log('Affiliate 03: '+checks+' code/content checks passed. Browser and conversion verification remain separate.');
