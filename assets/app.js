(function(){
  // menu mobilne
  var b=document.querySelector('.burger'),m=document.querySelector('.menu');
  b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  m.addEventListener('click',function(e){if(e.target.tagName==='A'){m.classList.remove('open');b.setAttribute('aria-expanded','false')}});

  // przykładowe terminy (stałe dla danego dnia, żeby demo nie skakało)
  var DN=['nd','pn','wt','śr','cz','pt','sb'],MS=['sty','lut','mar','kwi','maj','cze','lip','sie','wrz','paź','lis','gru'];
  var PULA=['9:00','10:00','11:00','12:00','16:00','17:00','18:00','19:00'];
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
  var dni=[],d=new Date();d.setHours(0,0,0,0);
  for(var i=1;dni.length<14;i++){
    var x=new Date(d);x.setDate(d.getDate()+i);var wd=x.getDay();
    var key=x.toISOString().slice(0,10),g=[];
    if(wd!==0&&wd!==6){PULA.forEach(function(h,j){if(hash(key+h)%3!==0)g.push(h)});}
    dni.push({d:x,g:g});
  }
  function fmt(o){return DN[o.d.getDay()]+' '+o.d.getDate()+' '+MS[o.d.getMonth()]}
  var pierwszy=dni.find(function(o){return o.g.length});
  document.getElementById('najblizszy').textContent=fmt(pierwszy)+', '+pierwszy.g[0];

  var stan={rodzaj:'Pierwsza konsultacja',temat:'Konsultacja ogólna',dzien:null,godz:null,plat:'BLIK'},krok=0;
  var form=document.getElementById('rezForm'),kroki=form.querySelectorAll('.krok'),etapy=document.querySelectorAll('#etapy li');
  var dniEl=document.getElementById('dni'),godzEl=document.getElementById('godziny'),dalejT=document.getElementById('dalejTermin');

  dni.forEach(function(o,idx){
    var bt=document.createElement('button');bt.type='button';bt.className='dzien';
    bt.innerHTML='<small>'+DN[o.d.getDay()]+'</small><b>'+o.d.getDate()+'</b><small>'+MS[o.d.getMonth()]+'</small>';
    if(!o.g.length)bt.disabled=true;
    bt.addEventListener('click',function(){wybierzDzien(idx)});
    dniEl.appendChild(bt);
  });
  function wybierzDzien(idx){
    stan.dzien=idx;stan.godz=null;dalejT.disabled=true;
    [].forEach.call(dniEl.children,function(c,j){c.classList.toggle('on',j===idx)});
    godzEl.innerHTML='';
    dni[idx].g.forEach(function(h){
      var bt=document.createElement('button');bt.type='button';bt.className='godz';bt.textContent=h;
      bt.addEventListener('click',function(){stan.godz=h;[].forEach.call(godzEl.children,function(c){c.classList.toggle('on',c===bt)});dalejT.disabled=false;sum()});
      godzEl.appendChild(bt);
    });
    sum();
  }
  wybierzDzien(dni.indexOf(pierwszy));

  function sum(){
    var t='<b>'+stan.rodzaj+'</b><br>'+stan.temat;
    if(stan.dzien!==null&&stan.godz)t+='<br><b>'+fmt(dni[stan.dzien])+', '+stan.godz+'</b>';
    t+='<br>Wideorozmowa online';
    document.getElementById('podsum').innerHTML=t;
    document.getElementById('koszykNazwa').textContent=stan.rodzaj;
  }
  form.addEventListener('change',function(e){
    if(e.target.name==='rodzaj')stan.rodzaj=e.target.value;
    if(e.target.id==='temat')stan.temat=e.target.value;
    if(e.target.name==='plat')stan.plat=e.target.value;
    sum();
  });
  function idz(n){
    krok=n;
    kroki.forEach(function(k,j){k.classList.toggle('on',j===n)});
    etapy.forEach(function(e,j){e.classList.toggle('on',j===n);e.classList.toggle('ok',j<n)});
    var top=document.getElementById('terminy').getBoundingClientRect().top;
    if(top<-40)document.querySelector('.rez').scrollIntoView({behavior:'smooth',block:'start'});
  }
  form.addEventListener('click',function(e){
    if(e.target.closest('[data-wstecz]'))idz(krok-1);
    if(e.target.closest('[data-dalej]')){
      if(krok===2){
        var err=document.getElementById('err'),em=document.getElementById('email').value.trim();
        if(!document.getElementById('imie').value.trim()){err.textContent='Wpisz imię.';return}
        if(!/^\S+@\S+\.\S+$/.test(em)){err.textContent='Wpisz poprawny adres e-mail.';return}
        if(!document.getElementById('zgoda').checked){err.textContent='Zaznacz akceptację regulaminu.';return}
        err.textContent='';
      }
      if(krok===3){
        document.getElementById('potwTekst').innerHTML='<b>'+stan.rodzaj+'</b>, '+fmt(dni[stan.dzien])+', godz. '+stan.godz+'. Płatność: '+stan.plat+'.';
      }
      idz(krok+1);
    }
  });
  document.getElementById('odNowa').addEventListener('click',function(){idz(0)});

  // przyciski tematów ustawiają temat w formularzu
  document.querySelectorAll('[data-temat]').forEach(function(a){
    a.addEventListener('click',function(){
      var t=a.getAttribute('data-temat');document.getElementById('temat').value=t;stan.temat=t;idz(0);sum();
    });
  });
  sum();
})();
