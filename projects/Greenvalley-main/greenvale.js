/* ============================================
     GREENVALE — engine do jogo cozy farming
     Inspirado em Stardew Valley, 100% original
     ============================================ */

  const GV_TS=48,GV_MW=60,GV_MH=45,GV_DAY_S=480,GV_SPD=28;
  const GV_SEASONS=['spring','summer','autumn','winter'];
  const GV_SNAMES={spring:'Primavera',summer:'Verão',autumn:'Outono',winter:'Inverno'};
  const GP={g:'#5a8a40',gd:'#4a7a30',gl:'#6aaa50',s:'#8a5a30',p:'#c8a870',pd:'#b09060',w:'#4a8fd0',wl:'#60a8e8',wd:'#3060a0',wo:'#8a6040',wod:'#6a4020',wa:'#c8b090',wad:'#a89070',ro:'#b83020',roc:'#3050b0',rom:'#308040',tg:'#3a7a28',td:'#2a5a18',tr:'#6a4020',ta:'#c06020',tw:'#d8e4f0',sa:'#e0c880',sad:'#c0a860'};

  const GV_CROPS={
    strawberry:{e:'🍓',n:'Morango', days:8, price:50,ss:['spring'],fe:'🍓'},
    lettuce:   {e:'🥬',n:'Alface',  days:6, price:35,ss:['spring','autumn'],fe:'🥬'},
    tomato:    {e:'🍅',n:'Tomate',  days:10,price:60,ss:['summer'],fe:'🍅'},
    corn:      {e:'🌽',n:'Milho',   days:12,price:70,ss:['summer'],fe:'🌽'},
    carrot:    {e:'🥕',n:'Cenoura', days:7, price:45,ss:['spring','autumn'],fe:'🥕'},
    pumpkin:   {e:'🎃',n:'Abóbora', days:14,price:90,ss:['autumn'],fe:'🎃'},
    blueberry: {e:'🫐',n:'Mirtilo', days:9, price:65,ss:['summer'],fe:'🫐'},
    potato:    {e:'🥔',n:'Batata',  days:8, price:55,ss:['autumn'],fe:'🥔'},
  };

  const GV_REC=[
    {id:'smoothie',n:'Smoothie Detox',e:'🥤',i:['🍓','🫐'],ef:{energy:30,mood:20},d:'Rico em antioxidantes!',day:1},
    {id:'salad',n:'Salada Verde',e:'🥗',i:['🥬','🍅'],ef:{hunger:35,mood:15},d:'Vitaminas essenciais!',day:1},
    {id:'oats',n:'Overnight Oats',e:'🥣',i:['🫐','🍓'],ef:{energy:50,hunger:40},d:'Café da manhã perfeito!',day:2},
    {id:'juice',n:'Suco Cenoura',e:'🧃',i:['🥕','🌽'],ef:{water:40,energy:25},d:'Beta-caroteno!',day:3},
    {id:'soup',n:'Sopa de Legumes',e:'🍲',i:['🥕','🥔'],ef:{hunger:50,energy:20},d:'Reconfortante!',day:5},
    {id:'jam',n:'Geleia de Frutas',e:'🍯',i:['🍓','🍓','🫐'],ef:{mood:30,hunger:20},d:'Caseira, sem açúcar!',day:8},
    {id:'bowl',n:'Bowl Completo',e:'🥙',i:['🌽','🥬','🍅'],ef:{hunger:60,energy:40},d:'Proteína + fibras!',day:10},
    {id:'cake',n:'Torta Abóbora',e:'🥧',i:['🎃','🥕'],ef:{mood:50,hunger:30},d:'Doce natural!',day:15},
  ];

  const GV_NPCS=[
    {id:'rosa',n:'Dona Rosa',e:'👵',c:'#f4b0b0',hx:28,hy:20,mh:8,
     ls:['Que bom ter você aqui!','Meu sonho é ver o café reabrir!','A vila está melhorando tanto!','Obrigada por cuidar de Greenvale!'],
     q:{id:'qr',t:'Pão da Dona Rosa',d:'Entregar 3 🍅',nd:'tomato',qty:3,g:150,hp:2}},
    {id:'bento',n:'Sr. Bento',e:'👨‍🌾',c:'#a0c4a0',hx:12,hy:18,mh:8,
     ls:['Essa fazenda estava abandonada há anos!','Cenouras no outono são as melhores!','Cada colheita é uma vitória!','Continue assim!'],
     q:{id:'qb',t:'Estoque do Bento',d:'Entregar 5 🌽',nd:'corn',qty:5,g:200,hp:2}},
    {id:'luca',n:'Chef Luca',e:'🧑‍🍳',c:'#a0a0f4',hx:35,hy:15,mh:8,
     ls:['A Cozinha da Vila precisa reabrir!','Uma boa sopa começa com legumes frescos.','Você já tentou o bowl?','Com a cozinha aberta, ensino minha receita secreta!'],
     q:{id:'ql',t:'Cozinha Reaberta',d:'Entregar 3 🥬',nd:'lettuce',qty:3,g:300,hp:3}},
    {id:'pip',n:'Pip',e:'🧒',c:'#f4d0a0',hx:20,hy:30,mh:6,
     ls:['Odeio vegetais!','Ok... o suco de cenoura não é TÃO ruim...','Você fez um smoothie?','Tá bom, legumes são gostosos. Não conta pra ninguém!'],
     q:{id:'qp',t:'Missão Pip',d:'Fazer 1 smoothie 🥤',nd:'smoothie',qty:1,g:80,hp:2}},
    {id:'luna',n:'Luna',e:'☕',c:'#d4a0c4',hx:30,hy:10,mh:8,
     ls:['O café está fechado há tanto tempo...','Morangos e mirtilos para a reabertura!','Cada xícara conta uma história.','Com o café aberto, a vila ganha vida!'],
     q:{id:'qu',t:'Reabertura do Café',d:'Entregar 4 🫐',nd:'blueberry',qty:4,g:250,hp:3}},
  ];

  const GV_VQ=[
    {id:'v1',t:'Primeiros Passos',d:'Plante 1 semente',tp:'plant',qty:1,g:100,vp:5},
    {id:'v2',t:'Primeira Colheita',d:'Colha 1 vegetal',tp:'harvest',qty:1,g:150,vp:10},
    {id:'v3',t:'Primeiro Prato',d:'Cozinhe 1 receita',tp:'cook',qty:1,g:200,vp:15},
    {id:'v4',t:'Fazendeiro de Verdade',d:'Colha 10 vegetais',tp:'harvest',qty:10,g:350,vp:25},
    {id:'v5',t:'Chef Amador',d:'Cozinhe 5 pratos',tp:'cook',qty:5,g:400,vp:30},
    {id:'v6',t:'Uma Semana na Vila',d:'Sobreviva 7 dias',tp:'days',qty:7,g:500,vp:40},
    {id:'v7',t:'Abundância',d:'Colha 25 vegetais',tp:'harvest',qty:25,g:600,vp:50},
    {id:'v8',t:'Mestre Culinário',d:'Cozinhe 10 pratos',tp:'cook',qty:10,g:800,vp:60},
  ];

  let GV={};
  function gvInitState(){
    GV={
      px:10,py:14,facing:'down',tool:'hoe',speed:2.2,
      gold:150,inv:[],cooks:[null,null,null],seed:'strawberry',selInv:-1,
      energy:100,maxE:100,hunger:100,maxH:100,water:100,maxW:100,mood:100,maxM:100,
      day:1,totalDays:1,season:0,timeMin:360,tickAcc:0,
      plots:Array.from({length:24},()=>({st:'empty',crop:null,gd:0,need:0})),
      vpts:0,
      locs:{
        farm:{n:'🌾 Fazenda',ok:true,x:10,y:16,req:0},
        plaza:{n:'🏘️ Praça Central',ok:true,x:25,y:22,req:0},
        cafe:{n:'☕ Café Saudável',ok:false,x:25,y:12,req:40},
        market:{n:'🛍️ Mercado Orgânico',ok:false,x:15,y:28,req:60},
        kitchen:{n:'🍳 Cozinha da Vila',ok:false,x:28,y:26,req:80},
        forest:{n:'🌳 Floresta',ok:false,x:47,y:20,req:100},
      },
      npcs:GV_NPCS.map(n=>({...n,hearts:0,qd:false,qp:0})),
      quests:GV_VQ.map(q=>({...q,prog:0,done:false})),
      unrcp:['smoothie','salad','oats'],
      stats:{planted:0,harvested:0,cooked:0},
      cooked:{},running:false,keys:{},af:0,at:0,moving:false,ntTimer:null,
    };
  }

  let gvMap=[];
  function gvGenMap(){
    gvMap=Array.from({length:GV_MH},()=>Array(GV_MW).fill(0));
    for(let y=5;y<GV_MH-5;y++)for(let x=40;x<45;x++)gvMap[y][x]=3;
    for(let y=2;y<8;y++)for(let x=42;x<50;x++)gvMap[y][x]=3;
    for(let x=0;x<GV_MW;x++)gvMap[22][x]=2;
    for(let y=0;y<GV_MH;y++)gvMap[y][22]=2;
    for(let y=8;y<22;y++)for(let x=1;x<21;x++)gvMap[y][x]=1;
    for(let r=0;r<3;r++)for(let c=0;c<8;c++)gvMap[12+r][3+c*2]=8;
    for(let y=0;y<GV_MH;y++)for(let x=38;x<40;x++)if(gvMap[y][x]===0)gvMap[y][x]=7;
  }

  let gvC,gvX,gvMC,gvMX,gvCX=0,gvCY=0;

  function gvInit(){
    gvC=document.getElementById('gv-canvas');
    gvMC=document.getElementById('gv-minimap-canvas');
    if(!gvC)return;
    gvX=gvC.getContext('2d');
    gvMX=gvMC?gvMC.getContext('2d'):null;
    gvInitState();gvGenMap();gvLoad();
    gvResize();window.addEventListener('resize',gvResize);
    document.addEventListener('keydown',gvKeyDn);
    document.addEventListener('keyup',e=>{GV.keys[e.key]=false;});
    gvC.addEventListener('click',gvClick);
    gvC.addEventListener('touchstart',e=>{if(e.touches[0])gvClick(e.touches[0]);},{passive:true});
    GV.running=true;gvLT=0;requestAnimationFrame(gvLoop);
    gvUpdateSidebar();gvMinimap();
  }

  function gvResize(){
    if(!gvC)return;
    const m=document.getElementById('gv-main');if(!m)return;
    gvC.width=m.clientWidth-(window.innerWidth>640?210:0);
    gvC.height=m.clientHeight;
  }

  function gvKeyDn(e){
    GV.keys[e.key]=true;
    if(!document.getElementById('greenvale-section')?.classList.contains('active'))return;
    const k=e.key;
    if(k==='e'||k==='E')gvInteract();
    if(k===' '){e.preventDefault();gvUseTool();}
    if(k==='1')gvEquip('hoe');if(k==='2')gvEquip('watering');
    if(k==='3')gvEquip('seeds');if(k==='4')gvEquip('bag');
    if(k==='c'||k==='C')gvToggleCook();
    if(k==='Escape'){
      e.preventDefault();
      if(document.getElementById('gv-cooking-panel')?.classList.contains('visible'))gvToggleCook();
      else if(document.getElementById('gv-dialog')?.classList.contains('visible'))gvCloseDlg();
      else fecharGreenVale();
    }
  }

  let gvLT=0;
  function gvLoop(ts=0){
    if(!GV.running)return;
    const dt=Math.min((ts-gvLT)/1000,0.08);gvLT=ts;
    gvUpdate(dt);gvDraw();requestAnimationFrame(gvLoop);
  }

  function gvUpdate(dt){
    let dx=0,dy=0;
    if(GV.keys['ArrowUp']||GV.keys['w']||GV.keys['W']){dy=-1;GV.facing='up';}
    if(GV.keys['ArrowDown']||GV.keys['s']||GV.keys['S']){dy=1;GV.facing='down';}
    if(GV.keys['ArrowLeft']||GV.keys['a']||GV.keys['A']){dx=-1;GV.facing='left';}
    if(GV.keys['ArrowRight']||GV.keys['d']||GV.keys['D']){dx=1;GV.facing='right';}
    GV.moving=dx!==0||dy!==0;
    if(GV.moving){
      const l=Math.sqrt(dx*dx+dy*dy);dx/=l;dy/=l;
      const sp=GV.speed*GV_TS*dt*(GV.energy>15?1:.5);
      const nx=GV.px+dx*sp/GV_TS,ny=GV.py+dy*sp/GV_TS;
      const tx=Math.floor(nx),ty=Math.floor(ny);
      if(tx>=0&&tx<GV_MW&&ty>=0&&ty<GV_MH&&gvMap[ty]?.[tx]!==3){GV.px=nx;GV.py=ny;}
      GV.energy=Math.max(0,GV.energy-dt*.28);
    }
    GV.px=Math.max(0,Math.min(GV.px,GV_MW-1));
    GV.py=Math.max(0,Math.min(GV.py,GV_MH-1));
    const tgX=GV.px*GV_TS-gvC.width/2,tgY=GV.py*GV_TS-gvC.height/2;
    gvCX+=(tgX-gvCX)*.12;gvCY+=(tgY-gvCY)*.12;
    gvCX=Math.max(0,Math.min(gvCX,GV_MW*GV_TS-gvC.width));
    gvCY=Math.max(0,Math.min(gvCY,GV_MH*GV_TS-gvC.height));
    GV.tickAcc+=dt;
    const tp=GV_DAY_S/(16*60);
    if(GV.tickAcc>=tp){
      GV.tickAcc-=tp;GV.timeMin++;
      if(GV.timeMin>=22*60){gvEndDay();return;}
      GV.hunger=Math.max(0,GV.hunger-.12);GV.water=Math.max(0,GV.water-.18);
      if(GV.hunger<20||GV.water<20){GV.energy=Math.max(0,GV.energy-.2);GV.mood=Math.max(0,GV.mood-.15);}
    }
    GV.at+=dt;if(GV.at>.14){GV.at=0;GV.af=(GV.af+1)%4;}
    gvHUD();
  }

  function gvAhead(){
    const cx=Math.round(GV.px),cy=Math.round(GV.py);
    const o={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[GV.facing];
    return{tx:cx+o[0],ty:cy+o[1]};
  }
  function gvPI(tx,ty){
    if((tx-3)%2!==0)return -1;
    const c=Math.floor((tx-3)/2),r=ty-12;
    if(c<0||c>7||r<0||r>2)return -1;
    return r*8+c;
  }
  function gvInteract(){
    const {tx,ty}=gvAhead();
    for(const n of GV.npcs){
      if(Math.abs(n.hx-Math.round(GV.px))<=2&&Math.abs(n.hy-Math.round(GV.py))<=2){gvTalk(n);return;}
    }
    const pi=gvPI(tx,ty);if(pi>=0)gvActPlot(pi);
  }
  function gvUseTool(){const {tx,ty}=gvAhead();const pi=gvPI(tx,ty);if(pi>=0)gvActPlot(pi);}
  function gvActPlot(pi){
    const p=GV.plots[pi];
    if(GV.tool==='hoe'&&p.st==='empty'){p.st='tilled';gvSpend(5);gvNotify('⛏️ Terra preparada! Use sementes (3).');}
    else if(GV.tool==='seeds'&&(p.st==='empty'||p.st==='tilled'))gvPlant(pi);
    else if(GV.tool==='watering'&&(p.st==='planted'||p.st==='growing')){p.st='watered';gvSpend(2);gvNotify('💧 Regado!');}
    else if(p.st==='ready')gvHarvest(pi);
    else if(p.st!=='empty'&&p.st!=='tilled')gvNotify('⏳ Ainda crescendo...');
  }
  function gvPlant(pi){
    const crop=GV_CROPS[GV.seed];if(!crop)return;
    const s=GV_SEASONS[GV.season];
    if(!crop.ss.includes(s)){gvNotify('⚠️ '+crop.n+' não cresce em '+GV_SNAMES[s]+'!');return;}
    const p=GV.plots[pi];p.st='planted';p.crop=GV.seed;p.gd=0;p.need=crop.days;
    gvSpend(3);GV.stats.planted++;gvQst('plant',1);
    gvNotify('🌱 '+crop.n+' plantado! Regue para acelerar.');gvSave();
  }
  function gvHarvest(pi){
    const p=GV.plots[pi];const crop=GV_CROPS[p.crop];if(!crop)return;
    gvAddInv(crop.fe,p.crop,1,crop.price);
    p.st='empty';p.crop=null;p.gd=0;
    GV.stats.harvested++;GV.vpts=Math.min(200,GV.vpts+3);
    GV.gold+=Math.floor(crop.price*.3);gvSpend(4);
    gvQst('harvest',1);gvCheckVil();
    gvNotify('✅ '+crop.e+' '+crop.n+' colhido! +'+Math.floor(crop.price*.3)+'g');
    gvUpdateSidebar();gvSave();
  }
  function gvSpend(a){GV.energy=Math.max(0,GV.energy-a);}
  function gvAddInv(emoji,id,qty,val){
    const e=GV.inv.find(i=>i.id===id);
    if(e)e.qty+=qty;else GV.inv.push({emoji,id,qty,val});
  }
  function gvEquip(t){GV.tool=t;gvUpdateSidebar();}

  let gvCookOn=false;
  function gvToggleCook(){
    gvCookOn=!gvCookOn;
    document.getElementById('gv-cooking-panel')?.classList.toggle('visible',gvCookOn);
    gvRenderCook();
  }
  function gvRenderCook(){
    for(let i=0;i<3;i++){const el=document.getElementById('gvcook'+i);if(el)el.textContent=GV.cooks[i]||'➕';}
    gvCookResult();
  }
  function gvCookSlot(i){
    const si=GV.selInv;
    if(si>=0&&GV.inv[si]){
      const it=GV.inv[si];GV.cooks[i]=it.emoji;it.qty--;
      if(it.qty<=0)GV.inv.splice(si,1);GV.selInv=-1;
    }else if(GV.cooks[i]){
      const id=Object.keys(GV_CROPS).find(k=>GV_CROPS[k].fe===GV.cooks[i]);
      if(id)gvAddInv(GV.cooks[i],id,1,GV_CROPS[id].price);GV.cooks[i]=null;
    }
    gvRenderCook();gvUpdateSidebar();
  }
  function gvCookResult(){
    const el=document.getElementById('gv-cooking-result');if(!el)return;
    const sl=GV.cooks.filter(Boolean);
    if(!sl.length){el.textContent='Coloque ingredientes nos slots';return;}
    for(const r of GV_REC){
      if(!GV.unrcp.includes(r.id)&&GV.totalDays<r.day)continue;
      if(!GV.unrcp.includes(r.id))GV.unrcp.push(r.id);
      const nd=[...r.i],gv=[...sl];let ok=true;
      for(const n of nd){const idx=gv.indexOf(n);if(idx===-1){ok=false;break;}gv.splice(idx,1);}
      if(ok&&sl.length>=r.i.length){el.textContent=r.e+' '+r.n+' — '+r.d;return;}
    }
    el.textContent='🤔 Combinação desconhecida...';
  }
  function gvCook(){
    const sl=GV.cooks.filter(Boolean);if(!sl.length){gvNotify('⚠️ Coloque ingredientes!');return;}
    for(const r of GV_REC){
      if(!GV.unrcp.includes(r.id))continue;
      const nd=[...r.i],gv=[...sl];let ok=true;
      for(const n of nd){const idx=gv.indexOf(n);if(idx===-1){ok=false;break;}gv.splice(idx,1);}
      if(ok&&sl.length>=r.i.length){
        GV.energy=Math.min(GV.maxE,GV.energy+(r.ef.energy||0));
        GV.hunger=Math.min(GV.maxH,GV.hunger+(r.ef.hunger||0));
        GV.water=Math.min(GV.maxW,GV.water+(r.ef.water||0));
        GV.mood=Math.min(GV.maxM,GV.mood+(r.ef.mood||0));
        GV.cooks=[null,null,null];GV.stats.cooked++;GV.gold+=20;
        GV.vpts=Math.min(200,GV.vpts+5);GV.cooked[r.id]=(GV.cooked[r.id]||0)+1;
        gvAddInv(r.e,r.id,1,50);gvQst('cook',1);gvCheckVil();
        if(r.id==='smoothie'){const n=GV.npcs.find(x=>x.id==='pip');if(n&&!n.qd)n.qp=1;}
        gvNotify('🍳 '+r.e+' '+r.n+' pronto! +'+( r.ef.energy||0)+'⚡');
        gvRenderCook();gvUpdateSidebar();gvSave();return;
      }
    }
    gvNotify('❌ Esses ingredientes não combinam...');
  }

  function gvTalk(npc){
    const dlg=document.getElementById('gv-dialog');if(!dlg)return;
    dlg.querySelector('.gv-dialog-name').textContent=npc.e+' '+npc.n;
    dlg.querySelector('.gv-dialog-text').textContent=npc.ls[Math.floor(Math.random()*npc.ls.length)];
    dlg.querySelector('.gv-dialog-actions').innerHTML=npc.qd
      ?'<button class="gv-dialog-btn" onclick="gvCloseDlg()">Tchau! 👋</button>'
      :'<button class="gv-dialog-btn" onclick="gvNPCQuest(\''+npc.id+'\')">📋 Missão</button><button class="gv-dialog-btn" onclick="gvCloseDlg()">Tchau! 👋</button>';
    dlg.classList.add('visible');
    npc.hearts=Math.min(npc.mh,(npc.hearts||0)+.5);gvUpdateSidebar();
  }
  function gvCloseDlg(){document.getElementById('gv-dialog')?.classList.remove('visible');}
  function gvNPCQuest(nid){
    const npc=GV.npcs.find(n=>n.id===nid);if(!npc||npc.qd){gvCloseDlg();return;}
    const q=npc.q;const it=GV.inv.find(i=>i.id===q.nd);const have=it?.qty||0;
    if(have>=q.qty){
      it.qty-=q.qty;if(it.qty<=0)GV.inv=GV.inv.filter(i=>i.id!==q.nd);
      npc.qd=true;GV.gold+=q.g;npc.hearts=Math.min(npc.mh,npc.hearts+q.hp);
      GV.vpts=Math.min(200,GV.vpts+20);gvCheckVil();gvQst('npc',1);
      gvNotify('🎉 Missão concluída! +'+q.g+'g 💛');gvUpdateSidebar();gvSave();gvCloseDlg();
    }else{
      document.getElementById('gv-dialog').querySelector('.gv-dialog-text').textContent=
        '📋 '+q.t+': '+q.d+' ('+have+'/'+q.qty+')';
    }
  }

  function gvCheckVil(){
    for(const[,l]of Object.entries(GV.locs))
      if(!l.ok&&GV.vpts>=l.req){l.ok=true;gvNotify('🎉 '+l.n+' desbloqueado!');}
    gvUpdateMapPanel();
  }
  function gvQst(tp,a){
    for(const q of GV.quests){
      if(q.done)continue;
      if(q.tp===tp){
        q.prog=Math.min(q.qty,q.prog+a);
        if(q.prog>=q.qty){q.done=true;GV.gold+=q.g;GV.vpts=Math.min(200,GV.vpts+q.vp);gvCheckVil();gvNotify('✨ "'+q.t+'" completa! +'+q.g+'g');}
      }
      if(q.tp==='days'){q.prog=GV.totalDays;if(q.prog>=q.qty&&!q.done){q.done=true;GV.gold+=q.g;GV.vpts=Math.min(200,GV.vpts+q.vp);gvCheckVil();}}
    }
    gvUpdateSidebar();
  }

  function gvEndDay(){
    GV.running=false;
    for(const p of GV.plots){
      if(p.st==='planted'||p.st==='growing'||p.st==='watered'){
        p.gd+=p.st==='watered'?2:1;p.st='growing';if(p.gd>=p.need)p.st='ready';
      }
    }
    GV.day++;GV.totalDays++;
    if(GV.day>GV_SPD){GV.day=1;GV.season=(GV.season+1)%4;gvNotify('🌸 '+GV_SNAMES[GV_SEASONS[GV.season]]+' chegou!');}
    GV.timeMin=360;GV.energy=100;GV.hunger=Math.min(100,GV.hunger+40);
    GV.water=Math.min(100,GV.water+50);GV.mood=Math.min(100,GV.mood+30);
    gvQst('days',0);gvSave();
    const sub=document.getElementById('gv-sleep-subtitle');
    if(sub)sub.textContent='Dia '+GV.day+' de '+GV_SNAMES[GV_SEASONS[GV.season]]+'\nColheitas: '+GV.stats.harvested+'  ·  Ouro: '+GV.gold+'g\nVila: '+GV.vpts+'/200 pts 🏘️';
    document.getElementById('gv-sleep-screen')?.classList.add('fading');
  }
  function gvWake(){
    document.getElementById('gv-sleep-screen')?.classList.remove('fading');
    GV.running=true;gvLT=0;requestAnimationFrame(gvLoop);gvUpdateSidebar();
  }

  function gvDraw(){
    if(!gvX||!gvC)return;
    gvX.clearRect(0,0,gvC.width,gvC.height);
    gvX.save();gvX.translate(-Math.round(gvCX),-Math.round(gvCY));
    gvDrawMap();gvDrawCrops();gvDrawBuildings();gvDrawNPCs();gvDrawPlayer();
    gvX.restore();
  }
  function gvDrawMap(){
    const x0=Math.max(0,Math.floor(gvCX/GV_TS)),y0=Math.max(0,Math.floor(gvCY/GV_TS));
    const x1=Math.min(GV_MW,x0+Math.ceil(gvC.width/GV_TS)+2);
    const y1=Math.min(GV_MH,y0+Math.ceil(gvC.height/GV_TS)+2);
    for(let ty=y0;ty<y1;ty++)for(let tx=x0;tx<x1;tx++)gvTile(gvMap[ty][tx],tx*GV_TS,ty*GV_TS,tx,ty);
  }
  function gvTile(t,sx,sy,tx,ty){
    const c=gvX,T=GV_TS;
    if(t===0){
      c.fillStyle=GP.g;c.fillRect(sx,sy,T,T);
      const v=(tx*7+ty*13)%5;
      if(v===0){c.fillStyle=GP.gd;c.fillRect(sx+2,sy+2,4,4);}
      if(v===1){c.fillStyle=GP.gl;c.fillRect(sx+T-6,sy+T-6,4,4);}
      if((tx+ty)%4===0){c.fillStyle=GP.gl;c.fillRect(sx+6,sy+10,2,6);c.fillRect(sx+10,sy+8,2,8);}
    }else if(t===1){
      c.fillStyle=GP.s;c.fillRect(sx,sy,T,T);
      c.fillStyle='rgba(0,0,0,.15)';
      for(let i=0;i<4;i++){c.fillRect(sx+i*12,sy+8,6,3);c.fillRect(sx+i*12+6,sy+22,4,3);}
    }else if(t===2){
      c.fillStyle=GP.p;c.fillRect(sx,sy,T,T);c.fillStyle=GP.pd;
      if((tx+ty)%3===0)c.fillRect(sx+4,sy+4,14,14);
      if((tx+ty)%3===1)c.fillRect(sx+20,sy+16,12,10);
      c.fillStyle='rgba(255,255,255,.1)';c.fillRect(sx+2,sy+2,4,2);
    }else if(t===3){
      c.fillStyle=GP.w;c.fillRect(sx,sy,T,T);
      const wv=Math.sin((tx+ty+Date.now()/700)*.8)*2;
      c.fillStyle=GP.wl;c.fillRect(sx+2,sy+4+wv,T-6,4);c.fillRect(sx+8,sy+20+wv,T-16,3);
      c.fillStyle=GP.wd;c.fillRect(sx+4,sy+T-8,T-8,4);
    }else if(t===7){
      c.fillStyle=GP.sa;c.fillRect(sx,sy,T,T);c.fillStyle=GP.sad;
      c.fillRect(sx+3,sy+5,8,4);c.fillRect(sx+20,sy+25,10,3);
    }else if(t===8){
      c.fillStyle='#6a3a18';c.fillRect(sx,sy,T,T);c.fillStyle='#4a2010';
      for(let i=0;i<4;i++)c.fillRect(sx+4,sy+6+i*10,T-8,3);
    }else{c.fillStyle=GP.g;c.fillRect(sx,sy,T,T);}
  }
  function gvDrawCrops(){
    for(let r=0;r<3;r++)for(let c2=0;c2<8;c2++){
      const pi=r*8+c2,p=GV.plots[pi];
      if(!p.crop||p.st==='empty'||p.st==='tilled')continue;
      const crop=GV_CROPS[p.crop];if(!crop)continue;
      const sx=(3+c2*2)*GV_TS,sy=(12+r)*GV_TS;
      let em='🌱';
      if(p.st==='ready')em=crop.fe;else if(p.gd>=Math.floor(p.need*.6))em='🌿';
      if(p.st==='watered'){gvX.fillStyle='rgba(80,160,230,.2)';gvX.fillRect(sx,sy,GV_TS,GV_TS);}
      if(p.st==='ready'){gvX.fillStyle='rgba(255,220,50,.18)';gvX.fillRect(sx,sy,GV_TS,GV_TS);}
      gvX.font=(GV_TS*.65)+'px serif';gvX.textAlign='center';gvX.textBaseline='middle';
      gvX.fillText(em,sx+GV_TS/2,sy+GV_TS/2);
    }
  }
  function gvDrawBuildings(){
    gvDHouse(2*GV_TS,5*GV_TS,GP.ro,'🏡');
    if(GV.locs.cafe?.ok)gvDHouse(24*GV_TS,8*GV_TS,GP.roc,'☕');else gvDRuin(24*GV_TS,8*GV_TS,'☕');
    if(GV.locs.market?.ok)gvDMarket(13*GV_TS,26*GV_TS);else gvDRuin(13*GV_TS,26*GV_TS,'🛍️');
    if(GV.locs.kitchen?.ok)gvDHouse(27*GV_TS,24*GV_TS,'#8a5030','🍳');else gvDRuin(27*GV_TS,24*GV_TS,'🍳');
    gvDTrees();gvDBridge(40*GV_TS,22*GV_TS);gvDFlowers();
  }
  function gvDHouse(sx,sy,rc,lbl){
    const c=gvX,T=GV_TS,w=5*T,h=4*T;
    c.fillStyle=GP.wa;c.fillRect(sx,sy+T,w,h-T);
    c.fillStyle=GP.wad;c.fillRect(sx+w-6,sy+T,6,h-T);
    c.fillStyle=GP.wo;c.fillRect(sx+w/2-9,sy+h-26,18,26);
    c.fillStyle=GP.wod;c.fillRect(sx+w/2-2,sy+h-16,4,4);
    c.fillStyle='#c8e0f4';c.fillRect(sx+8,sy+T+8,20,18);c.fillRect(sx+w-28,sy+T+8,20,18);
    c.fillStyle='rgba(0,0,0,.15)';
    c.fillRect(sx+16,sy+T+8,2,18);c.fillRect(sx+8,sy+T+17,20,2);
    c.fillRect(sx+w-20,sy+T+8,2,18);c.fillRect(sx+w-28,sy+T+17,20,2);
    c.fillStyle=rc;c.beginPath();c.moveTo(sx-6,sy+T);c.lineTo(sx+w/2,sy-8);c.lineTo(sx+w+6,sy+T);c.closePath();c.fill();
    c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.moveTo(sx+w/2,sy-8);c.lineTo(sx+w+6,sy+T);c.lineTo(sx+w/2+8,sy+T);c.closePath();c.fill();
    if(lbl){c.font=(T*.55)+'px serif';c.textAlign='center';c.fillText(lbl,sx+w/2,sy-10);}
  }
  function gvDMarket(sx,sy){
    const c=gvX,T=GV_TS,w=6*T,h=4*T;
    c.fillStyle=GP.wa;c.fillRect(sx,sy,w,h);
    for(let i=0;i<6;i++){c.fillStyle=i%2?'#f0f0b8':GP.rom;c.fillRect(sx+i*(w/6),sy-18,w/6,26);}
    c.font=(T*.5)+'px serif';c.textAlign='center';c.fillText('🛍️',sx+w/2,sy-22);
    ['🥕','🍅','🥬','🌽','🍓','🫐'].forEach((p,i)=>{c.font=(T*.45)+'px serif';c.fillText(p,sx+14+i*(w/6),sy+26);});
  }
  function gvDRuin(sx,sy,lbl){
    const c=gvX,T=GV_TS,w=4*T,h=3*T;
    c.fillStyle='#706050';c.fillRect(sx,sy,w,h);
    c.fillStyle='rgba(0,0,0,.3)';c.fillRect(sx+6,sy+6,26,34);c.fillRect(sx+w-30,sy+10,22,30);
    c.font=(T*.55)+'px serif';c.textAlign='center';
    c.fillText('🔒',sx+w/2,sy+T);c.fillText(lbl,sx+w/2,sy-8);
  }
  function gvDTrees(){
    const ts=[[0,0],[1,2],[3,0],[0,5],[52,3],[54,5],[55,2],[57,4],[48,10],[50,12],[52,14],[48,18],[50,20],[52,22],[35,30],[38,32],[40,28]];
    for(const[tx,ty]of ts)gvDTree(tx*GV_TS,ty*GV_TS);
  }
  function gvDTree(sx,sy){
    const c=gvX,T=GV_TS,s=GV_SEASONS[GV.season];
    c.fillStyle=GP.tr;c.fillRect(sx+T/2-5,sy+T-14,10,22);
    let lc=GP.tg;if(s==='autumn')lc=GP.ta;if(s==='winter')lc=GP.tw;
    c.fillStyle=lc;c.beginPath();c.arc(sx+T/2,sy+T/2,T*.55,0,Math.PI*2);c.fill();
    c.fillStyle=GP.td;c.beginPath();c.arc(sx+T/2+5,sy+T/2+5,T*.36,0,Math.PI*2);c.fill();
    if(s==='winter'){c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(sx+T/2,sy+T/2,T*.55,0,Math.PI*2);c.fill();}
  }
  function gvDBridge(sx,sy){
    const c=gvX,T=GV_TS;c.fillStyle=GP.wo;c.fillRect(sx-4,sy,5*T+8,T);
    c.fillStyle=GP.wod;for(let i=0;i<5;i++){c.fillRect(sx+i*T,sy+4,T-2,4);c.fillRect(sx+i*T,sy+T-8,T-2,4);}
  }
  function gvDFlowers(){
    const fl=[[23,20],[24,20],[23,24],[24,24],[26,20],[26,24]];const fe=['🌸','🌼','🌺'];
    for(const[tx,ty]of fl){gvX.font=(GV_TS*.5)+'px serif';gvX.textAlign='center';gvX.textBaseline='middle';gvX.fillText(fe[(tx+ty)%3],tx*GV_TS+GV_TS/2,ty*GV_TS+GV_TS/2);}
  }
  function gvDrawNPCs(){for(const n of GV.npcs)gvDNPC(n.hx*GV_TS,n.hy*GV_TS,n);}
  function gvDNPC(sx,sy,npc){
    const c=gvX,T=GV_TS;
    c.fillStyle=npc.c||'#e8c090';c.fillRect(sx+T*.3,sy+T*.38,T*.4,T*.48);
    c.fillStyle='#f0c090';c.fillRect(sx+T*.3,sy+T*.08,T*.4,T*.34);
    c.fillStyle='#2a1a08';c.fillRect(sx+T*.38,sy+T*.18,3,3);c.fillRect(sx+T*.55,sy+T*.18,3,3);
    c.font=(T*.28)+"px 'Press Start 2P',cursive";c.textAlign='center';c.fillStyle='rgba(255,255,255,.9)';
    c.fillText(npc.e,sx+T/2,sy-4);
  }
  function gvDrawPlayer(){
    const sx=GV.px*GV_TS,sy=GV.py*GV_TS,T=GV_TS,c=gvX;
    const b=GV.moving?Math.sin(GV.af*Math.PI/2)*2:0;
    const a=GV.moving?Math.sin(GV.af*Math.PI/2)*4:0;
    c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(sx+T/2,sy+T-.5,T/3,5,0,0,Math.PI*2);c.fill();
    c.fillStyle='#4a2a10';c.fillRect(sx+T*.22,sy+T*.82+b,T*.2,T*.16);c.fillRect(sx+T*.58,sy+T*.82+b,T*.2,T*.16);
    c.fillStyle='#3a5a8a';c.fillRect(sx+T*.25,sy+T*.5+b,T*.5,T*.35);
    c.fillStyle='#5a7aaa';c.fillRect(sx+T*.33,sy+T*.3+b,5,T*.24);c.fillRect(sx+T*.56,sy+T*.3+b,5,T*.24);
    c.fillStyle='#c86840';c.fillRect(sx+T*.25,sy+T*.3+b,T*.5,T*.24);
    c.fillRect(sx+T*.08,sy+T*.32+b-a,T*.18,T*.26);c.fillRect(sx+T*.74,sy+T*.32+b+a,T*.18,T*.26);
    c.fillStyle='#f0c090';c.fillRect(sx+T*.08,sy+T*.55+b-a,T*.18,T*.1);c.fillRect(sx+T*.74,sy+T*.55+b+a,T*.18,T*.1);
    c.fillStyle='#f0c090';c.fillRect(sx+T*.4,sy+T*.24+b,T*.2,T*.08);c.fillRect(sx+T*.24,sy+T*.04+b,T*.52,T*.24);
    if(GV.facing!=='up'){c.fillStyle='#2a1a08';c.fillRect(sx+T*.34,sy+T*.1+b,4,4);c.fillRect(sx+T*.55,sy+T*.1+b,4,4);c.fillStyle='#a04030';c.fillRect(sx+T*.4,sy+T*.22+b,T*.18,2);}
    c.fillStyle='#b86820';c.fillRect(sx+T*.2,sy+T*.02+b,T*.6,T*.1);c.fillRect(sx+T*.3,sy-T*.06+b,T*.4,T*.12);c.fillRect(sx+T*.12,sy+T*.1+b,T*.76,T*.06);
    const te={hoe:'⛏️',watering:'🚿',seeds:'🌱',bag:'🎒'}[GV.tool]||'⛏️';
    c.font=(T*.4)+'px serif';c.textAlign='center';c.textBaseline='middle';c.fillText(te,sx+T*1.15,sy+T*.6+b);
  }
  function gvClick(e){
    const r=gvC.getBoundingClientRect();
    const wx=(e.clientX-r.left)+gvCX,wy=(e.clientY-r.top)+gvCY;
    const tx=Math.floor(wx/GV_TS),ty=Math.floor(wy/GV_TS);
    for(const n of GV.npcs){if(Math.abs(n.hx-tx)<=1&&Math.abs(n.hy-ty)<=1){gvTalk(n);return;}}
    const pi=gvPI(tx,ty);
    if(pi>=0){
      const p=GV.plots[pi];
      if(p.st==='ready')gvHarvest(pi);
      else if(p.st==='empty'||p.st==='tilled')gvPlant(pi);
      else if(p.st==='planted'||p.st==='growing'){p.st='watered';gvSpend(2);gvNotify('💧 Regado!');}
      return;
    }
    GV.px=Math.max(0,Math.min(wx/GV_TS,GV_MW-1));
    GV.py=Math.max(0,Math.min(wy/GV_TS,GV_MH-1));
  }
  function gvHUD(){
    const sb=(cls,v,m)=>{const el=document.querySelector('.gv-bar-inner.'+cls);if(el)el.style.width=(v/m*100)+'%';};
    sb('energy',GV.energy,GV.maxE);sb('hunger',GV.hunger,GV.maxH);
    sb('water',GV.water,GV.maxW);sb('mood',GV.mood,GV.maxM);
    const cl=document.getElementById('gv-clock-display');
    if(cl){const h=Math.floor(GV.timeMin/60),m2=GV.timeMin%60;cl.textContent=String(h).padStart(2,'0')+':'+String(m2).padStart(2,'0');}
    const gl=document.getElementById('gv-gold-display');if(gl)gl.textContent=GV.gold+'g';
    const sb2=document.querySelector('.gv-season-badge');
    if(sb2){sb2.className='gv-season-badge '+GV_SEASONS[GV.season];sb2.textContent=GV_SNAMES[GV_SEASONS[GV.season]]+' · Dia '+GV.day;}
  }
  function gvUpdateSidebar(){gvRInv();gvRQuests();gvRNPCs();gvRRecs();gvUpdateMapPanel();}
  function gvRInv(){
    const tmap=['hoe','watering','seeds','bag'];
    const te={hoe:'⛏️',watering:'🚿',seeds:'🌱',bag:'🎒'};
    document.querySelectorAll('.gv-tool-slot').forEach((el,i)=>{
      el.textContent=te[tmap[i]]||'';el.className='gv-tool-slot'+(GV.tool===tmap[i]?' equipped':'');
      el.onclick=()=>gvEquip(tmap[i]);
      el.title=['1:Enxada','2:Regador','3:Sementes','4:Sacola'][i]||'';
    });
    const g=document.getElementById('gv-inv-grid');if(!g)return;
    g.innerHTML='';
    for(let i=0;i<16;i++){
      const it=GV.inv[i];const d=document.createElement('div');
      d.className='gv-inv-slot'+(GV.selInv===i?' selected':'');
      if(it){d.textContent=it.emoji;d.innerHTML+='<span class="qty">'+it.qty+'</span>';}
      d.onclick=()=>{GV.selInv=GV.selInv===i?-1:i;gvRInv();};g.appendChild(d);
    }
    const ss=document.getElementById('gv-seed-select');
    if(ss){
      const s=GV_SEASONS[GV.season];
      ss.innerHTML=Object.entries(GV_CROPS).filter(([,c])=>c.ss.includes(s))
        .map(([id,c])=>'<option value="'+id+'"'+(GV.seed===id?' selected':'')+'>'+c.e+' '+c.n+'</option>').join('');
      ss.onchange=e=>{GV.seed=e.target.value;};
    }
  }
  function gvRQuests(){
    const el=document.getElementById('gv-quests-list');if(!el)return;
    const ac=GV.quests.filter(q=>!q.done).slice(0,4);
    const dn=GV.quests.filter(q=>q.done).slice(0,2);
    el.innerHTML=[...ac,...dn].map(q=>
      '<div class="gv-quest-item'+(q.done?' done':'')+'">'+
      '<div class="gv-quest-title">'+q.t+'</div>'+
      '<div class="gv-quest-desc">'+q.d+'</div>'+
      '<div class="gv-quest-progress"><div class="gv-quest-bar" style="width:'+Math.min(100,(q.prog/q.qty)*100)+'%"></div></div>'+
      '</div>').join('');
    const vp=document.getElementById('gv-village-pts');if(vp)vp.textContent='🏘️ Vila: '+GV.vpts+'/200 pts';
  }
  function gvRNPCs(){
    const el=document.getElementById('gv-npcs-list');if(!el)return;
    el.innerHTML=GV.npcs.map(n=>
      '<div class="gv-npc-item" onclick="gvTalk(GV.npcs.find(x=>x.id===\''+n.id+'\'))">'+
      '<div class="gv-npc-avatar">'+n.e+'</div>'+
      '<div class="gv-npc-info">'+
      '<div class="gv-npc-name">'+n.n+'</div>'+
      '<div class="gv-npc-hearts">'+'❤️'.repeat(Math.floor(n.hearts||0))+'🤍'.repeat(n.mh-Math.floor(n.hearts||0))+'</div>'+
      '</div></div>').join('');
  }
  function gvRRecs(){
    const el=document.getElementById('gv-recipes-list');if(!el)return;
    el.innerHTML=GV_REC.map(r=>{
      const ok=GV.unrcp.includes(r.id)||GV.totalDays>=r.day;
      return '<div class="gv-recipe-item'+(ok?'':' locked')+'">'+
        '<div class="gv-recipe-header"><span class="gv-recipe-emoji">'+r.e+'</span><span class="gv-recipe-name">'+r.n+'</span></div>'+
        '<div class="gv-recipe-ingr">'+(ok?r.i.join(' + '):'???')+'</div>'+
        '</div>';
    }).join('');
  }
  function gvUpdateMapPanel(){
    const el=document.getElementById('gv-map-locs');if(!el)return;
    el.innerHTML=Object.entries(GV.locs).map(([k,l])=>
      '<div class="gv-map-loc'+(l.ok?'':' locked')+'" onclick="'+(l.ok?"gvTele('"+k+"')":'')+'">'+
      l.n+(l.ok?'':' <span style="font-size:.26rem;color:#7a5040">('+l.req+'pts)</span>')+
      '</div>').join('');
  }
  function gvTele(k){
    const l=GV.locs[k];if(!l?.ok)return;GV.px=l.x;GV.py=l.y;gvNotify('📍 '+l.n);gvCloseDlg();
  }
  function gvMinimap(){
    if(!gvMX||!gvMC)return;
    const mw=gvMC.width=190,mh=gvMC.height=80;
    const sx=mw/GV_MW,sy=mh/GV_MH;
    for(let ty=0;ty<GV_MH;ty++)for(let tx=0;tx<GV_MW;tx++){
      const t=gvMap[ty][tx];
      gvMX.fillStyle=t===3?'#3a80d0':t===2?'#c8a860':t===8?'#6a3a18':t===7?'#e0c888':'#4a7a30';
      gvMX.fillRect(tx*sx,ty*sy,sx+.5,sy+.5);
    }
    gvMX.fillStyle='#f4d03f';gvMX.fillRect(GV.px*sx-2,GV.py*sy-2,4,4);
    gvMX.fillStyle='#ff8080';for(const n of GV.npcs)gvMX.fillRect(n.hx*sx,n.hy*sy,3,3);
  }
  function gvNotify(msg){
    const el=document.getElementById('gv-notification');if(!el)return;
    el.textContent=msg;el.classList.add('show');
    if(GV.ntTimer)clearTimeout(GV.ntTimer);
    GV.ntTimer=setTimeout(()=>el.classList.remove('show'),3000);
  }
  function gvSave(){
    try{localStorage.setItem('gv_sv3',JSON.stringify({
      px:GV.px,py:GV.py,gold:GV.gold,energy:GV.energy,hunger:GV.hunger,water:GV.water,mood:GV.mood,
      day:GV.day,totalDays:GV.totalDays,season:GV.season,timeMin:GV.timeMin,
      plots:GV.plots,inv:GV.inv,vpts:GV.vpts,locs:GV.locs,
      npcs:GV.npcs.map(n=>({id:n.id,hearts:n.hearts,qd:n.qd,qp:n.qp})),
      quests:GV.quests.map(q=>({id:q.id,prog:q.prog,done:q.done})),
      unrcp:GV.unrcp,stats:GV.stats,cooked:GV.cooked,tool:GV.tool,seed:GV.seed,
    }));}catch(e){}
  }
  function gvLoad(){
    try{
      const s=JSON.parse(localStorage.getItem('gv_sv3')||'null');if(!s)return;
      Object.assign(GV,{px:s.px,py:s.py,gold:s.gold,energy:s.energy,hunger:s.hunger,water:s.water,mood:s.mood});
      Object.assign(GV,{day:s.day,totalDays:s.totalDays,season:s.season,timeMin:s.timeMin});
      if(s.plots)GV.plots=s.plots;if(s.inv)GV.inv=s.inv;
      GV.vpts=s.vpts??0;if(s.locs)Object.assign(GV.locs,s.locs);
      if(s.npcs)s.npcs.forEach(sn=>{const n=GV.npcs.find(x=>x.id===sn.id);if(n){n.hearts=sn.hearts;n.qd=sn.qd;n.qp=sn.qp;}});
      if(s.quests)s.quests.forEach(sq=>{const q=GV.quests.find(x=>x.id===sq.id);if(q){q.prog=sq.prog;q.done=sq.done;}});
      if(s.unrcp)GV.unrcp=s.unrcp;if(s.stats)GV.stats=s.stats;if(s.cooked)GV.cooked=s.cooked;
      GV.tool=s.tool??'hoe';GV.seed=s.seed??'strawberry';
    }catch(e){}
  }
  function gvNewGame(){localStorage.removeItem('gv_sv3');gvInitState();gvGenMap();gvUpdateSidebar();gvNotify('🌱 Nova partida!');}
  function gvCredits(){document.getElementById('gv-credits')?.classList.add('visible');}
  function gvHideCredits(){document.getElementById('gv-credits')?.classList.remove('visible');}
  function abrirGreenVale(){
    const sec=document.getElementById('greenvale-section');if(!sec)return;
    sec.classList.add('active');document.body.style.overflow='hidden';
    setTimeout(()=>gvInit(),120);
  }
  function fecharGreenVale(){
    const sec=document.getElementById('greenvale-section');if(!sec)return;
    if(GV.running){GV.running=false;gvSave();}
    sec.classList.remove('active');document.body.style.overflow='';
  }
  