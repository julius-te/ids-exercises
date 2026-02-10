const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function SketchLinearFunction({ showSolution, seed }) {
  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  React.useEffect(() => {
    if (!showSolution || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    let rng = () => { seed++; return seededRandom(seed); };
    
    let w1 = Math.floor(rng() * 6) - 3;
    let w2 = Math.floor(rng() * 6) - 3;
    const b = Math.floor(rng() * 8) - 4;
    
    if (w1 === 0 && w2 === 0) {
      w1 = 1;
    }

    // Generate line points
    const linePoints = [];
    if (w2 !== 0) {
      for (let x1 = -5; x1 <= 5; x1 += 0.1) {
        const x2 = -(w1 * x1 + b) / w2;
        if (x2 >= -5 && x2 <= 5) {
          linePoints.push({ x: x1, y: x2 });
        }
      }
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Decision Boundary',
            data: linePoints,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgb(59, 130, 246)',
            showLine: true,
            pointRadius: 0,
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: `Decision Boundary: ${w1}x₁ + ${w2}x₂ + ${b} = 0`
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'center',
            title: { display: true, text: 'x₁' },
            min: -5,
            max: 5,
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          },
          y: {
            type: 'linear',
            position: 'center',
            title: { display: true, text: 'x₂' },
            min: -5,
            max: 5,
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [showSolution, seed]);

  let rng = () => { seed++; return seededRandom(seed); };
  
  let w1 = Math.floor(rng() * 6) - 3;
  let w2 = Math.floor(rng() * 6) - 3;
  const b = Math.floor(rng() * 8) - 4;
  
  if (w1 === 0 && w2 === 0) {
    w1 = 1;
  }
  
  const x2AtX1_0 = w2 !== 0 ? -b / w2 : null;
  const x1AtX2_0 = w1 !== 0 ? -b / w1 : null;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Sketch the decision boundary for this linear function (where f(x₁, x₂) = 0):'),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono text-lg text-center' },
        `f(x₁, x₂) = ${w1}x₁ + ${w2}x₂ + ${b}`
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('div', { className: 'bg-white p-4 rounded border' },
          h('canvas', { ref: chartRef })
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Decision boundary: Set f(x₁, x₂) = 0'),
        h('p', null, `${w1}x₁ + ${w2}x₂ + ${b} = 0`),
        w2 !== 0 && h('p', null, `x₂ = ${(-w1/w2).toFixed(2)}x₁ + ${(-b/w2).toFixed(2)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Key points:'),
        x1AtX2_0 !== null && h('p', { className: 'ml-4' }, `x₁-intercept (x₂=0): x₁ = ${x1AtX2_0.toFixed(2)}`),
        x2AtX1_0 !== null && h('p', { className: 'ml-4' }, `x₂-intercept (x₁=0): x₂ = ${x2AtX1_0.toFixed(2)}`),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Linear decision boundary is a line in 2D. Points on the line satisfy f=0.'
        )
      )
    )
  );
}

export function EvaluateSvm({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const points = [
    { x1: 1, x2: 2, y: 1 },
    { x1: 2, x2: 3, y: 1 },
    { x1: 4, x2: 1, y: -1 },
    { x1: 5, x2: 2, y: -1 }
  ];
  
  const w1 = 1;
  const w2 = -1;
  const b = 0;
  
  const margins = points.map(p => {
    const fx = w1 * p.x1 + w2 * p.x2 + b;
    const yf = p.y * fx;
    return { ...p, fx, yf };
  });
  
  const allCorrect = margins.every(m => m.yf > 0);
  const minMargin = Math.min(...margins.map(m => m.yf));
  const supportVectors = margins.filter(m => Math.abs(m.yf - minMargin) < 0.01);
  
  const isValidSvm = allCorrect && minMargin >= 1;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Does this linear function describe a valid hard-margin SVM?'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-3' },
        h('p', { className: 'font-mono' }, `f(x₁, x₂) = ${w1}x₁ + ${w2}x₂ + ${b}`),
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Data points:'),
          h('table', { className: 'w-full text-sm' },
            h('thead', null,
              h('tr', null,
                h('th', { className: 'text-left p-2 border-b' }, 'x₁'),
                h('th', { className: 'text-left p-2 border-b' }, 'x₂'),
                h('th', { className: 'text-left p-2 border-b' }, 'y')
              )
            ),
            h('tbody', null,
              ...points.map((p, i) =>
                h('tr', { key: i },
                  h('td', { className: 'p-2 border-b' }, p.x1),
                  h('td', { className: 'p-2 border-b' }, p.x2),
                  h('td', { className: 'p-2 border-b' }, p.y)
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
        h('p', { className: 'font-semibold' }, 'For hard-margin SVM: y·f(x) ≥ 1 for all points'),
        h('div', { className: 'bg-blue-50 p-4 rounded mt-3' },
          h('p', { className: 'font-semibold mb-2' }, 'Check each point:'),
          ...margins.map((m, i) =>
            h('div', { key: i, className: 'mb-2 text-sm' },
              h('p', null, `Point ${i+1}: f(${m.x1}, ${m.x2}) = ${m.fx.toFixed(2)}`),
              h('p', null, `y·f(x) = ${m.y} × ${m.fx.toFixed(2)} = ${m.yf.toFixed(2)} ${m.yf >= 1 ? '✓' : '✗'}`)
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, 
            isValidSvm 
              ? '✓ Valid hard-margin SVM (all margins ≥ 1)' 
              : `✗ NOT a valid hard-margin SVM (min margin: ${minMargin.toFixed(2)})`
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Hard-margin SVM requires all points to be correctly classified with margin ≥ 1.'
        )
      )
    )
  );
}

export function FormulateHardMargin({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const points = [
    { x1: 1, x2: 1, y: 1 },
    { x1: 2, x2: 2, y: 1 },
    { x1: 4, x2: 1, y: -1 },
    { x1: 3, x2: 0, y: -1 }
  ];
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Formulate the optimization problem for hard-margin SVM:'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'x₁'),
              h('th', { className: 'text-left p-2 border-b' }, 'x₂'),
              h('th', { className: 'text-left p-2 border-b' }, 'y')
            )
          ),
          h('tbody', null,
            ...points.map((p, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, p.x1),
                h('td', { className: 'p-2 border-b' }, p.x2),
                h('td', { className: 'p-2 border-b' }, p.y)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('div', { className: 'bg-green-50 p-4 rounded' },
          h('p', { className: 'font-semibold mb-2' }, 'Optimization Problem:'),
          h('div', { className: 'font-mono text-sm space-y-2' },
            h('p', null, 'minimize: ½||w||² = ½(w₁² + w₂²)'),
            h('p', { className: 'mt-3' }, 'subject to:'),
            ...points.map((p, i) =>
              h('p', { key: i, className: 'ml-4' }, 
                `y${i+1}(w₁x₁${i+1} + w₂x₂${i+1} + b) ≥ 1`
              )
            ),
            h('p', { className: 'mt-3' }, 'Expanded constraints:'),
            ...points.map((p, i) =>
              h('p', { key: i, className: 'ml-4' }, 
                `${p.y}(${p.x1}w₁ + ${p.x2}w₂ + b) ≥ 1`
              )
            )
          )
        ),
        h('p', { className: 'mt-4 text-sm text-gray-700' }, 
          'Explanation: Hard-margin SVM maximizes margin (minimize ||w||) while ensuring all points are correctly classified with margin ≥ 1.'
        )
      )
    )
  );
}

export function FormulateSoftMargin({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const points = [
    { x1: 1, x2: 3, y: 1 },
    { x1: 2, x2: 2, y: 1 },
    { x1: 3, x2: 1, y: -1 },
    { x1: 2, x2: 0, y: -1 }
  ];
  
  const C = Math.floor(rng() * 5) + 1;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Formulate soft-margin SVM with regularization (C=${C}):`),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'x₁'),
              h('th', { className: 'text-left p-2 border-b' }, 'x₂'),
              h('th', { className: 'text-left p-2 border-b' }, 'y')
            )
          ),
          h('tbody', null,
            ...points.map((p, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, p.x1),
                h('td', { className: 'p-2 border-b' }, p.x2),
                h('td', { className: 'p-2 border-b' }, p.y)
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('div', { className: 'bg-green-50 p-4 rounded' },
          h('p', { className: 'font-semibold mb-2' }, 'Optimization Problem:'),
          h('div', { className: 'font-mono text-sm space-y-2' },
            h('p', null, `minimize: ½||w||² + C·Σξᵢ = ½(w₁² + w₂²) + ${C}·(ξ₁ + ξ₂ + ξ₃ + ξ₄)`),
            h('p', { className: 'mt-3' }, 'subject to:'),
            ...points.map((p, i) =>
              h('p', { key: i, className: 'ml-4' }, 
                `y${i+1}(w₁·${p.x1} + w₂·${p.x2} + b) ≥ 1 - ξ${i+1}`
              )
            ),
            h('p', { className: 'ml-4 mt-2' }, 'ξᵢ ≥ 0 for all i')
          )
        ),
        h('p', { className: 'mt-4 text-sm text-gray-700' }, 
          `Explanation: Soft-margin allows violations via slack variables ξᵢ. C=${C} controls trade-off: large C = fewer violations, small C = larger margin.`
        )
      )
    )
  );
}

export function DecisionBoundary({ showSolution, seed }) {
  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);

  React.useEffect(() => {
    if (!showSolution || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const w1 = 1;
    const w2 = -0.5;
    const b = -1;

    // Generate line points
    const linePoints = [];
    for (let x1 = 0; x1 <= 6; x1 += 0.1) {
      const x2 = -(w1 * x1 + b) / w2;
      if (x2 >= 0 && x2 <= 4) {
        linePoints.push({ x: x1, y: x2 });
      }
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Class +1',
            data: [{ x: 1, y: 2 }, { x: 2, y: 3 }],
            backgroundColor: 'rgb(34, 197, 94)',
            pointRadius: 8,
            pointStyle: 'circle'
          },
          {
            label: 'Class -1',
            data: [{ x: 4, y: 1 }, { x: 5, y: 2 }],
            backgroundColor: 'rgb(239, 68, 68)',
            pointRadius: 8,
            pointStyle: 'circle'
          },
          {
            label: 'Decision Boundary',
            data: linePoints,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgb(59, 130, 246)',
            showLine: true,
            pointRadius: 0,
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
          legend: { display: true },
          title: {
            display: true,
            text: 'SVM Decision Boundary'
          }
        },
        scales: {
          x: {
            type: 'linear',
            title: { display: true, text: 'x₁' },
            min: 0,
            max: 6,
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          },
          y: {
            type: 'linear',
            title: { display: true, text: 'x₂' },
            min: 0,
            max: 4,
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [showSolution]);

  let rng = () => { seed++; return seededRandom(seed); };
  
  const points = [
    { x1: 1, x2: 2, y: 1 },
    { x1: 2, x2: 3, y: 1 },
    { x1: 4, x2: 1, y: -1 },
    { x1: 5, x2: 2, y: -1 }
  ];
  
  const w1 = 1;
  const w2 = -0.5;
  const b = -1;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Find the decision boundary that best separates these points:'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'x₁'),
              h('th', { className: 'text-left p-2 border-b' }, 'x₂'),
              h('th', { className: 'text-left p-2 border-b' }, 'class')
            )
          ),
          h('tbody', null,
            ...points.map((p, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, p.x1),
                h('td', { className: 'p-2 border-b' }, p.x2),
                h('td', { className: 'p-2 border-b' }, p.y === 1 ? '+' : '-')
              )
            )
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('div', { className: 'bg-white p-4 rounded border' },
          h('canvas', { ref: chartRef })
        ),
        h('p', { className: 'font-semibold mt-3' }, 'One possible decision boundary:'),
        h('div', { className: 'bg-blue-50 p-4 rounded' },
          h('p', { className: 'font-mono text-lg' }, `f(x₁, x₂) = ${w1}x₁ + ${w2}x₂ + ${b}`),
          h('p', { className: 'mt-2 text-sm' }, 'Decision boundary: f(x₁, x₂) = 0'),
          h('p', { className: 'text-sm' }, `x₂ = ${-w1/w2}x₁ + ${-b/w2}`)
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Verification:'),
        h('div', { className: 'bg-green-50 p-4 rounded text-sm' },
          ...points.map((p, i) => {
            const fx = w1 * p.x1 + w2 * p.x2 + b;
            const pred = fx > 0 ? 1 : -1;
            return h('p', { key: i }, 
              `Point (${p.x1}, ${p.x2}): f = ${fx.toFixed(2)}, pred = ${pred === 1 ? '+' : '-'}, actual = ${p.y === 1 ? '+' : '-'} ${pred === p.y ? '✓' : '✗'}`
            );
          })
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Decision boundary separates classes. Many solutions exist; SVM finds the one with maximum margin.'
        )
      )
    )
  );
}
