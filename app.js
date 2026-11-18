const BASE=251,MONTHS=["Tháng 12","Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5"],HIST=[210,220,230,240,248];
const DEPTS=["Kinh doanh","Nhà hàng - Dịch vụ","Hành chính - Nhân sự","Tài chính - Kế toán","Kỹ thuật - IT","Khác"];
const COL=["#2f7de1","#3b82f6","#22b8cf","#f08c4a","#e8985e","#6c7ae0"];
const PCT=[28,18,12,15,17,10];
const ROLES={admin:"Quản trị hệ thống",hr:"Nhân sự",viewer:"Chỉ xem"};
const ld=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const seedEmp=[
 {id:"NV001",name:"Nguyễn Thị Lan",dept:"Kinh doanh",pos:"Nhân viên",date:"2023-04-10",st:"Đang làm việc",kpi:92},
 {id:"NV002",name:"Trần Văn Minh",dept:"Nhà hàng - Dịch vụ",pos:"Tổ trưởng",date:"2022-06-15",st:"Đang làm việc",kpi:96},
 {id:"NV003",name:"Phạm Thu Trang",dept:"Tài chính - Kế toán",pos:"Kế toán viên",date:"2021-09-20",st:"Đang làm việc",kpi:90},
 {id:"NV004",name:"Lê Quang Huy",dept:"Kỹ thuật - IT",pos:"Chuyên viên",date:"2024-01-12",st:"Đang làm việc",kpi:94},
 {id:"NV005",name:"Đỗ Thị Hương",dept:"Hành chính - Nhân sự",pos:"Nhân viên",date:"2025-03-03",st:"Thử việc",kpi:88},
 {id:"NV006",name:"Trần Thị Mai",dept:"Kinh doanh",pos:"Trưởng phòng Kinh doanh",date:"2019-02-01",st:"Đang làm việc",kpi:98},
 {id:"NV007",name:"Nguyễn Văn Nam",dept:"Nhà hàng - Dịch vụ",pos:"Phó phòng Nhà hàng",date:"2020-05-18",st:"Đang làm việc",kpi:96},
 {id:"NV008",name:"Lê Thu Hà",dept:"Hành chính - Nhân sự",pos:"Chuyên viên Nhân sự",date:"2021-11-08",st:"Đang làm việc",kpi:95}];
const seedAcc=[
 {u:"admin",p:"admin123",name:"Nguyễn Văn A",role:"admin",on:true},
 {u:"nhansu",p:"hr12345",name:"Trần Thu Hằng",role:"hr",on:true},
 {u:"xem",p:"view123",name:"Khách xem",role:"viewer",on:true}];
const S={emp:ld("tt_emp",seedEmp),acc:ld("tt_acc",seedAcc),me:null,view:"dash",q:"",err:""};
const me0=ld("tt_sess",null);if(me0)S.me=S.acc.find(a=>a.u===me0&&a.on)||null;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ini=n=>n.trim().split(/\s+/).slice(-2).map(w=>w[0]).join("").toUpperCase();
const dmy=d=>d?d.split("-").reverse().join("/"):"";
const canEmp=()=>S.me&&S.me.role!=="viewer",isAdm=()=>S.me&&S.me.role==="admin";
function toast(t){const e=document.createElement("div");e.className="toast";e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2200)}
function save(){sv("tt_emp",S.emp);sv("tt_acc",S.acc)}

function login(){
 $("#root").innerHTML=`<div class="login"><form class="lbox" id="lf"><div class="brand"><div class="ic">🏯</div><h1>CÔNG TY CỔ PHẦN THỦY TẠ</h1><p>Kết nối con người – Kiến tạo giá trị</p></div>
 <label for="u">Tên đăng nhập</label><input id="u" autocomplete="username" required>
 <label for="p">Mật khẩu</label><input id="p" type="password" autocomplete="current-password" required>
 <div class="err" role="alert">${esc(S.err)}</div><button class="btn full">Đăng nhập</button>
 <div class="hint"><b>Tài khoản dùng thử</b><br>Quản trị: admin / admin123<br>Nhân sự: nhansu / hr12345<br>Chỉ xem: xem / view123</div></form></div>`;
 $("#lf").onsubmit=e=>{e.preventDefault();const a=S.acc.find(x=>x.u===$("#u").value.trim()&&x.p===$("#p").value);
  if(!a){S.err="Sai tên đăng nhập hoặc mật khẩu.";return login()}
  if(!a.on){S.err="Tài khoản đã bị khóa. Liên hệ quản trị viên.";return login()}
  S.err="";S.me=a;sv("tt_sess",a.u);S.view="dash";app()};
}
function logout(){S.me=null;sv("tt_sess",null);login()}

const NAV=[["dash","🏠","Tổng quan"],["emp","👤","Hồ sơ nhân sự"],["docs","📁","Tài liệu"],["users","🔐","Quản trị người dùng"],["x1","🕒","Chấm công"],["x2","💲","Tính lương"],["x3","🎓","Đào tạo"],["x4","📈","Đánh giá (KPI)"],["x5","📊","Báo cáo thống kê"]];
function app(){
 if(!S.me)return login();
 const nav=NAV.filter(n=>n[0]!=="users"||isAdm()).map(n=>`<button class="nav ${S.view===n[0]?"on":""}" data-v="${n[0]}">${n[1]} ${n[2]}</button>`).join("");
 $("#root").innerHTML=`<div class="app"><aside><div class="logo">🏯 THỦY TẠ<small>Kết nối con người – Kiến tạo giá trị</small></div>${nav}<button class="nav" id="lo">🚪 Đăng xuất</button></aside>
 <main><div class="top"><input id="q" placeholder="Tìm kiếm nhân sự, phòng ban, chức vụ…" value="${esc(S.q)}" aria-label="Tìm kiếm"><div class="sp"></div>
 <div class="me"><span class="av">${esc(ini(S.me.name))}</span><div><b>${esc(S.me.name)}</b><small>${ROLES[S.me.role]}</small></div></div></div><div id="v"></div></main></div>`;
 document.querySelectorAll(".nav[data-v]").forEach(b=>b.onclick=()=>{S.view=b.dataset.v;app()});
 $("#lo").onclick=logout;
 $("#q").oninput=e=>{S.q=e.target.value;if(S.view==="dash"||S.view.startsWith("x")){S.view="emp";app();const q=$("#q");q.focus();q.setSelectionRange(99,99)}else view()};
 view();
}
function view(){const f={dash,emp,users,docs}[S.view]||soon;$("#v").innerHTML=f();bind()}
function soon(){return`<h2>${NAV.find(n=>n[0]===S.view)[2]}</h2><p class="sub">Mô-đun này đang được phát triển.</p><div class="card empty">Chưa có dữ liệu. Hãy quay lại Tổng quan hoặc Hồ sơ nhân sự.</div>`}

function stats(){const n=S.emp.length,w=S.emp.filter(e=>e.st==="Đang làm việc").length+Math.round(BASE*.93)-S.emp.length*0+0;
 const wk=S.emp.filter(e=>e.st==="Đang làm việc").length+230,pr=S.emp.filter(e=>e.st==="Thử việc").length,lv=S.emp.filter(e=>e.st==="Nghỉ phép").length+12,qt=S.emp.filter(e=>e.st==="Nghỉ việc").length+6;
 return{tot:BASE-5+n,wk,lv,qt,nw:S.emp.filter(e=>e.date>="2025-05-01").length+7+pr*0}}
function line(t){const d=[...HIST,t],W=420,H=190,mn=200,mx=260,x=i=>40+i*(W-60)/5,y=v=>H-30-(v-mn)/(mx-mn)*(H-50);
 return`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Biến động nhân sự">${[200,230,260].map(g=>`<line x1="40" x2="${W-15}" y1="${y(g)}" y2="${y(g)}" stroke="var(--bd)"/><text x="34" y="${y(g)+4}" text-anchor="end" font-size="11" fill="var(--mu)">${g}</text>`).join("")}
 <polyline fill="none" stroke="var(--pri)" stroke-width="2.5" points="${d.map((v,i)=>x(i)+","+y(v)).join(" ")}"/>${d.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="var(--card)" stroke="var(--pri)" stroke-width="2"/><text x="${x(i)}" y="${y(v)-10}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--tx)">${v}</text><text x="${x(i)}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--mu)">${MONTHS[i]}</text>`).join("")}</svg>`}
function donut(t){let off=0;const r=60,c=2*Math.PI*r;
 const arcs=PCT.map((p,i)=>{const l=c*p/100,s=`<circle r="${r}" cx="90" cy="90" fill="none" stroke="${COL[i]}" stroke-width="30" stroke-dasharray="${l} ${c-l}" stroke-dashoffset="${-off}" transform="rotate(-90 90 90)"/>`;off+=l;return s}).join("");
 return`<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><svg viewBox="0 0 180 180" width="180" role="img" aria-label="Cơ cấu theo phòng ban">${arcs}<text x="90" y="92" text-anchor="middle" font-size="26" font-weight="700" fill="var(--tx)">${t}</text><text x="90" y="110" text-anchor="middle" font-size="11" fill="var(--mu)">nhân viên</text></svg>
 <div class="leg">${DEPTS.map((d,i)=>`<div><i style="background:${COL[i]}"></i>${d} (${PCT[i]}%)</div>`).join("")}</div></div>`}
function dash(){const s=stats(),pc=v=>Math.round(v/s.tot*100);
 const top=[...S.emp].sort((a,b)=>b.kpi-a.kpi).slice(0,3);
 const NT=[["📅","Lịch nghỉ lễ 30/4 - 1/5","Thông báo lịch nghỉ lễ và kế hoạch làm việc","25/05/2025"],["📊","Đánh giá hiệu suất quý II","Bắt đầu từ ngày 01/06/2025","24/05/2025"],["🎓","Chương trình đào tạo nội bộ","Kỹ năng phục vụ khách hàng","22/05/2025"],["📄","Cập nhật chính sách lương 2025","Áp dụng từ tháng 07/2025","20/05/2025"]];
 return`<div class="ch"><div><h2>Tổng quan nhân sự</h2><p class="sub" style="margin:0">Quản lý nhân sự hiệu quả – Đồng hành cùng sự phát triển của công ty</p></div><b>${new Date().toLocaleDateString("vi-VN",{weekday:"long",day:"2-digit",month:"2-digit",year:"numeric"})}</b></div>
 <div class="kpis"><div class="k"><span>Tổng số nhân viên</span><b>${s.tot}</b><small>↑ cập nhật theo hồ sơ</small></div><div class="k"><span>Nhân viên mới</span><b>${s.nw}</b><small>trong tháng này</small></div>
 <div class="k"><span>Đang làm việc</span><b>${s.wk}</b><small>${pc(s.wk)}% tổng số</small></div><div class="k"><span>Nghỉ phép</span><b>${s.lv}</b><small>${pc(s.lv)}%</small></div><div class="k"><span>Nghỉ việc</span><b>${s.qt}</b><small>${pc(s.qt)}%</small></div></div>
 <div class="grid"><div class="card"><h3>Biến động nhân sự trong 6 tháng</h3>${line(s.tot)}</div><div class="card"><h3>Cơ cấu nhân sự theo phòng ban</h3>${donut(s.tot)}</div>
 <div class="card"><div class="ch"><h3>Thông báo</h3></div>${NT.map(n=>`<div class="nt"><span class="av" style="background:var(--hd)">${n[0]}</span><div><b>${n[1]}</b><p>${n[2]} · ${n[3]}</p></div></div>`).join("")}</div></div>
 <div class="grid2"><div class="card top3"><h3>Nhân viên nổi bật</h3>${top.map((e,i)=>`<div class="r"><span class="av">${i+1}</span><div><b>${esc(e.name)}</b><p>${esc(e.pos)}<br>Hiệu suất: <b style="color:var(--ok)">${e.kpi}%</b></p></div></div>`).join("")}</div>
 <div class="card"><div class="ch"><h3>Danh sách nhân viên gần đây</h3><button class="btn sec" data-v2="emp">Xem tất cả</button></div>${table([...S.emp].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5),false)}</div></div>`}

function tag(st){return`<span class="tag ${st==="Đang làm việc"?"t-ok":st==="Thử việc"||st==="Nghỉ phép"?"t-wn":"t-er"}">${st}</span>`}
function table(list,act=true){
 if(!list.length)return`<div class="empty">Không có nhân viên phù hợp. Thử từ khóa khác hoặc thêm nhân viên mới.</div>`;
 return`<div class="tw"><table><thead><tr><th>STT</th><th>Họ và tên</th><th>Mã NV</th><th>Phòng ban</th><th>Chức vụ</th><th>Ngày vào làm</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${list.map((e,i)=>`<tr><td>${i+1}</td><td><span class="av" style="width:28px;height:28px;font-size:11px;margin-right:8px">${esc(ini(e.name))}</span>${esc(e.name)}</td><td>${esc(e.id)}</td><td>${esc(e.dept)}</td><td>${esc(e.pos)}</td><td>${dmy(e.date)}</td><td>${tag(e.st)}</td>
 <td><button class="ib" data-view="${e.id}" title="Xem" aria-label="Xem">👁</button>${act&&canEmp()?`<button class="ib" data-edit="${e.id}" title="Sửa" aria-label="Sửa">✏️</button><button class="ib" data-del="${e.id}" title="Xóa" aria-label="Xóa">🗑</button>`:""}</td></tr>`).join("")}</tbody></table></div>`}
function emp(){const q=S.q.toLowerCase(),l=S.emp.filter(e=>[e.name,e.id,e.dept,e.pos,e.st].join(" ").toLowerCase().includes(q));
 return`<div class="ch"><div><h2>Hồ sơ nhân sự</h2><p class="sub" style="margin:0">${l.length} nhân viên</p></div>${canEmp()?`<button class="btn" id="add">+ Thêm nhân viên</button>`:""}</div><div class="card">${table(l)}</div>`}
function users(){if(!isAdm())return`<div class="card empty">Chỉ quản trị viên mới truy cập được mục này.</div>`;
 const q=S.q.toLowerCase(),l=S.acc.filter(a=>(a.u+a.name).toLowerCase().includes(q));
 return`<div class="ch"><div><h2>Quản trị người dùng</h2><p class="sub" style="margin:0">Tạo tài khoản, phân quyền, khóa và đặt lại mật khẩu</p></div><button class="btn" id="addu">+ Thêm tài khoản</button></div>
 <div class="card"><div class="tw"><table><thead><tr><th>Tài khoản</th><th>Họ tên</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${l.map(a=>`<tr><td>${esc(a.u)}</td><td>${esc(a.name)}</td><td>${ROLES[a.role]}</td><td>${a.on?'<span class="tag t-ok">Hoạt động</span>':'<span class="tag t-er">Đã khóa</span>'}</td>
 <td><button class="ib" data-ue="${esc(a.u)}" title="Sửa" aria-label="Sửa">✏️</button><button class="ib" data-ul="${esc(a.u)}" title="Khóa/Mở khóa" aria-label="Khóa hoặc mở khóa">${a.on?"🔒":"🔓"}</button><button class="ib" data-ud="${esc(a.u)}" title="Xóa" aria-label="Xóa">🗑</button></td></tr>`).join("")}</tbody></table></div></div>`}

const EXT=["gif","png","jpg","jpeg","webp","mp4","webm","txt","json","md","docx","pptx","csv","html","svg","pdf","xlsx","zip"],MAXB=20*1048576;
let _db=null,_mem=[],_dl=[];
const sz=n=>n<1024?n+" B":n<1048576?(n/1024).toFixed(1)+" KB":(n/1048576).toFixed(1)+" MB";
function idb(){return new Promise(r=>{try{const q=indexedDB.open("tt_docs",1);q.onupgradeneeded=()=>q.result.createObjectStore("f",{keyPath:"id"});q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)}catch(e){r(null)}})}
async function dbs(){if(_db===null)_db=(await idb())||false;return _db}
async function dAll(){const d=await dbs();if(!d)return _mem.slice();return new Promise(r=>{const q=d.transaction("f").objectStore("f").getAll();q.onsuccess=()=>r(q.result);q.onerror=()=>r(_mem.slice())})}
async function dPut(o){const d=await dbs();if(!d){_mem.push(o);return}return new Promise(r=>{const t=d.transaction("f","readwrite");t.objectStore("f").put(o);t.oncomplete=r;t.onerror=r})}
async function dDel(id){const d=await dbs();if(!d){_mem=_mem.filter(x=>x.id!==id);return}return new Promise(r=>{const t=d.transaction("f","readwrite");t.objectStore("f").delete(id);t.oncomplete=r;t.onerror=r})}
async function saveFile(name,data){let d=null;try{d=window.claude&&await claude.use("downloads")}catch(e){}
 if(!d){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data]));a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return toast("Đã tải xuống")}
 try{await d.save({filename:name,data});toast("Đã tải xuống")}catch(e){toast(e&&e.code==="declined"?"Bạn đã hủy tải xuống":e&&e.code==="rejected_extension"?"Định dạng này chưa hỗ trợ tải xuống":"Không tải xuống được")}}
function docs(){return`<div class="ch"><div><h2>Tài liệu</h2><p class="sub" style="margin:0">Tài liệu riêng của bạn – tài khoản khác không xem được</p></div><button class="btn sec" id="exp">Xuất danh sách nhân viên (CSV)</button></div>
 ${true?`<div class="dz" id="dz"><p style="margin:0 0 10px"><b>Kéo thả tệp vào đây</b> hoặc chọn từ máy</p><input type="file" id="fi" multiple accept="${EXT.map(e=>"."+e).join(",")}" style="max-width:320px" aria-label="Chọn tệp"><p style="margin:10px 0 0;font-size:12px">Tối đa 20 MB mỗi tệp. Hỗ trợ: ${EXT.join(", ")}.</p></div>`:""}
 <div class="card" id="dl"><div class="empty">Đang tải…</div></div>`}
async function loadDocs(){const box=$("#dl");if(!box)return;const q=S.q.toLowerCase();
 const mine=o=>o.u?o.u===S.me.u:o.by===S.me.name;_dl=(await dAll()).filter(mine).sort((a,b)=>b.at.localeCompare(a.at));const l=_dl.filter(o=>(o.name+o.by).toLowerCase().includes(q));
 if(!$("#dl"))return;
 $("#dl").innerHTML=l.length?`<div class="tw"><table><thead><tr><th>Tên tệp</th><th>Dung lượng</th><th>Người tải lên</th><th>Ngày tải lên</th><th>Thao tác</th></tr></thead><tbody>${l.map(o=>`<tr><td>📄 ${esc(o.name)}</td><td>${sz(o.size)}</td><td>${esc(o.by)}</td><td>${new Date(o.at).toLocaleString("vi-VN")}</td><td><button class="ib" data-dd="${o.id}" title="Tải xuống" aria-label="Tải xuống">⬇️</button>${true?`<button class="ib" data-dx="${o.id}" title="Xóa" aria-label="Xóa">🗑</button>`:""}</td></tr>`).join("")}</tbody></table></div>`:`<div class="empty">Chưa có tài liệu nào. ${canEmp()?"Hãy tải lên tệp đầu tiên.":""}</div>`;
 document.querySelectorAll("[data-dd]").forEach(b=>b.onclick=()=>{const o=_dl.find(x=>x.id===b.dataset.dd);if(o)saveFile(o.name,o.blob)});
 document.querySelectorAll("[data-dx]").forEach(b=>b.onclick=()=>{const o=_dl.find(x=>x.id===b.dataset.dx);confirmBox("Xóa tài liệu <b>"+esc(o.name)+"</b>?",async()=>{await dDel(o.id);loadDocs();toast("Đã xóa tài liệu")})})}
async function upFiles(fs){let n=0;for(const f of fs){const ext=(f.name.split(".").pop()||"").toLowerCase();
 if(!EXT.includes(ext)){toast("Không hỗ trợ định dạng: "+f.name);continue}
 if(f.size>MAXB){toast("Tệp quá 20 MB: "+f.name);continue}
 if(!f.size){toast("Tệp rỗng: "+f.name);continue}
 await dPut({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:f.name,size:f.size,type:f.type,by:S.me.name,u:S.me.u,at:new Date().toISOString(),blob:f});n++}
 if(n){toast("Đã tải lên "+n+" tệp")}loadDocs()}
function bindDocs(){loadDocs();
 const fi=$("#fi"),dz=$("#dz");
 if(fi)fi.onchange=()=>{upFiles([...fi.files]);fi.value=""};
 if(dz){["dragover","dragenter"].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.add("on")}));["dragleave","drop"].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.remove("on")}));dz.addEventListener("drop",e=>upFiles([...e.dataTransfer.files]))}
 $("#exp").onclick=()=>{const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
  const rows=[["Mã NV","Họ và tên","Phòng ban","Chức vụ","Ngày vào làm","Trạng thái","Hiệu suất (%)"],...S.emp.map(e=>[e.id,e.name,e.dept,e.pos,dmy(e.date),e.st,e.kpi])];
  saveFile("danh-sach-nhan-vien.csv","\ufeff"+rows.map(r=>r.map(q).join(",")).join("\r\n"))}}
function modal(h){$("#modal").innerHTML=`<div class="modal" id="ov"><div class="mb" role="dialog" aria-modal="true">${h}</div></div>`;$("#ov").onclick=e=>{if(e.target.id==="ov")close()}}
function close(){$("#modal").innerHTML=""}
function empForm(e){const n=!e;e=e||{id:"NV"+String(S.emp.length+1).padStart(3,"0"),name:"",dept:DEPTS[0],pos:"",date:new Date().toISOString().slice(0,10),st:"Thử việc",kpi:90};
 modal(`<form id="f"><h3>${n?"Thêm nhân viên":"Sửa nhân viên"}</h3><label>Họ và tên</label><input name="name" value="${esc(e.name)}" required>
 <div class="row"><div><label>Mã NV</label><input name="id" value="${esc(e.id)}" required ${n?"":"readonly"}></div><div><label>Ngày vào làm</label><input type="date" name="date" value="${e.date}" required></div></div>
 <label>Phòng ban</label><select name="dept">${DEPTS.map(d=>`<option ${d===e.dept?"selected":""}>${d}</option>`).join("")}</select><label>Chức vụ</label><input name="pos" value="${esc(e.pos)}" required>
 <div class="row"><div><label>Trạng thái</label><select name="st">${["Đang làm việc","Thử việc","Nghỉ phép","Nghỉ việc"].map(d=>`<option ${d===e.st?"selected":""}>${d}</option>`).join("")}</select></div><div><label>Hiệu suất (%)</label><input type="number" name="kpi" min="0" max="100" value="${e.kpi}"></div></div>
 <div class="err" id="fe"></div><div class="acts"><button type="button" class="btn sec" id="cx">Hủy</button><button class="btn">Lưu nhân viên</button></div></form>`);
 $("#cx").onclick=close;
 $("#f").onsubmit=ev=>{ev.preventDefault();const o=Object.fromEntries(new FormData(ev.target));o.kpi=+o.kpi;
  if(n&&S.emp.some(x=>x.id===o.id)){$("#fe").textContent="Mã nhân viên đã tồn tại.";return}
  if(n)S.emp.push(o);else Object.assign(S.emp.find(x=>x.id===e.id),o);save();close();view();toast("Đã lưu nhân viên")}}
function userForm(u){const n=!u;const a=u||{u:"",p:"",name:"",role:"viewer",on:true};
 modal(`<form id="f"><h3>${n?"Thêm tài khoản":"Sửa tài khoản"}</h3><label>Tên đăng nhập</label><input name="u" value="${esc(a.u)}" required ${n?"":"readonly"} pattern="[A-Za-z0-9_.]+" title="Chữ không dấu, số, _ hoặc .">
 <label>Họ và tên</label><input name="name" value="${esc(a.name)}" required><label>${n?"Mật khẩu":"Mật khẩu mới (bỏ trống nếu giữ nguyên)"}</label><input name="p" type="password" minlength="6" ${n?"required":""}>
 <label>Vai trò</label><select name="role">${Object.entries(ROLES).map(([k,v])=>`<option value="${k}" ${k===a.role?"selected":""}>${v}</option>`).join("")}</select>
 <div class="err" id="fe"></div><div class="acts"><button type="button" class="btn sec" id="cx">Hủy</button><button class="btn">Lưu tài khoản</button></div></form>`);
 $("#cx").onclick=close;
 $("#f").onsubmit=ev=>{ev.preventDefault();const o=Object.fromEntries(new FormData(ev.target));
  if(n&&S.acc.some(x=>x.u===o.u)){$("#fe").textContent="Tên đăng nhập đã tồn tại.";return}
  if(!n&&a.role==="admin"&&o.role!=="admin"&&S.acc.filter(x=>x.role==="admin"&&x.on).length<2){$("#fe").textContent="Phải còn ít nhất một quản trị viên.";return}
  if(n)S.acc.push({...o,on:true});else{const t=S.acc.find(x=>x.u===a.u);t.name=o.name;t.role=o.role;if(o.p)t.p=o.p}
  save();close();app();toast("Đã lưu tài khoản")}}
function confirmBox(msg,fn){modal(`<h3>Xác nhận</h3><p>${msg}</p><div class="acts"><button class="btn sec" id="cx">Hủy</button><button class="btn dg" id="ok">Xóa</button></div>`);$("#cx").onclick=close;$("#ok").onclick=()=>{close();fn()}}
function bind(){
 const on=(s,f)=>document.querySelectorAll(s).forEach(f);
 on("[data-v2]",b=>b.onclick=()=>{S.view=b.dataset.v2;app()});
 on("[data-view]",b=>b.onclick=()=>{const e=S.emp.find(x=>x.id===b.dataset.view);modal(`<h3>${esc(e.name)}</h3><p style="color:var(--mu)">${esc(e.id)} · ${esc(e.pos)}</p><p>Phòng ban: <b>${esc(e.dept)}</b><br>Ngày vào làm: <b>${dmy(e.date)}</b><br>Hiệu suất: <b>${e.kpi}%</b><br>Trạng thái: ${tag(e.st)}</p><div class="acts"><button class="btn" id="cx">Đóng</button></div>`);$("#cx").onclick=close});
 on("[data-edit]",b=>b.onclick=()=>empForm(S.emp.find(x=>x.id===b.dataset.edit)));
 on("[data-del]",b=>b.onclick=()=>confirmBox("Xóa nhân viên này khỏi hệ thống?",()=>{S.emp=S.emp.filter(x=>x.id!==b.dataset.del);save();view();toast("Đã xóa nhân viên")}));
 const add=$("#add");if(add)add.onclick=()=>empForm();
 if(S.view==="docs")bindDocs();
 const au=$("#addu");if(au)au.onclick=()=>userForm();
 on("[data-ue]",b=>b.onclick=()=>userForm(S.acc.find(x=>x.u===b.dataset.ue)));
 on("[data-ul]",b=>b.onclick=()=>{const a=S.acc.find(x=>x.u===b.dataset.ul);
  if(a.u===S.me.u)return toast("Không thể khóa chính mình");
  if(a.on&&a.role==="admin"&&S.acc.filter(x=>x.role==="admin"&&x.on).length<2)return toast("Phải còn ít nhất một quản trị viên");
  a.on=!a.on;save();view();toast(a.on?"Đã mở khóa":"Đã khóa tài khoản")});
 on("[data-ud]",b=>b.onclick=()=>{const a=S.acc.find(x=>x.u===b.dataset.ud);
  if(a.u===S.me.u)return toast("Không thể xóa chính mình");
  if(a.role==="admin"&&S.acc.filter(x=>x.role==="admin").length<2)return toast("Phải còn ít nhất một quản trị viên");
  confirmBox("Xóa tài khoản <b>"+esc(a.u)+"</b>?",()=>{S.acc=S.acc.filter(x=>x.u!==a.u);save();view();toast("Đã xóa tài khoản")})});
}
app();
