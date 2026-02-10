const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function FindTraces({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const petriNet = {
    places: ['p1', 'p2', 'p3', 'p4'],
    transitions: ['A', 'B', 'C'],
    arcs: [
      { from: 'p1', to: 'A' },
      { from: 'A', to: 'p2' },
      { from: 'p2', to: 'B' },
      { from: 'B', to: 'p3' },
      { from: 'p2', to: 'C' },
      { from: 'C', to: 'p4' },
      { from: 'p3', to: 'p4' }
    ],
    initial: 'p1',
    final: 'p4'
  };
  
  const traces = [
    ['A', 'B'],
    ['A', 'C']
  ];
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Find all possible traces of this Petri net:'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('pre', { className: 'font-mono text-sm whitespace-pre' },
          '  [p1] → (A) → [p2] → (B) → [p3]\n' +
          '                ↓              ↓\n' +
          '               (C)          [p4]\n' +
          '                ↓              ↑\n' +
          '              [p4] ←──────────┘\n' +
          '\nInitial marking: p1\nFinal marking: p4'
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Starting from p1:'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm space-y-2' },
          h('p', null, '1. Fire A: p1 → p2'),
          h('p', null, '2. From p2, can fire B or C:'),
          h('p', { className: 'ml-4' }, '   • Fire B: p2 → p3 → p4 (trace: A,B)'),
          h('p', { className: 'ml-4' }, '   • Fire C: p2 → p4 (trace: A,C)')
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'All traces:'),
          ...traces.map((trace, i) =>
            h('p', { key: i, className: 'font-mono' }, `${i+1}. <${trace.join(', ')}>`)
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: A trace is a sequence of transitions from initial to final marking.'
        )
      )
    )
  );
}

export function CreatePetriNet({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const traces = [
    ['A', 'B', 'C'],
    ['A', 'C', 'B'],
    ['A', 'B'],
    ['A', 'C']
  ];
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Create a Petri net that accepts these traces:'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        ...traces.map((trace, i) =>
          h('div', { key: i, className: 'font-mono text-sm' },
            `Trace ${i+1}: <${trace.join(', ')}>`
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'One possible Petri net:'),
        h('div', { className: 'bg-green-50 p-4 rounded' },
          h('pre', { className: 'font-mono text-sm whitespace-pre' },
            '       [start] → (A) → [p1]\n' +
            '                         ↓\n' +
            '                    ┌────┴────┐\n' +
            '                    ↓         ↓\n' +
            '                  (B)        (C)\n' +
            '                    ↓         ↓\n' +
            '                  [p2]      [p3]\n' +
            '                    ↓         ↓\n' +
            '                  (C)        (B)\n' +
            '                    ↓         ↓\n' +
            '                  [p4]      [p4]\n' +
            '                    ↘         ↙\n' +
            '                      [end]\n' +
            '\n(B and C can be skipped, both lead to end)'
          )
        ),
        h('p', { className: 'font-semibold mt-4' }, 'Explanation:'),
        h('p', { className: 'text-sm' }, '• A always fires first'),
        h('p', { className: 'text-sm' }, '• B and C can fire in any order or be skipped'),
        h('p', { className: 'text-sm' }, '• All traces lead to final state'),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Note: Multiple valid Petri nets exist. This is one solution.'
        )
      )
    )
  );
}

export function ProcessTreeToPetriNet({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const tree = '→(A, ×(B, C))';
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Translate this process tree to a Petri net:'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('p', { className: 'font-mono text-lg text-center mb-4' }, tree),
        h('div', { className: 'text-sm' },
          h('p', null, '→ = sequence'),
          h('p', null, '× = choice (XOR)'),
          h('p', null, '∧ = parallel (AND)')
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Parse tree'),
        h('p', { className: 'ml-4 text-sm' }, 'Sequence of: A, then choice(B or C)'),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Construct Petri net'),
        h('div', { className: 'bg-green-50 p-4 rounded mt-2' },
          h('pre', { className: 'font-mono text-xs whitespace-pre' },
            '  [p0] → (A) → [p1]\n' +
            '                 ↓\n' +
            '            ┌────┴────┐\n' +
            '            ↓         ↓\n' +
            '          (B)        (C)\n' +
            '            ↓         ↓\n' +
            '          [p2]      [p2]\n' +
            '\nSequence: A followed by choice\n' +
            'Choice: Either B or C (XOR)\n' +
            'Both B and C lead to same place p2'
          )
        ),
        h('p', { className: 'mt-4 text-sm text-gray-700' }, 
          'Explanation: → creates sequential places, × creates branching with single output place.'
        )
      )
    )
  );
}

export function PetriNetToProcessTree({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Translate this Petri net to a process tree:'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('pre', { className: 'font-mono text-xs whitespace-pre' },
          '       [p0]\n' +
          '        ↓\n' +
          '       (A)\n' +
          '        ↓\n' +
          '       [p1]\n' +
          '     ↙     ↘\n' +
          '   (B)     (C)\n' +
          '     ↓     ↓\n' +
          '   [p2]   [p3]\n' +
          '     ↘     ↙\n' +
          '      [p4]\n' +
          '        ↓\n' +
          '       (D)\n' +
          '        ↓\n' +
          '      [p5]'
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Analyze structure:'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
          h('p', null, '1. A fires first (sequence)'),
          h('p', null, '2. Then B and C fire in parallel (both tokens)'),
          h('p', null, '3. After both complete, D fires (sequence)')
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Process tree:'),
          h('p', { className: 'font-mono text-lg text-center' }, '→(A, ∧(B, C), D)'),
          h('p', { className: 'text-sm mt-3' }, '→ = sequence of A, parallel block, D'),
          h('p', { className: 'text-sm' }, '∧ = parallel execution of B and C')
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Split and join patterns indicate parallel execution. Sequential flow becomes → operator.'
        )
      )
    )
  );
}

export function InductiveMiner({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const log = [
    ['A', 'B', 'C'],
    ['A', 'C', 'B'],
    ['A', 'B'],
    ['A', 'C']
  ];
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Discover process tree using inductive miner:'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        ...log.map((trace, i) =>
          h('div', { key: i, className: 'font-mono text-sm' },
            `<${trace.join(', ')}>`
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Find directly-follows relations'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
          h('p', null, 'A → B (2 times)'),
          h('p', null, 'A → C (2 times)'),
          h('p', null, 'B → C (1 time)'),
          h('p', null, 'C → B (1 time)')
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Identify cut'),
        h('p', { className: 'text-sm' }, 'Sequence cut: A always comes first'),
        h('p', { className: 'text-sm' }, 'After A: B and C appear in any order (parallel)'),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Discovered process tree:'),
          h('p', { className: 'font-mono text-lg text-center' }, '→(A, ∧(B, C))'),
          h('p', { className: 'text-sm mt-3' }, 'A in sequence, then B and C in parallel'),
          h('p', { className: 'text-sm' }, 'B and C are optional (not all traces have both)')
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Inductive miner recursively finds cuts (sequence, parallel, choice, loop) to split event log.'
        )
      )
    )
  );
}

export function TokenReplayFitness({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const trace = ['A', 'B', 'D'];
  const model = {
    description: 'A → B → C → D',
    expected: ['A', 'B', 'C', 'D']
  };
  
  const produced = 4;
  const consumed = 3;
  const missing = 1;
  const remaining = 0;
  
  const fitness = 0.5 * (1 - missing/consumed) + 0.5 * (1 - remaining/produced);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Compute token-based replay fitness:'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-2' },
        h('p', null, `Trace: <${trace.join(', ')}>`),
        h('p', null, `Model: ${model.description}`)
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Replay trace on model:'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm space-y-1' },
          h('p', null, 'A: fires correctly ✓'),
          h('p', null, 'B: fires correctly ✓'),
          h('p', null, 'C: missing (trace skips to D) ✗'),
          h('p', null, 'D: fires correctly ✓')
        ),
        h('p', { className: 'font-semibold mt-3' }, 'Count tokens:'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm' },
          h('p', null, `Produced tokens (p): ${produced}`),
          h('p', null, `Consumed tokens (c): ${consumed}`),
          h('p', null, `Missing tokens (m): ${missing} (needed for C)`),
          h('p', null, `Remaining tokens (r): ${remaining}`)
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Fitness calculation:'),
          h('p', { className: 'font-mono text-sm' }, 'fitness = 0.5×(1 - m/c) + 0.5×(1 - r/p)'),
          h('p', { className: 'font-mono text-sm' }, `fitness = 0.5×(1 - ${missing}/${consumed}) + 0.5×(1 - ${remaining}/${produced})`),
          h('p', { className: 'font-mono text-sm' }, `fitness = ${fitness.toFixed(3)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Fitness = 1 (perfect), 0 (worst). Measures how well trace conforms to model.'
        )
      )
    )
  );
}
