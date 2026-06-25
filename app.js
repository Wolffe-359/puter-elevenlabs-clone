const text=document.getElementById('text');
const count=document.getElementById('count');
const player=document.getElementById('player');
const historyDiv=document.getElementById('history');
let currentAudio=null;

text.value=localStorage.getItem('savedText')||'';
count.textContent=text.value.length+' characters';

function saveHistory(item){
 const h=JSON.parse(localStorage.getItem('ttsHistory')||'[]');
 h.unshift(item);
 localStorage.setItem('ttsHistory',JSON.stringify(h.slice(0,20)));
 renderHistory();
}

function renderHistory(){
 const h=JSON.parse(localStorage.getItem('ttsHistory')||'[]');
 historyDiv.innerHTML='';
 h.forEach(x=>{
  const d=document.createElement('div');
  d.className='history-item';
  d.textContent=x.time+' - '+x.text.slice(0,40);
  historyDiv.appendChild(d);
 });
}
renderHistory();

text.addEventListener('input',()=>{
 count.textContent=text.value.length+' characters';
 localStorage.setItem('savedText',text.value);
});

async function generateSpeech(content){
 return await puter.ai.txt2speech(content,{
  provider:"elevenlabs",
  voice:document.getElementById('voice').value,
  model:document.getElementById('model').value,
  output_format:document.getElementById('format').value
 });
}

document.getElementById('generate').onclick=async()=>{
 try{
  const audio=await generateSpeech(text.value);
  currentAudio=audio;
  player.src=audio.toString();
  player.play();
  saveHistory({time:new Date().toLocaleString(),text:text.value});
 }catch(e){alert(e.message);}
};

document.getElementById('download').onclick=()=>{
 if(!currentAudio){alert('Generate audio first');return;}
 const a=document.createElement('a');
 a.href=currentAudio.toString();
 a.download='speech_'+Date.now()+'.mp3';
 a.click();
};

document.getElementById('batchGenerate').onclick=async()=>{
 const scripts=document.getElementById('batchText').value
 .split('---').map(x=>x.trim()).filter(Boolean);

 const progress=document.getElementById('progress');
 for(let i=0;i<scripts.length;i++){
   progress.textContent=`${i+1} / ${scripts.length} completed`;
   try{ await generateSpeech(scripts[i]); }catch(e){ console.error(e); }
 }
 progress.textContent='Finished';
};
