const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function GradientDescent({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const learningRate = (Math.floor(rng() * 3) + 1) * 0.1;
  const numInputs = 2;
  
  const weights = [];
  for (let i = 0; i < numInputs; i++) {
    weights.push((Math.floor(rng() * 10) - 5) / 10);
  }
  const bias = (Math.floor(rng() * 10) - 5) / 10;
  
  const inputs = [];
  for (let i = 0; i < numInputs; i++) {
    inputs.push(Math.floor(rng() * 10) + 1);
  }
  const target = Math.floor(rng() * 20) + 10;
  
  const prediction = inputs.reduce((sum, x, i) => sum + x * weights[i], bias);
  const error = prediction - target;
  
  const newWeights = weights.map((w, i) => w - learningRate * 2 * error * inputs[i]);
  const newBias = bias - learningRate * 2 * error;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Perform one step of gradient descent for linear regression with MSE:'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-2' },
        h('p', null, `Weights: w = [${weights.map(w => w.toFixed(2)).join(', ')}]`),
        h('p', null, `Bias: b = ${bias.toFixed(2)}`),
        h('p', null, `Input: x = [${inputs.join(', ')}]`),
        h('p', null, `Target: y = ${target}`),
        h('p', null, `Learning rate: α = ${learningRate}`)
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate prediction'),
        h('p', null, `ŷ = ${bias.toFixed(2)} + ${weights.map((w, i) => `${w.toFixed(2)}×${inputs[i]}`).join(' + ')}`),
        h('p', null, `ŷ = ${prediction.toFixed(2)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Calculate error and gradient'),
        h('p', null, `error = ŷ - y = ${prediction.toFixed(2)} - ${target} = ${error.toFixed(2)}`),
        h('p', null, `∂MSE/∂w_i = 2 × error × x_i`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 3: Update parameters'),
        ...newWeights.map((nw, i) =>
          h('p', { key: i }, `w_${i+1} = ${weights[i].toFixed(2)} - ${learningRate} × 2 × ${error.toFixed(2)} × ${inputs[i]} = ${nw.toFixed(3)}`)
        ),
        h('p', null, `b = ${bias.toFixed(2)} - ${learningRate} × 2 × ${error.toFixed(2)} = ${newBias.toFixed(3)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('div', { className: 'font-semibold mb-2' }, 'New parameters:'),
          h('p', null, `w = [${newWeights.map(w => w.toFixed(3)).join(', ')}]`),
          h('p', null, `b = ${newBias.toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Gradient descent updates parameters in direction that reduces loss.'
        )
      )
    )
  );
}
