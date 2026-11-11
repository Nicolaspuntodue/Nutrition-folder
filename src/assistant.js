// L'assistente di Sofia, gratis e senza internet: capisce le frasi più comuni sul cibo,
// cerca nel catalogo piatti con calorie simili e si ricorda i gusti che lei racconta.
// ponytail: regole sulle parole, non un'AI vera; frasi molto strane non le capisce.
import { MEALS, FOODS, CRAVINGS, similar, breakfasts, buildDay, itNum } from './plan.js'

const SLOTS = [[/colazion/, 'Colazione'], [/pranz/, 'Pranzo'], [/cena|stasera/, 'Cena'], [/allen|palestra|spuntin|merend/, 'Pre-allenamento']]
const CATS = [[/past[ae]\b|spaghett|rigaton|gnocch/, 'pasta'], [/\bris[oi]\b|risott/, 'riso'], [/carne|poll|tacchin|manz|bistecc|polpett/, 'carne'], [/pesce|salmon|tonn|merluzz|gamber/, 'pesce']]
const NO = /non mi (piace|piacciono|va|vanno)|odio|non lo sopporto|fa schifo|non (lo|la|li|le) mangio/
const YES = /mi piace|mi piacciono|adoro|amo |vado matta/
const STOP = new Set(['di', 'd', 'al', 'in', 'per', 'parz', 'scatola', 'magro', 'magra', 'integrale', 'integrali', 'extravergine', 'light', '2%', 'a', 'fette', 'lessate'])
const stem = (w) => w.toLowerCase().replace(/[^a-zàèéìòù]/g, '').replace(/[aeiouàèéìòù]$/, '')
const label = (slot) => ({ Colazione: 'la colazione', Pranzo: 'il pranzo', Cena: 'la cena', 'Pre-allenamento': 'il pre-allenamento' })[slot]

// Ogni parola di un alimento porta all'alimento: "pollo" → Petto di pollo, "pane" → i due pani.
const VOCAB = new Map()
for (const f of Object.keys(FOODS)) for (const w of f.split(/[\s']+/)) {
  if (STOP.has(w.toLowerCase()) || (f === 'Fiocchi di latte' && w === 'latte')) continue
  const k = stem(w)
  if (k.length > 2) VOCAB.set(k, [...(VOCAB.get(k) || []), f])
}
const foodsIn = (text) => [...new Set(text.split(/\s+/).flatMap((w) => VOCAB.get(stem(w)) || []))]

// "Non le piace: latte" / "Le piace: Pasta al pesto": dal testo salvato ai piatti da evitare o preferire.
const parsePref = (p) => { const m = String(p).match(/^(Non le piace|Le piace): (.+)$/); return m && { no: m[1] === 'Non le piace', what: m[2] } }
const hits = (id, what) => MEALS[id].name === what || MEALS[id].ing.some(([f]) => foodsIn(what.toLowerCase()).includes(f))

export function disliked(id, prefs) {
  return !!MEALS[id] && prefs.map(parsePref).some((p) => p?.no && hits(id, p.what))
}

export function answer(text, input, prefs = []) {
  const t = ` ${text.toLowerCase()} `
  const clauses = t.split(/[,.;!?]| ma | però /)
  const learned = []
  for (const c of clauses) {
    const food = c.split(/\s+/).find((w) => VOCAB.has(stem(w)))
    if (!food) continue
    if (NO.test(c)) learned.push(`Non le piace: ${food}`)
    else if (YES.test(c)) learned.push(`Le piace: ${food}`)
  }
  const all = [...prefs.filter((p) => !learned.some((l) => parsePref(l).what === parsePref(p)?.what)), ...learned]
  const plan = buildDay(input)
  const say = learned.length ? `Me lo segno 📝 ${learned.map((l) => (l.startsWith('Non') ? `niente ${parsePref(l).what}` : `${parsePref(l).what} sì`)).join(', ')}. ` : ''

  // Domande sui numeri del giorno.
  if (/protein|calori|kcal|macro|quant/.test(t) && !/cambi|altro|altra|alternativ|invece|simil/.test(t)) {
    const [k, p, c, g] = plan.total
    return { learned, proposals: [], reply: `${say}Oggi il tuo piano fa ${itNum(k)} kcal: ${itNum(p)} g di proteine, ${itNum(c)} g di carboidrati e ${itNum(g)} g di grassi. Le proteine che ti servono sono ${plan.goal.protein} g 💪` }
  }

  let slot = SLOTS.find(([re]) => re.test(t))?.[1]
  // Ha solo detto cosa non le piace: cerco se è già nel piano di oggi.
  if (!slot && learned.length) slot = plan.meals.find((m) => learned.some((l) => l.startsWith('Non') && MEALS[m.id] && hits(m.id, parsePref(l).what)))?.slot
  if (!slot && /fame|spuntin/.test(t)) slot = plan.meals.some((m) => m.slot === 'Pre-allenamento') ? 'Pre-allenamento' : null
  const asks = /cambi|altro|altra|alternativ|consigl|cosa mangio|idea|voglia|vorrei/.test(t)
  if (!slot && !CATS.some(([re]) => re.test(t)) && !asks) {
    return { learned, proposals: [], reply: learned.length ? `${say}Non ti proporrò più piatti così 💚`
      : /^\s*(ciao|buongiorno|buonasera|hey)/.test(t) ? 'Ciao 😊 Dimmi pure: vuoi cambiare un pasto, hai voglia di qualcosa o c\'è qualcosa che non ti piace?'
        : /grazie/.test(t) ? 'Di niente 💚 Sono qui quando vuoi.'
          : 'Puoi chiedermi per esempio "cambiami la colazione", "stasera ho voglia di pesce" o dirmi cosa non ti piace, e me lo ricordo 😊' }
  }
  slot ||= CATS.some(([re]) => re.test(t)) ? (plan.meals.some((m) => m.slot === 'Pranzo') ? 'Pranzo' : 'Cena') : plan.meals[0].slot
  const cur = plan.meals.find((m) => m.slot === slot)
  if (!cur) return { learned, proposals: [], reply: `${say}Oggi non ti alleni, quindi niente pre-allenamento. Se hai fame tra un pasto e l'altro, una banana o due gallette vanno benissimo 🍌` }

  const cat = CATS.find(([re]) => re.test(t))?.[1]
  const without = clauses.filter((c) => /senza|niente/.test(c)).flatMap(foodsIn)
  const want = clauses.filter((c) => !NO.test(c) && !/senza|niente/.test(c)).flatMap(foodsIn)
  const kind = slot === 'Colazione' && (/dolc/.test(t) ? 'dolce' : /salat/.test(t) ? 'salata' : null)
  const liked = all.map(parsePref).filter((p) => p && !p.no)

  let list = similar(input, slot, Infinity, kind ? breakfasts(input.day) : undefined)
    .filter((m) => MEALS[m.id] && !disliked(m.id, all) && !m.ing.some(([f]) => without.includes(f)))
    .filter((m) => !kind || MEALS[m.id].kind === kind)
    .filter((m) => !cat || slot === 'Colazione' || slot === 'Pre-allenamento' || CRAVINGS[cat].includes(m.id))
  const wanted = want.filter((f) => !list.length || list.some((m) => m.ing.some(([x]) => x === f)))
  if (wanted.length) list = list.filter((m) => m.ing.some(([f]) => wanted.includes(f)))
  if (/leggero|leggera|light/.test(t)) list.sort((a, b) => a.mac[0] - b.mac[0])
  else list = list.map((m) => ({ ...m, off: m.off - (liked.some((p) => hits(m.id, p.what)) ? 120 : 0) })).sort((a, b) => a.off - b.off)
  list = list.slice(0, 3)

  if (!list.length) return { learned, proposals: [], reply: `${say}Con queste richieste non trovo niente per ${label(slot)} 😅 Prova a chiedermelo in un altro modo.` }
  const what = [kind, cat, ...wanted.slice(0, 1).map((f) => `con ${f.toLowerCase()}`)].filter(Boolean).join(', ')
  return {
    learned,
    proposals: list.map((m) => ({ slot, id: m.id })),
    reply: `${say}Ecco ${list.length === 1 ? 'un\'idea' : `${list.length} idee`} per ${label(slot)}${what ? ` (${what})` : ''}, con calorie simili a quello che avevi 😊`,
  }
}
