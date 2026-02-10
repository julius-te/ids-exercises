const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function MinMax({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const values = [];
  for (let i = 0; i < 8; i++) {
    values.push(Math.floor(rng() * 90) + 10);
  }
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const newMin = Math.floor(rng() * 5);
  const newMax = newMin + Math.floor(rng() * 5) + 5;
  
  const normalized = values.map(v => 
    newMin + ((v - min) / (max - min)) * (newMax - newMin)
  );
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Normalize the following values using Min-Max normalization to the range [${newMin}, ${newMax}]:`),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono' },
        values.join(', ')
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', null, `Min = ${min}, Max = ${max}`),
        h('p', null, `Formula: newValue = newMin + ((value - min) / (max - min)) × (newMax - newMin)`),
        h('p', null, `Formula: newValue = ${newMin} + ((value - ${min}) / (${max} - ${min})) × (${newMax} - ${newMin})`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-2' },
          h('div', { className: 'font-mono text-sm space-y-1' },
            ...values.map((v, i) => 
              h('div', { key: i }, `${v} → ${normalized[i].toFixed(2)}`)
            )
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Min-Max normalization scales values to a specific range by applying a linear transformation.'
        )
      )
    )
  );
}

export function StandardScore({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const values = [];
  for (let i = 0; i < 8; i++) {
    values.push(Math.floor(rng() * 40) + 20);
  }
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  const standardized = values.map(v => (v - mean) / stdDev);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Normalize using Standard Score (Z-score):'),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono' }, values.join(', '))
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', null, `Mean (μ) = ${mean.toFixed(2)}`),
        h('p', null, `Standard Deviation (σ) = ${stdDev.toFixed(2)}`),
        h('p', null, `Formula: z = (value - μ) / σ`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-2' },
          h('div', { className: 'font-mono text-sm space-y-1' },
            ...values.map((v, i) => h('div', { key: i }, `${v} → ${standardized[i].toFixed(2)}`))
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Z-score normalization transforms data to have mean 0 and standard deviation 1.'
        )
      )
    )
  );
}

export function DecimalScaling({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const values = [];
  const magnitude = Math.floor(rng() * 3) + 2;
  
  for (let i = 0; i < 6; i++) {
    values.push(Math.floor(rng() * 900 + 100) * Math.pow(10, magnitude - 2));
  }
  
  const maxAbs = Math.max(...values.map(Math.abs));
  const j = Math.ceil(Math.log10(maxAbs));
  const normalized = values.map(v => v / Math.pow(10, j));
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Normalize using Decimal Scaling:'),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono' }, values.join(', '))
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', null, `Maximum absolute value = ${maxAbs}`),
        h('p', null, `j = ${j} (smallest integer such that max(|normalized|) < 1)`),
        h('p', null, `Formula: newValue = value / 10^j = value / ${Math.pow(10, j)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-2' },
          h('div', { className: 'font-mono text-sm space-y-1' },
            ...values.map((v, i) => h('div', { key: i }, `${v} → ${normalized[i].toFixed(4)}`))
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Decimal scaling normalizes by moving the decimal point.'
        )
      )
    )
  );
}
