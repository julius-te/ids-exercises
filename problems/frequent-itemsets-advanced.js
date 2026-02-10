const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function FpGrowth({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const transactions = [
    ['A', 'B', 'C'],
    ['A', 'B'],
    ['A', 'C'],
    ['B', 'C'],
    ['A', 'B', 'C'],
    ['A', 'C']
  ];
  
  const minSupport = 3;
  
  const itemCounts = {};
  transactions.forEach(t => {
    t.forEach(item => {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    });
  });
  
  const frequentItems = Object.entries(itemCounts)
    .filter(([item, count]) => count >= minSupport)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  
  const orderedTransactions = transactions.map(t => 
    t.filter(item => itemCounts[item] >= minSupport)
     .sort((a, b) => {
       const countDiff = itemCounts[b] - itemCounts[a];
       return countDiff !== 0 ? countDiff : a.localeCompare(b);
     })
  );
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Build FP-tree (minimum support = ${minSupport}):`),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        ...transactions.map((t, i) =>
          h('div', { key: i, className: 'font-mono text-sm' },
            `T${i + 1}: {${t.join(', ')}}`
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Find frequent items'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
          ...frequentItems.map(([item, count]) =>
            h('p', { key: item }, `${item}: ${count} transactions`)
          )
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Order transactions by frequency'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
          ...orderedTransactions.map((t, i) =>
            h('p', { key: i }, `T${i + 1}: [${t.join(', ')}]`)
          )
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Step 3: Build FP-tree'),
        h('div', { className: 'bg-green-50 p-4 rounded' },
          h('pre', { className: 'font-mono text-xs whitespace-pre' },
            '         root\n' +
            '          |\n' +
            `       A:${orderedTransactions.filter(t => t[0] === 'A').length}\n` +
            '       /  \\\n' +
            '      /    \\\n' +
            `   B:${orderedTransactions.filter(t => t[0] === 'A' && t[1] === 'B').length}    C:${orderedTransactions.filter(t => t[0] === 'A' && t[1] === 'C').length}\n` +
            '   /        \\\n' +
            ` C:${orderedTransactions.filter(t => t[0] === 'A' && t[1] === 'B' && t.includes('C')).length}       (leaf)\n` +
            '\n' +
            'Additional branches from root:\n' +
            `B:${orderedTransactions.filter(t => t[0] === 'B').length} -> C:${orderedTransactions.filter(t => t[0] === 'B' && t[1] === 'C').length}`
          )
        ),
        h('p', { className: 'font-semibold mt-4' }, 'Header table (links):'),
        h('div', { className: 'bg-green-50 p-4 rounded text-sm' },
          ...frequentItems.map(([item, count]) =>
            h('p', { key: item }, `${item}: points to all ${item} nodes in tree`)
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: FP-Growth builds a compressed prefix tree. Frequent items ordered by frequency. Paths share common prefixes for compression.'
        )
      )
    )
  );
}

export function DiscriminatoryItemsets({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const transactions = [
    { items: ['A', 'B'], protected: 'M' },
    { items: ['A', 'C'], protected: 'M' },
    { items: ['A', 'B'], protected: 'M' },
    { items: ['B', 'C'], protected: 'F' },
    { items: ['A', 'C'], protected: 'F' },
    { items: ['A', 'B', 'C'], protected: 'F' }
  ];
  
  const k = 0.3;
  const itemset = ['A', 'B'];
  
  const maleCount = transactions.filter(t => t.protected === 'M').length;
  const femaleCount = transactions.filter(t => t.protected === 'F').length;
  
  const maleWithItemset = transactions.filter(t => 
    t.protected === 'M' && itemset.every(item => t.items.includes(item))
  ).length;
  
  const femaleWithItemset = transactions.filter(t => 
    t.protected === 'F' && itemset.every(item => t.items.includes(item))
  ).length;
  
  const maleSupport = maleWithItemset / maleCount;
  const femaleSupport = femaleWithItemset / femaleCount;
  const discrimination = Math.abs(maleSupport - femaleSupport);
  
  const isDiscriminatory = discrimination >= k;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Is itemset {${itemset.join(', ')}} ${k}-discriminatory with respect to gender?`),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Transaction'),
              h('th', { className: 'text-left p-2 border-b' }, 'Items'),
              h('th', { className: 'text-left p-2 border-b' }, 'Gender')
            )
          ),
          h('tbody', null,
            ...transactions.map((t, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, i + 1),
                h('td', { className: 'p-2 border-b' }, `{${t.items.join(', ')}}`),
                h('td', { className: 'p-2 border-b' }, t.protected)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate support per group'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
          h('p', null, `Male transactions: ${maleCount}`),
          h('p', null, `Male with {${itemset.join(', ')}}: ${maleWithItemset}`),
          h('p', null, `Male support: ${maleWithItemset}/${maleCount} = ${maleSupport.toFixed(3)}`),
          h('p', { className: 'mt-2' }, `Female transactions: ${femaleCount}`),
          h('p', null, `Female with {${itemset.join(', ')}}: ${femaleWithItemset}`),
          h('p', null, `Female support: ${femaleWithItemset}/${femaleCount} = ${femaleSupport.toFixed(3)}`)
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Calculate discrimination'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
          h('p', null, `Discrimination = |${maleSupport.toFixed(3)} - ${femaleSupport.toFixed(3)}| = ${discrimination.toFixed(3)}`),
          h('p', null, `Threshold k = ${k}`)
        ),
        h('div', { className: isDiscriminatory ? 'bg-red-50' : 'bg-green-50' + ' p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, 
            isDiscriminatory 
              ? `✗ YES, itemset is ${k}-discriminatory (${discrimination.toFixed(3)} ≥ ${k})`
              : `✓ NO, itemset is not ${k}-discriminatory (${discrimination.toFixed(3)} < ${k})`
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          `Explanation: An itemset is k-discriminatory if |support(itemset|protected=A) - support(itemset|protected=B)| ≥ k`
        )
      )
    )
  );
}

export function AssociationRuleRelationship({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Given the following relationships, what can you infer?'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-2' },
        h('p', { className: 'font-mono' }, 'support(A ∪ B) < support(A ∪ C)'),
        h('p', { className: 'font-mono' }, 'confidence(A → B) > confidence(A → C)'),
        h('p', { className: 'mt-4' }, 'What can we infer about support(A)?')
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Key formulas:'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm space-y-1' },
          h('p', null, 'support(A ∪ B) = P(A ∩ B)'),
          h('p', null, 'confidence(A → B) = support(A ∪ B) / support(A)'),
          h('p', null, 'confidence(A → C) = support(A ∪ C) / support(A)')
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Analysis:'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm space-y-2' },
          h('p', null, 'Given: support(A ∪ B) < support(A ∪ C)'),
          h('p', null, 'Given: confidence(A → B) > confidence(A → C)'),
          h('p', { className: 'mt-2' }, 'This means:'),
          h('p', { className: 'ml-4' }, 'support(A ∪ B) / support(A) > support(A ∪ C) / support(A)'),
          h('p', { className: 'ml-4' }, 'support(A ∪ B) > support(A ∪ C)'),
          h('p', { className: 'mt-2 font-semibold text-red-600' }, 'CONTRADICTION!')
        ),
        h('div', { className: 'bg-yellow-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, 'Conclusion:'),
          h('p', { className: 'text-sm' }, 'These conditions cannot occur simultaneously. The scenario is impossible.')
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: If support(A∪B) < support(A∪C), then confidence(A→B) cannot be greater than confidence(A→C) since they share the same denominator.'
        )
      )
    )
  );
}
