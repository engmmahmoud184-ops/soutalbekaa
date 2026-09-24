import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";

const fallbackImage = "assets/logo.jpeg";
const demoArticles = [
  {id:"1",title:"مشاريع إنمائية جديدة تعيد الحيوية إلى بلدات البقاع",excerpt:"حزمة من المشاريع المحلية لتحسين الطرق والخدمات ودعم الحركة الاقتصادية في المنطقة.",category:"محليات",image:"https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85",author:"علي الموسوي",authorRole:"مراسل البقاع",date:"2026-09-25",views:2840,breaking:true,featured:true,body:"تشهد عدد من بلدات البقاع انطلاق مشاريع إنمائية جديدة تشمل تأهيل الطرق وتحسين الإنارة والخدمات العامة.\n\nوتأتي هذه الخطوات ضمن خطة تهدف إلى دعم المجتمعات المحلية وتحفيز النشاط الاقتصادي."},
  {id:"2",title:"المزارعون يستعدون لموسم واعد وسط خطط لدعم الإنتاج",excerpt:"مبادرات زراعية حديثة وتعاونيات محلية تفتح آفاقاً جديدة أمام مزارعي السهل.",category:"اقتصاد",image:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=85",author:"رنا شحادة",authorRole:"محررة اقتصادية",date:"2026-09-24",views:1920,featured:true,body:"بدأ المزارعون التحضير للموسم الجديد وسط تفاؤل بتحسن الإنتاج. وتعمل التعاونيات على توفير الإرشاد والمستلزمات اللازمة."},
  {id:"3",title:"مهرجان ثقافي يجمع الفن والتراث في قلب زحلة",excerpt:"أمسيات موسيقية ومعارض حرفية تحيي الذاكرة الثقافية للمنطقة.",category:"ثقافة",image:"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85",author:"نور حداد",authorRole:"كاتبة ثقافية",date:"2026-09-23",views:1450,gallery:["https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80"],body:"يستقبل قلب مدينة زحلة مهرجاناً ثقافياً متنوعاً بمشاركة فنانين وحرفيين من مختلف المناطق اللبنانية."},
  {id:"4",title:"نادي البقاع يحقق فوزاً مهماً في بطولة لبنان",excerpt:"أداء قوي وحضور جماهيري كبير في مباراة حاسمة ضمن منافسات البطولة.",category:"رياضة",image:"https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=85",author:"جواد حيدر",authorRole:"محرر رياضي",date:"2026-09-22",views:3210,body:"حقق فريق البقاع فوزاً مستحقاً بعد مباراة قوية شهدت تألق عدد من اللاعبين الشباب."},
  {id:"5",title:"تكنولوجيا الري الذكي تصل إلى حقول البقاع",excerpt:"حلول رقمية تساعد على ترشيد المياه وزيادة الإنتاج الزراعي.",category:"تكنولوجيا",image:"https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=1000&q=85",author:"رنا شحادة",authorRole:"محررة اقتصادية",date:"2026-09-21",views:980,body:"بدأت مزارع تجريبية في المنطقة استخدام أنظمة ري ذكية تعتمد على حساسات لمراقبة رطوبة التربة."},
  {id:"6",title:"تقرير مصوّر: جولة في أسواق بعلبك القديمة",excerpt:"حكايات الناس وروح المكان في جولة خاصة لكاميرا صوت البقاع.",category:"محليات",image:"https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?auto=format&fit=crop&w=1000&q=85",author:"علي الموسوي",authorRole:"مراسل البقاع",date:"2026-09-20",views:2430,videoUrl:"https://www.youtube.com/embed/dQw4w9WgXcQ",body:"تجولت كاميرا صوت البقاع في الأسواق القديمة ورصدت الحركة اليومية وحكايات أصحاب المحال."}
];

let articles = [];
const $ = selector => document.querySelector(selector);
const formatDate = value => new Intl.DateTimeFormat("ar-LB",{day:"numeric",month:"long",year:"numeric"}).format(new Date(value));
const safe = value => String(value ?? "").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
const youtubeEmbed = url => { if(!url) return ""; const match=url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/); return match?`https://www.youtube.com/embed/${match[1]}`:url; };

async function loadArticles(){
  if(!isFirebaseConfigured){articles=demoArticles;renderAll();return;}
  try{
    const {initializeApp}=await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js");
    const {getFirestore,collection,getDocs,query,where}=await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js");
    const db=getFirestore(initializeApp(firebaseConfig));
    const snap=await getDocs(query(collection(db,"articles"),where("status","==","published")));
    articles=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
    if(!articles.length) articles=demoArticles;
  }catch(error){console.warn("تعذّر الاتصال بـ Firebase، تم تشغيل الوضع التجريبي.",error);articles=demoArticles;}
  renderAll();
}

function renderAll(){renderTicker();renderHero();renderNews(articles);renderMostRead();renderVideos();renderAuthors();}
function renderTicker(){const items=articles.filter(a=>a.breaking).concat(articles.slice(0,3));$("#tickerContent").innerHTML=items.map(a=>`<span>${safe(a.title)}</span>`).join("");}
function renderHero(){const featured=articles.filter(a=>a.featured).slice(0,3);const picks=featured.length>=3?featured:articles.slice(0,3);$("#heroGrid").innerHTML=picks.map((a,i)=>`<article class="hero-story" data-id="${a.id}" tabindex="0"><img src="${safe(a.image||fallbackImage)}" alt=""><div class="hero-copy"><span class="category">${safe(a.category)}</span><${i===0?"h1":"h2"}>${safe(a.title)}</${i===0?"h1":"h2"}><div class="meta">${formatDate(a.date)} · ${safe(a.author)}</div></div></article>`).join("");bindCards();}
function card(a){return `<article class="news-card" data-id="${a.id}" tabindex="0"><div class="news-image"><img src="${safe(a.image||fallbackImage)}" alt=""><span class="category">${safe(a.category)}</span>${a.videoUrl?'<span class="play-badge">▶</span>':""}${a.gallery?.length?`<span class="gallery-badge">▣ ${a.gallery.length} صور</span>`:""}</div><div class="news-body"><h3>${safe(a.title)}</h3><p>${safe(a.excerpt)}</p><div class="card-meta"><span>${formatDate(a.date)}</span><span>◉ ${Number(a.views||0).toLocaleString("ar-LB")}</span></div></div></article>`;}
function renderNews(list){$("#newsGrid").innerHTML=list.map(card).join("");$("#emptyState").hidden=!!list.length;bindCards();}
function renderMostRead(){const sorted=[...articles].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,5);$("#mostReadList").innerHTML=sorted.map((a,i)=>`<article class="read-item" data-id="${a.id}" tabindex="0"><span class="read-number">${i+1}</span><div><h4>${safe(a.title)}</h4><span>${Number(a.views||0).toLocaleString("ar-LB")} قراءة</span></div></article>`).join("");bindCards();}
function renderVideos(){const videos=articles.filter(a=>a.videoUrl);const list=videos.length?videos:articles.slice(0,3);$("#videoGrid").innerHTML=list.slice(0,3).map(a=>`<article class="video-card" data-id="${a.id}" tabindex="0"><img src="${safe(a.image||fallbackImage)}" alt=""><span class="play">▶</span><h3>${safe(a.title)}</h3></article>`).join("");bindCards();}
function renderAuthors(){const unique=[...new Map(articles.map(a=>[a.author,{name:a.author,role:a.authorRole||"كاتب في صوت البقاع",image:a.authorImage||fallbackImage}])).values()].slice(0,4);$("#authorsGrid").innerHTML=unique.map(a=>`<article class="author-card"><img src="${safe(a.image)}" alt="${safe(a.name)}"><h3>${safe(a.name)}</h3><p>${safe(a.role)}</p></article>`).join("");}
function bindCards(){document.querySelectorAll("[data-id]").forEach(el=>{el.onclick=()=>openArticle(el.dataset.id);el.onkeydown=e=>{if(e.key==="Enter")openArticle(el.dataset.id)}});}
function openArticle(id){const a=articles.find(x=>String(x.id)===String(id));if(!a)return;const gallery=(a.gallery||[]).map(src=>`<img src="${safe(src)}" alt="صورة من الخبر">`).join("");$("#articleContent").innerHTML=`<img class="article-cover" src="${safe(a.image||fallbackImage)}" alt=""><div class="article-inner"><span class="category">${safe(a.category)}</span><h1>${safe(a.title)}</h1><p class="article-meta">بقلم ${safe(a.author)} · ${formatDate(a.date)} · ${Number(a.views||0).toLocaleString("ar-LB")} قراءة</p><div class="body">${safe(a.body||a.excerpt)}</div>${a.videoUrl?`<iframe class="article-video" src="${safe(youtubeEmbed(a.videoUrl))}" allowfullscreen title="فيديو الخبر"></iframe>`:""}${gallery?`<div class="article-gallery">${gallery}</div>`:""}</div>`;$("#articleDialog").showModal();}

document.querySelectorAll("[data-category]").forEach(link=>link.addEventListener("click",()=>{$("#newsTitle").textContent=`أخبار ${link.dataset.category}`;renderNews(articles.filter(a=>a.category===link.dataset.category));document.querySelectorAll(".nav-inner a").forEach(x=>x.classList.remove("active"));link.classList.add("active");}));
$("#showAll").onclick=()=>{$("#newsTitle").textContent="أحدث الأخبار";renderNews(articles)};
$("#searchToggle").onclick=()=>{$("#searchPanel").classList.toggle("open");$("#searchInput").focus()};
$("#searchInput").oninput=e=>{const q=e.target.value.trim();$("#newsTitle").textContent=q?`نتائج البحث عن: ${q}`:"أحدث الأخبار";renderNews(articles.filter(a=>(a.title+" "+a.excerpt+" "+a.category).includes(q)))};
$("#menuButton").onclick=()=>{const open=$("#mainNav").classList.toggle("open");$("#menuButton").setAttribute("aria-expanded",open)};
$("#dialogClose").onclick=()=>$("#articleDialog").close();
$("#articleDialog").onclick=e=>{if(e.target===$("#articleDialog"))$("#articleDialog").close()};
$("#newsletterForm").onsubmit=e=>{e.preventDefault();$("#newsletterMessage").textContent="شكراً! تم تسجيل بريدك بنجاح.";e.target.reset()};
$("#todayDate").textContent=new Intl.DateTimeFormat("ar-LB",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
$("#year").textContent=new Date().getFullYear();setInterval(()=>$("#liveTime").textContent=new Date().toLocaleTimeString("ar-LB"),1000);
loadArticles();
