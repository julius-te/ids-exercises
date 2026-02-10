const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function AgglomerativeMinDistance({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const points = [
    { id: 'A', x: 2, y: 3 },
    { id: 'B', x: 3, y: 4 },
    { id: 'C', x: 8, y: 9 },
    { id: 'D', x: 9, y: 10 }
  ];
  
  function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
  
  function minDistance(cluster1, cluster2) {
    let minDist = Infinity;
    cluster1.forEach(p1 => {
      cluster2.forEach(p2 => {
        const d = distance(p1, p2);
        if (d < minDist) minDist = d;
      });
    });
    return minDist;
  }
  
  const clusters = points.map(p => ({ points: [p], label: p.id }));
  const steps = [];
  
  while (clusters.length > 1) {
    let minDist = Infinity;
    let mergeI = -1, mergeJ = -1;
    
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const dist = minDistance(clusters[i].points, clusters[j].points);
        if (dist < minDist) {
          minDist = dist;
          mergeI = i;
          mergeJ = j;
        }
      }
    }
    
    const newCluster = {
      points: [...clusters[mergeI].points, ...clusters[mergeJ].points],
      label: `{${clusters[mergeI].label}, ${clusters[mergeJ].label}}`
    };
    
    steps.push({
      merge: [clusters[mergeI].label, clusters[mergeJ].label],
      distance: minDist,
      result: newCluster.label,
      remaining: clusters.length - 1
    });
    
    clusters.splice(mergeJ, 1);
    clusters.splice(mergeI, 1);
    clusters.push(newCluster);
  }
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Perform agglomerative clustering with minimum distance (single linkage):'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Point'),
              h('th', { className: 'text-left p-2 border-b' }, 'x'),
              h('th', { className: 'text-left p-2 border-b' }, 'y')
            )
          ),
          h('tbody', null,
            ...points.map((p, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, p.id),
                h('td', { className: 'p-2 border-b' }, p.x),
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
        h('p', { className: 'font-semibold' }, 'Agglomerative clustering (bottom-up):'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm space-y-3' },
          ...steps.map((step, i) =>
            h('div', { key: i },
              h('p', { className: 'font-semibold' }, `Step ${i + 1}:`),
              h('p', { className: 'ml-4' }, `Merge ${step.merge[0]} and ${step.merge[1]}`),
              h('p', { className: 'ml-4' }, `Distance: ${step.distance.toFixed(3)}`),
              h('p', { className: 'ml-4' }, `Result: ${step.result}`),
              h('p', { className: 'ml-4' }, `Clusters remaining: ${step.remaining}`)
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, 'Final dendrogram (bottom to top):'),
          h('pre', { className: 'font-mono text-xs mt-2' },
            steps.map((s, i) => `${i + 1}. ${s.result} (d=${s.distance.toFixed(2)})`).join('\n')
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Single linkage uses minimum distance between any two points in different clusters. Tends to create chain-like clusters.'
        )
      )
    )
  );
}

export function AgglomerativeMaxDistance({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const points = [
    { id: 'A', x: 2, y: 3 },
    { id: 'B', x: 3, y: 4 },
    { id: 'C', x: 8, y: 9 },
    { id: 'D', x: 9, y: 10 }
  ];
  
  function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
  
  function maxDistance(cluster1, cluster2) {
    let maxDist = 0;
    cluster1.forEach(p1 => {
      cluster2.forEach(p2 => {
        const d = distance(p1, p2);
        if (d > maxDist) maxDist = d;
      });
    });
    return maxDist;
  }
  
  const clusters = points.map(p => ({ points: [p], label: p.id }));
  const steps = [];
  
  while (clusters.length > 1) {
    let minMaxDist = Infinity;
    let mergeI = -1, mergeJ = -1;
    
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const dist = maxDistance(clusters[i].points, clusters[j].points);
        if (dist < minMaxDist) {
          minMaxDist = dist;
          mergeI = i;
          mergeJ = j;
        }
      }
    }
    
    const newCluster = {
      points: [...clusters[mergeI].points, ...clusters[mergeJ].points],
      label: `{${clusters[mergeI].label}, ${clusters[mergeJ].label}}`
    };
    
    steps.push({
      merge: [clusters[mergeI].label, clusters[mergeJ].label],
      distance: minMaxDist,
      result: newCluster.label,
      remaining: clusters.length - 1
    });
    
    clusters.splice(mergeJ, 1);
    clusters.splice(mergeI, 1);
    clusters.push(newCluster);
  }
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Perform agglomerative clustering with maximum distance (complete linkage):'),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', null,
              h('th', { className: 'text-left p-2 border-b' }, 'Point'),
              h('th', { className: 'text-left p-2 border-b' }, 'x'),
              h('th', { className: 'text-left p-2 border-b' }, 'y')
            )
          ),
          h('tbody', null,
            ...points.map((p, i) =>
              h('tr', { key: i },
                h('td', { className: 'p-2 border-b' }, p.id),
                h('td', { className: 'p-2 border-b' }, p.x),
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
        h('p', { className: 'font-semibold' }, 'Agglomerative clustering with complete linkage:'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm space-y-3' },
          ...steps.map((step, i) =>
            h('div', { key: i },
              h('p', { className: 'font-semibold' }, `Step ${i + 1}:`),
              h('p', { className: 'ml-4' }, `Merge ${step.merge[0]} and ${step.merge[1]}`),
              h('p', { className: 'ml-4' }, `Maximum distance: ${step.distance.toFixed(3)}`),
              h('p', { className: 'ml-4' }, `Result: ${step.result}`),
              h('p', { className: 'ml-4' }, `Clusters remaining: ${step.remaining}`)
            )
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, 'Final dendrogram (bottom to top):'),
          h('pre', { className: 'font-mono text-xs mt-2' },
            steps.map((s, i) => `${i + 1}. ${s.result} (d=${s.distance.toFixed(2)})`).join('\n')
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Complete linkage uses maximum distance between any two points in different clusters. Creates more compact, spherical clusters.'
        )
      )
    )
  );
}
