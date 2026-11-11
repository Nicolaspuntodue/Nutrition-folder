// npm test: l'assistente gratuito capisce le frasi tipiche di Sofia.
import assert from 'node:assert/strict'
import { answer, disliked } from './assistant.js'
import { MEALS } from './plan.js'

const day = { day: 2, training: 'pomeriggio', breakfast: 'dolce' }
const ask = (t, prefs) => answer(t, day, prefs)
const names = (r) => r.proposals.map((p) => MEALS[p.id].name)

let r = ask('Non mi va la colazione, cosa mangio con calorie simili?')
assert.equal(r.proposals.length, 3); assert.ok(answer('vorrei una colazione dolce', { day: 0, breakfast: 'salata' }).proposals.every((p) => MEALS[p.id].kind === 'dolce')); assert.ok(r.proposals.every((p) => p.slot === 'Colazione'))
r = ask('vorrei una colazione salata')
assert.ok(r.proposals.length === 3 && r.proposals.every((p) => MEALS[p.id].kind === 'salata'), names(r).join())
r = ask('Stasera ho voglia di pesce')
assert.ok(r.proposals.length && r.proposals.every((p) => p.slot === 'Cena'), r.reply)
r = ask('a pranzo voglio il salmone')
assert.ok(names(r).every((n) => /almone/.test(n)), names(r).join())
r = ask('non mi piacciono le uova')
assert.deepEqual(r.learned, ['Non le piace: uova'])
const prefs = r.learned
r = ask('cambiami la colazione salata', prefs)
assert.ok(r.proposals.length && r.proposals.every((p) => !MEALS[p.id].ing.some(([f]) => f === 'Uova')), names(r).join())
assert.ok(disliked('uovaFeta', prefs) && !disliked('toastBresaola', prefs))
r = ask('pranzo senza tonno')
assert.ok(r.proposals.length && r.proposals.every((p) => !MEALS[p.id].ing.some(([f]) => f === 'Tonno al naturale')))
r = ask('quante proteine mangio oggi?')
assert.ok(/proteine/.test(r.reply) && !r.proposals.length)
assert.ok(/pre-allenamento/.test(answer('ho fame prima della palestra', { day: 1, training: 'no' }).reply))
assert.ok(ask('ciao').reply.startsWith('Ciao'))
console.log('assistente ok')
