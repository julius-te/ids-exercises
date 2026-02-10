const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function StreamingKMeans({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const k = 2;
  const initialCentroids = [
    { x: Math.floor(rng() * 10) + 5, y: Math.floor(rng() * 10) + 5 },
    { x: Math.floor(rng() * 10) + 15, y: Math.floor(rng() * 10) + 5 }
  ];
  
  const newPoint = {
    x: Math.floor(rng() * 20) + 5,
    y: Math.floor(rng() * 20) + 5
  };
  
  const clusterCounts = [Math.floor(rng() * 5) + 5, Math.floor(rng() * 5) + 5];
  
  let minDist = Infinity;
  let assignedCluster = 0;
  initialCentroids.forEach((c, i) => {
    const dist = Math.sqrt(Math.pow(newPoint.x - c.x, 2) + Math.pow(newPoint.y - c.y, 2));
    if (dist < minDist) {
      minDist = dist;
      assignedCluster = i;
    }
  });
  
  const updatedCentroids = initialCentroids.map((c, i) => {
    if (i === assignedCluster) {
      const n = clusterCounts[i];
      return {
        x: (c.x * n + newPoint.x) / (n + 1),
        y: (c.y * n + newPoint.y) / (n + 1)
      };
    }
    return c;
  });
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, 'Update centroids in streaming k-means when new point arrives:'),
      h('div', { className: 'bg-gray-100 p-4 rounded space-y-2' },
        h('p', { className: 'font-semibold' }, 'Current centroids:'),
        ...initialCentroids.map((c, i) => 
          h('p', { key: i, className: 'ml-4 font-mono' }, 
            `C${i+1}: (${c.x.toFixed(2)}, ${c.y.toFixed(2)}) - ${clusterCounts[i]} points`
          )
        ),
        h('p', { className: 'font-semibold mt-3' }, 'New point:'),
        h('p', { className: 'ml-4 font-mono' }, `(${newPoint.x}, ${newPoint.y})`)
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Assign to nearest centroid'),
        ...initialCentroids.map((c, i) => {
          const dist = Math.sqrt(Math.pow(newPoint.x - c.x, 2) + Math.pow(newPoint.y - c.y, 2));
          return h('p', { key: i, className: 'ml-4' }, 
            `Distance to C${i+1}: ${dist.toFixed(3)} ${i === assignedCluster ? '← closest' : ''}`
          );
        }),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Update assigned centroid'),
        h('p', null, `Cluster ${assignedCluster + 1}: n = ${clusterCounts[assignedCluster]}`),
        h('p', null, `New centroid = (old_centroid × n + new_point) / (n + 1)`),
        h('div', { className: 'bg-blue-50 p-4 rounded mt-2 text-sm' },
          h('p', null, 
            `C${assignedCluster + 1}_x = (${initialCentroids[assignedCluster].x} × ${clusterCounts[assignedCluster]} + ${newPoint.x}) / ${clusterCounts[assignedCluster] + 1} = ${updatedCentroids[assignedCluster].x.toFixed(3)}`
          ),
          h('p', null, 
            `C${assignedCluster + 1}_y = (${initialCentroids[assignedCluster].y} × ${clusterCounts[assignedCluster]} + ${newPoint.y}) / ${clusterCounts[assignedCluster] + 1} = ${updatedCentroids[assignedCluster].y.toFixed(3)}`
          )
        ),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Updated centroids:'),
          ...updatedCentroids.map((c, i) => 
            h('p', { key: i, className: 'font-mono' }, 
              `C${i+1}: (${c.x.toFixed(3)}, ${c.y.toFixed(3)}) ${i === assignedCluster ? '(updated)' : ''}`
            )
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Streaming k-means updates centroids incrementally without storing all data. Uses weighted average for efficiency.'
        )
      )
    )
  );
}
