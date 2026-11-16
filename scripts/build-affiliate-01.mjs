// Render the three new preview pages from one offer record. Earlier pages are untouched.
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
const offerFile=readFileSync('public/assets/affiliate-01/offers.js','utf8');
const offer=JSON.parse(offerFile.slice(offerFile.indexOf('export const OFFER = ')+21).trim().replace(/;$/,''));
const values={
annualDisplay:offer.annual.display,monthlyDisplay:offer.monthly.display,
terms:offer.terms,short:offer.short,annualCharge:'$'+offer.annual.charge,
monthlyCharge:'$'+offer.monthly.charge,monthlyYearTotal:'$'+offer.monthlyYearTotal,
trialDays:offer.trialDays,billingDay:offer.billingDay
};
function escapeHTML(value){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');}
function render(dir) {
 for(const entry of readdirSync(dir,{withFileTypes:true})) {
  const path=join(dir,entry.name);
  if(entry.isDirectory())render(path);
  else if(entry.name==='index.html'){
   const destination=path.replace('templates/affiliate-01/','public/pages/');
   const html=readFileSync(path,'utf8').replace(/\{\{(\w+)\}\}/g,(_,key)=>{
    if(!(key in values))throw new Error('Unknown offer field '+key);
    return escapeHTML(values[key]);
   });
   mkdirSync(dirname(destination),{recursive:true});writeFileSync(destination,html);
  }
 }
}
render('templates/affiliate-01');
console.log('Rendered affiliate preview pages from the current offer record.');
