import './app.css'
import { buildDay, shopping, nextOption, DAYS, WEEK, itNum } from './plan.js'

const KEY = 'nl-sofia-v1'
const view = document.getElementById('view')
const restart = document.getElementById('restart')
const name = new URLSearchParams(location.search).get('nome')?.trim() || 'Sofia'
const now = new Date()
const pad = (n) => String(n).padStart(2, '0')
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
const addDays = (s, n) => { const d = fromIso(s); d.setDate(d.getDate() + n); return iso(d) }
const idxOf = (s) => (fromIso(s).getDay() + 6) % 7
const longDate = (s) => fromIso(s).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const today = iso(now)
const todayIdx = idxOf(today)
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }
function persist() { try { localStorage.setItem(KEY, JSON.stringify(store)) } catch { /* senza memoria l'app funziona lo stesso */ } }

// Ogni giorno del calendario ha le sue risposte, i pasti spuntati e i cambi.
const blank = () => ({ answers: null, mood: null, done: [], have: [], swaps: {} })
let store = load()
// La prima versione salvava un giorno solo: diventa un giorno del calendario.
if (!store.days) store = { days: store.date ? { [store.date]: { ...blank(), ...store } } : {} }
for (const k in store.days) if (k < addDays(today, -14)) delete store.days[k]
const lastWeight = Object.keys(store.days).sort().map((k) => store.days[k].answers?.weight).filter(Boolean).at(-1) || 58

let sel = today
const dayState = (d = sel) => store.days[d] || blank()
const edit = (d = sel) => (store.days[d] ??= blank())
const isToday = () => sel === today
const at = (h) => (isToday() ? `#${h}` : `#${h}/${sel}`)

const TRAINING_DAYS = [0, 2, 4]
// Prima delle domande la giornata si mostra con le risposte tipiche di Sofia.
const typical = (day) => ({ day, wake: '07:00', work: day !== 0, lunch: '13:30', training: TRAINING_DAYS.includes(day) ? 'pomeriggio' : 'no', hunger: 'normale', weight: lastWeight })
const answersFor = (d = sel) => dayState(d).answers || { ...typical(idxOf(d)), breakfast: dayState(today).answers?.breakfast }
const planFor = (d = sel) => buildDay({ ...answersFor(d), swaps: dayState(d).swaps })

// f: la stessa domanda quando prepara un altro giorno. today: solo per oggi.
const QUESTIONS = [
  { id: 'wake', q: 'A che ora ti sei svegliata?', f: 'A che ora ti svegli quel giorno?', opts: ['06:30', '07:00', '07:30', '08:00', '08:30', '09:00'].map((t) => [t, `⏰ ${t}`]) },
  { id: 'work', q: 'Oggi lavori al salone?', f: 'Quel giorno lavori al salone?', opts: [[true, '💇‍♀️ Sì, lavoro'], [false, '🏖️ No, sono libera']] },
  { id: 'lunch', q: 'Quando fai pausa pranzo?', if: (a) => a.work, opts: [['12:30', 'Verso le 12:30'], ['13:30', 'Verso le 13:30'], ['14:30', 'Verso le 14:30'], ['libera', '🤹 Non ho una pausa fissa']] },
  { id: 'training', q: 'Ti alleni oggi?', f: 'Ti alleni quel giorno?', opts: [['no', '🛋️ No, riposo'], ['mattina', '🌅 Sì, la mattina'], ['pomeriggio', '🏋️‍♀️ Sì, verso le 17'], ['sera', '🌙 Sì, verso le 19:30']] },
  { id: 'ieri', today: true, q: 'Com\'è andata ieri con il cibo?', opts: [['piano', '💪 Ho seguito il piano'], ['sgarro', '🍕 Ho sgarrato un po\''], ['saltato', '🤷‍♀️ Ho saltato qualche pasto']] },
  { id: 'craving', q: 'Hai voglia di qualcosa in particolare?', f: 'Di cosa avrai voglia?', opts: [['pasta', '🍝 Pasta'], ['riso', '🍚 Riso'], ['carne', '🍗 Carne'], ['pesce', '🐟 Pesce'], [null, '😌 Va bene tutto']] },
  { id: 'breakfast', q: 'La colazione la vuoi dolce o salata?', opts: [['dolce', '🥞 Dolce'], ['salata', '🍳 Salata']] },
  { id: 'hunger', q: 'Quanta fame hai stamattina?', f: 'Quanta fame pensi di avere?', opts: [['poca', '🤏 Poca'], ['normale', '👌 Normale'], ['tanta', '🤤 Tanta']] },
  { id: 'weight', today: true, q: 'Quanto pesi stamattina?', weight: true },
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
const visible = () => QUESTIONS.filter((x) => (!x.if || x.if(answers)) && (isToday() || !x.today))
const back = '<a class="link back-home" href="#">← Home</a>'
const backCal = () => (isToday() ? back : '<a class="link back-home" href="#calendario">← Calendario</a>')

/* ---------- Home ---------- */

// Dopo il primo ingresso la home non rifà le animazioni: si anima solo la risposta alla faccina.
function renderHome(calm = false) {
  restart.hidden = true
  const s = dayState(today)
  const plan = planFor(today)
  const next = plan.meals.find((m) => !s.done.includes(m.slot)) || plan.meals.at(-1)
  const hour = now.getHours()
  const greet = hour < 13 ? 'Buongiorno ☀️' : hour < 18 ? 'Buon pomeriggio 🌤️' : 'Buonasera 🌙'
  const mood = moodOf(s.mood)

  view.innerHTML = `
    <section class="home${calm ? ' calm' : ''}" aria-labelledby="hi">
      <p class="date">${greet} · ${longDate(today)}</p>
      <h1 id="hi" class="hi"><span>Ciao ${esc(name)} <i class="wave" aria-hidden="true">👋</i></span></h1>

      <div class="checkin${mood ? ' picked' : ''}" style="--mood:${mood?.color || '#ffffff'}">
        <h2>Come stai oggi?</h2>
        <div class="faces" role="radiogroup" aria-label="Come stai oggi?">
          ${MOODS.map((m) => `
            <button type="button" class="face${m.id === s.mood ? ' on' : ''}" role="radio" aria-checked="${m.id === s.mood}" data-mood="${m.id}" style="--c:${m.color}">
              <span class="emo" aria-hidden="true">${m.face}</span><small>${m.label}</small>
            </button>`).join('')}
        </div>
        ${mood ? `<p class="reply">${esc(mood.say)}</p>
          <a class="btn huge" href="#cambia">Vuoi cambiare qualcosa? ✏️</a>` : ''}
      </div>

      <a class="today" href="#giorno">
        <img src="${next.img}" alt="${esc(next.name)}" width="720" height="720">
        <span><small>${s.answers ? 'Il tuo piano di oggi' : 'La tua giornata tipo'} · prossimo alle ${next.time}</small><b>${esc(next.name)}</b><em>${itNum(plan.total[0])} kcal · ${itNum(plan.total[1])} g di proteine · ${plan.meals.length} pasti</em></span>
      </a>
      <div class="pair">
        <a class="btn big" href="#giorno">Vedi il piano 🍽️</a>
        <a class="btn ghost big" href="#cambia">Cambia il piano ✏️</a>
      </div>

      <div class="tiles">
        <a class="tile wide" href="#calendario"><span class="ico" aria-hidden="true">📅</span><b>Prepara domani o un altro giorno</b><small>Scegli il giorno sul calendario, rispondi a qualche domanda e sai già cosa mangiare</small></a>
        <a class="tile" href="#spesa-settimana"><span class="ico" aria-hidden="true">🛒</span><b>Spesa della settimana</b><small>Tutto quello che serve, già sommato</small></a>
        <a class="tile" href="#settimana"><span class="ico" aria-hidden="true">🗓️</span><b>La mia settimana</b><small>Cosa mangi nei prossimi 7 giorni</small></a>
      </div>
    </section>`

  view.querySelectorAll('.face').forEach((b) => b.addEventListener('click', () => {
    edit(today).mood = b.dataset.mood
    persist()
    renderHome(true)
    view.querySelector('.reply')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }))
}

/* ---------- Calendario ---------- */

// Cinque settimane da questo lunedì: ogni giorno da oggi in poi si prepara con il quiz.
function renderCalendar() {
  restart.hidden = true
  const start = addDays(today, -todayIdx)
  const cells = Array.from({ length: 35 }, (_, i) => addDays(start, i))
  const ready = next7().filter((d) => store.days[d]?.answers).length
  const months = [...new Set(cells.slice(todayIdx).map((d) => fromIso(d).toLocaleDateString('it-IT', { month: 'long' })))].map(cap).join(' · ')
  const tomorrow = addDays(today, 1)
  const go = (d) => (store.days[d]?.answers ? `#giorno/${d}` : `#quiz/${d}`)

  view.innerHTML = `
    <section class="cal-page" aria-labelledby="cal">
      ${back}
      <h1 id="cal">📅 Scegli un giorno</h1>
      <p class="lead">Tocca un giorno, rispondi a qualche domanda e ti dico cosa mangiare 🎮</p>
      <a class="btn huge" href="${go(tomorrow)}">${store.days[tomorrow]?.answers ? 'Vedi cosa mangi domani 🌅' : 'Prepara domani 🌅'}</a>
      <p class="score"><span aria-hidden="true">${'⭐'.repeat(ready)}${'☆'.repeat(7 - ready)}</span> <b>${ready} ${ready === 1 ? 'giorno pronto' : 'giorni pronti'} su 7</b></p>
      <div class="card">
        <h2>${months}</h2>
        <div class="cal">
          ${['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((l) => `<span class="dow" aria-hidden="true">${l}</span>`).join('')}
          ${cells.map((d) => {
            const n = fromIso(d).getDate()
            if (d < today) return `<span class="cday past" aria-hidden="true"><b>${n}</b></span>`
            const ok = store.days[d]?.answers
            const tag = ok ? '✅' : answersFor(d).training !== 'no' ? '🏋️‍♀️' : ''
            return `<a class="cday${d === today ? ' now' : ''}${ok ? ' ready' : ''}" href="${go(d)}" aria-label="${longDate(d)}${ok ? ', pronto' : ''}"><b>${n}</b><i aria-hidden="true">${tag}</i></a>`
          }).join('')}
        </div>
        <p class="hint">✅ giorno pronto · 🏋️‍♀️ allenamento · col bordo è oggi</p>
      </div>
    </section>`
}

/* ---------- Cambia il piano ---------- */

function renderChange() {
  restart.hidden = true
  const a = answersFor()
  const plan = planFor()
  const when = isToday() ? 'Oggi' : 'Quel giorno'
  const set = (patch) => { edit().answers = { ...answersFor(), ...patch }; persist(); renderChange() }

  view.innerHTML = `
    <section class="change" aria-labelledby="c">
      ${backCal()}
      <h1 id="c">Cambia il piano ✏️</h1>
      <p class="lead">${isToday() ? '' : `${cap(longDate(sel))}. `}Scegli tu cosa cambiare: il resto lo ricalcolo io.</p>

      <div class="card">
        <h2>${when} ti alleni?</h2>
        <div class="chips">
          ${[['no', '🛋️ No'], ['mattina', '🌅 Mattina'], ['pomeriggio', '🏋️‍♀️ Alle 17'], ['sera', '🌙 Alle 19:30']].map(([v, l]) =>
            `<button type="button" class="chip${a.training === v ? ' on' : ''}" data-train="${v}" aria-pressed="${a.training === v}">${l}</button>`).join('')}
        </div>
      </div>

      <div class="card">
        <h2>${when} lavori al salone?</h2>
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

      <a class="card link-card" href="${at('quiz')}"><h2>Rifai tutte le domande 📝</h2><p>Sveglia, pausa pranzo, fame, voglie: ricalcolo la giornata da capo.</p></a>
      <a class="btn huge" href="${at('giorno')}">Fatto, vedi il piano 🍽️</a>
    </section>`

  view.querySelectorAll('[data-train]').forEach((b) => b.addEventListener('click', () => set({ training: b.dataset.train })))
  view.querySelectorAll('[data-work]').forEach((b) => b.addEventListener('click', () => set({ work: b.dataset.work === 'true' })))
  view.querySelectorAll('.round').forEach((b) => b.addEventListener('click', () => {
    swap(plan, b.dataset.slot, a.day)
    const y = scrollY
    renderChange()
    scrollTo(0, y)
  }))
}

function swap(plan, slot, day) {
  const cur = plan.meals.find((m) => m.slot === slot)
  const taken = plan.meals.filter((m) => m.slot !== slot).map((m) => m.id)
  const s = edit()
  s.swaps = { ...s.swaps, [slot]: nextOption(slot, cur.id, day, taken) }
  s.done = s.done.filter((x) => x !== slot)
  persist()
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
      <p class="count">${isToday() ? '' : `🎮 Prepariamo ${longDate(sel)} · `}Domanda ${step + 1} di ${qs.length}</p>
      <h1 id="q" class="question">${esc(isToday() ? q.q : q.f || q.q)}</h1>
      ${q.weight ? `
        <div class="weigh">
          <label for="w">⚖️ Peso <output id="wo">${lastWeight.toFixed(1).replace('.', ',')} kg</output></label>
          <input id="w" type="range" min="45" max="75" step="0.5" value="${lastWeight}">
          <p class="hint">Resta tra noi 🤫 Serve solo per le proteine: 2 g per ogni chilo.</p>
        </div>
        <button class="btn big" id="go" type="button">Vedi la mia giornata 🎉</button>`
      : `<div class="opts">${q.opts.map(([v, l], i) => `<button type="button" class="opt${answers[q.id] === v ? ' sel' : ''}" data-i="${i}">${esc(l)}</button>`).join('')}</div>`}
      ${step ? '<button class="link back" id="back" type="button">← Indietro</button>' : isToday() ? '<a class="link back" href="#">← Home</a>' : '<a class="link back" href="#calendario">← Calendario</a>'}
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
  Object.assign(edit(), { answers: { day: idxOf(sel), weight: lastWeight, ...answers }, done: [], swaps: {} })
  persist()
  location.hash = at('giorno')
}

// Due righe in confidenza: l'umore dalla home, com'è andata ieri dalle domande.
function chat(a) {
  const ieri = {
    piano: 'E ieri hai seguito il piano: brava! 💪',
    sgarro: 'Ieri uno sgarro? Nessun problema 🍕 Oggi si riparte normale, niente digiuni per compensare.',
    saltato: 'Ieri hai saltato qualcosa: oggi prova a fare tutti i pasti, soprattutto il pranzo al salone 🤗',
  }[a?.ieri]
  return [moodOf(dayState(today).mood)?.say, ieri].filter(Boolean)
}

/* ---------- La mia giornata ---------- */

// Ogni anello si riempie con quello che hai già mangiato, sul totale del giorno.
function ring(label, eaten, total, unit) {
  const r = 26, c = 2 * Math.PI * r, f = total ? Math.min(1, eaten / total) : 0
  return `<figure class="ring">
    <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="${r}" class="ring-bg"/><circle cx="32" cy="32" r="${r}" class="ring-fg" style="stroke-dasharray:${c};stroke-dashoffset:${c * (1 - f)}"/></svg>
    <figcaption><b>${itNum(total)}${unit}</b><span>${label}</span></figcaption></figure>`
}

const short = (d) => (d === today ? 'Oggi' : d === addDays(today, 1) ? 'Domani' : `${DAYS[idxOf(d)].slice(0, 3)} ${fromIso(d).getDate()}`)

function renderDay() {
  restart.hidden = false
  const s = dayState()
  const a = answersFor()
  const plan = planFor()
  const [kcal, p, c, g] = plan.total
  const done = new Set(s.done)
  const ahead = sel > today
  const ate = plan.meals.filter((m) => done.has(m.slot)).reduce((t, m) => t.map((v, i) => v + m.mac[i]), [0, 0, 0, 0])
  const lines = isToday()
    ? [...chat(s.answers), ...(s.answers ? [] : ['Questa è la tua giornata tipo. Se oggi va diversamente, cambiala in un minuto 🙂'])]
    : [s.answers ? `${cap(longDate(sel))} è pronto ⭐ Quel giorno apri l'app e segui gli orari.` : `Questo è il piano tipo di quel giorno. Fai il quiz e lo preparo come vuoi tu 🎮`]
  const prev = addDays(sel, -1), nxt = addDays(sel, 1)

  view.innerHTML = `
    <section class="day" aria-labelledby="d">
      ${backCal()}
      <h1 id="d">${isToday() ? `${plan.day}, ${esc(name)}` : cap(longDate(sel))}</h1>
      <nav class="daynav" aria-label="Altri giorni">
        ${ahead ? `<a href="#giorno/${prev}">‹ ${short(prev)}</a>` : '<span></span>'}
        <a href="#calendario">📅 Calendario</a>
        <a href="#giorno/${nxt}">${short(nxt)} ›</a>
      </nav>
      <div class="chat">${lines.map((l) => `<p>${esc(l)}</p>`).join('')}
        ${s.answers ? '' : `<a class="btn" href="${at('quiz')}">Fai il quiz di questo giorno 🎮</a>`}
        <a class="btn ghost" href="${at('cambia')}">Cambia il piano ✏️</a></div>
      <div class="rings">
        ${ring('kcal', ate[0], kcal, '')}${ring('proteine', ate[1], p, ' g')}${ring('carboidrati', ate[2], c, ' g')}${ring('grassi', ate[3], g, ' g')}
      </div>
      ${ahead ? '' : `<p class="eaten">${done.size ? `Hai già mangiato ${itNum(ate[0])} kcal e ${itNum(ate[1])} g di proteine: ne mancano ${itNum(p - ate[1])} 💪` : 'Spunta i pasti man mano che li mangi ✅'}</p>`}

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
                ${ahead ? '' : `<button type="button" class="btn ${done.has(m.slot) ? 'ghost' : ''} done" data-slot="${m.slot}" aria-pressed="${done.has(m.slot)}">${done.has(m.slot) ? 'Fatto ✅' : 'L\'ho mangiato'}</button>`}
                <button type="button" class="btn ghost swap" data-slot="${m.slot}">Non mi va, cambialo 🔄</button>
              </div>
            </div>
          </li>`).join('')}
      </ol>
      <a class="btn huge ghost" href="${at('spesa')}">🛒 La spesa ${isToday() ? 'di oggi' : 'di questo giorno'}</a>
      <p class="fine">Valori stimati con medie da tabella, sul peso a crudo. Non è una prescrizione medica.</p>
    </section>`

  view.querySelectorAll('.meal-pic img').forEach((img) => img.addEventListener('error', () => img.closest('figure').remove(), { once: true }))
  view.querySelectorAll('.done').forEach((b) => b.addEventListener('click', () => {
    const slot = b.dataset.slot
    const st = edit()
    st.done = done.has(slot) ? st.done.filter((x) => x !== slot) : [...st.done, slot]
    persist()
    renderDay()
  }))
  view.querySelectorAll('.swap').forEach((b) => b.addEventListener('click', () => {
    const slot = b.dataset.slot
    swap(plan, slot, a.day)
    renderDay()
    document.querySelector(`.swap[data-slot="${slot}"]`)?.closest('.meal').scrollIntoView({ block: 'start' })
  }))
}

/* ---------- La spesa ---------- */

// La settimana sono i prossimi 7 giorni da oggi, con le risposte dei giorni già preparati.
const next7 = () => WEEK.map((_, i) => addDays(today, i))

function renderShop(week) {
  restart.hidden = true
  const list = shopping(week ? next7().map((d) => planFor(d)) : [planFor()])
  const have = new Set(dayState(today).have)
  view.innerHTML = `
    <section class="shop-page" aria-labelledby="s">
      ${week ? back : backCal()}
      <h1 id="s">🛒 ${week ? 'Spesa della settimana' : isToday() ? 'Spesa di oggi' : `Spesa di ${longDate(sel)}`}</h1>
      <div class="seg" role="group" aria-label="Periodo">
        <a href="${week ? '#spesa' : at('spesa')}" class="${week ? '' : 'on'}" aria-current="${!week}">${week || isToday() ? 'Oggi' : 'Questo giorno'}</a>
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
    const st = edit(today)
    st.have = cb.checked ? [...st.have, f] : st.have.filter((x) => x !== f)
    cb.closest('.item').classList.toggle('got', cb.checked)
    persist()
  }))
}

/* ---------- La settimana ---------- */

function renderWeek() {
  restart.hidden = true
  view.innerHTML = `
    <section class="week-page" aria-labelledby="w">
      ${back}
      <h1 id="w">🗓️ La mia settimana</h1>
      <ol class="week-list">
        ${next7().map((d) => {
          const p = planFor(d)
          const pr = p.meals.find((m) => m.slot === 'Pranzo'), ce = p.meals.find((m) => m.slot === 'Cena')
          return `<li class="wday${d === today ? ' is-today' : ''}"><a class="wlink" href="#giorno/${d}">
            <h2>${d === today ? 'Oggi' : cap(longDate(d))}${store.days[d]?.answers ? ' ✅' : ''} <small>${itNum(p.total[0])} kcal · ${answersFor(d).training !== 'no' ? '🏋️‍♀️ allenamento' : '🛋️ riposo'}</small></h2>
            <div class="wmeals">
              <figure><img src="${pr.img}" alt="" width="720" height="720" loading="lazy"><figcaption><b>Pranzo</b> ${esc(pr.name)}</figcaption></figure>
              <figure><img src="${ce.img}" alt="" width="720" height="720" loading="lazy"><figcaption><b>Cena</b> ${esc(ce.name)}</figcaption></figure>
            </div>
          </a></li>`
        }).join('')}
      </ol>
      <a class="btn huge" href="#spesa-settimana">🛒 Spesa della settimana</a>
    </section>`
}

/* ---------- Navigazione ---------- */

function route() {
  const [h, d] = location.hash.slice(1).split('/')
  sel = /^\d{4}-\d{2}-\d{2}$/.test(d || '') && d >= today ? d : today
  if (h === 'quiz') { answers = {}; step = 0; renderQuestion() }
  else if (h === 'giorno') renderDay()
  else if (h === 'spesa') renderShop(false)
  else if (h === 'spesa-settimana') renderShop(true)
  else if (h === 'settimana') renderWeek()
  else if (h === 'cambia') renderChange()
  else if (h === 'calendario') renderCalendar()
  else renderHome()
  scrollTo(0, 0)
}
restart.addEventListener('click', () => { location.hash = at('quiz') })
addEventListener('hashchange', route)
route()

// Installata sul telefono, l'app si apre anche senza rete. In sviluppo il service worker resta spento.
if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js')
