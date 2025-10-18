(function(){
  var overlay=document.getElementById('gate-overlay');
  var canvas=document.getElementById('wormhole');
  var msg=document.getElementById('message');
  var titleEl=document.getElementById('title');
  var linesEl=document.getElementById('lines');
  var ctx=canvas.getContext('2d');
  var W=0,H=0,CX=0,CY=0,DPR=1;
  var running=false, particles=[], MAX=900;

  function resize(){
    DPR=Math.min(window.devicePixelRatio||1,2);
    W=canvas.width=Math.floor(window.innerWidth*DPR);
    H=canvas.height=Math.floor(window.innerHeight*DPR);
    canvas.style.width='100%';canvas.style.height='100%';
    CX=W/2;CY=H/2;
    seed();
  }

  function seed(){
    particles.length=0;
    var maxR=Math.hypot(W,H)/2;
    for(var i=0;i<MAX;i++){
      var r=Math.random()*maxR;
      var a=Math.random()*Math.PI*2;
      var sr=-(0.15+0.0006*r)*(0.6+Math.random()*0.8);
      var sa=0.002+0.00015*r+Math.random()*0.0006;
      particles.push({r:r,a:a,sr:sr,sa:sa,px:0,py:0});
    }
  }

  function step(){
    if(!running) return;
    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation='lighter';
    var maxR=Math.hypot(W,H)/2;
    for(var i=0;i<particles.length;i++){
      var p=particles[i];
      p.a+=p.sa;p.r+=p.sr;
      var x=CX+Math.cos(p.a)*p.r;
      var y=CY+Math.sin(p.a)*p.r;
      var alpha=Math.min(1,Math.max(0,p.r/maxR));
      ctx.strokeStyle='rgba(168,85,247,'+(0.03+0.12*(1-alpha))+')';
      ctx.lineWidth=1.1*DPR*(1.4-alpha);
      ctx.beginPath();
      ctx.moveTo(p.px||x,p.py||y);
      ctx.lineTo(x,y);
      ctx.stroke();
      p.px=x;p.py=y;
      if(p.r<1||p.r>maxR){
        p.r=maxR*(0.6+Math.random()*0.4);
        p.a=Math.random()*Math.PI*2;
        p.px=CX+Math.cos(p.a)*p.r;
        p.py=CY+Math.sin(p.a)*p.r;
      }
    }
    ctx.globalCompositeOperation='source-over';
    var grad=ctx.createRadialGradient(CX,CY,0,CX,CY,Math.max(W,H)/1.2);
    grad.addColorStop(0,'rgba(0,0,0,0)');
    grad.addColorStop(0.5,'rgba(0,0,0,0.2)');
    grad.addColorStop(1,'rgba(0,0,0,0.9)');
    ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
    requestAnimationFrame(step);
  }

  function start(){
    if(running) return;
    running=true;
    overlay.classList.add('hidden');
    canvas.classList.add('active');
    requestAnimationFrame(step);
    setTimeout(function(){ msg.classList.add('show'); },3200);
    loadContent();
    setInterval(function(){
      var u=window.location.pathname+'?t='+Date.now();
      window.location.replace(u);
    },300000);
  }

  async function loadContent(){
    try{
      var res=await fetch('content.json?v='+Date.now());
      var data=await res.json();
      titleEl.textContent=data.title||'';
      linesEl.innerHTML='';
      (data.lines||[]).forEach(function(t){
        var p=document.createElement('p');p.textContent=t;linesEl.appendChild(p);
      });
    }catch(e){
      // Fallback для локального открытия file://
      if (location.protocol === 'file:'){
        titleEl.textContent='НЕИЗВЕСТНЫЙ';
        linesEl.innerHTML='';
        ['Он отдал себя, чтобы открыть путь.','Врата в Энд откликаются.','Выбор сделан — путь назад закрыт.']
          .forEach(function(t){var p=document.createElement('p');p.textContent=t;linesEl.appendChild(p);});
      }
    }
  }

  function ready(){
    resize();
    ['keydown','pointerdown','touchstart'].forEach(function(evt){
      window.addEventListener(evt,start,{once:true});
    });
    // Доп. страховки на случай фокуса и захвата событий
    document.addEventListener('keydown', start, { once:true });
    if (overlay) overlay.addEventListener('pointerdown', start, { once:true });
  }

  window.addEventListener('resize',resize);
  document.addEventListener('DOMContentLoaded',ready);
})();