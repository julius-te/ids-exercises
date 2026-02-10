const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function MultinomialConfusionMatrix({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const classes = ['A', 'B', 'C'];
  const predictions = [
    { actual: 'A', predicted: 'A' },
    { actual: 'A', predicted: 'B' },
    { actual: 'A', predicted: 'A' },
    { actual: 'B', predicted: 'B' },
    { actual: 'B', predicted: 'C' },
    { actual: 'B', predicted: 'B' },
    { actual: 'C', predicted: 'C' },
    { actual: 'C', predicted: 'A' },
    { actual: 'C', predicted: 'C' },
    { actual: 'C', predicted: 'C' }
  ];
  
  const confusionMatrix = {};
  classes.forEach(actual => {
    confusionMatrix[actual] = {};
    classes.forEach(pred => {
      confusionMatrix[actual][pred] = predictions.filter(
        p => p.actual === actual && p.predicted === pred
      ).length;
    });
  });
  
  const precisions = {};
  const recalls = {};
  
  classes.forEach(cls => {
    const tp = confusionMatrix[cls][cls];
    const fp = classes.filter(c => c !== cls)
      .reduce((sum, c) => sum + confusionMatrix[c][cls], 0);
    const fn = classes.filter(c => c !== cls)
      .reduce((sum, c) => sum + confusionMatrix[cls][c], 0);
    
    precisions[cls] = tp / (tp + fp);
    recalls[cls] = tp / (tp + fn);
  });
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Compute confusion matrix for multinomial classification and calculate precision/recall for each class:'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, '#'),
              h('th', { className: 'text-left p-2 border-b' }, 'Actual'),
              h('th', { className: 'text-left p-2 border-b' }, 'Predicted')
            )
          ),
          h('tbody', null,
            ...predictions.map((p, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, i + 1),
                h('td', { className: 'p-2 border-b' }, p.actual),
                h('td', { className: 'p-2 border-b' }, p.predicted)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Confusion Matrix:'),
        h('div', { className: 'bg-blue-50 p-4 rounded overflow-x-auto' },
          h('table', { className: 'text-sm border-collapse' },
            h('thead', null,
              h('tr', null,
                h('th', { className: 'p-2 border' }, 'Actual \\ Pred'),
                ...classes.map(cls => h('th', { key: cls, className: 'p-2 border' }, cls))
              )
            ),
            h('tbody', null,
              ...classes.map(actual =>
                h('tr', { key: actual },
                  h('td', { className: 'p-2 border font-semibold' }, actual),
                  ...classes.map(pred =>
                    h('td', { key: pred, className: 'p-2 border text-center' }, 
                      confusionMatrix[actual][pred]
                    )
                  )
                )
              )
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Per-class metrics:'),
          ...classes.map(cls =>
            h('div', { key: cls, className: 'mb-2' },
              h('p', { className: 'font-semibold' }, `Class ${cls}:`),
              h('p', { className: 'ml-4 text-sm' }, `Precision = ${precisions[cls].toFixed(3)}`),
              h('p', { className: 'ml-4 text-sm' }, `Recall = ${recalls[cls].toFixed(3)}`)
            )
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: For each class, precision = TP/(TP+FP), recall = TP/(TP+FN), where TP is diagonal element, FP is column sum excluding diagonal, FN is row sum excluding diagonal.'
        )
      )
    )
  );
}

export function AverageClassAccuracy({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const classes = ['A', 'B', 'C'];
  const confusionMatrix = {
    'A': { 'A': 8, 'B': 2, 'C': 0 },
    'B': { 'A': 1, 'B': 7, 'C': 2 },
    'C': { 'A': 0, 'B': 1, 'C': 9 }
  };
  
  const classAccuracies = {};
  let totalInstances = 0;
  
  classes.forEach(cls => {
    const total = Object.values(confusionMatrix[cls]).reduce((sum, v) => sum + v, 0);
    totalInstances += total;
    const correct = confusionMatrix[cls][cls];
    classAccuracies[cls] = { accuracy: correct / total, total };
  });
  
  const avgClassAccuracy = classes.reduce((sum, cls) => 
    sum + classAccuracies[cls].accuracy, 0) / classes.length;
  
  const avgClassAccuracyHM = classes.length / classes.reduce((sum, cls) => 
    sum + 1 / classAccuracies[cls].accuracy, 0);
  
  const overallAccuracy = classes.reduce((sum, cls) => 
    sum + confusionMatrix[cls][cls], 0) / totalInstances;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Calculate average class accuracy and harmonic mean:'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('p', { className: 'font-semibold mb-2' }, 'Confusion Matrix:'),
        h('table', { className: 'text-sm border-collapse' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'p-2 border' }, 'Actual \\ Pred'),
              ...classes.map(cls => h('th', { key: cls, className: 'p-2 border' }, cls))
            )
          ),
          h('tbody', null,
            ...classes.map(actual =>
              h('tr', { key: actual },
                h('td', { className: 'p-2 border font-semibold' }, actual),
                ...classes.map(pred =>
                  h('td', { key: pred, className: 'p-2 border text-center' }, 
                    confusionMatrix[actual][pred]
                  )
                )
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate per-class accuracy'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm space-y-1' },
          ...classes.map(cls =>
            h('p', { key: cls }, 
              `Accuracy(${cls}) = ${confusionMatrix[cls][cls]}/${classAccuracies[cls].total} = ${classAccuracies[cls].accuracy.toFixed(3)}`
            )
          )
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Average Class Accuracy (arithmetic mean)'),
        h('div', { className: 'bg-green-50 p-4 rounded' },
          h('p', null, `ACA = (${classes.map(c => classAccuracies[c].accuracy.toFixed(3)).join(' + ')}) / ${classes.length}`),
          h('p', { className: 'font-semibold' }, `ACA = ${avgClassAccuracy.toFixed(3)}`)
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Step 3: Average Class Accuracy (harmonic mean)'),
        h('div', { className: 'bg-green-50 p-4 rounded' },
          h('p', null, `ACA_HM = ${classes.length} / (${classes.map(c => `1/${classAccuracies[c].accuracy.toFixed(3)}`).join(' + ')})`),
          h('p', { className: 'font-semibold' }, `ACA_HM = ${avgClassAccuracyHM.toFixed(3)}`)
        ),
        h('div', { className: 'bg-yellow-50 p-4 rounded mt-4 text-sm' },
          h('p', null, `Overall accuracy: ${overallAccuracy.toFixed(3)}`),
          h('p', { className: 'mt-2' }, 'Note: ACA treats all classes equally, while overall accuracy is affected by class imbalance. Harmonic mean penalizes low accuracies more.')
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: ACA = average of per-class accuracies. ACA_HM = harmonic mean, more sensitive to low values.'
        )
      )
    )
  );
}
