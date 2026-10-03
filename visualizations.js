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

  function renderNetwork(pairs) {
    const wrap = document.getElementById("network-graph");
    const categories = sortedEntries(countBy(pairs,p=>p.category),5);
    const regions = sortedEntries(countBy(pairs,p=>p.region),5);
    const width=700, height=270, leftX=120, midX=350, rightX=590;
    const nodes=[];
    categories.forEach(([name],i)=>nodes.push({id:"c"+i,label:name,x:leftX,y:35+i*48}));
    regions.forEach(([name],i)=>nodes.push({id:"r"+i,label:name,x:rightX,y:35+i*48}));
    const links=[];
    categories.forEach(([cat],ci)=>{
      regions.forEach(([region],ri)=>{
        const n=pairs.filter(p=>p.category===cat && p.region===region).length;
        if(n) links.push({a:categories[ci][0],b:regions[ri][0],n,ci,ri});
      });
    });
    const svg='<svg viewBox="0 0 '+width+' '+height+'" role="img" aria-label="Category to region network">'+
      links.map(l=>{
        const y1=35+l.ci*48, y2=35+l.ri*48;
        return '<line x1="'+leftX+'" y1="'+y1+'" x2="'+rightX+'" y2="'+y2+'" stroke="currentColor" stroke-opacity="'+Math.min(.55,.12+l.n/.5/100)+'" stroke-width="'+Math.min(5,1+l.n/20)+'"/>';
      }).join("")+
      nodes.map(n=>'<circle cx="'+n.x+'" cy="'+n.y+'" r="6" fill="currentColor"/><text x="'+(n.x+(n.x<350?12:-12))+'" y="'+(n.y+4)+'" text-anchor="'+(n.x<350?"start":"end")+'">'+esc(n.label.slice(0,28))+'</text>').join("")+
      '<text x="'+leftX+'" y="15" text-anchor="middle">Categories</text><text x="'+rightX+'" y="15" text-anchor="middle">Regions</text></svg>';
    wrap.innerHTML=svg;
  }

  function renderSpatial(pairs) {
    const entries=sortedEntries(countBy(pairs,p=>p.region),8);
    const max=Math.max(...entries.map(x=>x[1]),1);
    document.getElementById("spatial-bars").innerHTML=entries.map(([label,value]) =>
      '<div class="spatial-row"><span>'+esc(label)+'</span><div><i style="width:'+((value/max)*100)+'%"></i></div><b>'+value+'</b></div>'
    ).join("");
  }

  function renderHeatmap(pairs) {
    const rows=sortedEntries(countBy(pairs,p=>p.category),8).map(x=>x[0]);
    const cols=["CS","CA"];
    const max=Math.max(...rows.flatMap(cat=>cols.map(s=>pairs.filter(p=>p.category===cat&&p.sensitivity===s).length)),1);
    const html='<div class="heatmap-grid" style="grid-template-columns:180px repeat(2,1fr)">'+
      '<div class="heatmap-corner"></div>'+cols.map(c=>'<div class="heatmap-head">'+c+'</div>').join("")+
      rows.map(cat=>'<div class="heatmap-label">'+esc(cat)+'</div>'+cols.map(s=>{
        const n=pairs.filter(p=>p.category===cat&&p.sensitivity===s).length;
        const alpha=.12+.72*(n/max);
        return '<div class="heatmap-cell" style="--cell-alpha:'+alpha+'"><strong>'+n+'</strong><small>'+s+'</small></div>';
      }).join("")).join("")+'</div>';
    document.getElementById("advanced-heatmap").innerHTML=html;
  }

  function render() {
    const pairs=state().globalPairs || [];
    if (!pairs.length) {
      status.textContent="Waiting for Global-MMLU-Lite rows…";
      return;
    }
    renderBasic(pairs);
    renderSimple(pairs);
    renderNetwork(pairs);
    renderSpatial(pairs);
    renderHeatmap(pairs);
    status.textContent="Visualizations are using "+pairs.length+" matched Global-MMLU-Lite records currently loaded in the browser.";
  }

  root.querySelectorAll("[data-scroll-target]").forEach(button => {
    button.addEventListener("click", () => {
      const target=document.querySelector(button.dataset.scrollTarget);
      if (target) target.scrollIntoView({behavior:"smooth",block:"center"});
    });
  });

  document.addEventListener("explorer-data-ready", render);
  render();
})();
