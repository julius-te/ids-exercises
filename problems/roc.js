const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function PlotCurve({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const points = [
    { threshold: 0.9, tpr: 0.2, fpr: 0.05 },
    { threshold: 0.7, tpr: 0.5, fpr: 0.15 },
    { threshold: 0.5, tpr: 0.7, fpr: 0.3 },
    { threshold: 0.3, tpr: 0.85, fpr: 0.5 },
    { threshold: 0.1, tpr: 0.95, fpr: 0.8 }
  ];
  
  const auc = 0.5 * (
    (points[0].fpr + 0) * (points[0].tpr + 0) +
    (points[1].fpr - points[0].fpr) * (points[1].tpr + points[0].tpr) +
    (points[2].fpr - points[1].fpr) * (points[2].tpr + points[1].tpr) +
    (points[3].fpr - points[2].fpr) * (points[3].tpr + points[2].tpr) +
    (points[4].fpr - points[3].fpr) * (points[4].tpr + points[3].tpr) +
    (1 - points[4].fpr) * (1 + points[4].tpr)
  );
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Plot the ROC curve and calculate AUC for these threshold values:'),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Threshold'),
              h('th', { className: 'text-left p-2 border-b' }, 'TPR'),
              h('th', { className: 'text-left p-2 border-b' }, 'FPR')
            )
          ),
          h('tbody', null,
            ...points.map((p, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, p.threshold),
                h('td', { className: 'p-2 border-b' }, p.tpr),
                h('td', { className: 'p-2 border-b' }, p.fpr)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'ROC Curve Points:'),
        h('p', null, 'Start: (0, 0), End: (1, 1)'),
        ...points.map((p, i) =>
          h('p', { key: i, className: 'ml-4' }, `Threshold ${p.threshold}: (${p.fpr}, ${p.tpr})`)
        ),
        h('div', { className: 'bg-blue-50 p-4 rounded mt-4' },
          h('p', { className: 'text-sm italic' }, 'ROC curve: Plot FPR (x-axis) vs TPR (y-axis)'),
          h('p', { className: 'text-sm italic' }, 'Connect points: (0,0) → ' + points.map(p => `(${p.fpr},${p.tpr})`).join(' → ') + ' → (1,1)')
        ),
        h('p', { className: 'font-semibold mt-4' }, 'AUC Calculation:'),
        h('p', null, 'Use trapezoidal rule to calculate area under curve'),
        h('div', { className: 'bg-green-50 p-4 rounded mt-2' },
          h('p', { className: 'font-semibold' }, `AUC ≈ ${auc.toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: ROC curve shows TPR vs FPR at different thresholds. AUC = 0.5 (random), AUC = 1.0 (perfect). Higher is better.'
        )
      )
    )
  );
}

export function ComputeAuc({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const n = 8;
  const data = [];
  for (let i = 0; i < n; i++) {
    data.push({
      actual: rng() > 0.5 ? 1 : 0,
      score: rng()
    });
  }
  data.sort((a, b) => b.score - a.score);
  
  const rocPoints = [{ tpr: 0, fpr: 0 }];
  let tp = 0, fp = 0;
  const totalPos = data.filter(d => d.actual === 1).length;
  const totalNeg = data.filter(d => d.actual === 0).length;
  
  data.forEach(d => {
    if (d.actual === 1) tp++;
    else fp++;
    rocPoints.push({
      tpr: tp / totalPos,
      fpr: fp / totalNeg
    });
  });
  
  let auc = 0;
  for (let i = 1; i < rocPoints.length; i++) {
    const width = rocPoints[i].fpr - rocPoints[i-1].fpr;
    const height = (rocPoints[i].tpr + rocPoints[i-1].tpr) / 2;
    auc += width * height;
  }
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Calculate the AUC for these predictions:'),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Actual'),
              h('th', { className: 'text-left p-2 border-b' }, 'Score')
            )
          ),
          h('tbody', null,
            ...data.map((d, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, d.actual),
                h('td', { className: 'p-2 border-b' }, d.score.toFixed(3))
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Sort by score (descending)'),
        h('p', null, `Total positives: ${totalPos}, Total negatives: ${totalNeg}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Calculate ROC points'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
          ...rocPoints.slice(1).map((p, i) =>
            h('p', { key: i }, `After instance ${i+1}: TPR=${p.tpr.toFixed(3)}, FPR=${p.fpr.toFixed(3)}`)
          )
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Step 3: Calculate AUC (trapezoidal rule)'),
        h('div', { className: 'bg-green-50 p-4 rounded mt-2' },
          h('p', { className: 'font-semibold' }, `AUC = ${auc.toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Sort by score, calculate TPR/FPR at each threshold, compute area using trapezoids.'
        )
      )
    )
  );
}
