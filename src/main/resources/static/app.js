(function () {
  const $ = (id) => document.getElementById(id);
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NS = 'http://www.w3.org/2000/svg';
  let mode = 'encrypt';
  let requestId = 0;

  // ---- Cipher disc ----
  const svg = $('wheel');
  function el(name, attrs, parent) {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(e);
    return e;
  }
  el('circle', { cx: 200, cy: 200, r: 196, class: 'disc-outer' });
  el('circle', { cx: 200, cy: 200, r: 148, class: 'disc-line' });
  const inner = el('g', { id: 'inner', style: 'transform-origin:200px 200px' });
  el('circle', { cx: 200, cy: 200, r: 142, class: 'disc-inner' }, inner);
  el('circle', { cx: 200, cy: 200, r: 96, class: 'disc-core' }, inner);
  for (let i = 0; i < 26; i++) {
    const ang = (i * 360) / 26;
    const o = el('text', { x: 200, y: 30, class: 'l-outer', transform: `rotate(${ang} 200 200)` });
    o.textContent = ABC[i];
    const n = el('text', { x: 200, y: 84, class: 'l-inner', transform: `rotate(${ang} 200 200)` }, inner);
    n.textContent = ABC[i];
  }
  el('circle', { cx: 200, cy: 200, r: 6, class: 'pin' });
  el('path', { d: 'M200 8 L193 -4 L207 -4 Z', class: 'marker' });

  // ---- UI ----
  const key = $('key'), input = $('input'), output = $('output');

  // Alphabet slid by k places (only used to draw the mapping strip)
  const slid = (k) => ABC.slice(k) + ABC.slice(0, k);

  // Asks the Spring Boot server (CaesarController) to do the work
  async function update() {
    const k = parseInt(key.value, 10);
    const text = input.value;
    const enc = mode === 'encrypt';
    const id = ++requestId;

    $('keyOut').textContent = k;
    inner.style.transform = `rotate(${-k * (360 / 26)}deg)`;
    $('inLabel').textContent = enc ? 'Your message' : 'Secret message';
    $('outLabel').textContent = enc ? 'Secret message' : 'Original message';
    $('plainStrip').textContent = enc ? ABC : slid(k);
    $('cipherStrip').textContent = enc ? slid(k) : ABC;

    try {
      const q = `text=${encodeURIComponent(text)}`;
      const [res, brute] = await Promise.all([
        fetch(`/api/${mode}?${q}&key=${k}`),
        fetch(`/api/bruteforce?${q}`)
      ]);
      const result = await res.text();
      const list = await brute.json();
      if (id !== requestId) return; // a newer request already replaced this one

      output.value = result;
      const ol = $('bruteList');
      ol.innerHTML = '';
      list.forEach((line, i) => {
        const li = document.createElement('li');
        li.textContent = line;
        li.dataset.k = i + 1;
        ol.appendChild(li);
      });
    } catch (e) {
      output.value = 'Cannot reach the server. Is the Spring Boot app running?';
    }
  }

  function setMode(m) {
    mode = m;
    $('m-enc').setAttribute('aria-selected', m === 'encrypt');
    $('m-dec').setAttribute('aria-selected', m === 'decrypt');
    update();
  }

  $('m-enc').onclick = () => setMode('encrypt');
  $('m-dec').onclick = () => setMode('decrypt');
  key.oninput = update;
  input.oninput = update;

  $('swap').onclick = () => {
    input.value = output.value;
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  $('copy').onclick = async () => {
    const btn = $('copy');
    try { await navigator.clipboard.writeText(output.value); btn.textContent = 'Copied'; }
    catch (e) { output.select(); document.execCommand('copy'); btn.textContent = 'Copied'; }
    setTimeout(() => (btn.textContent = 'Copy'), 1400);
  };

  update();
})();
