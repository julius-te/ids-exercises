const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function ArModel({ showSolution, seed }) {
  const chartRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  let rng = () => { seed++; return seededRandom(seed); };
  
  const n = 8;
  const series = [];
  for (let i = 0; i < n; i++) {
    series.push(Math.floor(rng() * 10) + 10);
  }
  
  const phi = rng() * 0.6 + 0.2;
  const c = Math.floor(rng() * 5) + 5;
  
  const forecast = c + phi * series[series.length - 1];
  
  const actualNext = Math.floor(rng() * 10) + 10;
  const error = Math.abs(forecast - actualNext);
  
  React.useEffect(() => {
    if (showSolution && canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      
      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [...series.map((_, i) => `t-${n-i}`), 't', 't+1'],
          datasets: [{
            label: 'Actual',
            data: [...series, actualNext, null],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            pointRadius: 5
          }, {
            label: 'Forecast',
            data: [...Array(n).fill(null), forecast, forecast],
            borderColor: '#EF4444',
            borderDash: [5, 5],
            pointRadius: 5,
            pointStyle: 'star'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'AR(1) Time Series Forecast'
            }
          },
          scales: {
            y: {
              beginAtZero: false
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
      h('p', { className: 'mb-2' }, 'Calculate forecast and error for AR(1) model:'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-2' },
        h('p', null, `Series: ${series.join(', ')}`),
        h('p', null, `AR(1): x_t = ${c} + ${phi.toFixed(3)} × x_{t-1}`),
        h('p', null, `Actual next value: ${actualNext}`)
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'mb-4', style: { height: '300px' } },
        h('canvas', { ref: canvasRef })
      ),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate forecast'),
        h('p', null, `Forecast = ${c} + ${phi.toFixed(3)} × ${series[series.length - 1]}`),
        h('p', null, `Forecast = ${forecast.toFixed(2)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Calculate error'),
        h('p', null, `MAE = |forecast - actual| = |${forecast.toFixed(2)} - ${actualNext}| = ${error.toFixed(2)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `Forecast: ${forecast.toFixed(2)}`),
          h('p', null, `Error (MAE): ${error.toFixed(2)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: AR(1) predicts next value using previous value with coefficient φ.'
        )
      )
    )
  );
}

export function MaModel({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const n = 8;
  const series = [];
  const errors = [];
  for (let i = 0; i < n; i++) {
    series.push(Math.floor(rng() * 10) + 10);
    if (i < n - 1) errors.push((rng() - 0.5) * 4);
  }
  
  const theta = rng() * 0.6 + 0.2;
  const mu = series.reduce((a, b) => a + b, 0) / series.length;
  
  const forecast = mu + theta * errors[errors.length - 1];
  const actualNext = Math.floor(rng() * 10) + 10;
  const error = Math.abs(forecast - actualNext);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Calculate forecast and error for MA(1) model:'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-2 text-sm' },
        h('p', null, `Series: ${series.join(', ')}`),
        h('p', null, `Previous errors: ${errors.map(e => e.toFixed(2)).join(', ')}`),
        h('p', null, `MA(1): x_t = μ + ${theta.toFixed(3)} × ε_{t-1}`),
        h('p', null, `Actual next value: ${actualNext}`)
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate mean'),
        h('p', null, `μ = ${mu.toFixed(2)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Calculate forecast'),
        h('p', null, `Forecast = ${mu.toFixed(2)} + ${theta.toFixed(3)} × ${errors[errors.length - 1].toFixed(2)}`),
        h('p', null, `Forecast = ${forecast.toFixed(2)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 3: Calculate error'),
        h('p', null, `MAE = |${forecast.toFixed(2)} - ${actualNext}| = ${error.toFixed(2)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `Forecast: ${forecast.toFixed(2)}`),
          h('p', null, `Error (MAE): ${error.toFixed(2)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: MA(1) predicts using mean plus weighted previous error term.'
        )
      )
    )
  );
}

export function Arima({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const n = 6;
  const series = [];
  for (let i = 0; i < n; i++) {
    series.push(Math.floor(rng() * 10) + 10);
  }
  
  const d = 1;
  const differenced = [];
  for (let i = 1; i < series.length; i++) {
    differenced.push(series[i] - series[i-1]);
  }
  
  const phi = 0.5;
  const forecast_diff = phi * differenced[differenced.length - 1];
  const forecast = series[series.length - 1] + forecast_diff;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Apply ARIMA(1,1,0) to forecast next value:'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-2' },
        h('p', null, `Series: ${series.join(', ')}`),
        h('p', null, `AR coefficient φ = ${phi}`)
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Difference series (d=1)'),
        h('p', { className: 'font-mono text-sm' }, `Differenced: ${differenced.join(', ')}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Apply AR(1) to differenced series'),
        h('p', null, `Forecast_diff = ${phi} × ${differenced[differenced.length - 1]} = ${forecast_diff.toFixed(2)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 3: Integrate back'),
        h('p', null, `Forecast = ${series[series.length - 1]} + ${forecast_diff.toFixed(2)} = ${forecast.toFixed(2)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `Forecast: ${forecast.toFixed(2)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: ARIMA(p,d,q) = differencing (I) + AR(p) + MA(q). Here: difference once, then AR(1).'
        )
      )
    )
  );
}

export function Arma({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const n = 6;
  const series = [];
  for (let i = 0; i < n; i++) {
    series.push(Math.floor(rng() * 10) + 10);
  }
  
  const phi = 0.6;
  const theta = 0.4;
  const mu = series.reduce((a, b) => a + b, 0) / series.length;
  const lastError = (rng() - 0.5) * 3;
  
  const forecast = mu + phi * (series[series.length - 1] - mu) + theta * lastError;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Calculate forecast using ARMA(1,1):'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-2' },
        h('p', null, `Series: ${series.join(', ')}`),
        h('p', null, `Previous error: ε = ${lastError.toFixed(2)}`),
        h('p', null, `φ = ${phi}, θ = ${theta}`)
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate mean'),
        h('p', null, `μ = ${mu.toFixed(2)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Apply ARMA(1,1)'),
        h('p', null, `x_t = μ + φ(x_{t-1} - μ) + θε_{t-1}`),
        h('p', null, `Forecast = ${mu.toFixed(2)} + ${phi}×(${series[series.length - 1]} - ${mu.toFixed(2)}) + ${theta}×${lastError.toFixed(2)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `Forecast = ${forecast.toFixed(2)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: ARMA combines AR (autoregressive) and MA (moving average) components.'
        )
      )
    )
  );
}
