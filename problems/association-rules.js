const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function ComputeMetrics({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const transactions = [];
  const items = ['A', 'B', 'C', 'D'];
  
  for (let i = 0; i < 10; i++) {
    const numItems = Math.floor(rng() * 3) + 2;
    const selectedItems = new Set();
    while (selectedItems.size < numItems) {
      selectedItems.add(items[Math.floor(rng() * items.length)]);
    }
    transactions.push(Array.from(selectedItems).sort());
  }
  
  const itemsetA = ['A', 'B'];
  const itemsetB = ['B', 'C'];
  
  const countA = transactions.filter(t => itemsetA.every(item => t.includes(item))).length;
  const countB = transactions.filter(t => itemsetB.every(item => t.includes(item))).length;
  const countAB = transactions.filter(t => 
    [...itemsetA, ...itemsetB].filter((v, i, a) => a.indexOf(v) === i).every(item => t.includes(item))
  ).length;
  
  const supportA = countA / transactions.length;
  const supportB = countB / transactions.length;
  const supportAB = countAB / transactions.length;
  
  const confidence = countA > 0 ? countAB / countA : 0;
  const lift = supportB > 0 ? confidence / supportB : 0;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Compute support, confidence, and lift for rule {${itemsetA.join(',')}} → {${itemsetB.join(',')}}:`),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('div', { className: 'font-mono text-sm' },
          ...transactions.map((t, i) =>
            h('div', { key: i }, `T${i + 1}: {${t.join(', ')}}`)
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Count occurrences'),
        h('p', null, `Transactions with {${itemsetA.join(',')}}: ${countA}`),
        h('p', null, `Transactions with {${itemsetB.join(',')}}: ${countB}`),
        h('p', null, `Transactions with both: ${countAB}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Calculate metrics'),
        h('p', null, `Support({${itemsetA.join(',')}}) = ${countA}/${transactions.length} = ${supportA.toFixed(3)}`),
        h('p', null, `Support({${itemsetB.join(',')}}) = ${countB}/${transactions.length} = ${supportB.toFixed(3)}`),
        h('p', null, `Support({${itemsetA.join(',')}} ∪ {${itemsetB.join(',')}}) = ${countAB}/${transactions.length} = ${supportAB.toFixed(3)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Results:'),
          h('p', null, `Confidence = Support(A∪B) / Support(A) = ${supportAB.toFixed(3)} / ${supportA.toFixed(3)} = ${confidence.toFixed(3)}`),
          h('p', null, `Lift = Confidence / Support(B) = ${confidence.toFixed(3)} / ${supportB.toFixed(3)} = ${lift.toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Support = frequency. Confidence = P(B|A). Lift > 1 means positive correlation.'
        )
      )
    )
  );
}
