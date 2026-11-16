
export const STATUS_INFO={
 draft:{label:'Draft',description:'Still being developed. Not approved for customer publication.'},
 review:{label:'In review',description:'With Michael for review.'},
 approved:{label:'Approved',description:'Approved for handoff. Awaiting customer publication.'},
 'with-walter':{label:'With Walter',description:'Handed over for customer publication.'},
 live:{label:'Live',description:'Published on the customer website. Use the separate customer-site link.'},
 retired:{label:'Retired',description:'Kept for reference and no longer in use.'}
};
export const START_FAMILIES=['astrology-landing','meditation-landing','example-signup'];
const text=value=>typeof value==='string'?value:'';
export function inferFamily(path){
 if(/^astrology-affiliate\/landing-\d+$/.test(path))return 'astrology-landing';
 if(/^meditation-affiliate\/landing-\d+$/.test(path))return 'meditation-landing';
 if(/^affiliate-preview\/birth-details-\d+$/.test(path))return 'example-signup';
 if(/^affiliate-preview\/review-\d+$/.test(path))return 'review-guide';
 return 'other';
}
export function makeRegister(listed,onDisk,problem=''){
 const entries=Array.isArray(listed)?listed:[];
 const byPath=new Map(entries.filter(x=>x&&typeof x.path==='string'&&x.path).map(x=>[x.path,x]));
 const paths=[...new Set([...onDisk,...byPath.keys()])];
 const rows=paths.map(path=>{
  const entry=byPath.get(path);
  const status=Object.hasOwn(STATUS_INFO,entry?.status)?entry.status:'draft';
  const missingFolder=!onDisk.includes(path);
  return {path,url:missingFolder?'':'/pages/'+path+'/',funnel:path.split('/')[0],
   title:text(entry?.title)||path,status,updated:text(entry?.updated),liveUrl:text(entry?.liveUrl),
   needsDetails:!entry||!text(entry.title)||!Object.hasOwn(STATUS_INFO,entry.status),missingFolder,
   label:text(entry?.label)||text(entry?.title)||path,summary:text(entry?.summary),
   family:text(entry?.family)||inferFamily(path),version:Number(path.match(/-(\d+)$/)?.[1]||0),
   previewQuery:text(entry?.previewQuery),examplePartner:text(entry?.examplePartner),revisionNote:text(entry?.revisionNote)
  };
 });
 rows.sort((a,b)=>a.funnel.localeCompare(b.funnel)||a.path.localeCompare(b.path));
 return {problem,rows};
}
export function partitionRows(rows){
 const families=[...START_FAMILIES,'review-guide'];
 const latest=[];
 for(const family of families){
  const candidates=rows.filter(p=>p.family===family&&!p.missingFolder&&p.status!=='retired').sort((a,b)=>b.version-a.version||b.updated.localeCompare(a.updated)||a.path.localeCompare(b.path));
  if(candidates[0])latest.push(candidates[0]);
 }
 const chosen=new Set(latest.map(p=>p.path));
 const older=rows.filter(p=>families.includes(p.family)&&!chosen.has(p.path));
 const versions=[...new Set(older.map(p=>p.version))].sort((a,b)=>b-a);
 return {start:latest.filter(p=>START_FAMILIES.includes(p.family)),guide:latest.find(p=>p.family==='review-guide')||null,history:versions.map(version=>({version,rows:older.filter(p=>p.version===version).sort((a,b)=>families.indexOf(a.family)-families.indexOf(b.family))})),other:rows.filter(p=>!families.includes(p.family))};
}
export function previewAddress(page){
 const suffix=/^affiliate_id=\d+$/.test(page.previewQuery)?'?'+page.previewQuery:'';
 return page.url?page.url+suffix:'';
}
export function liveAddress(value){
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:'';}catch{return '';}
}
export function searchText(page){
 return [page.label,page.summary,page.title,page.path,page.family,page.status,STATUS_INFO[page.status]?.label,page.examplePartner,page.revisionNote,'version '+page.version,'version '+String(page.version).padStart(2,'0'),'v'+page.version,
 page.family==='example-signup'?'signup sign-up sample birth details results plan membership':'',
 page.family==='review-guide'?'guide walkthrough context comparison':''].join(' ');
}
