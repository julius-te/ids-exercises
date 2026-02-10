const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function KMedoids({ showSolution, seed }) {
  const plotId = React.useId();
  let rng = () => { seed++; return seededRandom(seed); };
  
  const k = 2;
  const points = [];
  
  for (let i = 0; i < 6; i++) {
    points.push({
      id: i + 1,
      x: Math.floor(rng() * 15) + 1,
      y: Math.floor(rng() * 15) + 1
    });
  }
  
  const medoidIds = [0, 2];
  const medoids = medoidIds.map(id => points[id]);
  
  const assignments = points.map(p => {
    let minDist = Infinity;
    let cluster = 0;
    medoids.forEach((m, i) => {
      const dist = Math.abs(p.x - m.x) + Math.abs(p.y - m.y);
      if (dist < minDist) {
        minDist = dist;
        cluster = i + 1;
      }
    });
    return { ...p, cluster, dist: minDist };
  });
  
  const newMedoids = [];
  for (let i = 0; i < k; i++) {
    const clusterPoints = assignments.filter(p => p.cluster === i + 1);
    let minTotalDist = Infinity;
    let bestMedoid = null;
    
    clusterPoints.forEach(candidate => {
      let totalDist = 0;
      clusterPoints.forEach(p => {
        totalDist += Math.abs(candidate.x - p.x) + Math.abs(candidate.y - p.y);
      });
      if (totalDist < minTotalDist) {
        minTotalDist = totalDist;
        bestMedoid = candidate;
      }
    });
    
    if (bestMedoid) {
      newMedoids.push({ ...bestMedoid, totalDist: minTotalDist });
    }
  }
  
  React.useEffect(() => {
    if (showSolution) {
      const colors = ['#3B82F6', '#EF4444'];
      const traces = [];
      
      for (let i = 1; i <= k; i++) {
        const clusterPts = assignments.filter(p => p.cluster === i);
        traces.push({
          x: clusterPts.map(p => p.x),
          y: clusterPts.map(p => p.y),
          mode: 'markers+text',
          type: 'scatter',
          name: `Cluster ${i}`,
          marker: { size: 12, color: colors[i-1] },
          text: clusterPts.map(p => `P${p.id}`),
          textposition: 'top center'
        });
      }
      
      traces.push({
        x: medoids.map(m => m.x),
        y: medoids.map(m => m.y),
        mode: 'markers',
        type: 'scatter',
        name: 'Old Medoids',
        marker: { size: 18, color: 'gold', symbol: 'star', line: { width: 2, color: 'black' } }
      });
      
      traces.push({
        x: newMedoids.map(m => m.x),
        y: newMedoids.map(m => m.y),
        mode: 'markers',
        type: 'scatter',
        name: 'New Medoids',
        marker: { size: 18, color: 'green', symbol: 'star', line: { width: 2, color: 'black' } }
      });
      
      Plotly.newPlot(plotId, traces, {
        title: 'K-Medoids Clustering',
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        showlegend: true
      }, { responsive: true });
    }
  }, [showSolution, plotId]);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Perform one iteration of k-medoids with k=${k}:`),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('div', { className: 'mb-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Points:'),
          h('div', { className: 'font-mono text-sm grid grid-cols-2 gap-2' },
            ...points.map(p => h('div', { key: p.id }, `P${p.id}: (${p.x}, ${p.y})`))
          )
        ),
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Initial Medoids:'),
          h('div', { className: 'font-mono text-sm' },
            ...medoids.map((m, i) => h('div', { key: i }, `M${i+1}: P${m.id} (${m.x}, ${m.y})`))
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { id: plotId, className: 'mb-4', style: { width: '100%', height: '400px' } }),
      h('div', { className: 'space-y-4' },
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Step 1: Assign to nearest medoid (Manhattan distance)'),
          h('div', { className: 'bg-blue-50 p-4 rounded' },
            ...assignments.map(p =>
              h('div', { key: p.id, className: 'text-sm mb-1' }, 
                `P${p.id} (${p.x}, ${p.y}) → M${p.cluster} (dist: ${p.dist})`
              )
            )
          )
        ),
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Step 2: Select new medoids (minimize sum of distances)'),
          h('div', { className: 'bg-green-50 p-4 rounded' },
            ...newMedoids.map((m, i) => {
              const clusterPoints = assignments.filter(p => p.cluster === i + 1);
              return h('div', { key: i, className: 'mb-2' },
                h('p', { className: 'font-semibold' }, `Cluster ${i + 1}:`),
                h('p', { className: 'text-sm' }, 
                  `Points: ${clusterPoints.map(p => `P${p.id}`).join(', ')}`
                ),
                h('p', { className: 'text-sm' }, 
                  `New medoid: P${m.id} (${m.x}, ${m.y}), Total dist: ${m.totalDist}`
                )
              );
            })
          )
        ),
        h('p', { className: 'text-sm text-gray-700' }, 
          'Explanation: K-medoids uses actual data points as centers (medoids). More robust to outliers than k-means.'
        )
      )
    )
  );
}

export function KMeans({ showSolution, seed }) {
  const plotId = React.useId();
  let rng = () => { seed++; return seededRandom(seed); };
  
  const k = Math.floor(rng() * 2) + 2;
  const points = [];
  
  for (let i = 0; i < 8; i++) {
    points.push({
      id: i + 1,
      x: Math.floor(rng() * 20) + 1,
      y: Math.floor(rng() * 20) + 1
    });
  }
  
  const centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push({
      id: i + 1,
      x: points[i].x,
      y: points[i].y
    });
  }
  
  const assignments = points.map(p => {
    let minDist = Infinity;
    let cluster = 0;
    centroids.forEach((c, i) => {
      const dist = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
      if (dist < minDist) {
        minDist = dist;
        cluster = i + 1;
      }
    });
    return { ...p, cluster, dist: minDist };
  });
  
  const newCentroids = [];
  for (let i = 0; i < k; i++) {
    const clusterPoints = assignments.filter(p => p.cluster === i + 1);
    if (clusterPoints.length > 0) {
      const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
      const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
      newCentroids.push({ id: i + 1, x: avgX, y: avgY });
    }
  }
  
  React.useEffect(() => {
    if (showSolution) {
      const colors = ['#3B82F6', '#EF4444', '#10B981'];
      const traces = [];
      
      for (let i = 1; i <= k; i++) {
        const clusterPts = assignments.filter(p => p.cluster === i);
        traces.push({
          x: clusterPts.map(p => p.x),
          y: clusterPts.map(p => p.y),
          mode: 'markers+text',
          type: 'scatter',
          name: `Cluster ${i}`,
          marker: { size: 12, color: colors[i-1] },
          text: clusterPts.map(p => `P${p.id}`),
          textposition: 'top center'
        });
      }
      
      traces.push({
        x: centroids.map(c => c.x),
        y: centroids.map(c => c.y),
        mode: 'markers',
        type: 'scatter',
        name: 'Old Centroids',
        marker: { size: 16, color: 'orange', symbol: 'x', line: { width: 3 } }
      });
      
      traces.push({
        x: newCentroids.map(c => c.x),
        y: newCentroids.map(c => c.y),
        mode: 'markers',
        type: 'scatter',
        name: 'New Centroids',
        marker: { size: 16, color: 'purple', symbol: 'cross', line: { width: 3 } }
      });
      
      Plotly.newPlot(plotId, traces, {
        title: 'K-Means Clustering',
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        showlegend: true
      }, { responsive: true });
    }
  }, [showSolution, plotId]);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Perform one iteration of k-means with k=${k}:`),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        h('div', { className: 'mb-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Points:'),
          h('div', { className: 'font-mono text-sm grid grid-cols-2 gap-2' },
            ...points.map(p => h('div', { key: p.id }, `P${p.id}: (${p.x}, ${p.y})`))
          )
        ),
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Initial Centroids:'),
          h('div', { className: 'font-mono text-sm' },
            ...centroids.map(c => h('div', { key: c.id }, `C${c.id}: (${c.x}, ${c.y})`))
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { id: plotId, className: 'mb-4', style: { width: '100%', height: '400px' } }),
      h('div', { className: 'space-y-4' },
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Step 1: Assign to nearest centroid'),
          h('div', { className: 'bg-blue-50 p-4 rounded' },
            ...assignments.map(p =>
              h('div', { key: p.id, className: 'text-sm mb-1' }, 
                `P${p.id} (${p.x}, ${p.y}) → C${p.cluster} (dist: ${p.dist.toFixed(2)})`
              )
            )
          )
        ),
        h('div', null,
          h('p', { className: 'font-semibold mb-2' }, 'Step 2: Calculate new centroids'),
          h('div', { className: 'bg-green-50 p-4 rounded' },
            ...newCentroids.map(c => {
              const clusterPoints = assignments.filter(p => p.cluster === c.id);
              return h('div', { key: c.id, className: 'mb-2' },
                h('p', { className: 'font-semibold' }, `Cluster ${c.id}:`),
                h('p', { className: 'text-sm' }, 
                  `Points: ${clusterPoints.map(p => `P${p.id}`).join(', ')}`
                ),
                h('p', { className: 'text-sm' }, 
                  `New centroid: (${c.x.toFixed(2)}, ${c.y.toFixed(2)})`
                )
              );
            })
          )
        ),
        h('p', { className: 'text-sm text-gray-700' }, 
          'Explanation: K-means assigns points to nearest centroids, then recalculates centroids as cluster means.'
        )
      )
    )
  );
}
