
(() => {
 'use strict';
 const search=document.querySelector('[data-search]');
 const input=document.querySelector('#page-search');
 const clear=document.querySelector('#clear-search');
 const status=document.querySelector('#search-status');
 const pages=[...document.querySelectorAll('[data-page]')];
 const groups=[...document.querySelectorAll('[data-page-group]')];
 const sections=[...document.querySelectorAll('[data-page-section]')];
 if(!search||!input)return;
 search.hidden=false;
 const normalize=value=>value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').trim();
 function update(){
  const query=normalize(input.value),terms=query.split(/\s+/).filter(Boolean);
  let count=0;
  for(const page of pages){
   const text=normalize(page.dataset.search||'');
   const matches=terms.every(term=>text.includes(term));
   page.hidden=!matches;if(matches)count++;
  }
  for(const group of groups){
   const any=[...group.querySelectorAll('[data-page]')].some(page=>!page.hidden);
   group.hidden=!any;
   if(group.tagName==='DETAILS')group.open=!!query&&any;
  }
  for(const section of sections)section.hidden=![...section.querySelectorAll('[data-page]')].some(page=>!page.hidden);
  document.querySelector('#no-results').hidden=count>0;
  clear.hidden=!query;
  status.textContent=query?count+' matching '+(count===1?'preview':'previews')+'.':'Latest previews are shown first. Earlier versions are collapsed below.';
 }
 input.addEventListener('input',update);
 clear.addEventListener('click',()=>{input.value='';update();input.focus();});
 input.addEventListener('keydown',event=>{if(event.key==='Escape'){input.value='';update();}});
 update();
})();
