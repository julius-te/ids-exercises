const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function Coefficient({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const n = 10;
  const series = [];
  for (let i = 0; i < n; i++) {
    series.push(Math.floor(rng() * 20) + 10);
  }
  
  const lag = Math.floor(rng() * 3) + 1;
  
  const mean = series.reduce((a, b) => a + b, 0) / series.length;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < series.length - lag; i++) {
    numerator += (series[i] - mean) * (series[i + lag] - mean);
  }
  
  for (let i = 0; i < series.length; i++) {
    denominator += Math.pow(series[i] - mean, 2);
  }
  
  const acf = numerator / denominator;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Calculate the autocorrelation coefficient at lag ${lag}:`),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono text-sm' },
        series.join(', ')
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate mean'),
        h('p', null, `Mean = ${mean.toFixed(2)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Calculate autocorrelation'),
        h('p', null, `ACF(${lag}) = Σ[(x_t - mean)(x_{t+${lag}} - mean)] / Σ[(x_t - mean)²]`),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm mt-2' },
          h('p', null, `Numerator = ${numerator.toFixed(2)}`),
          h('p', null, `Denominator = ${denominator.toFixed(2)}`)
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `ACF(${lag}) = ${acf.toFixed(4)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: ACF measures correlation between observations at different time lags. Range: [-1, 1].'
        )
      )
    )
  );
}

export function AcfPlot({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const n = 12;
  const series = [];
  for (let i = 0; i < n; i++) {
    series.push(Math.floor(rng() * 20) + 10);
  }
  
  const mean = series.reduce((a, b) => a + b, 0) / series.length;
  const maxLag = 4;
  const acfValues = [];
  
  for (let lag = 0; lag <= maxLag; lag++) {
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < series.length - lag; i++) {
      numerator += (series[i] - mean) * (series[i + lag] - mean);
    }
    
    for (let i = 0; i < series.length; i++) {
      denominator += Math.pow(series[i] - mean, 2);
    }
    
    acfValues.push({ lag, value: numerator / denominator });
  }
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Calculate ACF values for lags 0-${maxLag} and describe the plot:`),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono text-sm' },
        series.join(', ')
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'ACF Values:'),
        h('div', { className: 'bg-blue-50 p-4 rounded space-y-1' },
          ...acfValues.map(acf =>
            h('div', { key: acf.lag, className: 'flex items-center gap-2' },
              h('span', { className: 'w-16' }, `Lag ${acf.lag}:`),
              h('span', { className: 'font-mono' }, acf.value.toFixed(4)),
              h('div', { 
                className: 'bg-blue-600 h-4', 
                style: { width: `${Math.abs(acf.value) * 100}px` }
              })
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Plot Description:'),
          h('p', { className: 'text-sm' }, 'ACF plot shows vertical bars at each lag with height = ACF value.'),
          h('p', { className: 'text-sm' }, 'ACF(0) always = 1 (perfect correlation with itself).'),
          h('p', { className: 'text-sm' }, 'Values outside ±1.96/√n indicate significant correlation.')
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: ACF plot helps identify patterns and seasonality in time series data.'
        )
      )
    )
  );
}

export function MovingAverage({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const n = 10;
  const series = [];
  for (let i = 0; i < n; i++) {
    series.push(Math.floor(rng() * 20) + 10);
  }
  
  const window = Math.floor(rng() * 2) + 3;
  
  const ma = [];
  for (let i = 0; i <= series.length - window; i++) {
    const sum = series.slice(i, i + window).reduce((a, b) => a + b, 0);
    ma.push(sum / window);
  }
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Calculate the ${window}-period moving average:`),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono text-sm' },
        series.join(', ')
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, `${window}-period Moving Average:`),
        h('div', { className: 'bg-blue-50 p-4 rounded space-y-1 text-sm' },
          ...ma.map((val, i) => {
            const values = series.slice(i, i + window);
            return h('div', { key: i },
              h('p', null, `MA[${i+1}] = (${values.join(' + ')}) / ${window} = ${val.toFixed(2)}`)
            );
          })
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Result:'),
          h('p', { className: 'font-mono text-sm' }, ma.map(v => v.toFixed(2)).join(', '))
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Moving average smooths time series by averaging over sliding window. Reduces noise, highlights trends.'
        )
      )
    )
  );
}
