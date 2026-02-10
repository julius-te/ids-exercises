const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function Apriori({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const transactions = [];
  const items = ['A', 'B', 'C', 'D', 'E'];
  const numTransactions = 8;
  
  for (let i = 0; i < numTransactions; i++) {
    const numItems = Math.floor(rng() * 3) + 2;
    const selectedItems = new Set();
    
    while (selectedItems.size < numItems) {
      selectedItems.add(items[Math.floor(rng() * items.length)]);
    }
    
    transactions.push(Array.from(selectedItems).sort());
  }
  
  const minSupport = Math.floor(numTransactions * 0.3);
  
  const itemCounts = {};
  items.forEach(item => {
    itemCounts[item] = transactions.filter(t => t.includes(item)).length;
  });
  
  const frequentItems = Object.entries(itemCounts)
    .filter(([item, count]) => count >= minSupport)
    .map(([item, count]) => ({ itemset: [item], support: count }))
    .sort((a, b) => b.support - a.support);
  
  const pairs = [];
  for (let i = 0; i < frequentItems.length; i++) {
    for (let j = i + 1; j < frequentItems.length; j++) {
      const itemset = [frequentItems[i].itemset[0], frequentItems[j].itemset[0]].sort();
      const support = transactions.filter(t => 
        itemset.every(item => t.includes(item))
      ).length;
      if (support >= minSupport) {
        pairs.push({ itemset, support });
      }
    }
  }
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Apply Apriori with minimum support = ${minSupport}:`),
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
      h('div', { className: 'space-y-4' },
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Step 1: Count 1-itemsets'),
          h('div', { className: 'bg-blue-50 p-4 rounded' },
            ...Object.entries(itemCounts).map(([item, count]) =>
              h('div', { key: item, className: 'text-sm' }, 
                `{${item}}: ${count} ${count >= minSupport ? '✓ frequent' : '✗ infrequent'}`
              )
            )
          )
        ),
        frequentItems.length > 0 && h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Frequent 1-itemsets:'),
          h('div', { className: 'bg-green-50 p-4 rounded' },
            ...frequentItems.map((item, i) =>
              h('div', { key: i, className: 'text-sm' }, 
                `{${item.itemset.join(', ')}}: ${item.support}`
              )
            )
          )
        ),
        pairs.length > 0 && h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Step 2: Generate 2-itemsets'),
          h('div', { className: 'bg-green-50 p-4 rounded' },
            ...pairs.map((pair, i) =>
              h('div', { key: i, className: 'text-sm' }, 
                `{${pair.itemset.join(', ')}}: ${pair.support}`
              )
            )
          )
        ),
        h('p', { className: 'text-sm text-gray-700' }, 
          'Explanation: Apriori finds frequent itemsets level-wise. Uses downward closure: all subsets of frequent itemset must be frequent.'
        )
      )
    )
  );
}
