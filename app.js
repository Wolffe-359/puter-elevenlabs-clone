
const MAX_CHARS=3000;
function splitTextSmart(text,maxChars=MAX_CHARS){
const chunks=[];let remaining=text.trim();
while(remaining.length>maxChars){
let split=remaining.lastIndexOf("\n\n",maxChars);
if(split<0) split=remaining.lastIndexOf(". ",maxChars);
if(split<0) split=remaining.lastIndexOf(" ",maxChars);
if(split<0) split=maxChars;
chunks.push(remaining.slice(0,split).trim());
remaining=remaining.slice(split).trim();}
if(remaining) chunks.push(remaining); return chunks;}
document.getElementById('generate').onclick=async()=>{
const chunks=splitTextSmart(document.getElementById('text').value);
const urls=[]; const p=document.getElementById('progress');
for(let i=0;i<chunks.length;i++){
p.textContent=`Generating ${i+1}/${chunks.length}`;
const audio=await puter.ai.txt2speech(chunks[i],{provider:'elevenlabs',voice:'hIreuBly94QFepU63yel',model:'eleven_multilingual_v2'});
urls.push(audio.src);
}
let total=0, arrays=[];
for(const u of urls){const r=await fetch(u); const b=await r.arrayBuffer(); arrays.push(new Uint8Array(b)); total+=b.byteLength;}
const merged=new Uint8Array(total); let o=0;
for(const a of arrays){merged.set(a,o); o+=a.length;}
const blob=new Blob([merged],{type:'audio/mpeg'});
const url=URL.createObjectURL(blob);
player.src=url;
downloadLink.href=url;
downloadLink.download='merged_tts.mp3';
downloadLink.style.display='block';
p.textContent='Finished';
};
