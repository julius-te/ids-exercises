# Visualization Improvements

## Libraries Added
- **Plotly.js** - For interactive scatter plots, heatmaps, and ROC curves
- **Chart.js** - For bar charts, line charts, and time series visualizations

Both libraries are loaded from CDN in `index.html`.

## Problems with Enhanced Visualizations

### 1. Clustering (`clustering.js`)
- **KMedoids**: Plotly scatter plot showing clusters, old medoids (gold stars), and new medoids (green stars)
- **KMeans**: Plotly scatter plot showing clusters, old centroids (orange X), and new centroids (purple cross)

### 2. ROC Curves (`roc.js`)
- **PlotCurve**: Interactive Plotly ROC curve with area fill showing AUC
- **ComputeAuc**: Plotly ROC curve generated from predictions with random classifier baseline

### 3. Box Plots (`boxplots.js`)
- **DrawFromData**: Plotly box plot showing distribution with quartiles and outliers

### 4. Time Series Forecasting (`forecasting.js`)
- **ArModel**: Chart.js line chart comparing actual values with AR(1) forecast

### 5. Regression (`regression.js`)
- **GradientDescent**: Chart.js bar chart showing target vs old/new predictions after gradient descent step

### 6. Confusion Matrix (`confusion-matrix.js`)
- **ComputeMetrics**: Plotly heatmap visualization of confusion matrix with TP/TN/FP/FN labels

### 7. Binning (`binning.js`)
- **EqualWidth**: Chart.js bar chart comparing original vs smoothed values after binning

### 8. Normalization (`normalization.js`)
- **MinMax**: Chart.js dual-axis line chart showing original vs normalized values

## Features
- All visualizations are:
  - **Responsive**: Adapt to mobile and desktop screens
  - **Interactive**: Hover tooltips, zoom capabilities (Plotly)
  - **Clean**: Modern color schemes matching Tailwind CSS palette
  - **Conditional**: Only render when solution is shown

## Technical Implementation
- Used `React.useEffect` for chart lifecycle management
- Used `React.useRef` for canvas/div references
- Proper cleanup on component unmount to prevent memory leaks
- All charts use vanilla JS (no JSX or transpilation)
