const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function NumericFeature({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const data = [
    { age: 25, income: 30000, buys: 'No' },
    { age: 35, income: 45000, buys: 'No' },
    { age: 45, income: 60000, buys: 'Yes' },
    { age: 20, income: 25000, buys: 'No' },
    { age: 50, income: 70000, buys: 'Yes' },
    { age: 30, income: 40000, buys: 'No' },
    { age: 55, income: 80000, buys: 'Yes' },
    { age: 40, income: 55000, buys: 'Yes' }
  ];
  
  const attribute = 'age';
  
  function entropy(subset) {
    const total = subset.length;
    if (total === 0) return 0;
    const yes = subset.filter(d => d.buys === 'Yes').length;
    const no = total - yes;
    if (yes === 0 || no === 0) return 0;
    const pYes = yes / total;
    const pNo = no / total;
    return -(pYes * Math.log2(pYes) + pNo * Math.log2(pNo));
  }
  
  const parentEntropy = entropy(data);
  
  const sortedData = [...data].sort((a, b) => a[attribute] - b[attribute]);
  const splitPoints = [];
  
  for (let i = 0; i < sortedData.length - 1; i++) {
    if (sortedData[i].buys !== sortedData[i + 1].buys) {
      const splitValue = (sortedData[i][attribute] + sortedData[i + 1][attribute]) / 2;
      const left = data.filter(d => d[attribute] <= splitValue);
      const right = data.filter(d => d[attribute] > splitValue);
      
      const leftEntropy = entropy(left);
      const rightEntropy = entropy(right);
      const weightedEntropy = (left.length / data.length) * leftEntropy + 
                              (right.length / data.length) * rightEntropy;
      const infoGain = parentEntropy - weightedEntropy;
      
      splitPoints.push({ value: splitValue, gain: infoGain, left, right, leftEntropy, rightEntropy });
    }
  }
  
  splitPoints.sort((a, b) => b.gain - a.gain);
  const bestSplit = splitPoints[0];
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Find the best split for numeric attribute "${attribute}" using Information Gain:`),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Age'),
              h('th', { className: 'text-left p-2 border-b' }, 'Income'),
              h('th', { className: 'text-left p-2 border-b' }, 'Buys')
            )
          ),
          h('tbody', null,
            ...data.map((d, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, d.age),
                h('td', { className: 'p-2 border-b' }, d.income),
                h('td', { className: 'p-2 border-b' }, d.buys)
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
        h('p', null, `Entropy(S) = ${parentEntropy.toFixed(3)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Find candidate split points'),
        h('p', { className: 'text-sm' }, 'Sort by age and find midpoints where class changes'),
        h('div', { className: 'bg-blue-50 p-4 rounded mt-2 text-sm space-y-2' },
          ...splitPoints.slice(0, 3).map((sp, i) =>
            h('div', { key: i },
              h('p', { className: 'font-semibold' }, `Split at age ≤ ${sp.value.toFixed(1)}:`),
              h('p', { className: 'ml-4' }, `Left: ${sp.left.length} items, Entropy = ${sp.leftEntropy.toFixed(3)}`),
              h('p', { className: 'ml-4' }, `Right: ${sp.right.length} items, Entropy = ${sp.rightEntropy.toFixed(3)}`),
              h('p', { className: 'ml-4' }, `Info Gain = ${sp.gain.toFixed(3)}`)
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, 'Best split:'),
          h('p', null, `age ≤ ${bestSplit.value.toFixed(1)}`),
          h('p', null, `Information Gain = ${bestSplit.gain.toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: For numeric attributes, try all midpoints between consecutive values with different classes.'
        )
      )
    )
  );
}

export function NumericTarget({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const data = [
    { outlook: 'Sunny', temp: 25, humidity: 70, play_hours: 2 },
    { outlook: 'Sunny', temp: 28, humidity: 80, play_hours: 1 },
    { outlook: 'Overcast', temp: 22, humidity: 65, play_hours: 5 },
    { outlook: 'Rain', temp: 18, humidity: 90, play_hours: 3 },
    { outlook: 'Rain', temp: 20, humidity: 85, play_hours: 4 },
    { outlook: 'Overcast', temp: 24, humidity: 60, play_hours: 5 }
  ];
  
  function variance(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  }
  
  function varianceReduction(subset, attribute, value) {
    const left = subset.filter(d => d[attribute] === value);
    const right = subset.filter(d => d[attribute] !== value);
    
    const leftVals = left.map(d => d.play_hours);
    const rightVals = right.map(d => d.play_hours);
    const allVals = subset.map(d => d.play_hours);
    
    const totalVar = variance(allVals);
    const weightedVar = (left.length / subset.length) * variance(leftVals) + 
                        (right.length / subset.length) * variance(rightVals);
    
    return { reduction: totalVar - weightedVar, left, right };
  }
  
  const outlookValues = ['Sunny', 'Overcast', 'Rain'];
  const splits = outlookValues.map(val => ({
    attribute: 'outlook',
    value: val,
    ...varianceReduction(data, 'outlook', val)
  }));
  
  splits.sort((a, b) => b.reduction - a.reduction);
  const bestSplit = splits[0];
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Build a regression tree for numeric target (play_hours) using variance reduction:'),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Outlook'),
              h('th', { className: 'text-left p-2 border-b' }, 'Temp'),
              h('th', { className: 'text-left p-2 border-b' }, 'Humidity'),
              h('th', { className: 'text-left p-2 border-b' }, 'Play Hours')
            )
          ),
          h('tbody', null,
            ...data.map((d, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, d.outlook),
                h('td', { className: 'p-2 border-b' }, d.temp),
                h('td', { className: 'p-2 border-b' }, d.humidity),
                h('td', { className: 'p-2 border-b' }, d.play_hours)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate variance of target'),
        h('p', null, `Var(play_hours) = ${variance(data.map(d => d.play_hours)).toFixed(3)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Evaluate splits on "outlook"'),
        h('div', { className: 'bg-blue-50 p-4 rounded mt-2 text-sm space-y-2' },
          ...splits.map((s, i) =>
            h('div', { key: i },
              h('p', { className: 'font-semibold' }, `Split: outlook = ${s.value}`),
              h('p', { className: 'ml-4' }, `Left: ${s.left.length} items`),
              h('p', { className: 'ml-4' }, `Right: ${s.right.length} items`),
              h('p', { className: 'ml-4' }, `Variance Reduction = ${s.reduction.toFixed(3)}`)
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, 'Best split:'),
          h('p', null, `outlook = ${bestSplit.value}`),
          h('p', null, `Variance Reduction = ${bestSplit.reduction.toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: For regression trees, use variance reduction instead of information gain. Choose split that minimizes weighted variance.'
        )
      )
    )
  );
}

export function DiscriminationAware({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const data = [
    { gender: 'M', age: 25, score: 80, hired: 'Yes' },
    { gender: 'F', age: 30, score: 85, hired: 'No' },
    { gender: 'M', age: 35, score: 75, hired: 'Yes' },
    { gender: 'F', age: 28, score: 90, hired: 'No' },
    { gender: 'M', age: 40, score: 70, hired: 'Yes' },
    { gender: 'F', age: 32, score: 88, hired: 'No' }
  ];
  
  const protectedAttr = 'gender';
  
  function entropy(subset) {
    const total = subset.length;
    if (total === 0) return 0;
    const yes = subset.filter(d => d.hired === 'Yes').length;
    const no = total - yes;
    if (yes === 0 || no === 0) return 0;
    const pYes = yes / total;
    const pNo = no / total;
    return -(pYes * Math.log2(pYes) + pNo * Math.log2(pNo));
  }
  
  function infoGain(data, attribute) {
    const parentEntropy = entropy(data);
    const values = [...new Set(data.map(d => d[attribute]))];
    
    let weightedEntropy = 0;
    values.forEach(val => {
      const subset = data.filter(d => d[attribute] === val);
      weightedEntropy += (subset.length / data.length) * entropy(subset);
    });
    
    return parentEntropy - weightedEntropy;
  }
  
  const genderGain = infoGain(data, 'gender');
  const ageGain = infoGain(data, 'age');
  
  const maleHired = data.filter(d => d.gender === 'M' && d.hired === 'Yes').length;
  const maleTotal = data.filter(d => d.gender === 'M').length;
  const femaleHired = data.filter(d => d.gender === 'F' && d.hired === 'Yes').length;
  const femaleTotal = data.filter(d => d.gender === 'F').length;
  
  const discrimination = Math.abs(maleHired / maleTotal - femaleHired / femaleTotal);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Evaluate discrimination in decision tree splits (protected attribute: gender):'),
      h('div', { className: 'bg-gray-100 p-4 rounded overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Gender'),
              h('th', { className: 'text-left p-2 border-b' }, 'Age'),
              h('th', { className: 'text-left p-2 border-b' }, 'Score'),
              h('th', { className: 'text-left p-2 border-b' }, 'Hired')
            )
          ),
          h('tbody', null,
            ...data.map((d, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, d.gender),
                h('td', { className: 'p-2 border-b' }, d.age),
                h('td', { className: 'p-2 border-b' }, d.score),
                h('td', { className: 'p-2 border-b' }, d.hired)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate Information Gain'),
        h('p', null, `Info Gain(gender) = ${genderGain.toFixed(3)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Calculate discrimination'),
        h('div', { className: 'bg-blue-50 p-4 rounded mt-2 text-sm' },
          h('p', null, `Male hired rate: ${maleHired}/${maleTotal} = ${(maleHired/maleTotal).toFixed(3)}`),
          h('p', null, `Female hired rate: ${femaleHired}/${femaleTotal} = ${(femaleHired/femaleTotal).toFixed(3)}`),
          h('p', { className: 'mt-2' }, `Discrimination = |${(maleHired/maleTotal).toFixed(3)} - ${(femaleHired/femaleTotal).toFixed(3)}| = ${discrimination.toFixed(3)}`)
        ),
        h('div', { className: 'bg-yellow-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, 'Analysis:'),
          h('p', { className: 'text-sm' }, discrimination > 0.2 
            ? '⚠️ High discrimination detected! Should NOT split on gender.'
            : '✓ Low discrimination, but still avoid splitting on protected attributes.'
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Discrimination-aware trees avoid splits on protected attributes (gender, race, etc.) and monitor disparate impact.'
        )
      )
    )
  );
}
