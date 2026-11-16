
export const STATUS_INFO={
 draft:{label:'Draft',description:'Still being developed. Not approved for customer publication.'},
 review:{label:'In review',description:'With Michael for review.'},
 approved:{label:'Approved',description:'Approved for handoff. Awaiting customer publication.'},
 'with-walter':{label:'With Walter',description:'Handed over for customer publication.'},
 live:{label:'Live',description:'Published on the customer website. Use the separate customer-site link.'},
 retired:{label:'Retired',description:'Kept for reference and no longer in use.'}
};
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
export function groupRows(rows){
 const order={'astrology-landing':0,'meditation-landing':1,'example-signup':2,'review-guide':3};
 const sorted=[...rows].sort((a,b)=>(order[a.family]??4)-(order[b.family]??4)||a.version-b.version||a.path.localeCompare(b.path));
 return {landing:sorted.filter(p=>p.family==='astrology-landing'||p.family==='meditation-landing'),signup:sorted.filter(p=>p.family==='example-signup'),guides:sorted.filter(p=>p.family==='review-guide'),other:sorted.filter(p=>!Object.hasOwn(order,p.family))};
}
export function previewAddress(page){
 const suffix=/^affiliate_id=\d+$/.test(page.previewQuery)?'?'+page.previewQuery:'';
 return page.url?page.url+suffix:'';
}
export function liveAddress(value){
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:'';}catch{return '';}
}
