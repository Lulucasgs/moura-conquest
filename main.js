/* Moura Conquest · interações do OnePage */
(function () {
  'use strict';

  var WA_NUM = '5541987292928';
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mouseFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var desktop = function () { return window.innerWidth >= 960; };

  /* ---------- WhatsApp com mensagem por botão ---------- */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(a.getAttribute('data-wa'));
    a.addEventListener('click', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'clique_whatsapp', cta: a.getAttribute('data-cta') || 'sem-nome' });
    });
  });

  /* ---------- Ano ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Header e menu ---------- */
  var header = document.getElementById('topo');
  var waFloat = document.getElementById('waFloat');
  var onScroll = function () {
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 40);
    waFloat.classList.toggle('show', y > 300);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  menuBtn.addEventListener('click', function () {
    var aberto = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    header.classList.add('is-solid');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* botão flutuante sobe quando o rodapé ou CTA final aparecem (mobile) */
  var alvoFim = document.querySelector('.final');
  if ('IntersectionObserver' in window && alvoFim) {
    new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { waFloat.classList.toggle('sobe', e.isIntersecting && window.innerWidth < 640); });
    }).observe(alvoFim);
  }

  /* ---------- Utilitário: quebra texto em letras ---------- */
  function quebraLetras(el, texto) {
    el.textContent = '';
    texto.split(' ').forEach(function (palavra, i, arr) {
      var w = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      Array.from(palavra).forEach(function (ch) {
        var l = document.createElement('span');
        l.className = 'l';
        var inner = document.createElement('span');
        inner.textContent = ch;
        l.appendChild(inner);
        w.appendChild(l);
      });
      el.appendChild(w);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.l > span');
  }

  /* ---------- Inicia depois que o GSAP carregar ---------- */
  window.addEventListener('load', function () {
    var temGsap = typeof window.gsap !== 'undefined';
    var temST = temGsap && typeof window.ScrollTrigger !== 'undefined';
    if (temST) gsap.registerPlugin(ScrollTrigger);

    iniciaRotator(temGsap);
    if (temST && !reduz) iniciaClip();
    iniciaBento(temGsap);
    iniciaConecta(temGsap, temST);
    iniciaTrabalhos();
  });

  /* ---------- Hero: palavra rotativa letra a letra ---------- */
  function iniciaRotator(temGsap) {
    var el = document.getElementById('rot');
    if (!el) return;
    var palavras = ['RECUPERAÇÃO', 'USINAGEM', 'TORNEARIA', 'FRESAGEM', 'SOLDAGEM', 'PEÇAS SOB MEDIDA'];
    var i = 0;
    if (reduz || !temGsap) {
      setInterval(function () { i = (i + 1) % palavras.length; el.textContent = palavras[i]; }, 2600);
      return;
    }
    var letras = quebraLetras(el, palavras[0]);
    gsap.from(letras, { yPercent: -110, duration: 0.6, stagger: 0.035, ease: 'power3.out', delay: 0.2 });
    setInterval(function () {
      gsap.to(el.querySelectorAll('.l > span'), {
        yPercent: 110, duration: 0.35, stagger: 0.02, ease: 'power2.in',
        onComplete: function () {
          i = (i + 1) % palavras.length;
          var novas = quebraLetras(el, palavras[i]);
          gsap.fromTo(novas, { yPercent: -110 }, { yPercent: 0, duration: 0.55, stagger: 0.035, ease: 'power3.out' });
        }
      });
    }, 2800);
  }

  /* ---------- H2: clip vertical letra a letra ---------- */
  function iniciaClip() {
    document.querySelectorAll('.clip').forEach(function (h) {
      var texto = h.textContent.trim();
      h.setAttribute('aria-label', texto);
      var letras = quebraLetras(h, texto);
      gsap.set(letras, { yPercent: -110 });
      ScrollTrigger.create({
        trigger: h, start: 'top 88%', once: true,
        onEnter: function () {
          gsap.to(letras, { yPercent: 0, duration: 0.6, stagger: Math.min(0.025, 0.9 / letras.length), ease: 'power3.out' });
        }
      });
    });
  }

  /* ---------- Bento: spotlight, borda, tilt, faíscas, clique ---------- */
  function iniciaBento(temGsap) {
    var cards = document.querySelectorAll('.bcard');
    if (!cards.length || !mouseFino || reduz) return;

    cards.forEach(function (card) {
      var timers = [];
      var faiscas = [];

      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
        if (temGsap && window.innerWidth >= 1024) {
          var rx = ((y - r.height / 2) / (r.height / 2)) * -5;
          var ry = ((x - r.width / 2) / (r.width / 2)) * 5;
          gsap.to(card, { rotateX: rx, rotateY: ry, x: (x - r.width / 2) * 0.03, y: (y - r.height / 2) * 0.03, duration: 0.25, ease: 'power2.out', transformPerspective: 1000 });
        }
      });

      card.addEventListener('mouseenter', function () {
        if (!temGsap) return;
        var r = card.getBoundingClientRect();
        for (var k = 0; k < 8; k++) {
          timers.push(setTimeout(function () {
            var s = document.createElement('span');
            s.className = 'spark';
            s.style.left = Math.random() * r.width + 'px';
            s.style.top = Math.random() * r.height + 'px';
            card.appendChild(s);
            faiscas.push(s);
            gsap.fromTo(s, { scale: 0, opacity: 0, rotation: Math.random() * 360 }, { scale: 1, opacity: 1, duration: 0.25 });
            gsap.to(s, { x: (Math.random() - 0.5) * 90, y: (Math.random() - 0.5) * 90, duration: 1.6 + Math.random() * 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
          }, k * 90));
        }
      });

      card.addEventListener('mouseleave', function () {
        timers.forEach(clearTimeout); timers = [];
        faiscas.forEach(function (s) {
          if (temGsap) gsap.to(s, { scale: 0, opacity: 0, duration: 0.25, onComplete: function () { s.remove(); } });
          else s.remove();
        });
        faiscas = [];
        if (temGsap) gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
      });

      card.addEventListener('click', function (e) {
        if (!temGsap) return;
        var r = card.getBoundingClientRect();
        var rp = document.createElement('span');
        rp.className = 'ripple';
        rp.style.left = (e.clientX - r.left) + 'px';
        rp.style.top = (e.clientY - r.top) + 'px';
        card.appendChild(rp);
        gsap.fromTo(rp, { scale: 0, opacity: 1 }, { scale: 45, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: function () { rp.remove(); } });
      });
    });
  }

  /* ---------- Como funciona: centro cresce e conecta aos serviços ---------- */
  function iniciaConecta(temGsap, temST) {
    var svg = document.getElementById('rede');
    if (!svg) return;
    var NS = 'http://www.w3.org/2000/svg';
    var gL = document.getElementById('linhas');
    var gN = document.getElementById('nos');
    var nomes = ['Recuperação', 'Usinagem', 'Tornearia', 'Fresagem', 'Soldagem', 'Sob medida', 'Manutenção', 'Serrarias'];
    var C = 300, R = 228, W = 156, H = 46;
    var linhas = [], nos = [];

    nomes.forEach(function (nome, i) {
      var a = (-90 + i * 45) * Math.PI / 180;
      var x = C + R * Math.cos(a), y = C + R * Math.sin(a);
      var ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', C); ln.setAttribute('y1', C);
      ln.setAttribute('x2', x.toFixed(1)); ln.setAttribute('y2', y.toFixed(1));
      ln.setAttribute('class', 'linha');
      var comp = Math.hypot(x - C, y - C);
      ln.style.strokeDasharray = comp;
      ln.style.strokeDashoffset = comp;
      gL.appendChild(ln);
      linhas.push(ln);

      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'no');
      var rc = document.createElementNS(NS, 'rect');
      rc.setAttribute('x', (x - W / 2).toFixed(1)); rc.setAttribute('y', (y - H / 2).toFixed(1));
      rc.setAttribute('width', W); rc.setAttribute('height', H); rc.setAttribute('rx', 12);
      var tx = document.createElementNS(NS, 'text');
      tx.setAttribute('x', x.toFixed(1)); tx.setAttribute('y', (y + 6).toFixed(1));
      tx.setAttribute('text-anchor', 'middle');
      tx.textContent = nome;
      g.appendChild(rc); g.appendChild(tx);
      gN.appendChild(g);
      nos.push(g);
    });

    var passos = document.querySelectorAll('#passos li');
    var centro = document.getElementById('centro');

    function tudoLigado() {
      linhas.forEach(function (l) { l.style.strokeDashoffset = 0; });
      nos.forEach(function (n) { n.classList.add('on'); });
      passos.forEach(function (p) { p.classList.add('on'); });
    }

    if (reduz || !temGsap || !temST) { tudoLigado(); return; }

    function montaTimeline() {
      var tl = gsap.timeline();
      tl.fromTo(centro, { scale: 0.55 }, { scale: 1.15, duration: 1, ease: 'power2.out' })
        .add(function () { passos[0].classList.add('on'); }, 0.1)
        .add(function () { passos[1].classList.add('on'); }, 0.9);
      linhas.forEach(function (l, i) {
        var t = 1 + i * 0.45;
        tl.to(l, { strokeDashoffset: 0, duration: 0.45, ease: 'none' }, t);
        tl.add(function () { nos[i].classList.add('on'); }, t + 0.42);
      });
      tl.add(function () { passos[2].classList.add('on'); }, 2.6)
        .add(function () { passos[3].classList.add('on'); }, 4.4)
        .to(centro, { scale: 1, duration: 0.4 }, 4.6);
      return tl;
    }

    if (desktop()) {
      var tl = montaTimeline();
      ScrollTrigger.create({
        trigger: '#como-funciona .conecta__pin',
        start: 'top top',
        end: '+=1600',
        pin: true,
        scrub: 0.6,
        animation: tl,
        onLeave: tudoLigado
      });
    } else {
      gsap.set(centro, { scale: 0.55 });
      ScrollTrigger.create({
        trigger: svg, start: 'top 75%', once: true,
        onEnter: function () { montaTimeline().timeScale(1.6); }
      });
    }
  }

  /* ---------- Trabalhos: título fixo muda conforme a imagem ---------- */
  function iniciaTrabalhos() {
    var itens = document.querySelectorAll('.titem');
    if (!itens.length || !('IntersectionObserver' in window)) return;
    var info = document.getElementById('trabInfo');
    var num = document.getElementById('trabNum');
    var tag = document.getElementById('trabTag');
    var tit = document.getElementById('trabTit');
    var desc = document.getElementById('trabDesc');
    var bar = document.getElementById('trabBar');
    var total = itens.length;
    var atual = -1;

    function ativa(idx) {
      if (idx === atual) return;
      atual = idx;
      var it = itens[idx];
      itens.forEach(function (x) { x.classList.toggle('ativo', x === it); });
      num.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
      tag.textContent = it.dataset.tag;
      tit.textContent = it.dataset.tit;
      desc.textContent = it.dataset.desc;
      bar.style.height = ((idx + 1) / total * 100) + '%';
      info.classList.remove('troca'); void info.offsetWidth; info.classList.add('troca');
    }

    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) ativa(Array.prototype.indexOf.call(itens, e.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    itens.forEach(function (it) { obs.observe(it); });
    ativa(0);
  }
})();
