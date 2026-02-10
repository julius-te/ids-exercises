const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function ComputeMetrics({ showSolution, seed }) {
  const plotId = React.useId();
  let rng = () => { seed++; return seededRandom(seed); };
  
  const predictions = [];
  const actuals = [];
  
  for (let i = 0; i < 12; i++) {
    const actual = rng() > 0.5 ? 'Positive' : 'Negative';
    const prediction = rng() > 0.4 ? actual : (actual === 'Positive' ? 'Negative' : 'Positive');
    predictions.push(prediction);
    actuals.push(actual);
  }
  
  let tp = 0, tn = 0, fp = 0, fn = 0;
  for (let i = 0; i < predictions.length; i++) {
    if (actuals[i] === 'Positive' && predictions[i] === 'Positive') tp++;
    else if (actuals[i] === 'Negative' && predictions[i] === 'Negative') tn++;
    else if (actuals[i] === 'Negative' && predictions[i] === 'Positive') fp++;
    else if (actuals[i] === 'Positive' && predictions[i] === 'Negative') fn++;
  }
  
  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const accuracy = (tp + tn) / (tp + tn + fp + fn);
  const f1 = 2 * (precision * recall) / (precision + recall);
  
  React.useEffect(() => {
    if (showSolution) {
      Plotly.newPlot(plotId, [{
        z: [[tp, fn], [fp, tn]],
        x: ['Predicted Positive', 'Predicted Negative'],
        y: ['Actual Positive', 'Actual Negative'],
        type: 'heatmap',
        colorscale: 'Blues',
        showscale: true,
        text: [[`TP: ${tp}`, `FN: ${fn}`], [`FP: ${fp}`, `TN: ${tn}`]],
        texttemplate: '%{text}',
        textfont: { size: 16 }
      }], {
        title: 'Confusion Matrix',
        xaxis: { side: 'top' },
        yaxis: { autorange: 'reversed' }
      }, { responsive: true });
    }
  }, [showSolution, plotId]);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Compute confusion matrix and calculate precision, recall, accuracy, F1:'),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Actual'),
              h('th', { className: 'text-left p-2 border-b' }, 'Predicted')
            )
          ),
          h('tbody', null,
            ...actuals.map((actual, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, actual),
                h('td', { className: 'p-2 border-b' }, predictions[i])
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { id: plotId, className: 'mb-4', style: { width: '100%', height: '400px' } }),
      h('div', { className: 'space-y-4' },
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Confusion Matrix:'),
          h('table', { className: 'border-collapse bg-blue-50' },
            h('thead', null,
              h('tr', null,
                h('th', { className: 'border p-2' }),
                h('th', { className: 'border p-2', colSpan: 2 }, 'Predicted')
              ),
              h('tr', null,
                h('th', { className: 'border p-2' }),
                h('th', { className: 'border p-2' }, 'Positive'),
                h('th', { className: 'border p-2' }, 'Negative')
              )
            ),
            h('tbody', null,
              h('tr', null,
                h('th', { className: 'border p-2', rowSpan: 2 }, 'Actual'),
                h('th', { className: 'border p-2' }, 'Positive'),
                h('td', { className: 'border p-2 text-center font-semibold' }, tp),
                h('td', { className: 'border p-2 text-center font-semibold' }, fn)
              ),
              h('tr', null,
                h('th', { className: 'border p-2' }, 'Negative'),
                h('td', { className: 'border p-2 text-center font-semibold' }, fp),
                h('td', { className: 'border p-2 text-center font-semibold' }, tn)
              )
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded' },
          h('p', { className: 'font-semibold mb-2' }, 'Metrics:'),
          h('div', { className: 'space-y-1 text-sm' },
            h('p', null, `TP = ${tp}, TN = ${tn}, FP = ${fp}, FN = ${fn}`),
            h('p', null, `Precision = TP/(TP+FP) = ${tp}/${tp+fp} = ${precision.toFixed(3)}`),
            h('p', null, `Recall = TP/(TP+FN) = ${tp}/${tp+fn} = ${recall.toFixed(3)}`),
            h('p', null, `Accuracy = (TP+TN)/Total = ${(tp+tn)}/${tp+tn+fp+fn} = ${accuracy.toFixed(3)}`),
            h('p', null, `F1 = 2×(P×R)/(P+R) = ${f1.toFixed(3)}`)
          )
        ),
        h('p', { className: 'text-sm text-gray-700' }, 
          'Explanation: Precision = how many predicted positives are correct. Recall = how many actual positives were found.'
        )
      )
    )
  );
}
