(() => {
  const root = document.getElementById("visualization-idioms");
  if (!root) return;

  const state = () => window.aiCultureExplorer || { globalPairs: [], ccCache: {} };
  const status = document.getElementById("idiom-status");

  function esc(value) {
    return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  }

  function countBy(items, getter) {
    return items.reduce((map, item) => {
      const key = getter(item) || "Not annotated";
      map[key] = (map[key] || 0) + 1;
      return map;
    }, {});
  }

  function sortedEntries(map, limit = Infinity) {
    return Object.entries(map).sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0])).slice(0,limit);
  }

  function renderBasic(pairs) {
    const stats = document.getElementById("basic-stats");
    const bars = document.getElementById("basic-bars");
    const categories = countBy(pairs, p => p.category);
    const sensitivity = countBy(pairs, p => p.sensitivity);
    stats.innerHTML = [
      ["Matched pairs", pairs.length],
      ["CS records", sensitivity.CS || 0],
      ["CA records", sensitivity.CA || 0],
      ["Categories", Object.keys(categories).length]
    ].map(([label,value]) => '<div><strong>'+esc(value)+'</strong><span>'+esc(label)+'</span></div>').join("");

    const top = sortedEntries(categories, 8);
    const max = Math.max(...top.map(x=>x[1]),1);
    bars.innerHTML = top.map(([label,value]) =>
      '<div class="mini-bar-row"><span>'+esc(label)+'</span><div><i style="width:'+((value/max)*100)+'%"></i></div><b>'+value+'</b></div>'
    ).join("");
  }

  function renderSimple(pairs) {
    const same = pairs.filter(p => p.en.answer === p.zh.answer).length;
    const changed = pairs.length - same;
    const total = Math.max(pairs.length,1);
    document.getElementById("simple-comparison").innerHTML =
      '<div class="comparison-track"><span style="width:'+((same/total)*100)+'%"></span></div>' +
      '<div class="comparison-legend"><div><strong>'+same+'</strong><span>same benchmark key</span></div>' +
      '<div><strong>'+changed+'</strong><span>different key</span></div></div>';
  }

  const culturalNodes = [
    {id:"classical", label:"Classical Chinese", task:"classical", x:22, y:18, axis:"Traditional · Cultural knowledge", description:"Classical-language interpretation, philosophical schools, cultural values and modern applications."},
    {id:"aesthetics", label:"Aesthetics & Philosophy", task:"aesthetics", x:43, y:30, axis:"Traditional · Cultural knowledge", description:"Chinese aesthetic and philosophical concepts that require context beyond literal translation."},
    {id:"folk", label:"Folk Culture", task:"folk", x:35, y:52, axis:"Cultural practice · Social context", description:"Rituals and everyday cultural practices, including their values, origins and modern continuation."},
    {id:"pragmatic", label:"Pragmatic Intent", task:"pragmatic", x:63, y:58, axis:"Language use · Social interaction", description:"Indirect meaning, politeness and culturally situated conversational intent."},
    {id:"slang", label:"Internet Slang", task:"slang", x:78, y:78, axis:"Modern · Social interaction", description:"Contemporary Chinese internet language, wordplay, tone and social context."},
    {id:"bilingual", label:"Chinese ↔ English Value Alignment", task:"bilingual", x:70, y:28, axis:"Language comparison", description:"Parallel Chinese and English value-oriented prompts for examining language-conditioned response framing."}
  ];

  const edges = [
    ["classical","aesthetics"],["classical","folk"],["classical","bilingual"],
    ["aesthetics","folk"],["aesthetics","bilingual"],["folk","pragmatic"],
    ["pragmatic","slang"],["pragmatic","bilingual"],["bilingual","slang"]
  ];

  function ccRows(task) {
    return state().ccCache?.[task] || [];
  }

  function nodeCount(node) {
    return ccRows(node.task).length;
  }

  function openDatasetViewer(view, task) {
    const datasetSelect = document.getElementById("dataset-select");
    if (datasetSelect) {
      datasetSelect.value = view;
      datasetSelect.dispatchEvent(new Event("change"));
    }

    if (view === "cc" && task) {
      const select = document.getElementById("cc-task");
      if (select) {
        select.value = task;
        select.dispatchEvent(new Event("change"));
      }
    }

    const explorer = document.getElementById("dataset-explorer");
    if (explorer) explorer.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function selectCcTask(task) {
    openDatasetViewer("cc", task);
  }

  function selectGlobalDataset() {
    openDatasetViewer("global");
  }

  function renderCulturalMap() {
    const wrap = document.getElementById("cultural-map");
    if (!wrap) return;

    const loaded = culturalNodes.filter(n => ccRows(n.task).length);
    const width = 900, height = 480;
    const pos = n => ({x: 50 + (n.x/100)*800, y: 45 + (n.y/100)*370});
    const maxCount = Math.max(...loaded.map(nodeCount), 1);

    const lines = edges.map(([a,b]) => {
      const A=culturalNodes.find(n=>n.id===a), B=culturalNodes.find(n=>n.id===b);
      if (!A || !B) return "";
      const p=pos(A), q=pos(B);
      return '<line x1="'+p.x+'" y1="'+p.y+'" x2="'+q.x+'" y2="'+q.y+'" class="culture-edge"/>';
    }).join("");

    const nodes = culturalNodes.map(n => {
      const p=pos(n), count=nodeCount(n);
      const r=12 + 12*(count/maxCount);
      return '<g class="culture-node" tabindex="0" role="button" data-task="'+n.task+'" aria-label="'+esc(n.label)+'">'+
        '<circle cx="'+p.x+'" cy="'+p.y+'" r="'+r+'" class="culture-node-circle"/>'+
        '<text x="'+p.x+'" y="'+(p.y+r+17)+'" text-anchor="middle" class="culture-node-label">'+esc(n.label)+'</text>'+
        '<text x="'+p.x+'" y="'+(p.y+4)+'" text-anchor="middle" class="culture-node-count">'+count+'</text>'+
      '</g>';
    }).join("");

    wrap.innerHTML =
      '<svg viewBox="0 0 '+width+' '+height+'" role="img" aria-label="Interactive CC-Eval cultural context network map">'+
        '<line x1="50" y1="415" x2="850" y2="415" class="culture-axis"/>'+
        '<line x1="50" y1="415" x2="50" y2="45" class="culture-axis"/>'+
        '<text x="450" y="455" text-anchor="middle" class="culture-axis-label">Cultural knowledge ←──────────────→ Language & social interaction</text>'+
        '<text x="25" y="235" text-anchor="middle" transform="rotate(-90 25 235)" class="culture-axis-label">Classical / traditional ←──────────────→ Modern / internet</text>'+
        lines + nodes +
      '</svg>';

    wrap.querySelectorAll(".culture-node").forEach(node => {
      const activate=()=>showNodeDetail(node.dataset.task);
      node.addEventListener("click",activate);
      node.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate();}});
    });
  }

  function showNodeDetail(task) {
    const node=culturalNodes.find(n=>n.task===task);
    const detail=document.getElementById("cultural-map-detail");
    if(!node || !detail) return;

    detail.innerHTML =
      '<span class="detail-kicker">OPENING DATASET VIEWER</span>'+
      '<p><strong>'+esc(node.label)+'</strong> — '+esc(node.description)+'</p>';

    selectCcTask(task);
  }

  function bindVisualizationDatasetEntries() {
    const basic=document.getElementById("idiom-basic");
    const simple=document.getElementById("idiom-simple");

    const bind=(el, action)=>{
      if(!el) return;
      el.addEventListener("click", action);
      el.addEventListener("keydown", e=>{
        if(e.key==="Enter" || e.key===" "){
          e.preventDefault();
          action();
        }
      });
    };

    bind(basic, selectGlobalDataset);
    bind(simple, selectGlobalDataset);
  }

  function renderVisualBridge() {
    const wrap=document.getElementById("visual-bridge");
    const rows=state().imageComparisons || [];
    if(!wrap) return;
    if(!rows.length){
      wrap.innerHTML='<div class="explorer-empty">Visual comparison records are still loading.</div>';
      return;
    }
    const models=[...new Set(rows.map(r=>r.ai))];
    const images=[...new Set(rows.map(r=>r.image))].sort((a,b)=>a-b);
    const cards=models.map(model=>{
      const modelRows=rows.filter(r=>r.ai===model);
      const unique=[...new Set(modelRows.map(r=>r.standardized))].length;
      return '<article class="visual-model-card"><span>'+esc(model)+'</span><strong>'+modelRows.length+'</strong><small>stored image readings</small><em>'+unique+' distinct standardized readings</em></article>';
    }).join("");
    const cells=images.map(image=>{
      const imageRows=rows.filter(r=>r.image===image);
      const unique=[...new Set(imageRows.map(r=>r.standardized))].length;
      const title=imageRows[0]?.image_title || ("Image "+(image+1));
      return '<div class="visual-image-card"><div><strong>'+esc(title)+'</strong><span>'+unique+' distinct readings across '+imageRows.length+' AI systems</span></div>'+
        imageRows.map(r=>'<div class="visual-reading"><b>'+esc(r.ai)+'</b><span>'+esc(r.standardized)+'</span></div>').join("")+
      '</div>';
    }).join("");
    wrap.innerHTML='<div class="visual-models">'+cards+'</div><div class="visual-image-grid">'+cells+'</div>';
  }

  function renderAdvanced(pairs) {
    const wrap=document.getElementById("advanced-heatmap");
    if(!wrap) return;
    const ccCounts=culturalNodes.map(n=>({label:n.label,task:n.task,count:nodeCount(n)}));
    const max=Math.max(...ccCounts.map(x=>x.count),1);
    wrap.innerHTML =
      '<div class="evidence-grid">'+
      '<div class="evidence-head">Cultural task family</div><div class="evidence-head">Chinese context records</div><div class="evidence-head">Language comparison</div>'+
      ccCounts.map(n=>{
        const bilingual=n.task==="bilingual" ? n.count : 0;
        const context=n.task==="bilingual" ? "Paired Chinese + English prompts" : n.count+" Chinese-context examples";
        const alpha=.12+.72*(n.count/max);
        return '<div class="evidence-label">'+esc(n.label)+'</div>'+
          '<div class="evidence-cell" style="--cell-alpha:'+alpha+'"><strong>'+n.count+'</strong><small>'+esc(context)+'</small></div>'+
          '<div class="evidence-cell secondary"><strong>'+ (bilingual || "—") +'</strong><small>'+ (bilingual ? "parallel prompts" : "not a bilingual subset") +'</small></div>';
      }).join("")+
      '</div><p class="evidence-note">These are dataset-structure counts, not model-performance scores. Actual AI performance requires saved model responses and a disclosed evaluation rubric.</p>';
  }

  function render() {
    const pairs=state().globalPairs || [];
    renderBasic(pairs);
    renderSimple(pairs);
    renderCulturalMap();
    renderAdvanced(pairs);
const loadedCc=Object.keys(state().ccCache||{}).filter(k=>Array.isArray(state().ccCache[k]));
    status.textContent = loadedCc.length
      ? "CC-Eval cultural map is using the repository's local CC-Eval files; Global-MMLU remains available for language/benchmark comparison."
      : "Waiting for CC-Eval rows…";
  }

  root.querySelectorAll("[data-scroll-target]").forEach(button => {
    button.addEventListener("click", () => {
      const target=document.querySelector(button.dataset.scrollTarget);
      if (target) target.scrollIntoView({behavior:"smooth",block:"center"});
    });
  });

  document.addEventListener("explorer-data-ready", render);
  document.addEventListener("explorer-image-comparison-ready", render);
  render();
  bindVisualizationDatasetEntries();
})();
