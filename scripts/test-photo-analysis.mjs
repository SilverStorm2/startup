import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import sharp from 'sharp';
import nextEnv from '@next/env';
import { fileURLToPath } from 'node:url';
// Load the same project environment as Next.js, regardless of the shell's cwd.
nextEnv.loadEnvConfig(fileURLToPath(new URL('..', import.meta.url)));
const transpile = s => ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const url = s => `data:text/javascript;base64,${Buffer.from(s).toString('base64')}`;
const typesUrl=url(transpile(await readFile(new URL('../lib/report-types.ts',import.meta.url),'utf8')));
const analysisUrl=url(transpile(await readFile(new URL('../lib/photo-analysis.ts',import.meta.url),'utf8')).replace('from "./report-types"',`from ${JSON.stringify(typesUrl)}`));
const {parsePhotoSuggestion}=await import(analysisUrl);
assert.equal(parsePhotoSuggestion('{"suggestion":null}'),null);
assert.deepEqual(parsePhotoSuggestion('{"suggestion":{"category":"infrastructure","subcategoryIndex":0}}'),{category:'infrastructure',subcategoryIndex:0});
for(const content of [null,'{}','bad','{"suggestion":{"category":"invented","subcategoryIndex":0}}','{"suggestion":{"category":"infrastructure","subcategoryIndex":-1}}','{"suggestion":{"category":"infrastructure","subcategoryIndex":99}}','{"suggestion":{"category":"infrastructure","subcategoryIndex":"0"}}']) assert.throws(()=>parsePhotoSuggestion(content));
const serverSource=transpile(await readFile(new URL('../lib/server-photo-analysis.ts',import.meta.url),'utf8')).replace('from "sharp"',`from ${JSON.stringify(import.meta.resolve('sharp'))}`).replace('from "./report-types"',`from ${JSON.stringify(typesUrl)}`).replace('from "./photo-analysis"',`from ${JSON.stringify(analysisUrl)}`);
const {analyzePhoto,visionModel}=await import(url(serverSource));
const realFetch=globalThis.fetch, realToken=process.env.HF_TOKEN;
const image=new Blob([await sharp({create:{width:1200,height:800,channels:3,background:'#bbbbbb'}}).png().toBuffer()],{type:'image/png'});
process.env.HF_TOKEN='test-server-token';
let requests=0;
globalThis.fetch=async(endpoint,options)=>{ requests++;assert.equal(endpoint,'https://router.huggingface.co/v1/chat/completions');assert.equal(options.headers.Authorization,'Bearer test-server-token');const body=JSON.parse(options.body);assert.equal(body.model,visionModel);const data=body.messages[0].content.find(x=>x.type==='image_url').image_url.url;assert(data.startsWith('data:image/jpeg;base64,'));const meta=await sharp(Buffer.from(data.split(',')[1],'base64')).metadata();assert(meta.width<=768&&meta.height<=768);return Response.json({choices:[{message:{content:'{"suggestion":{"category":"infrastructure","subcategoryIndex":0}}'}}]});};
assert.equal((await analyzePhoto(image)).subcategoryIndex,0);
for(const [status,code] of [[401,'HF_AUTH_ERROR'],[402,'HF_CREDITS_REQUIRED'],[429,'HF_RATE_LIMIT'],[503,'HF_UNAVAILABLE']]) {globalThis.fetch=async()=>new Response('',{status});await assert.rejects(analyzePhoto(image),e=>e.code===code);}
globalThis.fetch=async()=>Response.json({choices:[{message:{content:'invalid'}}]});await assert.rejects(analyzePhoto(image),e=>e.code==='HF_INVALID_RESPONSE');
globalThis.fetch=async()=>{throw new Error('network failure');};await assert.rejects(analyzePhoto(image),e=>e.code==='HF_UNAVAILABLE');
delete process.env.HF_TOKEN;await assert.rejects(analyzePhoto(image),e=>e.code==='HF_TOKEN_MISSING');
globalThis.fetch=realFetch;if(realToken)process.env.HF_TOKEN=realToken;
console.log('Photo tests passed: mapping, JPEG resizing, real image payload, server token and explicit HF errors.');
if(process.argv.includes('--live')){try{const bytes=await readFile(new URL('../public/og/krk-alert-og.png',import.meta.url));const result=await analyzePhoto(new Blob([bytes],{type:'image/png'}));console.log('Live HF response:',JSON.stringify({model:visionModel,suggestion:result}));}catch(e){console.error('Live HF error:',e.code||'UNKNOWN');process.exitCode=1;}}
