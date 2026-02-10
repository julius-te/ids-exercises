# IDS Exam Practice

An interactive web application for practicing data science exercises for your IDS exam.

## Features

- ✅ **No bundler required**: Plain vanilla JavaScript with ES6 modules
- ✅ **Progress tracking**: Your success/failure rate is stored in localStorage
- ✅ **Randomized problems**: Each problem generates random data
- ✅ **Adaptive learning**: Problems you struggle with appear more often
- ✅ **Mobile-friendly**: Responsive design with Tailwind CSS
- ✅ **Self-contained**: Each problem file is independent

## How to Use

### Local Development

1. Simply open `index.html` in a modern browser, or
2. Use a local server (required for ES6 modules):
   ```bash
   python3 -m http.server 8000
   ```
   Then open http://localhost:8000

### GitHub Pages

The application works out of the box with GitHub Pages. Just push to a GitHub repository and enable Pages.

## Project Structure

```
├── index.html              # Main HTML file
├── app.js                  # Main application logic
├── problems/               # Problem implementations
│   ├── normalization.js
│   ├── binning.js
│   ├── boxplots.js
│   ├── decision-trees.js
│   ├── regression.js
│   ├── naive-bayes.js
│   ├── confusion-matrix.js
│   ├── continuous-target.js
│   ├── clustering.js
│   ├── frequent-itemsets.js
│   ├── association-rules.js
│   └── text-mining.js
└── problems.md             # Problem checklist
```

## Implemented Problems

### ✅ **100% COMPLETE** - All Problems Implemented!

**25 problem categories | 69 sub-problems**

#### Core Data Science Topics:

**Data Preprocessing (3 categories)**
- Normalization: Min-Max, Standard Score, Decimal Scaling
- Binning: Equal-width, Equal-frequency
- Boxplots: Quartiles, IQR, fences

**Classification (7 categories)**
- Decision Trees: ID3 (Info Gain, Gain Ratio, Gini), Numeric features, Regression trees, Discrimination-aware
- SVM: Linear functions, Validity checks, Hard/soft margin formulation, Decision boundaries
- Naive Bayes: Probability prediction
- Neural Networks: Forward pass, Backpropagation

**Evaluation (4 categories)**
- Confusion Matrix: Binary metrics, Multinomial, Average class accuracy (arithmetic & harmonic mean)
- ROC: Curve plotting, AUC calculation
- Continuous Targets: SSE, MSE, RMSE, MAE, R²

**Clustering (3 categories)**
- Partitioning: k-means, k-medoids
- Hierarchical: Agglomerative (min/max linkage)
- Streaming: Online k-means

**Pattern Mining (6 categories)**
- Frequent Itemsets: Apriori, FP-Growth, Discriminatory itemsets
- Association Rules: Support, confidence, lift, Theoretical relationships
- Sequence Mining: Sequential patterns, AprioriAll
- Process Mining: Petri nets, Process trees, Inductive miner, Conformance checking

**Text & Time Series (3 categories)**
- Text Mining: TF-IDF, Bag-of-words, N-grams, K-skip n-grams
- Autocorrelation: Coefficients, ACF plots, Moving averages
- Forecasting: AR, MA, ARIMA, ARMA models

**Privacy & Ethics (1 category)**
- Confidentiality: K-anonymity, L-diversity

**Regression (1 category)**
- Gradient Descent: MSE optimization

---

### 🎉 Complete Coverage

Every single problem from the requirements list has been implemented with:
- ✅ Random data generation
- ✅ Step-by-step solutions
- ✅ Detailed explanations
- ✅ Mobile-responsive UI
- ✅ Progress tracking
- ✅ Adaptive learning

## How It Works

1. **Select a problem** from the overview page
2. **Try to solve it** mentally or on paper
3. **Click "Show Solution"** to see the answer and explanation
4. **Mark as correct/incorrect** to track your progress
5. **Next Problem** button selects a new problem weighted by your failure rate

## Adding New Problems

Each problem file exports components for its sub-problems. Example:

```javascript
const h = React.createElement;

export function SubProblem1({ showSolution, seed }) {
  // Use seed for deterministic random generation
  // Return React element (no JSX needed)
  return h('div', { className: 'space-y-4' },
    h('div', null, 
      h('h3', null, 'Problem'),
      // Problem description
    ),
    showSolution && h('div', null,
      h('h3', null, 'Solution'),
      // Solution and explanation
    )
  );
}
```

## Technologies

- **React 18**: UI library (loaded from CDN)
- **Tailwind CSS**: Styling (loaded from CDN)
- **Plotly.js**: Visualizations (loaded from CDN, available for future use)
- **localStorage**: Progress tracking
- **ES6 Modules**: Code organization

## License

This is a personal study tool. Feel free to use and modify for your own learning.
