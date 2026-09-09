const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const presets = [
  ["01 · Elementary", [
    ["Number line","x","2D"],["Linear counting","x+2","2D"],["Square numbers","x^2","2D"],
    ["Cube numbers","x^3","2D"],["Absolute value","abs(x)","2D"],["Square root","sqrt(x)","2D"],
    ["Percentage","0.01*x","2D"],["Reciprocal","1/x","2D"]
  ]],
  ["02 · Algebra", [
    ["Linear function","2*x+3","2D"],["Quadratic","x^2-4*x+3","2D"],["Cubic","x^3-3*x","2D"],
    ["Quartic","x^4-5*x^2+4","2D"],["Polynomial","x^5-2*x^3+x","2D"],["Exponential","2^x","2D"],
    ["Logarithm","log(x)","2D"],["Rational","(x^2-1)/(x-1)","2D"]
  ]],
  ["03 · Geometry", [
    ["Circle","sqrt(9-x^2)","2D"],["Parabola","x^2","2D"],["Ellipse","3*sqrt(1-x^2/16)","2D"],
    ["Hyperbola","sqrt(x^2+1)","2D"],["Distance from origin","sqrt(x^2+y^2)","3D"],["Sphere","sqrt(9-x^2-y^2)","3D"]
  ]],
  ["04 · Trigonometry", [
    ["Sine","sin(x)","2D"],["Cosine","cos(x)","2D"],["Tangent","tan(x)","2D"],
    ["Sine + cosine","sin(x)+cos(x)","2D"],["Sinc","sin(x)/x","2D"],["Hyperbolic sine","sinh(x)","2D"]
  ]],
  ["05 · Calculus", [
    ["x² derivative","2*x","2D"],["Cubic derivative","3*x^2","2D"],["Gaussian","exp(-x^2)","2D"],
    ["eˣ","exp(x)","2D"],["Taylor sin","x-x^3/6+x^5/120","2D"],["Integral-like x³","x^4/4","2D"]
  ]],
  ["06 · Multivariable", [
    ["Paraboloid","x^2+y^2","3D"],["Saddle","x^2-y^2","3D"],["Wave surface","sin(x)*cos(y)","3D"],
    ["Gaussian surface","exp(-(x^2+y^2))","3D"],["Ripple","sin(sqrt(x^2+y^2))*2/(sqrt(x^2+y^2)+1)","3D"],
    ["Cone","sqrt(x^2+y^2)","3D"]
  ]],
  ["07 · Linear Algebra", [
    ["Quadratic form","x^2+2*x*y+y^2","3D"],["Indefinite form","x^2-y^2","3D"],["Rotated form","x^2+x*y+y^2","3D"]
  ]],
  ["08 · Differential Equations", [
    ["Exponential growth","exp(x)","2D"],["Damped wave","exp(-0.15*x)*sin(3*x)","2D"],
    ["Harmonic oscillator","cos(x)","2D"],["Logistic curve","1/(1+exp(-x))","2D"]
  ]],
  ["09 · Probability & Statistics", [
    ["Normal distribution","exp(-x^2/2)/sqrt(2*pi)","2D"],
    ["Cauchy distribution","1/(pi*(1+x^2))","2D"],
    ["Gaussian ridge","exp(-(x^2+y^2)/2)","3D"]
  ]],
  ["10 · Complex Analysis", [
    ["Real part z²","x^2-y^2","3D"],["Imaginary part z²","2*x*y","3D"],
    ["Real part eᶻ","exp(x)*cos(y)","3D"],["Imaginary part eᶻ","exp(x)*sin(y)","3D"]
  ]],
  ["11 · Number Theory", [
    ["Modular wave","sin(pi*x)","2D"],["Prime-inspired curve","x*sin(x)","2D"]
  ]],
  ["12 · Topology / Geometry", [
    ["Mexican hat","(x^2+y^2-1)^2","3D"],["Manifold-like saddle","x^2-y^2+x*y","3D"]
  ]],
  ["13 · Differential Geometry", [
    ["Minimal-surface approximation","log(cosh(x))/1.2","2D"],["Curvature bowl","sqrt(1+x^2+y^2)","3D"]
  ]],
  ["14 · PDE / Physics", [
    ["Heat-kernel surface","exp(-(x^2+y^2)/1.5)","3D"],
    ["Wave packet","exp(-(x^2+y^2)/8)*cos(3*x)","3D"],
    ["Potential well","-1/sqrt(x^2+y^2+0.2)","3D"]
  ]],
  ["15 · Optimization", [
    ["Convex bowl","x^2+y^2","3D"],["Rosenbrock-like","(1-x)^2+100*(y-x^2)^2","3D"],
    ["Double well","(x^2-1)^2+y^2","3D"]
  ]],
  ["16 · Research Playground", [
    ["Lorentz-like surface","sin(x*y)","3D"],["Oscillatory surface","sin(x^2+y^2)","3D"],
    ["High-frequency wave","sin(4*x)*cos(4*y)","3D"],["Spiral profile","sin(x*y)/(1+x^2+y^2)","3D"]
  ]]
];

let mode = "3d", scene, camera, renderer, controls, surface, wire, pointCloud, axesGroup, gridHelper;
let animation = {running:false, start:0, progress:0, duration:2500};
let parsedExpr = null;
let currentPointCount = 0;

function init3D(){
  const canvas = $("#graphCanvas");
  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(0x050608,1);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45,1,.1,1000);
  camera.position.set(9,7,9);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = .07;
  controls.minDistance = 3;
  controls.maxDistance = 40;

  scene.add(new THREE.AmbientLight(0xffffff,.55));
  const light = new THREE.DirectionalLight(0xffffff,1.2);
  light.position.set(6,10,5); scene.add(light);

  buildHelpers();
  window.addEventListener("resize", resize);
  resize();
  renderLoop();
}

function buildHelpers(){
  if(gridHelper) scene.remove(gridHelper);
  if(axesGroup) scene.remove(axesGroup);
  gridHelper = new THREE.GridHelper(16,16,0x30343d,0x1a1d24);
  gridHelper.position.y = 0;
  scene.add(gridHelper);
  axesGroup = new THREE.Group();
  const matX = new THREE.LineBasicMaterial({color:0xff8a1f});
  const matY = new THREE.LineBasicMaterial({color:0x9aa1ad});
  const matZ = new THREE.LineBasicMaterial({color:0x707783});
  axesGroup.add(line([[-8,0,0],[8,0,0]],matX));
  axesGroup.add(line([[0,-8,0],[0,8,0]],matY));
  axesGroup.add(line([[0,0,-8],[0,0,8]],matZ));
  scene.add(axesGroup);
}

function line(points, material){
  const g = new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));
  return new THREE.Line(g,material);
}

function clearGraph(){
  [surface,wire,pointCloud].forEach(o=>{if(o){scene.remove(o);o.geometry?.dispose();o.material?.dispose()}});
  surface=wire=pointCloud=null;
  currentPointCount=0; $("#pointStat").textContent="0";
}

function parseEquation(){
  const raw=$("#equationInput").value.trim().replace(/^z\s*=\s*/i,"").replace(/^y\s*=\s*/i,"");
  if(!raw) throw new Error("Enter an equation.");
  parsedExpr=math.compile(raw);
  return raw;
}

function evalExpr(x,y=0){
  return parsedExpr.evaluate({x,y,pi:Math.PI,e:Math.E});
}

function plot3D(raw){
  clearGraph();
  const range=+$("#rangeInput").value, n=+$("#resolutionInput").value;
  let verts=[], indices=[], values=[], points=[];
  let min=Infinity,max=-Infinity;
  for(let j=0;j<n;j++){
    const y=-range+(2*range*j)/(n-1);
    for(let i=0;i<n;i++){
      const x=-range+(2*range*i)/(n-1);
      let z;
      try{z=Number(evalExpr(x,y));}catch{z=NaN}
      if(!Number.isFinite(z)) z=0;
      z=Math.max(-30,Math.min(30,z));
      min=Math.min(min,z);max=Math.max(max,z);
      verts.push(x,z,y); values.push(z);
      if(i<n-1&&j<n-1){
        const a=j*n+i,b=a+1,c=a+n,d=c+1;
        indices.push(a,c,b,b,c,d);
      }
      if($("#pointsToggle").checked && (i%3===0 && j%3===0)) points.push(x,z,y);
    }
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute("position",new THREE.Float32BufferAttribute(verts,3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const material=new THREE.MeshStandardMaterial({color:0xff8a1f,roughness:.35,metalness:.08,side:THREE.DoubleSide,transparent:true,opacity:.92});
  surface=new THREE.Mesh(geometry,material);
  surface.scale.set(1,0,1);
  scene.add(surface);

  const edgeGeo=new THREE.EdgesGeometry(geometry);
  wire=new THREE.LineSegments(edgeGeo,new THREE.LineBasicMaterial({color:0xffb45e,transparent:true,opacity:.22}));
  wire.scale.set(1,0,1); scene.add(wire);

  if(points.length){
    const pg=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));
    pointCloud=new THREE.Points(pg,new THREE.PointsMaterial({color:0xffffff,size:.065,sizeAttenuation:true}));
    pointCloud.scale.set(1,0,1); scene.add(pointCloud);
  }
  currentPointCount=n*n; $("#pointStat").textContent=currentPointCount.toLocaleString();
  animateBuild([surface,wire,pointCloud].filter(Boolean));
}

function plot2D(raw){
  clearGraph();
  const range=+$("#rangeInput").value, n=600;
  const pts=[];
  for(let i=0;i<n;i++){
    const x=-range+(2*range*i)/(n-1);
    let y; try{y=Number(evalExpr(x,0));}catch{y=NaN}
    if(Number.isFinite(y)&&Math.abs(y)<100) pts.push(new THREE.Vector3(x,y,0));
  }
  const g=new THREE.BufferGeometry().setFromPoints(pts);
  const m=new THREE.LineBasicMaterial({color:0xff8a1f});
  surface=new THREE.Line(g,m); scene.add(surface);
  currentPointCount=pts.length; $("#pointStat").textContent=pts.length.toLocaleString();
  surface.scale.set(0,0,0);
  animateBuild([surface]);
}

function animateBuild(objects){
  animation.running=true; animation.start=performance.now(); animation.progress=0;
  animation.duration=3000/+$("#speedInput").value;
  $("#statusText").textContent="Building graph…";
  $("#timeStat").textContent="0.0s";
  const tick=performance.now();
  objects.forEach(o=>{if(o)o.scale.y=1;});
  // 3D reveal is vertical scaling. 2D uses x-scale.
  if(mode==="3d") objects.forEach(o=>{if(o)o.scale.set(1,0,1)});
  else objects.forEach(o=>{if(o)o.scale.set(0,0,0)});
}

function updateAnimation(now){
  if(!animation.running)return;
  const t=Math.min(1,(now-animation.start)/animation.duration);
  const eased=1-Math.pow(1-t,3);
  if(mode==="3d") [surface,wire,pointCloud].forEach(o=>{if(o)o.scale.y=eased});
  else if(surface) surface.scale.set(eased,eased,eased);
  animation.progress=t;
  $("#timeStat").textContent=((now-animation.start)/1000).toFixed(1)+"s";
  if(t>=1){animation.running=false;$("#statusText").textContent="Complete";}
}

function renderLoop(now=performance.now()){
  requestAnimationFrame(renderLoop);
  updateAnimation(now);
  controls?.update();
  renderer.render(scene,camera);
}

function resize(){
  const c=$("#graphCanvas"), r=c.getBoundingClientRect();
  renderer.setSize(r.width,r.height,false);
  camera.aspect=r.width/r.height; camera.updateProjectionMatrix();
}

function showError(msg){
  const box=$("#errorBox"); box.textContent=msg; box.style.display="block";
  $("#statusText").textContent="Equation error";
}
function hideError(){$("#errorBox").style.display="none"}

function plot(){
  hideError();
  try{
    const raw=parseEquation();
    $("#displayEquation").textContent=(mode==="3d"?"z = ":"y = ")+prettyEquation(raw);
    $("#typeStat").textContent=mode==="3d"?"3D Surface":"2D Function";
    mode==="3d"?plot3D(raw):plot2D(raw);
  }catch(e){showError("Could not parse this equation. Try expressions such as sin(x), x^2, or sin(x)*cos(y).")}
}
function prettyEquation(s){
  return s.replace(/\bsqrt\(/g,"√(").replace(/\bpi\b/g,"π").replace(/\*/g," · ").replace(/\^2\b/g,"²").replace(/\^3\b/g,"³");
}

function renderPresets(filter=""){
  const list=$("#presetList"); list.innerHTML="";
  const q=filter.toLowerCase();
  presets.forEach(([cat,items])=>{
    const matches=items.filter(([n,e])=>(n+" "+e+" "+cat).toLowerCase().includes(q));
    if(!matches.length)return;
    const group=document.createElement("div"); group.className="preset-category";
    group.innerHTML=`<div class="preset-category-title">${cat}</div>`;
    matches.forEach(([name,eq,kind])=>{
      const b=document.createElement("button"); b.className="preset-item";
      b.innerHTML=`<span>${name}</span><span class="preset-eq">${eq}</span>`;
      b.onclick=()=>{
        $("#equationInput").value=eq;
        setMode(kind==="3D"?"3d":"2d");
        plot();
      };
      group.appendChild(b);
    });
    list.appendChild(group);
  });
}
function setMode(m){
  mode=m;
  $$(".segment").forEach(b=>b.classList.toggle("active",b.dataset.mode===m));
  $("#equationPrefix").textContent=m==="3d"?"z =":"y =";
  $("#typeStat").textContent=m==="3d"?"3D Surface":"2D Function";
  buildHelpers();
}
function resetView(){
  camera.position.set(9,7,9); controls.target.set(0,0,0); controls.update();
}
function toggleTheme(){
  document.body.classList.toggle("light");
  renderer.setClearColor(document.body.classList.contains("light")?0xf8f9fb:0x050608,1);
}

$("#plotBtn").onclick=plot;
$("#resetBtn").onclick=()=>{clearGraph();resetView();plot()};
$("#pauseBtn").onclick=()=>{
  animation.running=!animation.running;
  if(animation.running){animation.start=performance.now()-animation.progress*animation.duration;$("#statusText").textContent="Building graph…"}
  else $("#statusText").textContent="Paused";
};
$("#themeBtn").onclick=toggleTheme;
$("#fullscreenBtn").onclick=()=>document.documentElement.requestFullscreen?.();
$("#rangeInput").oninput=e=>$("#rangeValue").textContent=e.target.value;
$("#resolutionInput").oninput=e=>$("#resolutionValue").textContent=e.target.value;
$("#speedInput").oninput=e=>$("#speedValue").textContent=Number(e.target.value).toFixed(1)+"×";
$("#presetSearch").oninput=e=>renderPresets(e.target.value);
$("#equationInput").addEventListener("keydown",e=>{if(e.key==="Enter")plot()});
$("#gridToggle").onchange=e=>gridHelper.visible=e.target.checked;
$("#axesToggle").onchange=e=>axesGroup.visible=e.target.checked;
$("#pointsToggle").onchange=plot;
$("#glowToggle").onchange=e=>{if(surface)surface.material.emissiveIntensity=e.target.checked?.12:0};
$$(".segment").forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$$(".examples button").forEach(b=>b.onclick=()=>{$("#equationInput").value=b.dataset.eq;setMode("3d");plot()});

init3D();
renderPresets();
plot();
