const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function AllMetrics({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const actual = [];
  const predicted = [];
  
  for (let i = 0; i < 10; i++) {
    actual.push(Math.floor(rng() * 30) + 10);
    predicted.push(actual[i] + Math.floor(rng() * 10) - 5);
  }
  
  const errors = actual.map((a, i) => a - predicted[i]);
  const squaredErrors = errors.map(e => e * e);
  
  const sse = squaredErrors.reduce((a, b) => a + b, 0);
  const mse = sse / actual.length;
  const rmse = Math.sqrt(mse);
  const mae = errors.map(e => Math.abs(e)).reduce((a, b) => a + b, 0) / actual.length;
  
  const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
  const ssTot = actual.reduce((sum, y) => sum + Math.pow(y - mean, 2), 0);
  const r2 = 1 - (sse / ssTot);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Calculate SSE, MSE, RMSE, MAE, and R²:'),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Actual'),
              h('th', { className: 'text-left p-2 border-b' }, 'Predicted')
            )
          ),
          h('tbody', null,
            ...actual.map((val, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, val),
                h('td', { className: 'p-2 border-b' }, predicted[i])
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('div', { className: 'overflow-x-auto' },
          h('table', { className: 'w-full text-sm bg-blue-50' },
            h('thead', null,
              h('tr', null,
                h('th', { className: 'border p-2' }, 'Actual'),
                h('th', { className: 'border p-2' }, 'Predicted'),
                h('th', { className: 'border p-2' }, 'Error'),
                h('th', { className: 'border p-2' }, 'Error²')
              )
            ),
            h('tbody', null,
              ...actual.map((val, i) =>
                h('tr', { key: i },
                  h('td', { className: 'border p-2 text-center' }, val),
                  h('td', { className: 'border p-2 text-center' }, predicted[i]),
                  h('td', { className: 'border p-2 text-center' }, errors[i].toFixed(2)),
                  h('td', { className: 'border p-2 text-center' }, squaredErrors[i].toFixed(2))
                )
              )
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('div', { className: 'space-y-2' },
            h('p', { className: 'font-semibold' }, 'Results:'),
            h('p', null, `SSE = ${sse.toFixed(2)}`),
            h('p', null, `MSE = SSE/n = ${sse.toFixed(2)}/${actual.length} = ${mse.toFixed(2)}`),
            h('p', null, `RMSE = √MSE = ${rmse.toFixed(2)}`),
            h('p', null, `MAE = ${mae.toFixed(2)}`),
            h('p', null, `R² = 1-(SSE/SSTot) = 1-(${sse.toFixed(2)}/${ssTot.toFixed(2)}) = ${r2.toFixed(3)}`)
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: SSE sums squared errors. MSE is average. RMSE is in original units. R² measures variance explained.'
        )
      )
    )
  );
}
