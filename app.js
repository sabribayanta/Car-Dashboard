const COLOR_MAP = {
  AQU:{name:'Aqua',hex:'#5fb9b8'},
  BEI:{name:'Beige',hex:'#d9c7a3'},
  BLK:{name:'Black',hex:'#232323'},
  BLU:{name:'Blue',hex:'#2f5fa8'},
  BRN:{name:'Brown',hex:'#6b4423'},
  BRZ:{name:'Bronze',hex:'#8c6239'},
  CRM:{name:'Cream',hex:'#efe4c9'},
  FWN:{name:'Fawn',hex:'#c99e78'},
  GLD:{name:'Gold',hex:'#d4af37'},
  GRN:{name:'Green',hex:'#3a7d44'},
  GRY:{name:'Grey',hex:'#93979c'},
  KHA:{name:'Khaki',hex:'#8b8557'},
  MRN:{name:'Maroon',hex:'#6e2142'},
  MVE:{name:'Mauve',hex:'#9b7a94'},
  OGE:{name:'Orange',hex:'#d9762a'},
  PNK:{name:'Pink',hex:'#e79cb0'},
  PUR:{name:'Purple',hex:'#6a3d9a'},
  RED:{name:'Red',hex:'#b3261e'},
  SIL:{name:'Silver',hex:'#c4c6c8'},
  TAN:{name:'Tan',hex:'#c19a6b'},
  TUR:{name:'Turquoise',hex:'#30bfae'},
  WHI:{name:'White',hex:'#f2f0e8'},
  YLW:{name:'Yellow',hex:'#e8c547'}
};

function colorInfo(code){
  return COLOR_MAP[code] || {name:code, hex:'#666'};
}

// The source registry file hard-truncates make codes and model codes
// (model codes are capped at 6 characters). These maps restore readable
// names for the highest-volume entries — anything not listed here falls
// back to the raw code, and the raw code is always shown in small print
// on the card so nothing is silently guessed without being checkable.
const MAKE_MAP = {
  'B Y D':'BYD', 'HYNDAI':'Hyundai', 'MITSUB':'Mitsubishi', 'M G':'MG',
  'B M W':'BMW', 'MERC B':'Mercedes-Benz', 'G WALL':'GWM', 'VOLKS':'Volkswagen',
  'CHEV':'Chevrolet', 'LANDRO':'Land Rover', 'ALFA':'Alfa Romeo',
  'ROLLS':'Rolls-Royce', 'ASTON':'Aston Martin'
};

const MODEL_MAP = {
  'FORD|EVERES':'Everest', 'FORD|RANGER':'Ranger', 'FORD|MUSTAN':'Mustang',
  'FORD|TOUREN':'Tourneo', 'FORD|TRANSI':'Transit',
  'TOYOTA|COROLL':'Corolla', 'TOYOTA|CORLLA':'Corolla', 'TOYOTA|LANDCR':'LandCruiser',
  'TOYOTA|LANDSR':'LandCruiser', 'TOYOTA|HIACE':'HiAce', 'TOYOTA|HI ACE':'HiAce',
  'TOYOTA|HILUX':'HiLux', 'TOYOTA|HILUC':'HiLux', 'TOYOTA|HILUZ':'HiLux',
  'TOYOTA|FORTUN':'Fortuner', 'TOYOTA|ALPHAR':'Alphard', 'TOYOTA|COASTE':'Coaster',
  'TOYOTA|KLUGER':'Kluger', 'TOYOTA|PRADO':'Prado',
  'HYNDAI|TUCSON':'Tucson', 'HYNDAI|KONA':'Kona', 'HYNDAI|SANTA':'Santa Fe',
  'HYNDAI|VENUE':'Venue', 'HYNDAI|I30':'i30',
  'KIA|SPORTA':'Sportage', 'KIA|CARNIV':'Carnival', 'KIA|SORENT':'Sorento',
  'KIA|PICANT':'Picanto', 'KIA|TASMAN':'Tasman', 'KIA|STONIC':'Stonic',
  'GEELY|STARRA':'Starray',
  'B Y D|SEALIO':'Sealion', 'B Y D|DOLPHI':'Dolphin', 'B Y D|SHARK':'Shark',
  'MAZDA|CX5':'CX-5', 'MAZDA|CX30':'CX-30', 'MAZDA|CX3':'CX-3',
  'MAZDA|CX60':'CX-60', 'MAZDA|BT50':'BT-50',
  'HAVAL|JOLION':'Jolion',
  'NISSAN|XTRAIL':'X-Trail', 'NISSAN|PATROL':'Patrol', 'NISSAN|NAVARA':'Navara',
  'ISUZU|DMAX':'D-Max', 'ISUZU|MUX':'MU-X',
  'MITSUB|OUTLAN':'Outlander', 'MITSUB|TRITON':'Triton',
  'G WALL|CANNON':'Cannon', 'G WALL|TANK 3':'Tank 300',
  'SUBARU|FOREST':'Forester', 'SUBARU|OUTBAC':'Outback', 'SUBARU|CROSST':'Crosstrek',
  'HONDA|CRV':'CR-V', 'HONDA|ZRV':'ZR-V', 'HONDA|HRV':'HR-V',
  'MERC B|GLC300':'GLC 300',
  'VOLKS|TIGUAN':'Tiguan',
  'CHEV|SILVER':'Silverado',
  'TESLA|MY RWD':'Model Y RWD', 'TESLA|MY LR':'Model Y Long Range',
  'TESLA|M3 RWD':'Model 3 RWD'
};

function displayMake(make){
  return MAKE_MAP[make] || make;
}
function displayModel(make, model){
  return MODEL_MAP[make+'|'+model] || model;
}

const state = {
  search:'',
  makes:new Set(),
  colors:new Set(),
  years:new Set(),
  sort:'total-desc'
};

function computeSummary(){
  const totalReg = VEHICLE_DATA.reduce((s,d)=>s+d.total,0);
  const makes = new Set(VEHICLE_DATA.map(d=>d.make)).size;
  const models = new Set(VEHICLE_DATA.map(d=>d.make+'|'+d.model)).size;
  const el = document.getElementById('summary');
  const stats = [
    [totalReg.toLocaleString(),'Registrations'],
    [makes,'Makes'],
    [models,'Make/model combos'],
    [VEHICLE_DATA.length.toLocaleString(),'Colour variants']
  ];
  el.innerHTML = stats.map(([num,lbl])=>`<div class="stat"><div class="num">${num}</div><div class="lbl">${lbl}</div></div>`).join('');
}

function buildChips(){
  const makeTotals = {};
  VEHICLE_DATA.forEach(d=>{makeTotals[d.make]=(makeTotals[d.make]||0)+d.total;});
  const makeOrder = Object.keys(makeTotals).sort((a,b)=>displayMake(a).localeCompare(displayMake(b)));
  const makeRow = document.getElementById('makeChips');
  makeRow.innerHTML = makeOrder.map(code=>{
    return `<div class="chip" data-make="${code}">${displayMake(code)}</div>`;
  }).join('');
  makeRow.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const mk = chip.dataset.make;
      if(state.makes.has(mk)){state.makes.delete(mk); chip.classList.remove('active');}
      else {state.makes.add(mk); chip.classList.add('active');}
      render();
    });
  });
  document.getElementById('makeFilterInput').addEventListener('input',(e)=>{
    const q = e.target.value.trim().toUpperCase();
    makeRow.querySelectorAll('.chip').forEach(chip=>{
      const label = (chip.dataset.make + ' ' + chip.textContent).toUpperCase();
      chip.style.display = label.includes(q) ? '' : 'none';
    });
  });

  const colorTotals = {};
  VEHICLE_DATA.forEach(d=>{colorTotals[d.color]=(colorTotals[d.color]||0)+d.total;});
  const colorOrder = Object.keys(colorTotals).sort((a,b)=>colorTotals[b]-colorTotals[a]);
  const colorRow = document.getElementById('colorChips');
  colorRow.innerHTML = colorOrder.map(code=>{
    const info = colorInfo(code);
    return `<div class="chip" data-color="${code}"><span class="swatch" style="background:${info.hex}"></span>${info.name}</div>`;
  }).join('');
  colorRow.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const c = chip.dataset.color;
      if(state.colors.has(c)){state.colors.delete(c); chip.classList.remove('active');}
      else {state.colors.add(c); chip.classList.add('active');}
      render();
    });
  });

  const years = [...new Set(VEHICLE_DATA.map(d=>d.year))].sort((a,b)=>b-a);
  const yearRow = document.getElementById('yearChips');
  yearRow.innerHTML = years.map(y=>`<div class="chip" data-year="${y}">${y}</div>`).join('');
  yearRow.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      const y = Number(chip.dataset.year);
      if(state.years.has(y)){state.years.delete(y); chip.classList.remove('active');}
      else {state.years.add(y); chip.classList.add('active');}
      render();
    });
  });
}

function getFiltered(){
  const q = state.search.trim().toUpperCase();
  let rows = VEHICLE_DATA.filter(d=>{
    if(q){
      const hay = (d.make+' '+d.model+' '+displayMake(d.make)+' '+displayModel(d.make,d.model)).toUpperCase();
      if(!hay.includes(q)) return false;
    }
    if(state.makes.size && !state.makes.has(d.make)) return false;
    if(state.colors.size && !state.colors.has(d.color)) return false;
    if(state.years.size && !state.years.has(d.year)) return false;
    return true;
  });
  if(state.sort==='total-desc') rows = rows.slice().sort((a,b)=>b.total-a.total);
  else if(state.sort==='total-asc') rows = rows.slice().sort((a,b)=>a.total-b.total);
  else if(state.sort==='make-asc') rows = rows.slice().sort((a,b)=>a.make.localeCompare(b.make) || a.model.localeCompare(b.model));
  return rows;
}

function render(){
  const rows = getFiltered();
  const grid = document.getElementById('grid');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('resultCount');
  const shown = rows.slice(0,240);
  countEl.textContent = `${rows.length.toLocaleString()} row${rows.length===1?'':'s'} shown` + (rows.length>240 ? ' (first 240 displayed — refine your search)' : '');

  if(rows.length===0){
    grid.innerHTML='';
    empty.style.display='block';
    return;
  }
  empty.style.display='none';

  grid.innerHTML = shown.map(d=>{
    const info = colorInfo(d.color);
    const makeName = displayMake(d.make);
    const modelName = displayModel(d.make, d.model);
    const makeChanged = makeName !== d.make;
    const modelChanged = modelName !== d.model;
    const codeNote = (makeChanged || modelChanged)
      ? `<div class="code-note">code: ${d.make} ${d.model}</div>` : '';
    return `<div class="card" style="--card-color:${info.hex}">
      <div class="make">${makeName}</div>
      <div class="model">${modelName}</div>
      ${codeNote}
      <div class="meta">
        <div class="color-tag"><span class="swatch" style="background:${info.hex}"></span>${info.name} · ${d.year}</div>
        <div style="text-align:right;">
          <div class="count">${d.total}</div>
          <div class="count-lbl">registered</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

document.getElementById('searchInput').addEventListener('input',(e)=>{
  state.search = e.target.value;
  render();
});
document.getElementById('sortSelect').addEventListener('change',(e)=>{
  state.sort = e.target.value;
  render();
});
document.getElementById('clearBtn').addEventListener('click',()=>{
  state.search='';
  state.makes.clear();
  state.colors.clear();
  state.years.clear();
  state.sort='total-desc';
  document.getElementById('searchInput').value='';
  document.getElementById('makeFilterInput').value='';
  document.getElementById('sortSelect').value='total-desc';
  document.querySelectorAll('.chip.active').forEach(c=>c.classList.remove('active'));
  document.querySelectorAll('#makeChips .chip').forEach(c=>c.style.display='');
  render();
});

function renderTopCharts(){
  const makeTotals = {};
  const colorTotals = {};
  VEHICLE_DATA.forEach(d=>{
    makeTotals[d.make]=(makeTotals[d.make]||0)+d.total;
    colorTotals[d.color]=(colorTotals[d.color]||0)+d.total;
  });

  const topMakes = Object.entries(makeTotals).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const topColors = Object.entries(colorTotals).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const makeMax = topMakes[0][1];
  document.getElementById('makeChart').innerHTML = topMakes.map(([code,total])=>`
    <div class="bar-row">
      <div class="bar-label" title="${displayMake(code)}">${displayMake(code)}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(total/makeMax*100).toFixed(1)}%"></div></div>
      <div class="bar-value">${total.toLocaleString()}</div>
    </div>`).join('');

  const colorMax = topColors[0][1];
  document.getElementById('colorChart').innerHTML = topColors.map(([code,total])=>{
    const info = colorInfo(code);
    return `
    <div class="bar-row">
      <div class="bar-label" title="${info.name}"><span class="swatch" style="background:${info.hex}"></span>${info.name}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(total/colorMax*100).toFixed(1)}%;background:${info.hex}"></div></div>
      <div class="bar-value">${total.toLocaleString()}</div>
    </div>`;
  }).join('');
}

computeSummary();
renderTopCharts();
buildChips();
render();