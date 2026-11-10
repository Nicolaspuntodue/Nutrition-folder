import './app.css'
import { buildDay, shopping, nextOption, DAYS, WEEK, itNum } from './plan.js'

const KEY = 'nl-sofia-v1'
const view = document.getElementById('view')
const restart = document.getElementById('restart')
const name = new URLSearchParams(location.search).get('nome')?.trim() || 'Sofia'
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }
function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* senza memoria l'app funziona lo stesso */ } }

let state = load()
const lastWeight = state.answers?.weight || 58
if (state.date !== today) state = { date: today, answers: null, mood: null, done: [], have: [], swaps: {} }

const todayIdx = (now.getDay() + 6) % 7
const TRAINING_DAYS = [0, 2, 4]
// Prima delle domande la giornata si mostra con le risposte tipiche di Sofia.
const typical = (day) => ({ day, wake: '07:00', work: day !== 0, lunch: '13:30', training: TRAINING_DAYS.includes(day) ? 'pomeriggio' : 'no', hunger: 'normale', weight: lastWeight })
const answersNow = () => state.answers || typical(todayIdx)

const QUESTIONS = [
  { id: 'wake', q: 'A che ora ti sei svegliata?', opts: ['06:30', '07:00', '07:30', '08:00', '08:30', '09:00'].map((t) => [t, `⏰ ${t}`]) },
  { id: 'work', q: 'Oggi lavori al salone?', opts: [[true, '💇‍♀️ Sì, lavoro'], [false, '🏖️ No, sono libera']] },
  { id: 'lunch', q: 'Quando fai pausa pranzo?', if: (a) => a.work, opts: [['12:30', 'Verso le 12:30'], ['13:30', 'Verso le 13:30'], ['14:30', 'Verso le 14:30'], ['libera', '🤹 Non ho una pausa fissa']] },
  { id: 'training', q: 'Ti alleni oggi?', opts: [['no', '🛋️ No, oggi riposo'], ['mattina', '🌅 Sì, la mattina'], ['pomeriggio', '🏋️‍♀️ Sì, verso le 17'], ['sera', '🌙 Sì, verso le 19:30']] },
  { id: 'ieri', q: 'Com\'è andata ieri con il cibo?', opts: [['piano', '💪 Ho seguito il piano'], ['sgarro', '🍕 Ho sgarrato un po\''], ['saltato', '🤷‍♀️ Ho saltato qualche pasto']] },
  { id: 'craving', q: 'Hai voglia di qualcosa in particolare?', opts: [['pasta', '🍝 Pasta'], ['riso', '🍚 Riso'], ['carne', '🍗 Carne'], ['pesce', '🐟 Pesce'], [null, '😌 Va bene tutto']] },
  { id: 'breakfast', q: 'La colazione la vuoi dolce o salata?', opts: [['dolce', '🥞 Dolce'], ['salata', '🍳 Salata']] },
  { id: 'hunger', q: 'Quanta fame hai stamattina?', opts: [['poca', '🤏 Poca'], ['normale', '👌 Normale'], ['tanta', '🤤 Tanta']] },
  { id: 'weight', q: 'Quanto pesi stamattina?', weight: true },
]

// Il check-in della home: cinque faccine, dal corallo al verde, come nelle app dell'umore.
const MOODS = [
  { id: 'ko', face: '😫', label: 'Distrutta', color: '#f2a196',
    say: 'Giornata pesante 🫶 Oggi niente perfezione: fai i pasti principali, bevi tanta acqua e se puoi vai a letto presto.' },
  { id: 'stanca', face: '😴', label: 'Stanca', color: '#f6c48a',
    say: 'Un po\' di stanchezza 😴 Non saltare la colazione: è quella che ti tiene in piedi al salone.' },
  { id: 'normale', face: '🙂', label: 'Normale', color: '#f3dc85',
    say: 'Giornata tranquilla 🙂 Segui il piano e al resto ci penso io.' },
  { id: 'bene', face: '😊', label: 'Bene', color: '#b9d99b',
    say: 'Che bello sentirlo 😊 Oggi è il giorno giusto per fare tutto come da piano.' },
  { id: 'carica', face: '🤩', label: 'Carica', color: '#86c99c',
    say: 'Sei carica 🤩 Se ti alleni oggi, spingi: il pre-allenamento è già nel piano.' },
]
const moodOf = (id) => MOODS.find((m) => m.id === id)

let answers = {}
let step = 0
const visible = () => QUESTIONS.filter((x) => !x.if || x.if(answers))
const back = '<a class="link back-home" href="#">← Home</a>'

/* ---------- Home ---------- */

// Dopo il primo ingresso la home non rifà le animazioni: si anima solo la risposta alla faccina.
function renderHome(calm = false) {
  restart.hidden = true
  const plan = buildDay({ ...answersNow(), swaps: state.swaps })
  const next = plan.meals.find((m) => !state.done.includes(m.slot)) || plan.meals.at(-1)
  const hour = now.getHours()
  const greet = hour < 13 ? 'Buongiorno ☀️' : hour < 18 ? 'Buon pomeriggio 🌤️' : 'Buonasera 🌙'
  const date = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
  const mood = moodOf(state.mood)

  view.innerHTML = `
    <section class="home${calm ? ' calm' : ''}" aria-labelledby="hi">
      <p class="date">${greet} · ${date}</p>
      <h1 id="hi" class="hi"><span>Ciao ${esc(name)} <i class="wave" aria-hidden="true">👋</i></span></h1>

      <div class="checkin${mood ? ' picked' : ''}" style="--mood:${mood?.color || '#ffffff'}">
        <h2>Come stai oggi?</h2>
        <div class="faces" role="radiogroup" aria-label="Come stai oggi?">
          ${MOODS.map((m) => `
            <button type="button" class="face${m.id === state.mood ? ' on' : ''}" role="radio" aria-checked="${m.id === state.mood}" data-mood="${m.id}" style="--c:${m.color}">
              <span class="emo" aria-hidden="true">${m.face}</span><small>${m.label}</small>
            </button>`).join('')}
        </div>
        ${mood ? `<p class="reply">${esc(mood.say)}</p>
          <a class="btn huge" href="#cambia">Vuoi cambiare qualcosa? ✏️</a>` : ''}
      </div>

      <a class="today" href="#giorno">
        <img src="${next.img}" alt="${esc(next.name)}" width="720" height="720">
        <span><small>${state.answers ? 'Il tuo piano di oggi' : 'La tua giornata tipo'} · prossimo alle ${next.time}</small><b>${esc(next.name)}</b><em>${itNum(plan.total[0])} kcal · ${itNum(plan.total[1])} g di proteine · ${plan.meals.length} pasti</em></span>
      </a>
      <div class="pair">
        <a class="btn big" href="#giorno">Vedi il piano 🍽️</a>
        <a class="btn ghost big" href="#cambia">Cambia il piano ✏️</a>
      </div>

      <div class="tiles">
        <a class="tile" href="#spesa-settimana"><span class="ico" aria-hidden="true">🛒</span><b>Spesa della settimana</b><small>Tutto quello che serve, già sommato</small></a>
        <a class="tile" href="#settimana"><span class="ico" aria-hidden="true">📅</span><b>La mia settimana</b><small>Cosa mangi giorno per giorno</small></a>
      </div>
    </section>`

  view.querySelectorAll('.face').forEach((b) => b.addEventListener('click', () => {
    state.mood = b.dataset.mood
    save(state)
    renderHome(true)
    view.querySelector('.reply')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }))
}

/* ---------- Cambia il piano ---------- */

function renderChange() {
  restart.hidden = true
  const a = answersNow()
  const plan = buildDay({ ...a, swaps: state.swaps })
  const set = (patch) => { state.answers = { ...answersNow(), ...patch }; save(state); renderChange() }

  view.innerHTML = `
    <section class="change" aria-labelledby="c">
      ${back}
      <h1 id="c">Cambia il piano ✏️</h1>
      <p class="lead">Scegli tu cosa cambiare: il resto lo ricalcolo io.</p>

      <div class="card">
        <h2>Oggi ti alleni?</h2>
        <div class="chips">
          ${[['no', '🛋️ No'], ['mattina', '🌅 Mattina'], ['pomeriggio', '🏋️‍♀️ Alle 17'], ['sera', '🌙 Alle 19:30']].map(([v, l]) =>
            `<button type="button" class="chip${a.training === v ? ' on' : ''}" data-train="${v}" aria-pressed="${a.training === v}">${l}</button>`).join('')}
        </div>
      </div>

      <div class="card">
        <h2>Oggi lavori al salone?</h2>
        <div class="chips">
          ${[[true, '💇‍♀️ Sì'], [false, '🏖️ No, sono libera']].map(([v, l]) =>
            `<button type="button" class="chip${a.work === v ? ' on' : ''}" data-work="${v}" aria-pressed="${a.work === v}">${l}</button>`).join('')}
        </div>
      </div>

      <div class="card">
        <h2>Un pasto non ti va?</h2>
        <p class="hint">Tocca 🔄 e te ne propongo un altro a caso, con gli stessi conti.</p>
        <ul class="swaps">
          ${plan.meals.map((m) => `
            <li>
              <img src="${m.img}" alt="" width="720" height="720" loading="lazy">
              <span><small>${m.time} · ${m.slot}</small>${esc(m.name)}</span>
              <button type="button" class="round" data-slot="${m.slot}" aria-label="Cambia ${m.slot}">🔄</button>
            </li>`).join('')}
        </ul>
      </div>

      <a class="card link-card" href="#quiz"><h2>Rifai tutte le domande 📝</h2><p>Sveglia, pausa pranzo, fame, voglie: ricalcolo la giornata da capo.</p></a>
      <a class="btn huge" href="#giorno">Fatto, vedi il piano 🍽️</a>
    </section>`

  view.querySelectorAll('[data-train]').forEach((b) => b.addEventListener('click', () => set({ training: b.dataset.train })))
  view.querySelectorAll('[data-work]').forEach((b) => b.addEventListener('click', () => set({ work: b.dataset.work === 'true' })))
  view.querySelectorAll('.round').forEach((b) => b.addEventListener('click', () => {
    const s = b.dataset.slot
    const cur = plan.meals.find((m) => m.slot === s)
    const taken = plan.meals.filter((m) => m.slot !== s).map((m) => m.id)
    state.swaps = { ...state.swaps, [s]: nextOption(s, cur.id, a.day, taken) }
    state.done = state.done.filter((x) => x !== s)
    save(state)
    const y = scrollY
    renderChange()
    scrollTo(0, y)
  }))
}

/* ---------- Domande ---------- */

function renderQuestion() {
  restart.hidden = true
  const qs = visible()
  const q = qs[step]
  const pct = Math.round((step / qs.length) * 100)
  view.innerHTML = `
    <section class="quiz" aria-labelledby="q">
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${qs.length}" aria-valuenow="${step}" aria-label="Domanda ${step + 1} di ${qs.length}"><span style="width:${pct}%"></span></div>
      <p class="count">Domanda ${step + 1} di ${qs.length}</p>
      <h1 id="q" class="question">${esc(q.q)}</h1>
      ${q.weight ? `
        <div class="weigh">
          <label for="w">⚖️ Peso <output id="wo">${lastWeight.toFixed(1).replace('.', ',')} kg</output></label>
          <input id="w" type="range" min="45" max="75" step="0.5" value="${lastWeight}">
          <p class="hint">Resta tra noi 🤫 Serve solo per le proteine: 2 g per ogni chilo.</p>
        </div>
        <button class="btn big" id="go" type="button">Vedi la mia giornata 🎉</button>`
      : `<div class="opts">${q.opts.map(([v, l], i) => `<button type="button" class="opt${answers[q.id] === v ? ' sel' : ''}" data-i="${i}">${esc(l)}</button>`).join('')}</div>`}
      ${step ? '<button class="link back" id="back" type="button">← Indietro</button>' : '<a class="link back" href="#">← Home</a>'}
    </section>`
  view.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
    answers[q.id] = q.opts[+b.dataset.i][0]
    b.classList.add('sel')
    setTimeout(next, 180)
  }))
  const w = document.getElementById('w')
  if (w) {
    w.addEventListener('input', () => { document.getElementById('wo').textContent = `${(+w.value).toFixed(1).replace('.', ',')} kg` })
    document.getElementById('go').addEventListener('click', () => { answers.weight = +w.value; finish() })
  }
  document.getElementById('back')?.addEventListener('click', () => { step--; renderQuestion() })
}

function next() {
  step++
  if (step >= visible().length) finish()
  else renderQuestion()
}

function finish() {
  state = { ...state, answers: { day: todayIdx, ...answers }, done: [], swaps: {} }
  save(state)
  location.hash = 'giorno'
}

// Due righe in confidenza: l'umore dalla home, com'è andata ieri dalle domande.
function chat(a) {
  const ieri = {
    piano: 'E ieri hai seguito il piano: brava! 💪',
    sgarro: 'Ieri uno sgarro? Nessun problema 🍕 Oggi si riparte normale, niente digiuni per compensare.',
    saltato: 'Ieri hai saltato qualcosa: oggi prova a fare tutti i pasti, soprattutto il pranzo al salone 🤗',
  }[a?.ieri]
  return [moodOf(state.mood)?.say, ieri].filter(Boolean)
}

/* ---------- La mia giornata ---------- */

// Ogni anello si riempie con quello che hai già mangiato, sul totale del giorno.
function ring(label, eaten, total, unit) {
  const r = 26, c = 2 * Math.PI * r, f = total ? Math.min(1, eaten / total) : 0
  return `<figure class="ring">
    <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" class="ring-bg"/><circle cx="32" cy="32" r="${r}" class="ring-fg" style="stroke-dasharray:${c};stroke-dashoffset:${c * (1 - f)}"/></svg>
    <figcaption><b>${itNum(total)}${unit}</b><span>${label}</span></figcaption></figure>`
}

function renderDay() {
  restart.hidden = false
  const a = answersNow()
  const plan = buildDay({ ...a, swaps: state.swaps })
  const [kcal, p, c, g] = plan.total
  const done = new Set(state.done)
  const ate = plan.meals.filter((m) => done.has(m.slot)).reduce((t, m) => t.map((v, i) => v + m.mac[i]), [0, 0, 0, 0])
  const lines = [...chat(state.answers), ...(state.answers ? [] : ['Questa è la tua giornata tipo. Se oggi va diversamente, cambiala in un minuto 🙂'])]

  view.innerHTML = `
    <section class="day" aria-labelledby="d">
      ${back}
      <h1 id="d">${plan.day}, ${esc(name)}</h1>
      <div class="chat">${lines.map((l) => `<p>${esc(l)}</p>`).join('')}<a class="btn ghost" href="#cambia">Cambia il piano ✏️</a></div>
      <div class="rings">
        ${ring('kcal', ate[0], kcal, '')}${ring('proteine', ate[1], p, ' g')}${ring('carboidrati', ate[2], c, ' g')}${ring('grassi', ate[3], g, ' g')}
      </div>
      <p class="eaten">${done.size ? `Hai già mangiato ${itNum(ate[0])} kcal e ${itNum(ate[1])} g di proteine: ne mancano ${itNum(p - ate[1])} 💪` : 'Spunta i pasti man mano che li mangi ✅'}</p>

      <ol class="meals">
        ${plan.meals.map((m, i) => `
          <li class="meal${done.has(m.slot) ? ' is-done' : ''}">
            <div class="meal-time"><b>${m.time}</b><span>${m.slot}</span></div>
            <div class="meal-body">
              <figure class="meal-pic"><img src="${m.img}" alt="${esc(m.name)}" width="512" height="512" loading="${i ? 'lazy' : 'eager'}"></figure>
              <h3>${esc(m.name)}</h3>
              ${m.note ? `<p class="note">${esc(m.note)}</p>` : ''}
              <ul class="ing">${m.ing.map(([f, gr]) => `<li><span>${esc(f)}</span><b>${f === 'Pizza margherita' ? '1 pizza' : `${gr} g`}</b></li>`).join('')}</ul>
              <p class="mac"><b>${itNum(m.mac[0])} kcal</b> · proteine ${itNum(m.mac[1])} g · carboidrati ${itNum(m.mac[2])} g · grassi ${itNum(m.mac[3])} g</p>
              <div class="acts">
                <button type="button" class="btn ${done.has(m.slot) ? 'ghost' : ''} done" data-slot="${m.slot}" aria-pressed="${done.has(m.slot)}">${done.has(m.slot) ? 'Fatto ✅' : 'L\'ho mangiato'}</button>
                <button type="button" class="btn ghost swap" data-slot="${m.slot}">Non mi va, cambialo 🔄</button>
              </div>
            </div>
          </li>`).join('')}
      </ol>
      <a class="btn huge ghost" href="#spesa">🛒 La spesa di oggi</a>
      <p class="fine">Valori stimati con medie da tabella, sul peso a crudo. Non è una prescrizione medica.</p>
    </section>`

  view.querySelectorAll('.meal-pic img').forEach((img) => img.addEventListener('error', () => img.closest('figure').remove(), { once: true }))
  view.querySelectorAll('.done').forEach((b) => b.addEventListener('click', () => {
    const s = b.dataset.slot
    state.done = done.has(s) ? state.done.filter((x) => x !== s) : [...state.done, s]
    save(state)
    renderDay()
  }))
  view.querySelectorAll('.swap').forEach((b) => b.addEventListener('click', () => {
    const s = b.dataset.slot
    const cur = plan.meals.find((m) => m.slot === s)
    const taken = plan.meals.filter((m) => m.slot !== s).map((m) => m.id)
    state.swaps = { ...state.swaps, [s]: nextOption(s, cur.id, a.day, taken) }
    state.done = state.done.filter((x) => x !== s)
    save(state)
    renderDay()
    document.querySelector(`.swap[data-slot="${s}"]`)?.closest('.meal').scrollIntoView({ block: 'start' })
  }))
}

/* ---------- La spesa ---------- */

function weekPlans() {
  const a = answersNow()
  return WEEK.map((_, d) => buildDay(d === a.day ? { ...a, swaps: state.swaps } : { ...typical(d), breakfast: a.breakfast }))
}

function renderShop(week) {
  restart.hidden = true
  const list = week ? shopping(weekPlans()) : shopping([buildDay({ ...answersNow(), swaps: state.swaps })])
  const have = new Set(state.have)
  view.innerHTML = `
    <section class="shop-page" aria-labelledby="s">
      ${back}
      <h1 id="s">🛒 ${week ? 'Spesa della settimana' : 'Spesa di oggi'}</h1>
      <div class="seg" role="group" aria-label="Periodo">
        <a href="#spesa" class="${week ? '' : 'on'}" aria-current="${!week}">Oggi</a>
        <a href="#spesa-settimana" class="${week ? 'on' : ''}" aria-current="${week}">Settimana</a>
      </div>
      <p class="hint">Spunta quello che hai già in casa: resta solo cosa comprare.</p>
      <div class="shop">
        ${list.map(([aisle, items]) => `<div class="aisle"><h2>${aisle}</h2>${items.map(([f, q]) => `
          <label class="item${have.has(f) ? ' got' : ''}"><input type="checkbox" data-food="${esc(f)}" ${have.has(f) ? 'checked' : ''}><span>${esc(f)}</span><b>${q}</b></label>`).join('')}</div>`).join('')}
      </div>
    </section>`
  view.querySelectorAll('[data-food]').forEach((cb) => cb.addEventListener('change', () => {
    const f = cb.dataset.food
    state.have = cb.checked ? [...state.have, f] : state.have.filter((x) => x !== f)
    cb.closest('.item').classList.toggle('got', cb.checked)
    save(state)
  }))
}

/* ---------- La settimana ---------- */

function renderWeek() {
  restart.hidden = true
  view.innerHTML = `
    <section class="week-page" aria-labelledby="w">
      ${back}
      <h1 id="w">📅 La mia settimana</h1>
      <ol class="week-list">
        ${weekPlans().map((p, d) => {
          const pr = p.meals.find((m) => m.slot === 'Pranzo'), ce = p.meals.find((m) => m.slot === 'Cena')
          return `<li class="wday${d === todayIdx ? ' is-today' : ''}">
            <h2>${DAYS[d]}${d === todayIdx ? ' · oggi' : ''} <small>${itNum(p.total[0])} kcal · ${(d === answersNow().day ? answersNow().training !== 'no' : TRAINING_DAYS.includes(d)) ? '🏋️‍♀️ allenamento' : '🛋️ riposo'}</small></h2>
            <div class="wmeals">
              <figure><img src="${pr.img}" alt="" width="720" height="720" loading="lazy"><figcaption><b>Pranzo</b> ${esc(pr.name)}</figcaption></figure>
              <figure><img src="${ce.img}" alt="" width="720" height="720" loading="lazy"><figcaption><b>Cena</b> ${esc(ce.name)}</figcaption></figure>
            </div>
          </li>`
        }).join('')}
      </ol>
      <a class="btn huge" href="#spesa-settimana">🛒 Spesa della settimana</a>
    </section>`
}

/* ---------- Navigazione ---------- */

function route() {
  const h = location.hash.slice(1)
  if (h === 'quiz') { answers = {}; step = 0; renderQuestion() }
  else if (h === 'giorno') renderDay()
  else if (h === 'spesa') renderShop(false)
  else if (h === 'spesa-settimana') renderShop(true)
  else if (h === 'settimana') renderWeek()
  else if (h === 'cambia') renderChange()
  else renderHome()
  scrollTo(0, 0)
}
restart.addEventListener('click', () => { location.hash = 'quiz' })
addEventListener('hashchange', route)
route()

// Installata sul telefono, l'app si apre anche senza rete. In sviluppo il service worker resta spento.
if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js')
