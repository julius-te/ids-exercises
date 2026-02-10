const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function EqualWidth({ showSolution, seed }) {
  const chartRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  let rng = () => { seed++; return seededRandom(seed); };
  
  const values = [];
  for (let i = 0; i < 15; i++) {
    values.push(Math.floor(rng() * 90) + 10);
  }
  values.sort((a, b) => a - b);
  
  const numBins = Math.floor(rng() * 2) + 3;
  const binWidth = (Math.max(...values) - Math.min(...values)) / numBins;
  
  const bins = [];
  for (let i = 0; i < numBins; i++) {
    const binMin = Math.min(...values) + i * binWidth;
    const binMax = binMin + binWidth;
    const binValues = values.filter(v => v >= binMin && (i === numBins - 1 ? v <= binMax : v < binMax));
    const binMean = binValues.length > 0 ? binValues.reduce((a, b) => a + b, 0) / binValues.length : binMin + binWidth / 2;
    bins.push({
      range: `[${binMin.toFixed(1)}, ${binMax.toFixed(1)}${i === numBins - 1 ? ']' : ')'}`,
      values: binValues,
      mean: binMean
    });
  }
  
  const smoothed = values.map(v => {
    const bin = bins.find(b => b.values.includes(v));
    return bin ? bin.mean : v;
  });
  
  React.useEffect(() => {
    if (showSolution && canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      
      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: values.map((_, i) => `V${i+1}`),
          datasets: [{
            label: 'Original',
            data: values,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: '#3B82F6',
            borderWidth: 1
          }, {
            label: 'Smoothed',
            data: smoothed,
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            borderColor: '#EF4444',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Equal-Width Binning with Smoothing'
            }
          }
        }
      });
    }
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [showSolution]);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Apply equal-width binning with ${numBins} bins and smooth by bin means:`),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono' }, values.join(', '))
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'mb-4', style: { height: '300px' } },
        h('canvas', { ref: canvasRef })
      ),
      h('div', { className: 'space-y-2' },
        h('p', null, `Bin width = (${Math.max(...values)} - ${Math.min(...values)}) / ${numBins} = ${binWidth.toFixed(2)}`),
        h('div', { className: 'space-y-2 mt-2' },
          ...bins.map((bin, i) =>
            h('div', { key: i, className: 'bg-blue-50 p-3 rounded' },
              h('div', { className: 'font-semibold' }, `Bin ${i + 1}: ${bin.range}`),
              h('div', { className: 'font-mono text-sm' }, `Values: ${bin.values.join(', ')}`),
              h('div', { className: 'text-sm' }, `Mean: ${bin.mean.toFixed(2)}`)
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-2' },
          h('div', { className: 'font-semibold mb-1' }, 'Smoothed values:'),
          h('div', { className: 'font-mono text-sm' }, smoothed.map(v => v.toFixed(2)).join(', '))
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Equal-width binning divides the range into bins of equal size.'
        )
      )
    )
  );
}

export function EqualFrequency({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const values = [];
  for (let i = 0; i < 15; i++) {
    values.push(Math.floor(rng() * 90) + 10);
  }
  values.sort((a, b) => a - b);
  
  const numBins = Math.floor(rng() * 2) + 3;
  const binSize = Math.floor(values.length / numBins);
  
  const bins = [];
  for (let i = 0; i < numBins; i++) {
    const start = i * binSize;
    const end = i === numBins - 1 ? values.length : (i + 1) * binSize;
    const binValues = values.slice(start, end);
    const binMean = binValues.reduce((a, b) => a + b, 0) / binValues.length;
    bins.push({ values: binValues, mean: binMean });
  }
  
  const smoothed = values.map(v => {
    const bin = bins.find(b => b.values.includes(v));
    return bin ? bin.mean : v;
  });
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Apply equal-frequency binning with ${numBins} bins and smooth by bin means:`),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono' }, values.join(', '))
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', null, `Each bin should contain approximately ${binSize} values`),
        h('div', { className: 'space-y-2 mt-2' },
          ...bins.map((bin, i) =>
            h('div', { key: i, className: 'bg-blue-50 p-3 rounded' },
              h('div', { className: 'font-semibold' }, `Bin ${i + 1}:`),
              h('div', { className: 'font-mono text-sm' }, `Values: ${bin.values.join(', ')}`),
              h('div', { className: 'text-sm' }, `Mean: ${bin.mean.toFixed(2)}`)
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-2' },
          h('div', { className: 'font-semibold mb-1' }, 'Smoothed values:'),
          h('div', { className: 'font-mono text-sm' }, smoothed.map(v => v.toFixed(2)).join(', '))
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Equal-frequency binning creates bins with approximately the same number of values.'
        )
      )
    )
  );
}
