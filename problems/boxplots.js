const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function DrawFromData({ showSolution, seed }) {
  const plotId = React.useId();
  let rng = () => { seed++; return seededRandom(seed); };
  
  const values = [];
  for (let i = 0; i < 12; i++) {
    values.push(Math.floor(rng() * 60) + 20);
  }
  values.sort((a, b) => a - b);
  
  const q1Index = Math.floor(values.length / 4);
  const q3Index = Math.floor(3 * values.length / 4);
  const medianIndex = Math.floor(values.length / 2);
  
  const q1 = values[q1Index];
  const q3 = values[q3Index];
  const median = values[medianIndex];
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  
  React.useEffect(() => {
    if (showSolution) {
      Plotly.newPlot(plotId, [{
        y: values,
        type: 'box',
        name: 'Data',
        marker: { color: '#3B82F6' },
        boxmean: true
      }], {
        title: 'Box Plot',
        yaxis: { title: 'Values' }
      }, { responsive: true });
    }
  }, [showSolution, plotId]);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Calculate Q1, Q3, IQR, and lower and upper fences for a boxplot:'),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono' }, values.join(', '))
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { id: plotId, className: 'mb-4', style: { width: '100%', height: '400px' } }),
      h('div', { className: 'space-y-2' },
        h('p', null, `Q1 (1st quartile, 25th percentile) = ${q1}`),
        h('p', null, `Median = ${median}`),
        h('p', null, `Q3 (3rd quartile, 75th percentile) = ${q3}`),
        h('p', null, `IQR = Q3 - Q1 = ${q3} - ${q1} = ${iqr}`),
        h('p', null, `Lower fence = Q1 - 1.5 × IQR = ${q1} - 1.5 × ${iqr} = ${lowerFence.toFixed(1)}`),
        h('p', null, `Upper fence = Q3 + 1.5 × IQR = ${q3} + 1.5 × ${iqr} = ${upperFence.toFixed(1)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('div', { className: 'font-semibold mb-2' }, 'Summary:'),
          h('div', { className: 'space-y-1 text-sm' },
            h('div', null, `Q1 = ${q1}`),
            h('div', null, `Median = ${median}`),
            h('div', null, `Q3 = ${q3}`),
            h('div', null, `IQR = ${iqr}`),
            h('div', null, `Lower fence = ${lowerFence.toFixed(1)}`),
            h('div', null, `Upper fence = ${upperFence.toFixed(1)}`)
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Q1 is at position n/4, Q3 at position 3n/4 in sorted data. IQR measures spread of middle 50%. Fences identify potential outliers.'
        )
      )
    )
  );
}
