const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function calcEntropy(counts, total) {
  return -counts.reduce((sum, c) => {
    if (c === 0) return sum;
    const p = c / total;
    return sum + p * Math.log2(p);
  }, 0);
}

export function Id3InformationGain({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const classes = ['A', 'B'];
  const features = ['Sunny', 'Rainy', 'Cloudy'];
  
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      weather: features[Math.floor(rng() * features.length)],
      class: classes[Math.floor(rng() * classes.length)]
    });
  }
  
  const classCounts = {};
  classes.forEach(c => { classCounts[c] = data.filter(d => d.class === c).length; });
  
  const entropy = calcEntropy(Object.values(classCounts), data.length);
  
  const infoGain = {};
  features.forEach(f => {
    const withF = data.filter(d => d.weather === f);
    const withoutF = data.filter(d => d.weather !== f);
    
    const entropyWith = calcEntropy(
      classes.map(c => withF.filter(d => d.class === c).length),
      withF.length
    );
    const entropyWithout = calcEntropy(
      classes.map(c => withoutF.filter(d => d.class === c).length),
      withoutF.length
    );
    
    const weightedEnt = (withF.length / data.length) * entropyWith + 
                        (withoutF.length / data.length) * entropyWithout;
    infoGain[f] = entropy - weightedEnt;
  });
  
  const bestFeature = Object.keys(infoGain).reduce((a, b) => 
    infoGain[a] > infoGain[b] ? a : b
  );
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Calculate Information Gain for the "Weather" feature:'),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Weather'),
              h('th', { className: 'text-left p-2 border-b' }, 'Class')
            )
          ),
          h('tbody', null,
            ...data.map((row, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, row.weather),
                h('td', { className: 'p-2 border-b' }, row.class)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate parent entropy'),
        h('p', null, `Class distribution: A=${classCounts.A}, B=${classCounts.B}`),
        h('p', null, `H(parent) = ${entropy.toFixed(3)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Calculate Information Gain'),
        ...Object.keys(infoGain).map(f =>
          h('div', { key: f, className: 'ml-4' }, `IG(${f}) = ${infoGain[f].toFixed(3)}`)
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `Best split: ${bestFeature}`),
          h('p', { className: 'text-sm mt-1' }, `Information Gain = ${infoGain[bestFeature].toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: IG = H(parent) - weighted avg of H(children). ID3 chooses feature with highest IG.'
        )
      )
    )
  );
}

export function Id3GainRatio({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const classes = ['A', 'B'];
  const features = ['X', 'Y', 'Z'];
  
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      feature: features[Math.floor(rng() * features.length)],
      class: classes[Math.floor(rng() * classes.length)]
    });
  }
  
  const classCounts = {};
  classes.forEach(c => { classCounts[c] = data.filter(d => d.class === c).length; });
  
  const entropy = calcEntropy(Object.values(classCounts), data.length);
  
  const gainRatio = {};
  features.forEach(f => {
    const withF = data.filter(d => d.feature === f);
    const withoutF = data.filter(d => d.feature !== f);
    
    const entropyWith = calcEntropy(
      classes.map(c => withF.filter(d => d.class === c).length),
      withF.length
    );
    const entropyWithout = calcEntropy(
      classes.map(c => withoutF.filter(d => d.class === c).length),
      withoutF.length
    );
    
    const weightedEnt = (withF.length / data.length) * entropyWith + 
                        (withoutF.length / data.length) * entropyWithout;
    const ig = entropy - weightedEnt;
    
    const splitInfo = calcEntropy([withF.length, withoutF.length], data.length);
    gainRatio[f] = splitInfo > 0 ? ig / splitInfo : 0;
  });
  
  const bestFeature = Object.keys(gainRatio).reduce((a, b) => 
    gainRatio[a] > gainRatio[b] ? a : b
  );
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Calculate Gain Ratio for each feature:'),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Feature'),
              h('th', { className: 'text-left p-2 border-b' }, 'Class')
            )
          ),
          h('tbody', null,
            ...data.map((row, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, row.feature),
                h('td', { className: 'p-2 border-b' }, row.class)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Gain Ratio = Information Gain / Split Info'),
        ...Object.keys(gainRatio).map(f =>
          h('div', { key: f, className: 'ml-4' }, `GR(${f}) = ${gainRatio[f].toFixed(3)}`)
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `Best split: ${bestFeature}`),
          h('p', { className: 'text-sm mt-1' }, `Gain Ratio = ${gainRatio[bestFeature].toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Gain Ratio normalizes IG by split info to avoid bias toward features with many values.'
        )
      )
    )
  );
}

export function Id3Gini({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const classes = ['A', 'B'];
  const features = ['P', 'Q'];
  
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      feature: features[Math.floor(rng() * features.length)],
      class: classes[Math.floor(rng() * classes.length)]
    });
  }
  
  const calcGini = (counts, total) => {
    return 1 - counts.reduce((sum, c) => {
      const p = c / total;
      return sum + p * p;
    }, 0);
  };
  
  const classCounts = {};
  classes.forEach(c => { classCounts[c] = data.filter(d => d.class === c).length; });
  
  const giniParent = calcGini(Object.values(classCounts), data.length);
  
  const giniGain = {};
  features.forEach(f => {
    const withF = data.filter(d => d.feature === f);
    const withoutF = data.filter(d => d.feature !== f);
    
    const giniWith = calcGini(
      classes.map(c => withF.filter(d => d.class === c).length),
      withF.length
    );
    const giniWithout = calcGini(
      classes.map(c => withoutF.filter(d => d.class === c).length),
      withoutF.length
    );
    
    const weightedGini = (withF.length / data.length) * giniWith + 
                         (withoutF.length / data.length) * giniWithout;
    giniGain[f] = giniParent - weightedGini;
  });
  
  const bestFeature = Object.keys(giniGain).reduce((a, b) => 
    giniGain[a] > giniGain[b] ? a : b
  );
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Calculate Gini gain for each feature:'),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Feature'),
              h('th', { className: 'text-left p-2 border-b' }, 'Class')
            )
          ),
          h('tbody', null,
            ...data.map((row, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, row.feature),
                h('td', { className: 'p-2 border-b' }, row.class)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', null, `Gini(parent) = ${giniParent.toFixed(3)}`),
        h('p', { className: 'font-semibold mt-2' }, 'Gini gain for each feature:'),
        ...Object.keys(giniGain).map(f =>
          h('div', { key: f, className: 'ml-4' }, `Gini gain(${f}) = ${giniGain[f].toFixed(3)}`)
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `Best split: ${bestFeature}`),
          h('p', { className: 'text-sm mt-1' }, `Gini gain = ${giniGain[bestFeature].toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Gini = 1 - Σp². Lower Gini = more pure. Choose split with highest Gini gain.'
        )
      )
    )
  );
}
