
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {makeRegister,groupRows,previewAddress,liveAddress} from './register-model.mjs';
import {renderHub} from './register-render.mjs';
const read=p=>readFileSync(p,'utf8');
const base={title:'Astrology page',status:'draft',updated:'2026-11-16',liveUrl:'',label:'Astrology landing page',family:'astrology-landing'};
const fixture=[{...base,path:'astrology-affiliate/landing-10'},{...base,path:'astrology-affiliate/landing-02'},{...base,path:'astrology-affiliate/landing-11',status:'retired'}];
const grouped=groupRows(makeRegister(fixture,fixture.map(p=>p.path)).rows);
assert.deepEqual(grouped.landing.map(p=>p.version),[2,10,11],'All versions stay visible and sort numerically');
assert.equal(grouped.landing[2].status,'retired','A retired status is retained without hiding its record');
assert.equal(grouped.landing[0].status,'draft','Grouping never changes approval status');
const missing=makeRegister(fixture,['astrology-affiliate/landing-02']);
assert.equal(groupRows(missing.rows).landing.length,3,'Missing folders remain in the version table');
assert.equal(missing.rows.find(p=>p.version===10).url,'','A missing folder has no broken preview link');
const unknown=makeRegister([],['new-preview/page-01']);
assert.ok(unknown.rows[0].needsDetails&&groupRows(unknown.rows).other.length===1,'Unlisted page types remain visible');
assert.ok(makeRegister([{...base,path:'one/two',status:'constructor'}],['one/two']).rows[0].needsDetails,'Invalid statuses do not inherit object properties');
assert.equal(previewAddress({url:'/pages/one/two/',previewQuery:'affiliate_id=52145'}),'/pages/one/two/?affiliate_id=52145');
assert.equal(previewAddress({url:'/pages/one/two/',previewQuery:'redirect=https://untrusted.invalid'}),'/pages/one/two/');
assert.equal(liveAddress('javascript:alert(1)'),'', 'Unsafe addresses are rejected');
assert.equal(liveAddress('https://zodiac.fm/example'),'https://zodiac.fm/example');
const data=JSON.parse(read('public/register.json'));
const listed=JSON.parse(read('pages.json'));
const html=read('public/index.html');
assert.equal(data.rows.length,new Set(listed.map(p=>p.path)).size,'Every page remains registered');
assert.equal((html.match(/<tr data-page="/g)||[]).length,data.rows.length,'Every page appears once in a table');
for(const entry of listed){
 const row=data.rows.find(p=>p.path===entry.path);assert.ok(row);
 for(const key of ['title','status','updated','liveUrl'])assert.equal(row[key],entry[key],'Keep original metadata '+key);
 if(!row.missingFolder){assert.ok(html.includes('href="'+previewAddress(row)+'"'));assert.ok(existsSync('public'+row.url+'index.html'));}
}
assert.ok(html.includes('GTM work')&&html.includes('Landing pages')&&html.includes('Example signup flows')&&html.includes('Review guides'),'Clear review sections');
assert.ok(html.includes("Version numbers don't indicate approval"),'Version and approval are separate');
assert.ok(!/Earlier drafts|latest previews|Start with the latest|<details|<script|data-search|class="open-link"/i.test(html),'No promoted versions, collapsed content, search, cards, or client script');
assert.equal((html.match(/<table /g)||[]).length,4,'Plain tables for the four current review sections');
assert.ok(html.includes('tabindex="0"')&&html.includes('scope="col"')&&html.includes('scope="row"'),'Tables support keyboard scrolling and have header semantics');
assert.ok(!html.includes('{{')&&!html.includes('Loading the list'),'Content is complete without JavaScript');
const resources=JSON.parse(read('review-links.json'));
assert.equal(data.resources.length,resources.length,'GTM work references are included');
for(const resource of resources)assert.ok(html.includes('href="'+liveAddress(resource.url)+'"'),'Actual GTM work links are present');
const injection=makeRegister([{...base,path:'one/two',revisionNote:'<img src=x onerror=bad()>',examplePartner:'A & B'}],['one/two']);
injection.resources=[];
const escaped=renderHub(read('templates/register/index.html'),injection);
assert.ok(escaped.includes('&lt;img')&&!escaped.includes('<img src=x'),'Escape metadata');
assert.ok(escaped.includes('A &amp; B'));
console.log('GTM register checks passed: all versions visible, original metadata preserved, tables, links, and no-JavaScript content.');
