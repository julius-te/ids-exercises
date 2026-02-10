const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function KAnonymity({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const data = [
    { age: 25, zip: '10001', disease: 'Flu' },
    { age: 25, zip: '10001', disease: 'Cold' },
    { age: 27, zip: '10002', disease: 'Cancer' },
    { age: 27, zip: '10002', disease: 'Diabetes' },
    { age: 30, zip: '10003', disease: 'Flu' },
    { age: 30, zip: '10003', disease: 'Cold' }
  ];
  
  const k = 2;
  
  const anonymized = [
    { age: '25-27', zip: '1000*', disease: 'Flu' },
    { age: '25-27', zip: '1000*', disease: 'Cold' },
    { age: '25-27', zip: '1000*', disease: 'Cancer' },
    { age: '25-27', zip: '1000*', disease: 'Diabetes' },
    { age: '30-30', zip: '1000*', disease: 'Flu' },
    { age: '30-30', zip: '1000*', disease: 'Cold' }
  ];
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Anonymize this dataset to achieve ${k}-anonymity:`),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Age'),
              h('th', { className: 'text-left p-2 border-b' }, 'ZIP'),
              h('th', { className: 'text-left p-2 border-b' }, 'Disease')
            )
          ),
          h('tbody', null,
            ...data.map((row, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, row.age),
                h('td', { className: 'p-2 border-b' }, row.zip),
                h('td', { className: 'p-2 border-b' }, row.disease)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, `${k}-Anonymity: Each record indistinguishable from at least ${k}-1 others`),
        h('p', null, 'Quasi-identifiers: Age, ZIP (not Disease - sensitive attribute)'),
        h('p', { className: 'font-semibold mt-3' }, 'Anonymized dataset:'),
        h('div', { className: 'bg-green-50 p-4 rounded overflow-x-auto' },
          h('table', { className: 'w-full text-sm' },
            h('thead', null,
              h('tr', null,
                h('th', { className: 'text-left p-2 border-b' }, 'Age'),
                h('th', { className: 'text-left p-2 border-b' }, 'ZIP'),
                h('th', { className: 'text-left p-2 border-b' }, 'Disease')
              )
            ),
            h('tbody', null,
              ...anonymized.map((row, i) =>
                h('tr', { key: i },
                  h('td', { className: 'p-2 border-b' }, row.age),
                  h('td', { className: 'p-2 border-b' }, row.zip),
                  h('td', { className: 'p-2 border-b' }, row.disease)
                )
              )
            )
          )
        ),
        h('p', { className: 'font-semibold mt-4' }, 'Verification:'),
        h('p', { className: 'ml-4 text-sm' }, 'Group 1 (Age 25-27, ZIP 1000*): 4 records ✓'),
        h('p', { className: 'ml-4 text-sm' }, 'Group 2 (Age 30-30, ZIP 1000*): 2 records ✓'),
        h('p', { className: 'ml-4 text-sm' }, `Each group has ≥ ${k} records: ${k}-anonymity achieved!`),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Generalization (ranges) and suppression (*) make records less specific to prevent re-identification.'
        )
      )
    )
  );
}

export function LDiversity({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const data = [
    { age: '25-27', zip: '1000*', disease: 'Flu' },
    { age: '25-27', zip: '1000*', disease: 'Cold' },
    { age: '25-27', zip: '1000*', disease: 'Flu' },
    { age: '25-27', zip: '1000*', disease: 'Cold' },
    { age: '30-32', zip: '1000*', disease: 'Cancer' },
    { age: '30-32', zip: '1000*', disease: 'Diabetes' }
  ];
  
  const l = 2;
  
  const group1Diseases = data.slice(0, 4).map(d => d.disease);
  const group2Diseases = data.slice(4, 6).map(d => d.disease);
  
  const group1Unique = new Set(group1Diseases).size;
  const group2Unique = new Set(group2Diseases).size;
  
  const satisfiesLDiversity = group1Unique >= l && group2Unique >= l;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Check if this ${l}-anonymous dataset satisfies ${l}-diversity:`),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Age'),
              h('th', { className: 'text-left p-2 border-b' }, 'ZIP'),
              h('th', { className: 'text-left p-2 border-b' }, 'Disease')
            )
          ),
          h('tbody', null,
            ...data.map((row, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, row.age),
                h('td', { className: 'p-2 border-b' }, row.zip),
                h('td', { className: 'p-2 border-b' }, row.disease)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, `${l}-Diversity: Each equivalence class has ≥ ${l} distinct sensitive values`),
        h('div', { className: 'bg-blue-50 p-4 rounded mt-3' },
          h('p', { className: 'font-semibold mb-2' }, 'Group 1 (Age 25-27):'),
          h('p', { className: 'ml-4 text-sm' }, `Diseases: ${group1Diseases.join(', ')}`),
          h('p', { className: 'ml-4 text-sm' }, `Distinct values: ${group1Unique} ${group1Unique >= l ? '✓' : '✗'}`),
          h('p', { className: 'font-semibold mt-3 mb-2' }, 'Group 2 (Age 30-32):'),
          h('p', { className: 'ml-4 text-sm' }, `Diseases: ${group2Diseases.join(', ')}`),
          h('p', { className: 'ml-4 text-sm' }, `Distinct values: ${group2Unique} ${group2Unique >= l ? '✓' : '✗'}`)
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, 
            satisfiesLDiversity 
              ? `✓ Dataset satisfies ${l}-diversity` 
              : `✗ Dataset does NOT satisfy ${l}-diversity`
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: l-diversity prevents homogeneity attacks by requiring diversity in sensitive attributes within each group.'
        )
      )
    )
  );
}
