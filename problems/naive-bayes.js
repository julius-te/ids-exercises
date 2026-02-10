const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function PredictProbability({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const data = [
    { features: ['Sunny', 'Hot'], class: 'Yes' },
    { features: ['Sunny', 'Hot'], class: 'Yes' },
    { features: ['Rainy', 'Cold'], class: 'No' },
    { features: ['Rainy', 'Hot'], class: 'Yes' },
    { features: ['Sunny', 'Cold'], class: 'No' },
    { features: ['Rainy', 'Cold'], class: 'No' }
  ];
  
  const testInstance = {
    features: rng() > 0.5 ? ['Sunny', 'Hot'] : ['Rainy', 'Cold']
  };
  
  const classCounts = { Yes: 0, No: 0 };
  data.forEach(d => classCounts[d.class]++);
  
  const total = data.length;
  const pYes = classCounts.Yes / total;
  const pNo = classCounts.No / total;
  
  const featureProbs = {};
  ['Yes', 'No'].forEach(cls => {
    featureProbs[cls] = {};
    const classData = data.filter(d => d.class === cls);
    
    testInstance.features.forEach((feature, idx) => {
      const featureName = idx === 0 ? 'Weather' : 'Temp';
      const count = classData.filter(d => d.features[idx] === feature).length;
      featureProbs[cls][featureName] = count / classData.length;
    });
  });
  
  const pFeaturesGivenYes = featureProbs.Yes.Weather * featureProbs.Yes.Temp;
  const pFeaturesGivenNo = featureProbs.No.Weather * featureProbs.No.Temp;
  
  const pYesGivenFeatures = (pFeaturesGivenYes * pYes) / 
    (pFeaturesGivenYes * pYes + pFeaturesGivenNo * pNo);
  const pNoGivenFeatures = (pFeaturesGivenNo * pNo) / 
    (pFeaturesGivenYes * pYes + pFeaturesGivenNo * pNo);
  
  const prediction = pYesGivenFeatures > pNoGivenFeatures ? 'Yes' : 'No';
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Use Naive Bayes to predict class probability for:'),
      h('div', { className: 'bg-gray-100 p-4 rounded mb-4' },
        h('table', { className: 'w-full text-sm mb-4' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Weather'),
              h('th', { className: 'text-left p-2 border-b' }, 'Temperature'),
              h('th', { className: 'text-left p-2 border-b' }, 'Class')
            )
          ),
          h('tbody', null,
            ...data.map((row, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, row.features[0]),
                h('td', { className: 'p-2 border-b' }, row.features[1]),
                h('td', { className: 'p-2 border-b' }, row.class)
              )
            )
          )
        ),
        h('p', { className: 'font-semibold' }, 
          `Test: Weather=${testInstance.features[0]}, Temp=${testInstance.features[1]}`
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Prior probabilities'),
        h('p', null, `P(Yes) = ${classCounts.Yes}/${total} = ${pYes.toFixed(3)}`),
        h('p', null, `P(No) = ${classCounts.No}/${total} = ${pNo.toFixed(3)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Likelihoods'),
        h('p', null, `P(${testInstance.features[0]}|Yes) = ${featureProbs.Yes.Weather.toFixed(3)}`),
        h('p', null, `P(${testInstance.features[1]}|Yes) = ${featureProbs.Yes.Temp.toFixed(3)}`),
        h('p', null, `P(${testInstance.features[0]}|No) = ${featureProbs.No.Weather.toFixed(3)}`),
        h('p', null, `P(${testInstance.features[1]}|No) = ${featureProbs.No.Temp.toFixed(3)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 3: Posterior probabilities'),
        h('p', null, `P(features|Yes) × P(Yes) = ${(pFeaturesGivenYes * pYes).toFixed(4)}`),
        h('p', null, `P(features|No) × P(No) = ${(pFeaturesGivenNo * pNo).toFixed(4)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Results:'),
          h('p', null, `P(Yes|features) = ${pYesGivenFeatures.toFixed(3)}`),
          h('p', null, `P(No|features) = ${pNoGivenFeatures.toFixed(3)}`),
          h('p', { className: 'mt-2 font-semibold' }, `Prediction: ${prediction}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Naive Bayes assumes feature independence. P(C|F) ∝ P(F|C)×P(C).'
        )
      )
    )
  );
}
