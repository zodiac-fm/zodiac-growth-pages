
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {makeRegister,partitionRows,previewAddress,liveAddress,searchText} from './register-model.mjs';
import {renderHub} from './register-render.mjs';
const base={title:'Astrology copy',status:'draft',updated:'2026-11-16',liveUrl:'',label:'Astrology landing page',summary:'For astrology readers.',family:'astrology-landing'};
const fixture=[{...base,path:'astrology-affiliate/landing-02'},{...base,path:'astrology-affiliate/landing-10'},{...base,path:'astrology-affiliate/landing-11',status:'retired'}];
const disk=fixture.map(p=>p.path);
const data=makeRegister(fixture,disk),parts=partitionRows(data.rows);
assert.equal(parts.start[0].version,10,'Select versions numerically and do not promote a retired version');
assert.equal(parts.start[0].status,'draft','Newest does not mean approved');
assert.equal(parts.history.reduce((n,v)=>n+v.rows.length,0),2,'Preserve earlier and retired records');
const missing=makeRegister(fixture,disk.filter(p=>!p.endsWith('-10')));
assert.equal(partitionRows(missing.rows).start[0].version,2,'Fall back from a missing newest folder');
assert.equal(missing.rows.find(p=>p.version===10).url,'','No broken button for a missing page');
const unlisted=makeRegister([],['new-preview/page-01']);
assert.ok(unlisted.rows[0].needsDetails&&unlisted.rows[0].url,'An unlisted page remains discoverable');
assert.equal(partitionRows(unlisted.rows).other.length,1,'Unknown page families remain visible');
assert.ok(makeRegister([{...base,path:'one/two',status:'constructor'}],['one/two']).rows[0].needsDetails,'Inherited object properties are not statuses');
assert.equal(previewAddress({url:'/pages/one/two/',previewQuery:'affiliate_id=52145'}),'/pages/one/two/?affiliate_id=52145','Keep the example partner on the preview link');
assert.equal(previewAddress({url:'/pages/one/two/',previewQuery:'redirect=https://untrusted.invalid'}),'/pages/one/two/','No untrusted query destination');
assert.equal(liveAddress('javascript:alert(1)'),'', 'Reject unsafe live links');
assert.equal(liveAddress('https://zodiac.fm/example'),'https://zodiac.fm/example','Keep a valid separate customer-site link');
const injection=makeRegister([{...base,path:'one/two',title:'<script>bad()</script>',label:'<img src=x onerror=bad()>',summary:'A & B'}],['one/two']);
const template=readFileSync('templates/register/index.html','utf8');
const protectedHTML=renderHub(template,injection);
assert.ok(protectedHTML.includes('&lt;img')&&!protectedHTML.includes('<img src=x'),'Escape displayed metadata');
assert.ok(protectedHTML.includes('A &amp; B'),'Escape text and attributes consistently');
const actual=JSON.parse(readFileSync('public/register.json','utf8'));
const listed=JSON.parse(readFileSync('pages.json','utf8'));
const html=readFileSync('public/index.html','utf8');
assert.equal(actual.rows.length,new Set(listed.map(p=>p.path)).size,'All registered pages are preserved');
for(const entry of listed){
 const row=actual.rows.find(p=>p.path===entry.path);assert.ok(row,'Registered path exists');
 for(const key of ['title','status','updated','liveUrl'])assert.equal(row[key],entry[key],'Preserve original metadata '+key);
 if(!row.missingFolder){
  assert.ok(html.includes('href="'+previewAddress(row)+'"'),'Every available page has a server-rendered link');
  assert.ok(existsSync('public'+row.url+'index.html'),'Preview destination exists');
 }
 assert.ok(searchText(row).includes('version '+row.version),'Versions are searchable');
}
assert.equal((html.match(/data-page data-search=/g)||[]).length,actual.rows.length,'Render each page once');
assert.ok(!html.includes('{{')&&!html.includes('Loading the list'),'No blank loading state or unrendered content');
assert.ok(html.includes('Website preview hub')&&html.includes("don't start trials or take payments"),'Explain context and preview limits');
assert.ok(!/<details data-page-group open/.test(html),'Earlier versions start collapsed');
assert.ok(html.includes('id="page-search"')&&html.includes('role="status"'),'Labeled search and live result count');
const script=readFileSync('public/assets/register/register.js','utf8');
assert.ok(!/fetch\(|localStorage|sessionStorage|sendBeacon/.test(script),'Search stays local without requests or persistence');

function mockNode(extra={}){
 return {hidden:false,value:'',textContent:'',handlers:{},addEventListener(type,fn){this.handlers[type]=fn;},focus(){this.focused=true;},...extra};
}
const searchRows=actual.rows.map(page=>mockNode({dataset:{search:searchText(page)},page}));
const selection=partitionRows(actual.rows);
const nodesFor=rows=>rows.map(page=>searchRows.find(node=>node.page.path===page.path));
const startNodes=nodesFor(selection.start),guideNodes=selection.guide?nodesFor([selection.guide]):[];
const searchGroups=[
 mockNode({tagName:'OL',querySelectorAll:()=>startNodes}),
 mockNode({tagName:'UL',querySelectorAll:()=>guideNodes}),
 ...selection.history.map(group=>mockNode({tagName:'DETAILS',open:false,version:group.version,querySelectorAll:()=>nodesFor(group.rows)}))
];
const latestSection=mockNode({querySelectorAll:()=>[...startNodes,...guideNodes]});
const historySection=mockNode({querySelectorAll:()=>searchRows.filter(node=>!startNodes.includes(node)&&!guideNodes.includes(node))});
const searchNodes={'[data-search]':mockNode({hidden:true}),'#page-search':mockNode(),'#clear-search':mockNode(),'#search-status':mockNode(),'#no-results':mockNode()};
const documentMock={querySelector:key=>searchNodes[key]||null,querySelectorAll:key=>key==='[data-page]'?searchRows:key==='[data-page-group]'?searchGroups:key==='[data-page-section]'?[latestSection,historySection]:[]};
new Function('document',script)(documentMock);
assert.ok(!searchNodes['[data-search]'].hidden,'Enable search only when the controller runs');
assert.ok(searchGroups.filter(g=>g.tagName==='DETAILS').every(g=>!g.open),'History stays collapsed initially');
searchNodes['#page-search'].value='version 2';searchNodes['#page-search'].handlers.input();
assert.equal(searchRows.filter(n=>!n.hidden).length,actual.rows.filter(p=>p.version===2).length,'Search finds all version 2 pages');
assert.ok(searchGroups.find(g=>g.version===2).open&&latestSection.hidden,'Matching history opens and unrelated latest pages hide');
searchNodes['#page-search'].value='meditation';searchNodes['#page-search'].handlers.input();
assert.equal(searchRows.filter(n=>!n.hidden).length,actual.rows.filter(p=>p.family==='meditation-landing').length,'Find meditation pages across versions');
searchNodes['#page-search'].value='signup';searchNodes['#page-search'].handlers.input();
assert.equal(searchRows.filter(n=>!n.hidden).length,actual.rows.filter(p=>p.family==='example-signup').length,'Find signup without needing the folder name');
searchNodes['#page-search'].value='no-such-page-zz';searchNodes['#page-search'].handlers.input();
assert.ok(!searchNodes['#no-results'].hidden&&searchNodes['#search-status'].textContent==='0 matching previews.','Readable no-result state');
searchNodes['#clear-search'].handlers.click();
assert.equal(searchRows.filter(n=>!n.hidden).length,actual.rows.length,'Clearing restores all preserved pages');
assert.ok(!latestSection.hidden&&searchGroups.filter(g=>g.tagName==='DETAILS').every(g=>!g.open)&&searchNodes['#page-search'].focused,'Clear restores latest-first view and search focus');
searchNodes['#page-search'].value='version 1';searchNodes['#page-search'].handlers.input();searchNodes['#page-search'].handlers.keydown({key:'Escape'});
assert.equal(searchNodes['#page-search'].value,'','Escape clears the search');

console.log('Preview register checks passed: versions, metadata preservation, links, safety, and no-JavaScript content.');
