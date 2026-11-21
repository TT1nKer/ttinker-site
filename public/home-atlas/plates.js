/* Original two-ink technical plates. These are structural illustrations, not
 * measured data or network telemetry. No clock, fetch, assets, or render loop.
 * Call draw(canvas, projectKey, phase) after selection, input, or resize.
 */
(function (global) {
  'use strict';
  const INK = '#202b6d';
  const VERMILION = '#d75232';
  const TAU = Math.PI * 2;
  const cache = new WeakMap();
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const hash = (v) => { const n = Math.sin(v * 12.9898 + 78.233) * 43758.5453; return n - Math.floor(n); };

  function pen(c, color = INK, width = .65, alpha = 1) {
    c.strokeStyle = color; c.fillStyle = color; c.lineWidth = width;
    c.globalAlpha = alpha; c.lineCap = 'round'; c.lineJoin = 'round';
  }
  function stroke(c, points, color = INK, width = .65, alpha = 1) {
    if (points.length < 2) return;
    pen(c, color, width, alpha); c.beginPath(); c.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]);
    c.stroke();
  }
  function dot(c, x, y, r = 1.7, color = INK, filled = true, alpha = 1) {
    pen(c, color, .7, alpha); c.beginPath(); c.arc(x, y, r, 0, TAU); filled ? c.fill() : c.stroke();
  }
  function ring(c, x, y, rx, ry, angle = 0, color = INK, width = .6, alpha = 1, start = 0, end = TAU) {
    pen(c, color, width, alpha); c.beginPath(); c.ellipse(x, y, rx, ry, angle, start, end); c.stroke();
  }
  function label(c, s, x, y, color = INK, size = 10, align = 'center') {
    pen(c, color); c.font = `${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;
    c.textAlign = align; c.textBaseline = 'middle'; c.fillText(s, x, y);
  }
  function bezier(a, b, d, e, t) {
    const q = 1 - t;
    return [q*q*q*a[0] + 3*q*q*t*b[0] + 3*q*t*t*d[0] + t*t*t*e[0], q*q*q*a[1] + 3*q*q*t*b[1] + 3*q*t*t*d[1] + t*t*t*e[1]];
  }
  function curve(c, a, b, d, e, progress = 1, color = INK, width = .6, alpha = 1) {
    const pts = []; const count = Math.max(2, Math.ceil(55 * progress));
    for (let i = 0; i <= count; i++) pts.push(bezier(a, b, d, e, progress * i / count));
    stroke(c, pts, color, width, alpha);
    return pts[pts.length - 1];
  }
  function rect(c, x, y, w, h, color = INK, width = .6, alpha = 1) {
    pen(c, color, width, alpha); c.strokeRect(x, y, w, h);
  }
  function hatch(c, x, y, w, h, spacing = 3.2, alpha = .55) {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    for (let k = -h; k < w; k += spacing) stroke(c, [[x+k,y+h],[x+k+h,y]], INK, .48, alpha);
    c.restore();
  }
  function arrow(c, p, tangent, color = VERMILION, size = 3.5, alpha = 1) {
    const a = Math.atan2(tangent[1], tangent[0]);
    stroke(c, [[p[0]-Math.cos(a-.47)*size,p[1]-Math.sin(a-.47)*size],p,[p[0]-Math.cos(a+.47)*size,p[1]-Math.sin(a+.47)*size]],color,.8,alpha);
  }
  function event(c, x, y, source, color = INK, alpha = 1) {
    if (source === 0) dot(c,x,y,2.05,color,false,alpha);
    else if (source === 1) rect(c,x-1.8,y-1.8,3.6,3.6,color,.7,alpha);
    else stroke(c,[[x,y-2.4],[x+2.3,y+1.8],[x-2.3,y+1.8],[x,y-2.4]],color,.7,alpha);
  }

  function chatcommons(c, phase) {
    const start = 87, end = 650;
    const centers = [78,163,246];
    const ypos = (lane,x,j=0) => {
      const t=(x-start)/(end-start);
      const swell=Math.exp(-(((t-.36)/.25)**2)),late=Math.exp(-(((t-.86)/.19)**2));
      const bend = [-28,9,29][lane]*Math.sin(t*Math.PI)*Math.sin(t*Math.PI*.91)+[3,-10,-3][lane]*Math.sin(t*TAU);
      const breadth = 17+[17,10,13][lane]*swell+[10,17,8][lane]*late;
      // Closely nested edges give the engraver's dark contour. The open middle
      // remains light enough for individual record glyphs to be distinguishable.
      return centers[lane]+bend+Math.sin(j*Math.PI*.5)*breadth;
    };
    const tip=lerp(137,650,phase);
    // Each hatching ribbon is a separate local history. Its small outline
    // symbols identify originating records, including copies after exchange.
    for(let lane=0;lane<3;lane++) {
      const y=centers[lane];
      label(c,String.fromCharCode(65+lane),47,y,INK,12);
      rect(c,66,y-23,18,46,INK,1,.96);
      for(let j=0;j<7;j++) stroke(c,[[69,y-16+j*5],[80,y-16+j*5]],INK,.45,.55);
      stroke(c,[[70,y+26],[83,y+26],[83,y+23]],INK,.5,.4);
      for(let j=0;j<43;j++) {
        const f=(j-21)/21;
        const pts=[];
        for(let x=start;x<=end;x+=5) pts.push([x,ypos(lane,x,f)]);
        const boundary=j===0||j===42;
        const width=boundary?1:j%7===0?.86:.55;
        stroke(c,pts,INK,width,boundary?.39:.23);
        c.save();c.beginPath();c.rect(start-1,0,tip-start+1,330);c.clip();
        stroke(c,pts,INK,width,boundary?1:j%7===0?.96:.82);
        c.restore();
      }
      // Cross sections give the band a printed, laminated edge, without a fill.
      for(let k=0;k<6;k++) {
        const x=105+k*24+lane*7;
        if(x>tip)continue;
        stroke(c,[[x,ypos(lane,x,-1.03)],[x+4,ypos(lane,x+4,1.03)]],INK,.45,.33);
        event(c,x+4,ypos(lane,x+4,0),lane,INK,.93);
      }
      if(tip>515) {
        for(let k=0;k<5;k++){
          const x=525+k*23;
          if(x>tip-6)break;
          // A has not met C again after the relayed exchange, so C-origin
          // records cannot appear in A's history during this illustration.
          const sources=[[0,1,0,1,0],[1,0,2,1,0],[2,1,0,2,1]];
          event(c,x,ypos(lane,x,0),sources[lane][k],k===4?VERMILION:INK,.9);
        }
      }
      const yn=ypos(lane,tip);
      stroke(c,[[tip,ypos(lane,tip,-1)-3],[tip,ypos(lane,tip,1)+3]],VERMILION,.85,.9);
      dot(c,tip,yn,2.7,VERMILION);
    }
    // Direct bidirectional exchange: each arrow starts at one device's earlier
    // record and ends at a later record in the other device. Histories stay local.
    const direct = ease(.14,.54,phase);
    for(let direction=0;direction<2;direction++) {
      const from=direction, to=1-direction;
      for(let j=0;j<25;j++){
        const f=Math.sin((j-12)/12*Math.PI*.5)*13;
        const a=[212+direction*13,ypos(from,212+direction*13)+f];
        const e=[349+direction*14,ypos(to,349+direction*14)+f];
        const b=[265,a[1]], d=[294,e[1]];
        curve(c,a,b,d,e,1,INK,.52,.23);
        if(direct>0)curve(c,a,b,d,e,direct,INK,j%6===0?.82:.56,.9);
      }
      if(direct>0) {
        const a=[212+direction*13,ypos(from,212+direction*13)];
        const e=[349+direction*14,ypos(to,349+direction*14)];
        const b=[265,a[1]], d=[294,e[1]];
        const p=curve(c,a,b,d,e,direct,VERMILION,1.1,.96);
        const prev=bezier(a,b,d,e,Math.max(0,direct-.035));
        arrow(c,p,[p[0]-prev[0],p[1]-prev[1]],VERMILION,4);
        if(direct>.98)event(c,e[0],e[1],from,VERMILION);
      }
    }
    // The relay is a transport junction, not a fourth permanent history.
    const relay = ease(.40,.70,phase), rx=420, ry=210;
    const relayRoutes=[
      [[335,ypos(1,335)],[377,166],[382,200],[rx-11,ry]],
      [[rx+11,ry],[462,214],[455,257],[497,ypos(2,497)]],
      [[338,ypos(2,338)],[375,267],[387,220],[rx-11,ry]],
      [[rx+11,ry],[463,201],[452,170],[500,ypos(1,500)]]
    ];
    relayRoutes.forEach((r,index)=>{
      const leg=clamp(relay*2-(index%2));
      for(let j=-9;j<=9;j++){
        const shift=Math.sin(j/9*Math.PI*.5)*8.5;
        const q=r.map(p=>[p[0],p[1]+shift]);
        curve(c,...q,1,INK,.49,.24);
        if(leg>0)curve(c,...q,leg,INK,j%3===0?.70:.52,.85);
      }
      if(leg>0){
        const p=curve(c,...r,leg,VERMILION,.9,.92);
        const prev=bezier(...r,Math.max(0,leg-.03));
        arrow(c,p,[p[0]-prev[0],p[1]-prev[1]],VERMILION,3.2);
      }
    });
    const hex=[];
    for(let i=0;i<=6;i++)hex.push([rx+11*Math.cos(i*TAU/6),ry+11*Math.sin(i*TAU/6)]);
    c.save();c.globalCompositeOperation='destination-out';dot(c,rx,ry,10,'#000');c.restore();
    stroke(c,hex,INK,1.05,1);label(c,'R',rx,ry,INK,9);
    // Two unobtrusive register rules establish a common direction of time.
    stroke(c,[[89,315],[650,315]],INK,.4,.19);
    for(const x of [89,212,350,420,500,650])stroke(c,[[x,312],[x,318]],INK,.45,.29);
    arrow(c,[650,315],[1,0],INK,3,.35);
  }

  function opensender(c,phase) {
    // A file is partitioned into independent byte ranges, then reassembled.
    // Unequal progress is illustrative, not a fabricated speed measurement.
    for(let page=0;page<5;page++){
      const x=62+page*4,y=80-page*3;
      stroke(c,[[x,y+171],[x,y],[x+64,y],[x+64,y+171],[x,y+171]],INK,.65,.34+page*.12);
    }
    for(let i=0;i<26;i++)stroke(c,[[89,90+i*5.5],[117-(i%5)*3,90+i*5.5]],INK,.48,.65);
    const lanes=13;
    for(let i=0;i<lanes;i++){
      const y=57+i*18;
      const q=clamp(phase*1.24-(hash(i+10)*.19));
      const a=[147,95+i*10.4],e=[227,y];
      for(let j=-1;j<=1;j++){
        const yy=j*2.0;
        curve(c,[a[0],a[1]+yy],[184,a[1]+yy],[192,y+yy],[e[0],y+yy],1,INK,.48,.67);
        curve(c,[492,y+yy],[536,y+yy],[532,95+i*10.4+yy],[576,95+i*10.4+yy],1,INK,.48,.67);
      }
      stroke(c,[[227,y-3.3],[492,y-3.3]],INK,.48,.32);
      stroke(c,[[227,y+3.3],[492,y+3.3]],INK,.48,.32);
      const n=24;
      for(let b=0;b<n;b++){
        const x=232+b*10.6;
        const complete=(b+1)/n<=q;
        if(complete)hatch(c,x,y-2.7,7.6,5.4,2.1,.82);
        else stroke(c,[[x,y],[x+7.6,y]],INK,.45,.16);
      }
      const cursor=232+Math.floor(q*23)*10.6;
      rect(c,cursor,y-4,8,8,VERMILION,.85,.9);
      if(q>=.999)stroke(c,[[575,95+i*10.4],[582,95+i*10.4]],VERMILION,1.5,.9);
    }
    rect(c,588,80,65,169,INK,.8,.95);
    for(let i=0;i<26;i++){
      const y=87+i*6;
      stroke(c,[[593,y],[648,y]],INK,.45,i/26<phase?.72:.14);
      for(let b=0;b<9;b++)if(hash(i*13+b)>.46&&i/26<phase)stroke(c,[[595+b*5.5,y-1.3],[595+b*5.5,y+1.3]],INK,.65,.8);
    }
    label(c,'Σ',620,269,phase>.98?VERMILION:INK,13);
    stroke(c,[[232,305],[486,305]],INK,.4,.18);
    for(let i=0;i<13;i++)stroke(c,[[232+i*21.1,302],[232+i*21.1,308]],INK,.4,.22);
  }

  function adaptiveNet(c,phase) {
    // A deliberately small structural model: topology changes with coupling.
    const pts=[];
    for(let band=0;band<3;band++){
      for(let i=0;i<19;i++){
        const a=i/19*TAU+band*.09;
        const r=73+band*22;
        const deformation=phase*15*Math.sin(a*3+band*.8);
        pts.push([350+(r+deformation)*Math.cos(a)*1.96,166+(r+deformation)*Math.sin(a)*.97]);
      }
    }
    // The field is a light spatial reference, with no numeric axes or scores.
    for(let x=84;x<655;x+=24)for(let y=49;y<297;y+=24){
      const dx=(x-350)/270,dy=(y-166)/132;
      if(dx*dx+dy*dy>1.15)continue;
      stroke(c,[[x-1.5,y],[x+1.5,y]],INK,.4,.13);
      stroke(c,[[x,y-1.5],[x,y+1.5]],INK,.4,.13);
    }
    for(let i=0;i<pts.length;i++){
      const ringIndex=Math.floor(i/19),angleIndex=i%19;
      const next=ringIndex*19+(angleIndex+1)%19;
      stroke(c,[pts[i],pts[next]],INK,.58,.65);
      for(let jump=1;jump<=3;jump++){
        const to=((ringIndex+1)%3)*19+(angleIndex+jump*2)%19;
        if(hash(i*19+jump)>lerp(.76,.25,phase)){
          const a=pts[i],b=pts[to];
          curve(c,a,[lerp(a[0],350,.15),lerp(a[1],166,.15)],[lerp(b[0],350,.15),lerp(b[1],166,.15)],b,1,INK,.43,.38);
        }
      }
    }
    const active=Math.min(18,Math.floor(phase*19));
    for(let band=0;band<3;band++){
      const p=pts[band*19+active],q=pts[((band+1)%3)*19+(active+4)%19];
      curve(c,p,[lerp(p[0],350,.14),lerp(p[1],166,.14)],[lerp(q[0],350,.14),lerp(q[1],166,.14)],q,1,VERMILION,1.1,.88);
    }
    pts.forEach((p,i)=>{
      dot(c,p[0],p[1],i%19===active?3.7:1.65,i%19===active?VERMILION:INK,i%19===active,.95);
    });
    ring(c,350,166,276,126,0,INK,.4,.18,.04,2.63);
    ring(c,350,166,276,126,0,INK,.4,.18,3.15,5.75);
    for(const a of [.25,1.32,2.36,3.4,4.45,5.5]){
      const p=[350+276*Math.cos(a),166+126*Math.sin(a)];
      stroke(c,[[p[0]-4*Math.cos(a),p[1]-4*Math.sin(a)],[p[0]+4*Math.cos(a),p[1]+4*Math.sin(a)]],INK,.5,.4);
    }
  }

  function hwine(c,phase) {
    // a(b+c) and ab+ac are genuinely equivalent alternatives. Shared inputs
    // fan out where required; the equivalence mark applies to their outputs.
    const upper=[
      [[98,62],[281,62],[281,94],[330,94]],
      [[98,105],[171,105],[171,117],[210,117]],
      [[98,143],[171,143],[171,131],[210,131]],
      [[236,124],[283,124],[283,106],[330,106]],
      [[357,100],[417,100]]
    ];
    const lower=[
      [[98,222],[155,222],[155,200],[214,200]],
      [[155,222],[155,250],[214,250]],
      [[98,184],[192,184],[192,212],[214,212]],
      [[98,283],[192,283],[192,263],[214,263]],
      [[240,206],[288,206],[288,227],[330,227]],
      [[240,257],[288,257],[288,239],[330,239]],
      [[357,233],[417,233]]
    ];
    for(const [group,chosen] of [[upper,phase<.5],[lower,phase>=.5]]){
      for(const route of group){
        for(let j=-1;j<=1;j++)stroke(c,route.map(p=>[p[0],p[1]+j*1.7]),INK,.43,.65);
        if(chosen)stroke(c,route,VERMILION,.85,.9);
      }
    }
    for(const [s,y] of [['a',62],['b',105],['c',143],['b',184],['a',222],['c',283]]){
      label(c,s,85,y,INK,11);dot(c,98,y,1.4,INK);
    }
    dot(c,155,222,2,INK);
    for(const [x,y,s] of [[223,124,'+'],[343,100,'×'],[227,206,'×'],[227,257,'×'],[343,233,'+']]){
      ring(c,x,y,13,13,0,INK,.7,.9);label(c,s,x,y,INK,12);
    }
    for(const y of [100,233]){
      rect(c,417,y-19,48,38,INK,.7,.8);
      for(let j=-5;j<=5;j++)stroke(c,[[421,y+j*2.7],[461,y+j*2.7]],INK,.43,.65);
      for(let j=-9;j<=9;j++)curve(c,[465,y+j*.85],[506,y+j*.85],[520,165+j*.85],[592,165+j*.85],1,INK,.45,.65);
    }
    stroke(c,[[435,145],[431,145],[431,185],[435,185]],INK,.5,.4);
    stroke(c,[[447,145],[451,145],[451,185],[447,185]],INK,.5,.4);
    label(c,'≡',441,165,INK,12);
    for(let i=0;i<22;i++)stroke(c,[[599+i*2,143],[599+i*2,188]],INK,.48,.64);
    rect(c,594,138,53,55,INK,.8,.8);
    const y=phase<.5?100:233,p=phase<.5?phase*2:(phase-.5)*2;
    const head=curve(c,[465,y],[506,y],[520,165],[592,165],p,VERMILION,1.2,.95);
    dot(c,head[0],head[1],3,VERMILION);
  }

  function solar(c,phase) {
    // Kepler ellipses share a focus. Their foreshortening is an orthographic
    // projection of the orbital plane, never a simulated live ephemeris.
    const focus=[432,151],angle=-.20,ca=Math.cos(angle),sa=Math.sin(angle),ecc=.40,flatten=.46;
    const at=(a,E)=>{
      const x=a*(Math.cos(E)-ecc),y=a*Math.sqrt(1-ecc*ecc)*Math.sin(E)*flatten;
      return [focus[0]+x*ca-y*sa,focus[1]+x*sa+y*ca];
    };
    for(let band=0;band<3;band++){
      for(let i=0;i<21;i++){
        const a=94+band*75+i*2.05;
        const pts=[];
        for(let j=0;j<=160;j++)pts.push(at(a,j/160*TAU));
        stroke(c,pts,INK,i===0||i===20?1.05:i%5===0?.83:.59,i===0||i===20?1:.88);
      }
    }
    const lightAxis=[at(285,Math.PI),at(285,0)];
    stroke(c,lightAxis,INK,.4,.2);
    for(let i=-1;i<=1;i++)ring(c,focus[0],focus[1],5+i*2,5+i*2,0,VERMILION,.65,.9);
    stroke(c,[[focus[0]-11,focus[1]],[focus[0]+11,focus[1]]],VERMILION,.55,.8);
    stroke(c,[[focus[0],focus[1]-11],[focus[0],focus[1]+11]],VERMILION,.55,.8);
    for(let body=0;body<3;body++){
      const a=114+body*75;
      const mean=(phase*TAU*(1-body*.18)+body*2.03)%TAU;
      let E=mean;for(let j=0;j<6;j++)E-=(E-ecc*Math.sin(E)-mean)/(1-ecc*Math.cos(E));
      const p=at(a,E),trail=[];
      for(let i=0;i<=34;i++)trail.push(at(a,E-.78+i/34*.78));
      stroke(c,trail,VERMILION,1.6,1);
      dot(c,p[0],p[1],body===1?4.7:3.5,VERMILION,false);
      dot(c,p[0],p[1],1.5,VERMILION);
      stroke(c,[focus,p],INK,.4,.19);
    }
    // Tiny divisions are positional construction marks rather than labels.
    for(let k=0;k<48;k++){
      const e=k/48*TAU,p=at(290,e),q=at(k%4===0?297:293,e);
      stroke(c,[p,q],INK,.5,k%4===0?.6:.25);
    }
  }

  function pomodoroAKAtimer(c,phase) {
    // Four focus/break units. Angular position represents deliberate progress.
    const cx=244,cy=165;
    for(let j=0;j<14;j++)ring(c,cx,cy,92+j*2.4,92+j*2.4,0,INK,.47,.67,-Math.PI*.5,Math.PI*1.5);
    for(let i=0;i<120;i++){
      const a=-Math.PI/2+i/120*TAU;
      const major=i%5===0,rest=i%30>=25;
      const r=major?81:87;
      stroke(c,[[cx+r*Math.cos(a),cy+r*Math.sin(a)],[cx+91*Math.cos(a),cy+91*Math.sin(a)]],rest?VERMILION:INK,major?.9:.55,rest?.8:.6);
    }
    for(let quadrant=0;quadrant<4;quadrant++){
      const start=-Math.PI/2+quadrant*Math.PI/2;
      ring(c,cx,cy,72,72,0,INK,.6,.35,start+.07,start+Math.PI/2-.07);
      for(let i=0;i<8;i++){
        const radius=67-i*3.4;
        ring(c,cx,cy,radius,radius,0,INK,.45,.35,start+.06,start+Math.PI/2-.06);
      }
    }
    const a=-Math.PI/2+phase*TAU;
    for(let j=0;j<8;j++)ring(c,cx,cy,95+j*3.3,95+j*3.3,0,VERMILION,.53,.85,-Math.PI/2,a);
    stroke(c,[[cx-9*Math.cos(a),cy-9*Math.sin(a)],[cx+128*Math.cos(a),cy+128*Math.sin(a)]],VERMILION,1.1);
    dot(c,cx,cy,4,VERMILION,false);dot(c,cx,cy,1.1,VERMILION);
    // A compact phase ledger unrolls the circular sequence into four measures.
    for(let i=0;i<4;i++){
      const y=85+i*51;
      curve(c,[cx+130,cy+(i-1.5)*13],[407,cy+(i-1.5)*13],[395,y],[432,y],1,INK,.55,.45);
      const amount=clamp(phase*4-i);
      for(let j=0;j<30;j++){
        const x=436+j*5.8;
        const length=j>=25?9:19;
        stroke(c,[[x,y-length/2],[x,y+length/2]],j>=25?VERMILION:INK,j%5===0?.9:.55,j/30<amount?.9:.18);
      }
      stroke(c,[[433,y+15],[608,y+15]],INK,.4,.19);
      if(amount>0&&amount<1)dot(c,436+amount*174,y,2.8,VERMILION);
    }
    for(let i=0;i<4;i++){
      const ang=-Math.PI/2+i*Math.PI/2;
      stroke(c,[[cx+132*Math.cos(ang),cy+132*Math.sin(ang)],[cx+139*Math.cos(ang),cy+139*Math.sin(ang)]],INK,.7,.65);
    }
  }

  function fstCC(c,phase) {
    // A small expression tree and an instruction word field; no fake test
    // totals, benchmark figures, or invented machine-code claims.
    const leaves=[[86,69],[86,127],[86,212]];
    leaves.forEach((p,i)=>{label(c,['a','b','c'][i],p[0],p[1],INK,13);});
    const plus=[202,99],times=[308,165],output=[412,165];
    const routes=[
      [leaves[0],[142,69],[150,99],plus],
      [leaves[1],[142,127],[150,99],plus],
      [plus,[255,99],[254,165],times],
      [leaves[2],[202,212],[245,165],times],
      [times,[345,165],[373,165],output]
    ];
    routes.forEach((r,i)=>{
      for(let j=-3;j<=3;j++)curve(c,...r.map(p=>[p[0]+(p[0]===86?13:0),p[1]+j*1.7]),1,INK,.45,.58);
      const t=ease(i*.12,i*.12+.28,phase);
      if(t>0)curve(c,...r,t,VERMILION,1,.95);
    });
    for(const [p,s] of [[plus,'+'],[times,'×']]){
      ring(c,p[0],p[1],15,15,0,INK,.8,.9);label(c,s,p[0],p[1],INK,15);
    }
    for(let j=0;j<15;j++){
      const y=55+j*15.5;
      curve(c,[412,165+(j-7)*1.7],[447,165+(j-7)*1.7],[437,y],[472,y],1,INK,.46,.47);
      for(let bit=0;bit<32;bit++){
        const x=478+bit*5.3;
        const high=hash(j*37+bit+40)>.52;
        stroke(c,[[x,y-(high?3:1)],[x,y+(high?3:1)]],j/15<ease(.40,1,phase)?INK:INK,high?.95:.55,j/15<ease(.40,1,phase)?.8:.16);
      }
      if(j===Math.min(14,Math.floor(ease(.4,1,phase)*15)))stroke(c,[[472,y-6],[650,y-6],[650,y+6],[472,y+6]],VERMILION,.7,.8);
    }
    for(const x of [478,520,563,606,648])stroke(c,[[x,41],[x,48]],INK,.5,.45);
    stroke(c,[[80,267],[106,267],[106,290],[335,290],[335,267],[364,267]],INK,.6,.32);
    label(c,'(a + b) × c',221,290,INK,11);
  }

  function StockItsMygo(c,phase) {
    // An abstract watch/filter operation. These marks are not market prices.
    const count=38;
    for(let row=0;row<count;row++){
      const y=49+row*6.25;
      for(let j=0;j<10;j++){
        const x=83+j*19.2;
        const h=1+hash(row*101+j)*3.7;
        stroke(c,[[x,y-h],[x,y+h]],INK,.55,.5);
        stroke(c,[[x-2,y],[x+2,y]],INK,.45,.35);
      }
      const rank=hash(row+350),selected=rank>lerp(.30,.85,phase);
      const dest=164+(row-(count-1)/2)*1.16;
      curve(c,[273,y],[335,y],[342,dest],[387,dest],1,INK,.45,.32);
      if(selected){
        const endY=54+row*6.1;
        curve(c,[407,dest],[462,dest],[485,endY],[553,endY],1,INK,.54,.75);
        for(let j=0;j<11;j++)stroke(c,[[558+j*5.9,endY-2],[558+j*5.9,endY+2]],INK,.45,.6);
        if(row%3===0)dot(c,632,endY,1.9,VERMILION,false,.92);
      }
    }
    // Two offset etched screens articulate a narrow filtering throat.
    for(let layer=0;layer<2;layer++){
      const x=388+layer*16;
      stroke(c,[[x,64],[x,263]],INK,.85,.75);
      for(let i=0;i<31;i++){
        const y=68+i*6.3;
        stroke(c,[[x-4,y],[x+4,y+2]],INK,.55,.62);
      }
      stroke(c,[[x-4,60],[x+4,60],[x+4,267],[x-4,267]],INK,.48,.35);
    }
    const yy=lerp(235,94,phase);
    stroke(c,[[377,yy],[419,yy]],VERMILION,1.1,.95);
    arrow(c,[419,yy],[1,0],VERMILION,4);
    stroke(c,[[82,301],[268,301]],INK,.4,.22);
    stroke(c,[[555,301],[639,301]],INK,.4,.22);
  }

  function BoOS(c,phase) {
    // State continuity around a runtime boundary; stores and tools remain
    // distinct. This is an architectural motif, not a thermodynamic claim.
    const cx=342,cy=165;
    for(let j=0;j<29;j++){
      const rx=95+j*2.05,ry=75+j*1.55;
      ring(c,cx,cy,rx,ry,0,INK,j%7===0?.65:.43,.65,-Math.PI*.78,Math.PI*.78);
      ring(c,cx,cy,rx,ry,0,INK,.43,.42,Math.PI*.85,Math.PI*1.15);
    }
    for(let i=0;i<13;i++){
      const y=82+i*13.2;
      const endpoint=[cx-127*Math.sqrt(Math.max(0,1-((y-cy)/112)**2)),y];
      curve(c,[110,y],[178,y],[173,endpoint[1]],endpoint,1,INK,.5,.6);
      for(let j=0;j<7;j++)stroke(c,[[74+j*4.5,y-3],[74+j*4.5,y+3]],INK,.6,.66);
      curve(c,[cx+136*Math.sqrt(Math.max(0,1-((y-cy)/115)**2)),y],[520,y],[535,70+i*15.5],[579,70+i*15.5],1,INK,.5,.6);
      for(let j=0;j<4;j++)rect(c,585+j*8,67+i*15.5,5.5,5.5,INK,.4,.55);
    }
    // Nested memory contours have deliberate gaps for causal entry/exit.
    for(let j=0;j<9;j++)ring(c,cx,cy,27+j*5.3,22+j*4.3,0,INK,.48,.45,-2.42,2.42);
    const a=-Math.PI*.78+phase*Math.PI*1.56;
    for(let j=0;j<7;j++)ring(c,cx,cy,104+j*4.7,82+j*3.5,0,VERMILION,.58,.85,-Math.PI*.78,a);
    const x=cx+134*Math.cos(a),y=cy+104*Math.sin(a);
    dot(c,x,y,3.4,VERMILION,false);dot(c,x,y,1.1,VERMILION);
    stroke(c,[[cx-6,cy],[cx+6,cy]],INK,.65,.75);
    stroke(c,[[cx,cy-6],[cx,cy+6]],INK,.65,.75);
    label(c,'M',92,278,INK,9);label(c,'T',606,278,INK,9);
  }

  const drawers = { chatcommons, opensender, adaptiveNet, hwine, solar, pomodoroAKAtimer, fstCC, StockItsMygo, BoOS };

  function draw(canvas, key = 'chatcommons', phase = .62) {
    if (!canvas || typeof canvas.getContext !== 'function') return false;
    const bounds = typeof canvas.getBoundingClientRect === 'function' ? canvas.getBoundingClientRect() : null;
    // Use CSS dimensions, never multiply an old backing-store width by DPR.
    const previous = cache.get(canvas);
    const width = Math.max(1, Math.round((bounds && bounds.width) || canvas.clientWidth || (previous && previous.width) || 720));
    const height = Math.max(1, Math.round((bounds && bounds.height) || canvas.clientHeight || (previous && previous.height) || 330));
    const dpr = Math.min(3, Math.max(1, Number(global.devicePixelRatio) || 1));
    const progress = Math.round(clamp(Number.isFinite(Number(phase)) ? Number(phase) : .62)*10000)/10000;
    const project = Object.prototype.hasOwnProperty.call(drawers,key) ? key : 'chatcommons';
    const pw = Math.round(width*dpr), ph=Math.round(height*dpr);
    if(previous && previous.key===project && previous.phase===progress && previous.width===width && previous.height===height && previous.dpr===dpr && canvas.width===pw && canvas.height===ph) return false;
    if(canvas.width!==pw)canvas.width=pw;
    if(canvas.height!==ph)canvas.height=ph;
    const c=canvas.getContext('2d'); if(!c)return false;
    c.setTransform(1,0,0,1,0,0);
    c.clearRect(0,0,pw,ph);
    const scale=Math.min(width/720,height/330);
    c.setTransform(dpr*scale,0,0,dpr*scale,dpr*(width-720*scale)/2,dpr*(height-330*scale)/2);
    drawers[project](c,progress);
    c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;
    cache.set(canvas,{key:project,phase:progress,width,height,dpr});
    return true;
  }
  global.TinkerPlate=Object.freeze({draw});
})(typeof window !== 'undefined' ? window : globalThis);
