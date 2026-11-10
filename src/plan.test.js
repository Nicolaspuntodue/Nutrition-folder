// npm test: controlla il piano su ogni giorno e ogni combinazione di risposte.
import assert from 'node:assert/strict'
import { buildDay, shopping, WEEK, MEALS, options, nextOption, CRAVINGS } from './plan.js'

for (let day = 0; day < 7; day++) {
  for (const work of [true, false]) for (const training of ['no', 'mattina', 'pomeriggio', 'sera'])
    for (const breakfast of ['dolce', 'salata']) {
      const p = buildDay({ day, work, training, breakfast, wake: '07:00', lunch: '13:30', weight: 58, hunger: 'normale' })
      const slots = p.meals.map((m) => m.slot)
      assert.ok(!slots.some((n) => /Spuntino|Merenda/.test(n)), 'niente spuntini')
      assert.equal(slots.includes('Pre-allenamento'), training !== 'no')
      for (let i = 1; i < p.meals.length; i++) assert.ok(p.meals[i].at > p.meals[i - 1].at, `orari in ordine ${p.day}`)
      for (const m of p.meals) for (const [f, g] of m.ing) {
        if (f === 'Riso') assert.ok(g >= 70 && g <= 80, 'riso 70-80 g')
        if (f === 'Petto di pollo' || f === 'Manzo macinato magro') assert.equal(g, 250, `${f} 250 g`)
      }
      const col = p.meals.find((m) => m.slot === 'Colazione').name
      if (/Yogurt greco/.test(col)) assert.ok(day === 1 || day === 4, `yogurt solo mar e ven, non ${p.day}`)
      if (breakfast === 'salata') assert.ok(!/Yogurt|Latte|Pancake/.test(col), 'colazione salata')
      const off = Math.abs(p.total[0] - p.goal.kcal)
      // Sabato (pizza) e domenica (burger) hanno pochi carboidrati elastici: tolleranza più larga.
      assert.ok(off < (day >= 5 ? 450 : 200), `${p.day} ${work} ${training} ${breakfast}: ${Math.round(p.total[0])} vs ${p.goal.kcal}`)
      assert.ok(p.total[1] >= 95, `${p.day} proteine ${Math.round(p.total[1])}`)
    }
}
// Ogni alternativa di "Cambia piatto", su ogni giorno, rispetta le stesse regole.
for (let day = 0; day < 7; day++) for (const slot of ['Colazione', 'Pranzo', 'Cena', 'Pre-allenamento']) {
  const base = buildDay({ day, training: 'pomeriggio', breakfast: 'dolce' }).meals.find((m) => m.slot === slot)
  for (const id of options(slot, base.id, day)) {
    const p = buildDay({ day, training: 'pomeriggio', breakfast: 'dolce', swaps: { [slot]: id } })
    const m = p.meals.find((x) => x.slot === slot)
    assert.equal(m.id, id)
    for (const [f, g] of m.ing) {
      if (f === 'Riso') assert.ok(g >= 70 && g <= 80, `riso in ${id}`)
      if (['Petto di pollo', 'Petto di tacchino', 'Manzo macinato magro'].includes(f)) assert.equal(g, 250, `${f} in ${id}`)
    }
    if (/Yogurt greco/.test(m.name)) assert.ok(day === 1 || day === 4, `yogurt in ${p.day}`)
    assert.ok(Math.abs(p.total[0] - p.goal.kcal) < (day >= 5 ? 450 : 260), `${p.day} ${id}: ${Math.round(p.total[0])} vs ${p.goal.kcal}`)
  }
}
for (let k = 0; k < 200; k++) {
  const pick = nextOption('Pre-allenamento', 'gallette', 0, [])
  assert.ok(pick !== 'gallette' && options('Pre-allenamento', 'gallette', 0).includes(pick), 'alternativa casuale valida')
  assert.ok(!['salmoneRiso', 'polloPatateDolci'].includes(nextOption('Pranzo', 'salmoneRiso', 0, ['polloPatateDolci'])), 'mai il piatto attuale o uno già nel giorno')
}
// La voglia del giorno finisce sempre in tavola, a pranzo o a cena.
for (let day = 0; day < 7; day++) for (const craving of Object.keys(CRAVINGS)) {
  const p = buildDay({ day, craving })
  const ids = p.meals.filter((m) => m.slot === 'Pranzo' || m.slot === 'Cena').map((m) => m.id)
  assert.ok(ids.some((id) => CRAVINGS[craving].includes(id)), `${p.day}: voglia di ${craving} non accontentata`)
  for (const m of p.meals) for (const [f, g] of m.ing) if (f === 'Riso') assert.ok(g >= 70 && g <= 80)
}
const week = WEEK.map((_, day) => buildDay({ day, training: [0, 2, 4].includes(day) ? 'pomeriggio' : 'no' }))
assert.ok(shopping(week).length >= 5)
console.log('ok\n' + week.map((p) => `${p.day} ${Math.round(p.total[0])}/${p.goal.kcal} kcal, P${Math.round(p.total[1])}`).join('\n'))
