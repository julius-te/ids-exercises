const { useState, useEffect, createElement: h } = React;

const Storage = {
  get: () => {
    const data = localStorage.getItem('ids-progress');
    return data ? JSON.parse(data) : {};
  },
  set: (data) => {
    localStorage.setItem('ids-progress', JSON.stringify(data));
  },
  getStats: (problemId, subProblemId) => {
    const data = Storage.get();
    const key = `${problemId}-${subProblemId}`;
    return data[key] || { correct: 0, incorrect: 0 };
  },
  recordResult: (problemId, subProblemId, isCorrect) => {
    const data = Storage.get();
    const key = `${problemId}-${subProblemId}`;
    const stats = data[key] || { correct: 0, incorrect: 0 };
    if (isCorrect) {
      stats.correct++;
    } else {
      stats.incorrect++;
    }
    data[key] = stats;
    Storage.set(data);
  }
};

const PROBLEMS = [
  {
    id: 'normalization',
    name: 'Normalization',
    subProblems: [
      { id: 'min-max', name: 'Min-Max' },
      { id: 'standard-score', name: 'Standard Score' },
      { id: 'decimal-scaling', name: 'Decimal Scaling' }
    ]
  },
  {
    id: 'binning',
    name: 'Binning',
    subProblems: [
      { id: 'equal-width', name: 'Equal-width' },
      { id: 'equal-frequency', name: 'Equal-frequency' }
    ]
  },
  {
    id: 'boxplots',
    name: 'Boxplots',
    subProblems: [
      { id: 'draw-from-data', name: 'Draw from data' }
    ]
  },
  {
    id: 'decision-trees',
    name: 'Decision Trees',
    subProblems: [
      { id: 'id3-information-gain', name: 'ID3 with Information Gain' },
      { id: 'id3-gain-ratio', name: 'ID3 with Gain Ratio' },
      { id: 'id3-gini', name: 'ID3 with Gini' }
    ]
  },
  {
    id: 'decision-trees-advanced',
    name: 'Decision Trees (Advanced)',
    subProblems: [
      { id: 'numeric-feature', name: 'ID3 with numeric feature' },
      { id: 'numeric-target', name: 'Regression tree (numeric target)' },
      { id: 'discrimination-aware', name: 'Discrimination-aware trees' }
    ]
  },
  {
    id: 'regression',
    name: 'Regression',
    subProblems: [
      { id: 'gradient-descent', name: 'Gradient descent with MSE' }
    ]
  },
  {
    id: 'svm',
    name: 'SVM',
    subProblems: [
      { id: 'sketch-linear-function', name: 'Sketch 2D linear function' },
      { id: 'evaluate-svm', name: 'Evaluate SVM validity' },
      { id: 'formulate-hard-margin', name: 'Formulate hard-margin optimization' },
      { id: 'formulate-soft-margin', name: 'Formulate soft-margin optimization' },
      { id: 'decision-boundary', name: 'Provide decision boundary' }
    ]
  },
  {
    id: 'naive-bayes',
    name: 'Naive Bayes',
    subProblems: [
      { id: 'predict-probability', name: 'Predict probability' }
    ]
  },
  {
    id: 'neural-networks',
    name: 'Neural Networks',
    subProblems: [
      { id: 'compute-output', name: 'Compute output' },
      { id: 'backpropagation', name: 'Apply backpropagation' }
    ]
  },
  {
    id: 'confusion-matrix',
    name: 'Confusion Matrix',
    subProblems: [
      { id: 'compute-metrics', name: 'Compute metrics' }
    ]
  },
  {
    id: 'confusion-matrix-advanced',
    name: 'Confusion Matrix (Advanced)',
    subProblems: [
      { id: 'multinomial-confusion-matrix', name: 'Multinomial confusion matrix' },
      { id: 'average-class-accuracy', name: 'Average class accuracy & HM' }
    ]
  },
  {
    id: 'roc',
    name: 'ROC',
    subProblems: [
      { id: 'plot-curve', name: 'Plot ROC curve' },
      { id: 'compute-auc', name: 'Compute AUC' }
    ]
  },
  {
    id: 'continuous-target',
    name: 'Continuous Target Features',
    subProblems: [
      { id: 'all-metrics', name: 'SSE, MSE, RMSE, MAE, R²' }
    ]
  },
  {
    id: 'clustering',
    name: 'Clustering',
    subProblems: [
      { id: 'k-means', name: 'k-means' },
      { id: 'k-medoids', name: 'k-medoids' }
    ]
  },
  {
    id: 'clustering-advanced',
    name: 'Clustering (Advanced)',
    subProblems: [
      { id: 'agglomerative-min-distance', name: 'Agglomerative (min distance)' },
      { id: 'agglomerative-max-distance', name: 'Agglomerative (max distance)' }
    ]
  },
  {
    id: 'frequent-itemsets',
    name: 'Frequent Item Sets',
    subProblems: [
      { id: 'apriori', name: 'Apriori algorithm' }
    ]
  },
  {
    id: 'frequent-itemsets-advanced',
    name: 'Frequent Itemsets (Advanced)',
    subProblems: [
      { id: 'fp-growth', name: 'FP-Growth' },
      { id: 'discriminatory-itemsets', name: 'k-discriminatory itemsets' }
    ]
  },
  {
    id: 'association-rules',
    name: 'Association Rules',
    subProblems: [
      { id: 'compute-metrics', name: 'Compute support, confidence, lift' }
    ]
  },
  {
    id: 'association-rules-advanced',
    name: 'Association Rules (Advanced)',
    subProblems: [
      { id: 'association-rule-relationship', name: 'Theoretical relationships' }
    ]
  },
  {
    id: 'sequence-mining',
    name: 'Sequence Mining',
    subProblems: [
      { id: 'sequence-support', name: 'Calculate support' },
      { id: 'sequence-confidence', name: 'Calculate confidence' },
      { id: 'describe-as-itemsets', name: 'Describe as itemsets' },
      { id: 'apriori-all', name: 'AprioriAll algorithm' }
    ]
  },
  {
    id: 'process-mining',
    name: 'Process Mining',
    subProblems: [
      { id: 'find-traces', name: 'Find Petri net traces' },
      { id: 'create-petri-net', name: 'Create Petri net' },
      { id: 'process-tree-to-petri-net', name: 'Process tree → Petri net' },
      { id: 'petri-net-to-process-tree', name: 'Petri net → Process tree' },
      { id: 'inductive-miner', name: 'Inductive miner' },
      { id: 'token-replay-fitness', name: 'Token-based replay fitness' }
    ]
  },
  {
    id: 'text-mining',
    name: 'Text Mining',
    subProblems: [
      { id: 'tf-idf', name: 'TF-IDF' },
      { id: 'bag-of-words', name: 'Bag-of-words similarity' },
      { id: 'n-grams', name: 'N-grams' },
      { id: 'k-skip-n-grams', name: 'K-skip N-grams' }
    ]
  },
  {
    id: 'autocorrelation',
    name: 'Autocorrelation',
    subProblems: [
      { id: 'coefficient', name: 'Calculate coefficient' },
      { id: 'acf-plot', name: 'Draw ACF plot' },
      { id: 'moving-average', name: 'Calculate moving average' }
    ]
  },
  {
    id: 'forecasting',
    name: 'Forecasting',
    subProblems: [
      { id: 'ar-model', name: 'AR model' },
      { id: 'ma-model', name: 'MA model' },
      { id: 'arima', name: 'ARIMA' },
      { id: 'arma', name: 'ARMA' }
    ]
  },
  {
    id: 'streaming-kmeans',
    name: 'Streaming K-Means',
    subProblems: [
      { id: 'streaming-k-means', name: 'Update centroids' }
    ]
  },
  {
    id: 'confidentiality',
    name: 'Confidentiality',
    subProblems: [
      { id: 'k-anonymity', name: 'K-anonymity' },
      { id: 'l-diversity', name: 'L-diversity' }
    ]
  }
];

async function loadProblemComponents() {
  for (const problem of PROBLEMS) {
    try {
      const module = await import(`./problems/${problem.id}.js`);
      problem.subProblems.forEach(subProblem => {
        const componentName = subProblem.id.split('-').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join('');
        subProblem.component = module[componentName];
      });
    } catch (e) {
      console.warn(`Failed to load ${problem.id}:`, e);
    }
  }
}

function selectNextSubProblem(currentProblemId, currentSubProblemId) {
  const availableSubProblems = [];
  
  PROBLEMS.forEach(problem => {
    problem.subProblems.forEach(subProblem => {
      if (subProblem.component && !(problem.id === currentProblemId && subProblem.id === currentSubProblemId)) {
        const stats = Storage.getStats(problem.id, subProblem.id);
        const total = stats.correct + stats.incorrect;
        const failureRate = total === 0 ? 1 : stats.incorrect / total;
        availableSubProblems.push({
          problemId: problem.id,
          subProblemId: subProblem.id,
          failureRate
        });
      }
    });
  });
  
  if (availableSubProblems.length === 0) return null;
  
  const totalWeight = availableSubProblems.reduce((sum, sp) => sum + sp.failureRate, 0);
  let random = Math.random() * totalWeight;
  
  for (const sp of availableSubProblems) {
    random -= sp.failureRate;
    if (random <= 0) {
      return { problemId: sp.problemId, subProblemId: sp.subProblemId };
    }
  }
  
  return availableSubProblems[0];
}

function OverviewPage({ onSelectProblem }) {
  const problemStats = PROBLEMS.map(problem => {
    const subStats = problem.subProblems
      .filter(sp => sp.component)
      .map(sp => {
        const stats = Storage.getStats(problem.id, sp.id);
        const total = stats.correct + stats.incorrect;
        const successRate = total === 0 ? 0 : (stats.correct / total * 100);
        return { ...sp, stats, total, successRate };
      });
    
    const totalAttempts = subStats.reduce((sum, s) => sum + s.total, 0);
    const totalCorrect = subStats.reduce((sum, s) => sum + s.stats.correct, 0);
    const overallSuccess = totalAttempts === 0 ? 0 : (totalCorrect / totalAttempts * 100);
    
    return { ...problem, subStats, totalAttempts, overallSuccess };
  }).filter(p => p.subStats.length > 0);
  
  const handleRandomProblem = () => {
    const next = selectNextSubProblem(null, null);
    if (next) {
      window.location.hash = `#/problem/${next.problemId}/${next.subProblemId}`;
    }
  };
  
  return h('div', { className: 'min-h-screen bg-gray-50 p-4' },
    h('div', { className: 'max-w-6xl mx-auto' },
      h('div', { className: 'flex justify-between items-center mb-8 flex-wrap gap-4' },
        h('h1', { className: 'text-4xl font-bold text-gray-900' }, 'IDS Exam Practice'),
        h('button', { 
          onClick: handleRandomProblem,
          className: 'px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-lg shadow-lg'
        }, '🎲 Random Problem')
      ),
      h('div', { className: 'grid gap-6' },
        problemStats.map(problem =>
          h('div', { key: problem.id, className: 'bg-white rounded-lg shadow-md p-6' },
            h('div', { className: 'flex justify-between items-center mb-4' },
              h('h2', { className: 'text-2xl font-semibold text-gray-800' }, problem.name),
              h('div', { className: 'text-right' },
                h('div', { className: 'text-sm text-gray-600' }, `${problem.totalAttempts} attempts`),
                h('div', { className: 'text-lg font-semibold', style: { color: problem.overallSuccess >= 70 ? '#10b981' : problem.overallSuccess >= 40 ? '#f59e0b' : '#ef4444' } },
                  problem.totalAttempts > 0 ? `${problem.overallSuccess.toFixed(1)}%` : 'Not attempted'
                )
              )
            ),
            h('div', { className: 'grid gap-2' },
              problem.subStats.map(sub =>
                h('div', { 
                  key: sub.id, 
                  className: 'flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer', 
                  onClick: () => onSelectProblem(problem.id, sub.id) 
                },
                  h('span', { className: 'text-gray-700' }, sub.name),
                  h('div', { className: 'flex items-center gap-4' },
                    h('span', { className: 'text-sm text-gray-600' }, `${sub.stats.correct}✓ ${sub.stats.incorrect}✗`),
                    h('span', { className: 'font-semibold w-16 text-right', style: { color: sub.successRate >= 70 ? '#10b981' : sub.successRate >= 40 ? '#f59e0b' : '#ef4444' } },
                      sub.total > 0 ? `${sub.successRate.toFixed(0)}%` : '—'
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

function ProblemPage({ problemId, subProblemId, onBack }) {
  const [seed, setSeed] = useState(Date.now());
  const [showSolution, setShowSolution] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  
  const problem = PROBLEMS.find(p => p.id === problemId);
  const subProblem = problem?.subProblems.find(sp => sp.id === subProblemId);
  
  if (!problem || !subProblem || !subProblem.component) {
    return h('div', { className: 'min-h-screen bg-gray-50 p-4 flex items-center justify-center' },
      h('div', { className: 'text-center' },
        h('p', { className: 'text-xl text-gray-600 mb-4' }, 'Problem not found'),
        h('button', { onClick: onBack, className: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700' }, 'Back to Overview')
      )
    );
  }
  
  const stats = Storage.getStats(problemId, subProblemId);
  const total = stats.correct + stats.incorrect;
  const successRate = total === 0 ? 0 : (stats.correct / total * 100);
  
  const handleResult = (isCorrect) => {
    Storage.recordResult(problemId, subProblemId, isCorrect);
    setShowSolution(false);
    setShowChoices(true);
  };
  
  const handleRegenerate = () => {
    setSeed(Date.now());
    setShowSolution(false);
    setShowChoices(false);
  };
  
  const handleNextProblem = () => {
    const next = selectNextSubProblem(problemId, subProblemId);
    if (next) {
      window.location.hash = `#/problem/${next.problemId}/${next.subProblemId}`;
    }
  };
  
  return h('div', { className: 'min-h-screen bg-gray-50 p-4' },
    h('div', { className: 'max-w-4xl mx-auto' },
      h('div', { className: 'mb-6 flex justify-between items-center flex-wrap gap-4' },
        h('button', { onClick: onBack, className: 'px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700' }, '← Back'),
        h('div', { className: 'text-center flex-1' },
          h('h1', { className: 'text-2xl font-bold text-gray-900' }, problem.name),
          h('p', { className: 'text-gray-600' }, subProblem.name)
        ),
        h('div', { className: 'text-right' },
          h('div', { className: 'text-sm text-gray-600' }, `${stats.correct}✓ ${stats.incorrect}✗`),
          h('div', { className: 'font-semibold', style: { color: successRate >= 70 ? '#10b981' : successRate >= 40 ? '#f59e0b' : '#ef4444' } },
            total > 0 ? `${successRate.toFixed(0)}%` : 'Not attempted'
          )
        )
      ),
      h('div', { className: 'bg-white rounded-lg shadow-md p-6 mb-6' },
        h(subProblem.component, { showSolution, seed })
      ),
      h('div', { className: 'flex flex-col gap-4' },
        !showSolution && !showChoices && h('div', { className: 'flex gap-4 flex-wrap' },
          h('button', { 
            onClick: () => setShowSolution(true), 
            className: 'flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold' 
          }, 'Show Solution'),
          h('button', { 
            onClick: handleRegenerate, 
            className: 'flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold' 
          }, 'Regenerate Problem')
        ),
        showSolution && !showChoices && h('div', { className: 'flex gap-4 flex-wrap' },
          h('button', { 
            onClick: () => handleResult(true), 
            className: 'flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold' 
          }, '✓ I was correct'),
          h('button', { 
            onClick: () => handleResult(false), 
            className: 'flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold' 
          }, '✗ I was incorrect')
        ),
        showChoices && h('div', { className: 'flex gap-4 flex-wrap' },
          h('button', { 
            onClick: handleRegenerate, 
            className: 'flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold' 
          }, 'Same Problem Again'),
          h('button', { 
            onClick: handleNextProblem, 
            className: 'flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold' 
          }, 'Next Problem (Random)')
        )
      )
    )
  );
}

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  
  useEffect(() => {
    loadProblemComponents().then(() => setComponentsLoaded(true));
    
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  if (!componentsLoaded) {
    return h('div', { className: 'min-h-screen bg-gray-50 flex items-center justify-center' },
      h('div', { className: 'text-xl text-gray-600' }, 'Loading exercises...')
    );
  }
  
  const handleSelectProblem = (problemId, subProblemId) => {
    window.location.hash = `#/problem/${problemId}/${subProblemId}`;
  };
  
  const handleBack = () => {
    window.location.hash = '#/';
  };
  
  if (route.startsWith('#/problem/')) {
    const parts = route.replace('#/problem/', '').split('/');
    if (parts.length === 2) {
      return h(ProblemPage, { problemId: parts[0], subProblemId: parts[1], onBack: handleBack });
    }
  }
  
  return h(OverviewPage, { onSelectProblem: handleSelectProblem });
}

ReactDOM.render(h(App), document.getElementById('root'));
