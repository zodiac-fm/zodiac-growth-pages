// Build the complete, readable hub and JSON register. Page errors stay visible without hiding records.
import {existsSync,mkdirSync,readFileSync,readdirSync,statSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {makeRegister} from './register-model.mjs';
import {renderHub} from './register-render.mjs';
const root='public/pages';
const folders=dir=>existsSync(dir)?readdirSync(dir).filter(name=>statSync(join(dir,name)).isDirectory()):[];
let listed=[],problem='';
try{const parsed=JSON.parse(readFileSync('pages.json','utf8'));if(Array.isArray(parsed))listed=parsed;else problem='The page list is not in the expected format.';}catch{problem='The page list could not be read.';}
const onDisk=folders(root).flatMap(funnel=>folders(join(root,funnel)).filter(page=>existsSync(join(root,funnel,page,'index.html'))).map(page=>funnel+'/'+page));
const data=makeRegister(listed,onDisk,problem);
mkdirSync('public',{recursive:true});
writeFileSync('public/register.json',JSON.stringify(data,null,2));
writeFileSync('public/index.html',renderHub(readFileSync('templates/register/index.html','utf8'),data));
console.log('Preview hub built with '+data.rows.length+' pages.'+(problem?' '+problem:''));
