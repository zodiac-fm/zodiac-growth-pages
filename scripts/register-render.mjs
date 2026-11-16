
import {STATUS_INFO,groupRows,previewAddress,liveAddress} from './register-model.mjs';
export const escapeHTML=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#39;");
function table(headers,rows,kind,title){
 if(!rows.length)return '<p class="empty">No items listed.</p>';
 return '<div class="table-wrap" role="region" aria-label="'+escapeHTML(title)+'" tabindex="0"><table class="'+kind+'"><thead><tr>'+headers.map(h=>'<th scope="col">'+escapeHTML(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div>';
}
function statusCell(page){
 return '<td class="status">'+escapeHTML(STATUS_INFO[page.status].label)+(page.needsDetails?'<p class="warning">Name or status needs details.</p>':'')+'</td>';
}
function linkCell(page){
 const href=previewAddress(page),live=page.status==='live'?liveAddress(page.liveUrl):'';
 return '<td class="link">'+(href?'<a href="'+escapeHTML(href)+'" aria-label="'+escapeHTML('Open '+page.label+', version '+page.version)+'">Open preview</a>':'Unavailable')+(live?'<br><a href="'+escapeHTML(live)+'">Customer page</a>':'')+(page.status==='live'&&!live?'<p class="warning">Customer link needed.</p>':'')+'</td>';
}
function versionCell(page){return '<td class="version">'+(page.version?escapeHTML(page.version):'Unnumbered')+'</td>';}
export function renderHub(template,data){
 const esc=escapeHTML,groups=groupRows(data.rows);
 const work=table(['Work','What to review','Link'],(data.resources||[]).map(item=>'<tr><th scope="row">'+esc(item.title)+'</th><td>'+esc(item.summary)+'</td><td class="link">'+(liveAddress(item.url)?'<a href="'+esc(liveAddress(item.url))+'">Open work</a>':'Unavailable')+'</td></tr>'),'work','GTM work');
 const landing=table(['Audience','Version','Approach','Example partner','Status','Preview'],groups.landing.map(page=>'<tr data-page="'+esc(page.path)+'"><th scope="row">'+(page.family==='astrology-landing'?'Astrology':'Meditation')+'</th>'+versionCell(page)+'<td>'+esc(page.revisionNote||page.summary)+'</td><td>'+esc(page.examplePartner||'Generic example')+'</td>'+statusCell(page)+linkCell(page)+'</tr>'),'landing','Landing pages');
 const signup=table(['Version','What to review','Status','Preview'],groups.signup.map(page=>'<tr data-page="'+esc(page.path)+'"><th scope="row">'+esc(page.version||'Unnumbered')+'</th><td>'+esc(page.revisionNote||page.summary)+'</td>'+statusCell(page)+linkCell(page)+'</tr>'),'signup','Example signup flows');
 const guides=table(['Version','What it covers','Status','Guide'],groups.guides.map(page=>'<tr data-page="'+esc(page.path)+'"><th scope="row">'+esc(page.version||'Unnumbered')+'</th><td>'+esc(page.revisionNote||page.summary)+'</td>'+statusCell(page)+linkCell(page)+'</tr>'),'guides','Review guides');
 const other=groups.other.length?'<section><h2>Other previews</h2>'+table(['Page','Version','Purpose','Status','Preview'],groups.other.map(page=>'<tr data-page="'+esc(page.path)+'"><th scope="row">'+esc(page.label)+'</th>'+versionCell(page)+'<td>'+esc(page.summary||page.title)+'</td>'+statusCell(page)+linkCell(page)+'</tr>'),'other','Other previews')+'</section>':'';
 const flagged=data.rows.filter(p=>p.needsDetails||p.missingFolder||(p.status==='live'&&!liveAddress(p.liveUrl)));
 const issues=data.problem||flagged.length?'<p class="issue">'+esc(data.problem||'Some entries need details or a working page link. They remain listed in the tables.')+'</p>':'';
 const values={issues,work,landing,signup,guides,other};
 return template.replace(/\{\{(\w+)\}\}/g,(_,key)=>values[key]??'');
}
