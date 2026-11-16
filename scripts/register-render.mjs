
import {STATUS_INFO,partitionRows,previewAddress,liveAddress,searchText} from './register-model.mjs';
export const escapeHTML=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#39;");
export function renderEntry(page,{step=null,guide=false}={}){
 const esc=escapeHTML,href=previewAddress(page);
 const info=STATUS_INFO[page.status];
 const label=guide?'Open review guide':page.family==='example-signup'?'Try example signup':page.family==='astrology-landing'?'Open astrology preview':page.family==='meditation-landing'?'Open meditation preview':'Open preview';
 const live=page.status==='live'?liveAddress(page.liveUrl):'';
 const metadata=[
 ['Version',page.version?String(page.version):'Not numbered'],['Updated',page.updated||'Not recorded'],['Status',info.description],['Original title',page.title],['Page location',page.path],...(page.revisionNote?[['About this version',page.revisionNote]]:[])
 ];
 return '<li class="page-entry'+(guide?' guide-entry':'')+'" data-page data-search="'+esc(searchText(page))+'"><article><div class="page-top">'+(step?'<span class="step-number" aria-hidden="true">'+step+'</span>':'')+'<span class="version">'+(page.version?'Version '+page.version:'Unnumbered')+'</span><span class="status">'+esc(info.label)+'</span></div><h3>'+esc(page.label)+'</h3>'+(page.summary?'<p class="page-summary">'+esc(page.summary)+'</p>':'')+(page.examplePartner?'<p class="example">Example partner: '+esc(page.examplePartner)+'</p>':'')+(href?'<a class="open-link" href="'+esc(href)+'" aria-label="'+esc(label+', version '+page.version)+'">'+esc(label)+'</a>':'<p class="issue">Preview unavailable. Its page folder is missing.</p>')+(live?'<a class="live-link" href="'+esc(live)+'">Open the published customer page</a>':'')+(page.status==='live'&&!live?'<p class="issue">Marked Live, but the customer-site address needs checking.</p>':'')+(page.needsDetails?'<p class="issue">The name or status needs to be completed.</p>':'')+'<details class="page-details"><summary>Page details</summary><dl>'+metadata.map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('')+'</dl></details></article></li>';
}
export function renderHub(template,data){
 const esc=escapeHTML,parts=partitionRows(data.rows),groups=[];
 const hasLatest=parts.start.length||parts.guide;
 groups.push('<section class="page-section" data-page-section'+(!hasLatest?' hidden':'')+' aria-labelledby="latest-title"><h2 id="latest-title">Start with the latest previews</h2><p class="section-intro">Open an audience page first. To try the full example, choose “Find my music” on that page and use the sample birth details.</p><ol class="latest-list" role="list" data-page-group>'+parts.start.map((p,i)=>renderEntry(p,{step:i+1})).join('')+'</ol>'+(parts.guide?'<ul class="guide-list" role="list" data-page-group>'+renderEntry(parts.guide,{guide:true})+'</ul>':'')+'</section>');
 if(parts.history.length)groups.push('<section class="page-section history" data-page-section aria-labelledby="history-title"><h2 id="history-title">Earlier drafts</h2><p class="section-intro">Kept for comparison. Start with the latest previews unless you are reviewing an earlier version.</p>'+parts.history.map(group=>{
 const note=group.rows.find(p=>p.revisionNote)?.revisionNote||'Earlier versions kept for comparison.';
 return '<details data-page-group><summary><span class="history-title">Version '+group.version+'</span><span class="history-subtitle">'+esc(note)+' '+group.rows.length+' pages.</span></summary><ul class="page-list" role="list">'+group.rows.map(p=>renderEntry(p)).join('')+'</ul></details>';
 }).join('')+'</section>');
 if(parts.other.length)groups.push('<section class="page-section" data-page-section aria-labelledby="other-title"><h2 id="other-title">Other previews</h2><ul class="page-list" role="list" data-page-group>'+parts.other.map(p=>renderEntry(p)).join('')+'</ul></section>');
 if(!data.rows.length)groups.push('<p class="empty">There are no preview pages yet.</p>');
 const needs=data.rows.filter(p=>p.needsDetails||p.missingFolder||(p.status==='live'&&!liveAddress(p.liveUrl)));
 const issues=data.problem||needs.length?'<aside class="issue"><h2>The list needs a quick check</h2>'+(data.problem?'<p>'+esc(data.problem)+'</p>':'')+(needs.length?'<p>'+needs.length+' '+(needs.length===1?'page needs':'pages need')+' details or a working location. Those entries remain listed below.</p>':'')+'</aside>':'';
 const statuses=Object.entries(STATUS_INFO).map(([,info])=>'<div><dt>'+esc(info.label)+'</dt><dd>'+esc(info.description)+'</dd></div>').join('');
 return template.replace('{{issues}}',issues).replace('{{groups}}',groups.join('')).replace('{{statuses}}',statuses);
}
