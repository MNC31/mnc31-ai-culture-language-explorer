import "./style.css";
const records = [
  {id:"demo-01",subject:"World Religions",category:"Humanities",sensitivity:"CS",culture:"Western Culture",region:"Europe",country:"Italy",
   en:{q:"Which city is traditionally associated with Vatican City?",o:["Rome","Milan","Venice","Florence"],a:"A",m:"A — Rome",match:true},
   zh:{q:"哪个城市通常被认为与梵蒂冈城有关？",o:["罗马","米兰","威尼斯","佛罗伦萨"],a:"A",m:"A — 罗马",match:true}},
  {id:"demo-02",subject:"Geography",category:"Social Sciences",sensitivity:"CA",culture:"Global",region:"East Asia",country:"China",
   en:{q:"Which river is the longest in China?",o:["Yellow River","Yangtze River","Pearl River","Mekong River"],a:"B",m:"B — Yangtze River",match:true},
   zh:{q:"中国最长的河流是哪一条？",o:["黄河","长江","珠江","湄公河"],a:"B",m:"C — 珠江",match:false}},
  {id:"demo-03",subject:"Cultural Knowledge",category:"Humanities",sensitivity:"CS",culture:"Chinese Culture",region:"East Asia",country:"China",
   en:{q:"Which festival is traditionally associated with mooncakes?",o:["Spring Festival","Mid-Autumn Festival","Dragon Boat Festival","Qingming Festival"],a:"B",m:"B — Mid-Autumn Festival",match:true},
   zh:{q:"哪一个节日通常与月饼联系在一起？",o:["春节","中秋节","端午节","清明节"],a:"B",m:"B — 中秋节",match:true}}
];
let i=0, lang="both", sens="all";
const opts=x=>x.o.map((v,n)=>`<div class="option"><b>${String.fromCharCode(65+n)}</b>${v}</div>`).join("");
const card=(x,title)=>`<article class="card"><small>● ${title}</small><h3>${x.q}</h3><div>${opts(x)}</div><p class="key">Benchmark answer: <b>${x.a}</b></p></article>`;
const response=(x,title)=>`<article class="response"><div class="rh"><b>${title}</b><span class="${x.match?"match":"mismatch"}">${x.match?"Matches key":"Does not match key"}</span></div><p>${x.m}</p><small>Extracted answer: <b>${x.match?x.a:"C"}</b></small></article>`;
function render(){const r=records[i]; const show=sens==="all"||r.sensitivity===sens;
document.querySelector("#app").innerHTML=`
<header><div class="brand"><b>AI</b><span><strong>Culture & Language Explorer</strong><small>Interactive evaluation prototype</small></span></div><nav><a href="#explore">Explore</a><a href="#comparator">Comparator</a><a href="#methodology">Methodology</a></nav></header>
<main><section class="hero"><label>MULTILINGUAL AI EVALUATION</label><h1>Does changing the language<br><i>change the context?</i></h1><p>A starting point for exploring matched English and Simplified Chinese evaluation examples, cultural metadata, and precomputed model responses.</p><a href="#explore">Explore the demo ↓</a></section>
<section id="explore"><div class="heading"><div><label>01 · PAIRED EXPLORATION</label><h2>Explore matched questions</h2></div><small>${i+1} / ${records.length}</small></div>
<div class="toolbar"><label>Language<select id="lang"><option value="both">English + Chinese</option><option value="en">English only</option><option value="zh">Simplified Chinese only</option></select></label><label>Cultural sensitivity<select id="sens"><option value="all">All</option><option value="CS">Culturally sensitive (CS)</option><option value="CA">Culturally agnostic (CA)</option></select></label><button id="prev">←</button><button id="next">→</button></div>
${show?`<div class="meta"><span><b>Subject</b> ${r.subject}</span><span><b>Category</b> ${r.category}</span><span><b>Label</b> ${r.sensitivity}</span><span><b>Culture</b> ${r.culture}</span><span><b>Region</b> ${r.region}</span></div><div class="grid">${lang!=="zh"?card(r.en,"English"):""}${lang!=="en"?card(r.zh,"简体中文 · Simplified Chinese"):""}</div>`:"<div class="empty">This record does not match the selected sensitivity filter. Try another example.</div>"}</section>
<section id="comparator" class="dark"><div class="heading"><div><label>02 · PRECOMPUTED COMPARATOR</label><h2>What did the model output?</h2></div><small>NOT A LIVE CHATBOT</small></div><p>These demo outputs show the future comparison interface. Production records will include model, version, prompt, date, and decoding metadata.</p><div class="grid">${response(r.en,"English prompt")}${response(r.zh,"Simplified Chinese prompt")}</div></section>
<section id="methodology"><label>03 · NEXT PHASE</label><h2>Keep the evidence visible.</h2><div class="methods"><div><b>01</b><h3>Source metadata</h3><p>Dataset, record ID, language, subject, culture, region, and sensitivity stay attached to each example.</p></div><div><b>02</b><h3>Model outputs</h3><p>Saved responses will be separate from source records and documented with evaluation conditions.</p></div><div><b>03</b><h3>Comparison notes</h3><p>Later visualizations can distinguish benchmark matches from descriptive observations.</p></div></div></section></main>
<footer>AI Culture & Language Explorer · Prototype <span>Data and methodology will be added later.</span></footer>`;
document.querySelector("#lang").value=lang; document.querySelector("#sens").value=sens;
document.querySelector("#lang").onchange=e=>{lang=e.target.value;render()}; document.querySelector("#sens").onchange=e=>{sens=e.target.value;render()};
document.querySelector("#prev").onclick=()=>{if(i>0)i--;render()}; document.querySelector("#next").onclick=()=>{if(i<records.length-1)i++;render()};
} render();