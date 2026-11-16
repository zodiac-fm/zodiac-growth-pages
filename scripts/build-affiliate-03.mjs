
import { readFileSync,readdirSync,mkdirSync,writeFileSync } from 'node:fs';
import { dirname,join } from 'node:path';
function record(path,name){
 const text=readFileSync(path,'utf8'),marker='export const '+name+' = ';
 return JSON.parse(text.slice(text.indexOf(marker)+marker.length).trim().replace(/;$/,''));
}
const offer=record('public/assets/affiliate-01/offers.js','OFFER');
const tracks=record('public/assets/affiliate-02/catalog.js','CATALOG');
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const rows=tracks.map(t=>'<li class="track-row" data-track="'+esc(t.id)+'"><div class="track-top"><h3>'+esc(t.name)+'</h3><span class="track-duration">'+t.minutes+' min</span></div><p class="track-character">'+esc(t.line||t.purposes.join(' · '))+'</p><p class="track-access">'+(t.free?'Stays free':'Included with membership')+'</p></li>').join('\n');
const values={annualDisplay:offer.annual.display,monthlyDisplay:offer.monthly.display,annualCharge:'$'+offer.annual.charge,monthlyCharge:'$'+offer.monthly.charge,monthlyYearTotal:'$'+offer.monthlyYearTotal,trialDays:offer.trialDays,billingDay:offer.billingDay,terms:offer.terms,short:offer.short,catalogRows:rows};
function walk(dir){
 for(const entry of readdirSync(dir,{withFileTypes:true})){
  const path=join(dir,entry.name);
  if(entry.isDirectory())walk(path);
  else if(entry.name==='index.html'){
   const html=readFileSync(path,'utf8').replace(/\{\{(\w+)\}\}/g,(_,key)=>{
    if(!(key in values))throw new Error('Unrecognized field '+key);
    return key==='catalogRows'?values[key]:esc(values[key]);
   });
   const dest=path.replace('templates/affiliate-03/','public/pages/');
   mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,html);
  }
 }
}
walk('templates/affiliate-03');
console.log('Rendered affiliate version 03 from the shared offer and approved catalog.');
