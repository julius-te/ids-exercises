const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function SequenceSupport({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const sequences = [
    [['A', 'B'], ['C']],
    [['A'], ['B', 'C']],
    [['A', 'B'], ['C'], ['D']],
    [['B'], ['C']],
    [['A'], ['C']]
  ];
  
  const targetSeq = [['A'], ['C']];
  const minSupport = 3;
  
  const contains = (seq, subseq) => {
    let j = 0;
    for (let i = 0; i < seq.length && j < subseq.length; i++) {
      const itemset = seq[i];
      const targetItemset = subseq[j];
      if (targetItemset.every(item => itemset.includes(item))) {
        j++;
      }
    }
    return j === subseq.length;
  };
  
  let support = 0;
  const supporting = [];
  sequences.forEach((seq, i) => {
    if (contains(seq, targetSeq)) {
      support++;
      supporting.push(i + 1);
    }
  });
  
  const isFrequent = support >= minSupport;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Calculate support for sequence <{A}, {C}> (min support = ${minSupport}):`),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-1 text-sm' },
        ...sequences.map((seq, i) =>
          h('div', { key: i, className: 'font-mono' },
            `S${i+1}: <${seq.map(itemset => `{${itemset.join(',')}}`).join(', ')}>`
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Check which sequences contain <{A}, {C}>:'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
          ...sequences.map((seq, i) => {
            const match = contains(seq, targetSeq);
            return h('p', { key: i }, 
              `S${i+1}: ${match ? '✓ Contains' : '✗ Does not contain'} <{A}, {C}>`
            );
          })
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `Support = ${support}/${sequences.length}`),
          h('p', null, `Supporting sequences: S${supporting.join(', S')}`),
          h('p', { className: 'mt-2 font-semibold' }, 
            isFrequent ? `✓ Frequent (≥ ${minSupport})` : `✗ Not frequent (< ${minSupport})`
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Sequence S contains subsequence s if all itemsets of s appear in S in order (not necessarily consecutively).'
        )
      )
    )
  );
}

export function SequenceConfidence({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const sequences = [
    [['A'], ['B'], ['C']],
    [['A'], ['C']],
    [['A'], ['B'], ['C'], ['D']],
    [['B'], ['C']],
    [['A'], ['C'], ['B']]
  ];
  
  const antecedent = [['A']];
  const consequent = [['C']];
  const fullRule = [['A'], ['C']];
  
  const contains = (seq, subseq) => {
    let j = 0;
    for (let i = 0; i < seq.length && j < subseq.length; i++) {
      const itemset = seq[i];
      const targetItemset = subseq[j];
      if (targetItemset.every(item => itemset.includes(item))) {
        j++;
      }
    }
    return j === subseq.length;
  };
  
  let supportA = 0;
  let supportAC = 0;
  
  sequences.forEach(seq => {
    if (contains(seq, antecedent)) supportA++;
    if (contains(seq, fullRule)) supportAC++;
  });
  
  const confidence = supportA > 0 ? supportAC / supportA : 0;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Calculate confidence for sequence rule <{A}> → <{C}>:'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-1 text-sm' },
        ...sequences.map((seq, i) =>
          h('div', { key: i, className: 'font-mono' },
            `S${i+1}: <${seq.map(itemset => `{${itemset.join(',')}}`).join(', ')}>`
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Count sequences with <{A}>'),
        h('p', null, `Support(<{A}>) = ${supportA}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Count sequences with <{A}, {C}>'),
        h('p', null, `Support(<{A}, {C}>) = ${supportAC}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, 'Confidence:'),
          h('p', null, `Confidence = Support(<{A}, {C}>) / Support(<{A}>)`),
          h('p', null, `Confidence = ${supportAC}/${supportA} = ${confidence.toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          `Confidence = ${(confidence * 100).toFixed(1)}% of sequences containing A also contain C after A.`
        )
      )
    )
  );
}

export function DescribeAsItemsets({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const sequence = [['A', 'B'], ['C'], ['D', 'E']];
  
  const allItems = new Set();
  sequence.forEach(itemset => itemset.forEach(item => allItems.add(item)));
  const items = Array.from(allItems).sort();
  
  const itemsets = [];
  items.forEach(item => {
    const positions = [];
    sequence.forEach((set, i) => {
      if (set.includes(item)) positions.push(i + 1);
    });
    itemsets.push({ item, positions });
  });
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Describe this sequence as a set of (item, position) pairs:'),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono text-center' },
        `<${sequence.map(s => `{${s.join(',')}}`).join(', ')}>`
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Itemset representation:'),
        h('div', { className: 'bg-green-50 p-4 rounded' },
          h('div', { className: 'font-mono text-sm space-y-1' },
            ...itemsets.map((item, i) =>
              h('p', { key: i }, `(${item.item}, ${item.positions.join(',')})`)
            )
          )
        ),
        h('p', { className: 'mt-4 text-sm text-gray-700' }, 
          'Explanation: Each item is paired with its position(s) in the sequence. Multiple positions mean item appears in multiple itemsets.'
        )
      )
    )
  );
}

export function AprioriAll({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const sequences = [
    [['A'], ['B'], ['C']],
    [['A'], ['C']],
    [['A'], ['B'], ['C']],
    [['B'], ['C']]
  ];
  
  const minSupport = 2;
  
  const contains = (seq, subseq) => {
    let j = 0;
    for (let i = 0; i < seq.length && j < subseq.length; i++) {
      if (seq[i].includes(subseq[j][0])) {
        j++;
      }
    }
    return j === subseq.length;
  };
  
  const oneSeqs = [
    { seq: [['A']], support: sequences.filter(s => contains(s, [['A']])).length },
    { seq: [['B']], support: sequences.filter(s => contains(s, [['B']])).length },
    { seq: [['C']], support: sequences.filter(s => contains(s, [['C']])).length }
  ].filter(s => s.support >= minSupport);
  
  const twoSeqs = [
    { seq: [['A'], ['B']], support: sequences.filter(s => contains(s, [['A'], ['B']])).length },
    { seq: [['A'], ['C']], support: sequences.filter(s => contains(s, [['A'], ['C']])).length },
    { seq: [['B'], ['C']], support: sequences.filter(s => contains(s, [['B'], ['C']])).length }
  ].filter(s => s.support >= minSupport);
  
  const threeSeqs = [
    { seq: [['A'], ['B'], ['C']], support: sequences.filter(s => contains(s, [['A'], ['B'], ['C']])).length }
  ].filter(s => s.support >= minSupport);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Apply AprioriAll algorithm (min support = ${minSupport}):`),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-1 text-sm' },
        ...sequences.map((seq, i) =>
          h('div', { key: i, className: 'font-mono' },
            `S${i+1}: <${seq.map(itemset => `{${itemset.join(',')}}`).join(', ')}>`
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-3' },
        h('div', null,
          h('p', { className: 'font-semibold' }, 'Level 1: Frequent 1-sequences'),
          h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
            ...oneSeqs.map((s, i) =>
              h('p', { key: i }, `<{${s.seq[0][0]}>: support = ${s.support}`)
            )
          )
        ),
        twoSeqs.length > 0 && h('div', null,
          h('p', { className: 'font-semibold' }, 'Level 2: Frequent 2-sequences'),
          h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
            ...twoSeqs.map((s, i) =>
              h('p', { key: i }, 
                `<${s.seq.map(is => `{${is.join(',')}}`).join(', ')}>: support = ${s.support}`
              )
            )
          )
        ),
        threeSeqs.length > 0 && h('div', null,
          h('p', { className: 'font-semibold' }, 'Level 3: Frequent 3-sequences'),
          h('div', { className: 'bg-green-50 p-4 rounded text-sm' },
            ...threeSeqs.map((s, i) =>
              h('p', { key: i }, 
                `<${s.seq.map(is => `{${is.join(',')}}`).join(', ')}>: support = ${s.support}`
              )
            )
          )
        ),
        h('p', { className: 'mt-4 text-sm text-gray-700' }, 
          'Explanation: AprioriAll finds frequent sequences level-wise. Uses anti-monotonicity: subsequences of frequent sequences must be frequent.'
        )
      )
    )
  );
}
