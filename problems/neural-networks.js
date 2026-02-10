const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function ComputeOutput({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const weights1 = [[rng() * 2 - 1, rng() * 2 - 1], [rng() * 2 - 1, rng() * 2 - 1], [rng() * 2 - 1, rng() * 2 - 1]];
  const bias1 = [rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1];
  const weights2 = [rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1];
  const bias2 = rng() * 2 - 1;
  
  const input = [Math.floor(rng() * 5) + 1, Math.floor(rng() * 5) + 1];
  
  const sigmoid = x => 1 / (1 + Math.exp(-x));
  
  const hidden = weights1.map((w, i) => {
    const z = w[0] * input[0] + w[1] * input[1] + bias1[i];
    return sigmoid(z);
  });
  
  const outputZ = hidden[0] * weights2[0] + hidden[1] * weights2[1] + hidden[2] * weights2[2] + bias2;
  const output = sigmoid(outputZ);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Compute the output of this 3-layer neural network (2 inputs, 3 hidden nodes, 1 output):'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-2 text-sm' },
        h('p', { className: 'font-semibold' }, `Input: [${input.map(x => x.toFixed(1)).join(', ')}]`),
        h('p', { className: 'font-semibold' }, 'Hidden layer weights:'),
        ...weights1.map((w, i) => h('p', { key: i, className: 'ml-4' }, 
          `Node ${i+1}: w=[${w.map(x => x.toFixed(3)).join(', ')}], b=${bias1[i].toFixed(3)}`
        )),
        h('p', { className: 'font-semibold' }, 'Output layer:'),
        h('p', { className: 'ml-4' }, `w=[${weights2.map(x => x.toFixed(3)).join(', ')}], b=${bias2.toFixed(3)}`),
        h('p', { className: 'text-xs mt-2' }, 'Activation: sigmoid(x) = 1/(1+e^(-x))')
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2 text-sm' },
        h('p', { className: 'font-semibold' }, 'Step 1: Compute hidden layer'),
        ...hidden.map((h_val, i) => {
          const z = weights1[i][0] * input[0] + weights1[i][1] * input[1] + bias1[i];
          return h('div', { key: i, className: 'ml-4' },
            h('p', null, `h${i+1} = sigmoid(${weights1[i][0].toFixed(3)}×${input[0]} + ${weights1[i][1].toFixed(3)}×${input[1]} + ${bias1[i].toFixed(3)})`),
            h('p', null, `h${i+1} = sigmoid(${z.toFixed(3)}) = ${h_val.toFixed(4)}`)
          );
        }),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Compute output'),
        h('p', { className: 'ml-4' }, `z = ${hidden.map((h, i) => `${weights2[i].toFixed(3)}×${h.toFixed(4)}`).join(' + ')} + ${bias2.toFixed(3)}`),
        h('p', { className: 'ml-4' }, `z = ${outputZ.toFixed(4)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `Output = sigmoid(${outputZ.toFixed(4)}) = ${output.toFixed(4)}`)
        ),
        h('p', { className: 'mt-2 text-gray-700' }, 
          'Explanation: Forward propagation computes layer by layer. Apply weights, add bias, then activation function.'
        )
      )
    )
  );
}

export function Backpropagation({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const w1 = rng() * 2 - 1;
  const w2 = rng() * 2 - 1;
  const w3 = rng() * 2 - 1;
  const b1 = rng() * 2 - 1;
  const b2 = rng() * 2 - 1;
  
  const x = Math.floor(rng() * 5) + 1;
  const y_true = rng() > 0.5 ? 1 : 0;
  const lr = 0.1;
  
  const sigmoid = x => 1 / (1 + Math.exp(-x));
  const sigmoid_derivative = x => x * (1 - x);
  
  const z1 = w1 * x + b1;
  const h1 = sigmoid(z1);
  const z2 = w2 * h1 + b2;
  const h2 = sigmoid(z2);
  const z3 = w3 * h2;
  const output = sigmoid(z3);
  
  const dL_dout = 2 * (output - y_true);
  const dout_dz3 = sigmoid_derivative(output);
  const dz3_dw3 = h2;
  const dz3_dh2 = w3;
  
  const dL_dw3 = dL_dout * dout_dz3 * dz3_dw3;
  
  const dL_dh2 = dL_dout * dout_dz3 * dz3_dh2;
  const dh2_dz2 = sigmoid_derivative(h2);
  const dL_dw2 = dL_dh2 * dh2_dz2 * h1;
  const dL_db2 = dL_dh2 * dh2_dz2;
  
  const new_w3 = w3 - lr * dL_dw3;
  const new_w2 = w2 - lr * dL_dw2;
  const new_b2 = b2 - lr * dL_db2;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Apply backpropagation to update weights (simplified network):'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-2 text-sm' },
        h('p', null, `Input x=${x}, Target y=${y_true}`),
        h('p', null, `w1=${w1.toFixed(3)}, b1=${b1.toFixed(3)}, w2=${w2.toFixed(3)}, b2=${b2.toFixed(3)}, w3=${w3.toFixed(3)}`),
        h('p', null, `Learning rate α=${lr}`),
        h('p', null, 'Loss: MSE = (ŷ - y)²')
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2 text-sm' },
        h('p', { className: 'font-semibold' }, 'Forward pass:'),
        h('p', { className: 'ml-4' }, `h1 = sigmoid(${w1.toFixed(3)}×${x} + ${b1.toFixed(3)}) = ${h1.toFixed(4)}`),
        h('p', { className: 'ml-4' }, `h2 = sigmoid(${w2.toFixed(3)}×${h1.toFixed(4)} + ${b2.toFixed(3)}) = ${h2.toFixed(4)}`),
        h('p', { className: 'ml-4' }, `ŷ = sigmoid(${w3.toFixed(3)}×${h2.toFixed(4)}) = ${output.toFixed(4)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Backward pass:'),
        h('p', { className: 'ml-4' }, `∂L/∂ŷ = 2(ŷ - y) = ${dL_dout.toFixed(4)}`),
        h('p', { className: 'ml-4' }, `∂L/∂w3 = ${dL_dw3.toFixed(4)}`),
        h('p', { className: 'ml-4' }, `∂L/∂w2 = ${dL_dw2.toFixed(4)}`),
        h('p', { className: 'ml-4' }, `∂L/∂b2 = ${dL_db2.toFixed(4)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Updated weights:'),
          h('p', null, `w3 = ${w3.toFixed(3)} - ${lr}×${dL_dw3.toFixed(4)} = ${new_w3.toFixed(4)}`),
          h('p', null, `w2 = ${w2.toFixed(3)} - ${lr}×${dL_dw2.toFixed(4)} = ${new_w2.toFixed(4)}`),
          h('p', null, `b2 = ${b2.toFixed(3)} - ${lr}×${dL_db2.toFixed(4)} = ${new_b2.toFixed(4)}`)
        ),
        h('p', { className: 'mt-2 text-gray-700' }, 
          'Explanation: Backpropagation computes gradients layer by layer using chain rule, then updates weights.'
        )
      )
    )
  );
}
