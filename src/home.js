import './home.css'
import { createPhotoStage } from './photo-stage.js'
import { buildDay, itNum, DAYS } from './plan.js'

const $ = (s) => document.querySelector(s)
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

// Hero: un lunedì vero di Sofia, con allenamento alle 17. Lo scroll scorre i pasti sul piatto.
const monday = buildDay({ day: 0, work: true, training: 'pomeriggio', wake: '07:00', lunch: '13:30', breakfast: 'salata' })
const steps = $('#steps')
steps.innerHTML = monday.meals.map((m) => `
  <li><span class="t">${m.time}</span><span class="s">${m.slot}</span><span class="n">${m.name}</span><span class="k">${itNum(m.mac[0])} kcal · ${itNum(m.mac[1])} g proteine</span></li>`).join('')
const items = [...steps.children]

let plate = null
try { plate = createPhotoStage($('#plate'), monday.meals.map((m) => m.img)) } catch { $('.frame').classList.add('no-gl') }

let active = -1
function onScroll() {
  const r = $('.hero').getBoundingClientRect()
  const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)))
  const i = Math.min(items.length - 1, Math.floor(p * items.length))
  if (i !== active) {
    active = i
    items.forEach((li, k) => li.classList.toggle('on', k === i))
    plate?.show(i)
    $('#plate-fallback').src = monday.meals[i].img
  }
  plate?.setTilt(p)
  document.documentElement.style.setProperty('--hero-p', p.toFixed(3))
}
addEventListener('scroll', onScroll, { passive: true })
onScroll()

// Come funziona: un cursore a quattro fasi che cambia frase e frammento dell'app.
const stages = [
  { clause: 'Prima, qualche domanda', p: "Ti svegli, apri l'app e rispondi: che giorno è, se lavori al salone, se ti alleni e a che ora, se la colazione la vuoi dolce o salata.",
    ui: `<p class="q">Ti alleni oggi?</p><div class="chips"><span>No</span><span>Mattina</span><span class="sel">Pomeriggio</span><span>Sera</span></div><p class="hint">Domanda 5 di 8</p>` },
  { clause: 'Poi, la tua giornata', p: 'Ogni pasto con il suo orario, le grammature e i macro. Se ti alleni alle 17, il pre-allenamento arriva alle 15:45.',
    ui: monday.meals.map((m) => `<div class="tl"><b>${m.time}</b><span>${m.slot}</span><em>${itNum(m.mac[0])} kcal</em></div>`).join('') +
      `<div class="tl tot"><b>Totale</b><span>${itNum(monday.total[1])} g proteine</span><em>${itNum(monday.total[0])} kcal</em></div>` },
  { clause: 'Quindi, la spesa giusta', p: 'La lista di quello che serve oggi, già sommata. Spunti quello che hai in casa e resta solo cosa comprare.',
    ui: monday.meals.flatMap((m) => m.ing).filter(([f]) => f !== 'Olio extravergine').slice(0, 7)
      .map(([f, g], i) => `<label class="li"><input type="checkbox" ${i < 2 ? 'checked' : ''} tabindex="-1"><span>${f}</span><em>${g} g</em></label>`).join('') },
  { clause: 'Infine, spunta i pasti', p: 'Segni quello che hai mangiato e vedi quanto manca alle proteine del giorno.',
    ui: monday.meals.map((m, i) => `<label class="li"><input type="checkbox" ${i < 2 ? 'checked' : ''} tabindex="-1"><span>${m.slot}</span><em>${m.time}</em></label>`).join('') +
      `<p class="hint">2 pasti su ${monday.meals.length} · ${itNum(monday.meals[0].mac[1] + monday.meals[1].mac[1])} di ${itNum(monday.total[1])} g di proteine</p>` },
]
const range = $('#stage-range'), names = [...$('#stage-names').children]
function setStage(i) {
  const s = stages[i]
  $('#how-title').textContent = s.clause
  $('#how-p').textContent = s.p
  const frag = $('#frag')
  frag.classList.remove('show')
  frag.innerHTML = s.ui
  requestAnimationFrame(() => frag.classList.add('show'))
  names.forEach((n, k) => n.classList.toggle('on', k === i))
  $('#track').style.setProperty('--fill', `${(i / 3) * 100}%`)
}
range.addEventListener('input', () => setStage(+range.value))
names.forEach((n, k) => n.addEventListener('click', () => { range.value = k; setStage(k) }))
setStage(0)

// La settimana: righe con la foto del piatto in margine.
const picks = [
  [0, 'pranzo', 'Pranzo a casa nel giorno libero, poi pollo e patate dolci la sera.'],
  [2, 'pranzo', "Si mangiano freddi tra un cliente e l'altro: si preparano la sera prima."],
  [4, 'pranzo', 'Si scalda in un minuto al salone: tre settori e una riga di sriracha.'],
  [5, 'cena', 'Il sabato sera è libero, ed è già nei conti della giornata.'],
  [3, 'cena', 'Giorno di riposo: bistecca, avocado e patate dolci al forno.'],
]
$('#rows').innerHTML = picks.map(([d, slot, line], i) => {
  const p = buildDay({ day: d, work: true, training: [0, 2, 4].includes(d) ? 'pomeriggio' : 'no' })
  const m = p.meals.find((x) => x.slot.toLowerCase() === slot)
  return `<li class="row r${i % 3}" data-rise>
    <div class="row-text"><h3>${DAYS[d]}: ${m.name.split(' con ')[0].split(',')[0].toLowerCase()}</h3>
      <p>${line} ${m.name}: ${itNum(m.mac[0])} kcal e ${itNum(m.mac[1])} g di proteine. La giornata intera fa ${itNum(p.total[0])} kcal.</p></div>
    <figure class="row-pic"><img src="${m.img}" alt="${m.name}, visto dall'alto" width="800" height="800" loading="lazy"></figure>
  </li>`
}).join('')
document.querySelectorAll('.row-pic img').forEach((img) => img.addEventListener('error', () => img.closest('figure').classList.add('empty'), { once: true }))

// Il peso: proteine = 2 g per chilo, ricalcolate a ogni movimento.
const kg = $('#kg')
kg.addEventListener('input', () => {
  const w = +kg.value
  $('#kg-out').textContent = `${w.toFixed(1).replace('.', ',')} kg`
  $('#protein').textContent = Math.round(w * 2)
})

// Entrate: ogni blocco sale una volta quando entra nello schermo.
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.2 })
document.querySelectorAll('[data-rise]').forEach((el) => (reduce ? el.classList.add('in') : io.observe(el)))
