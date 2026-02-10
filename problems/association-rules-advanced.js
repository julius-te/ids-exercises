// Association Rules - Advanced

const { createElement: h } = React;

function generateTheoryQuestion() {
  const questions = [
    {
      question: "Can an association rule have high confidence but low support?",
      answer: "Yes",
      explanation: "Confidence measures the conditional probability P(Y|X), which can be high even if X is rare (low support). For example: {caviar} → {champagne} might have 95% confidence but only 0.1% support because caviar purchases are rare."
    },
    {
      question: "Can an association rule have high support but low confidence?",
      answer: "Yes",
      explanation: "Support measures P(X ∪ Y), which can be high even if the implication is weak. For example: {milk} → {bread} might have 20% support but only 40% confidence if milk appears in many transactions without bread."
    },
    {
      question: "If rule X → Y has confidence 100%, does that mean Y → X also has confidence 100%?",
      answer: "No",
      explanation: "Confidence is not symmetric. If all transactions with X also contain Y, it doesn't mean all transactions with Y contain X. Example: {organic_milk} → {milk} has 100% confidence, but {milk} → {organic_milk} may have only 10% confidence."
    },
    {
      question: "Can the confidence of X → Y be less than the support of Y?",
      answer: "No",
      explanation: "Confidence of X → Y equals support(X ∪ Y) / support(X), which must be at least 0. But if it's greater than 0, then support(X ∪ Y) ≤ support(Y), so confidence = support(X ∪ Y) / support(X) could be less than support(Y) when support(X) > support(X ∪ Y) / support(Y). Actually, confidence CAN be less than support(Y). Example: If support(Y) = 0.6, support(X) = 0.8, support(X∪Y) = 0.4, then confidence = 0.4/0.8 = 0.5 < 0.6."
    },
    {
      question: "If X → Y has lift > 1, what does this tell us about Y → X?",
      answer: "Y → X also has lift > 1 (same value)",
      explanation: "Lift is symmetric: lift(X → Y) = lift(Y → X) = P(X ∪ Y) / (P(X) × P(Y)). If lift > 1, X and Y are positively correlated, regardless of direction."
    },
    {
      question: "Can a rule have lift < 1 but still be useful in practice?",
      answer: "Yes",
      explanation: "Lift < 1 indicates negative correlation, which can be valuable. For example: {diet_soda} → {regular_soda} might have lift < 1, revealing that customers buying diet soda avoid regular soda - useful for product placement."
    },
    {
      question: "Is it possible for all subsets of a frequent itemset to be infrequent?",
      answer: "No",
      explanation: "This violates the Apriori principle (anti-monotonicity). If an itemset is frequent, all its subsets must also be frequent, because any subset appears at least as often as the full itemset."
    },
    {
      question: "Can increasing minimum confidence threshold increase the number of generated rules?",
      answer: "No",
      explanation: "Increasing the minimum confidence threshold is monotonic - it can only filter out more rules, never add new ones. Rules that didn't meet the lower threshold certainly won't meet a higher one."
    }
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
}

function AssociationRulesAdvancedSub1({ showSolution }) {
  const [problem, setProblem] = React.useState(() => generateTheoryQuestion());
  
  return h('div', { className: 'space-y-4' },
    h('div', { className: 'bg-blue-50 border-l-4 border-blue-500 p-4' },
      h('p', { className: 'font-semibold text-lg' }, 'Theoretical Question:'),
      h('p', { className: 'mt-2 text-lg' }, problem.question)
    ),
    
    showSolution && h('div', { className: 'bg-green-50 border-l-4 border-green-500 p-4 space-y-2' },
      h('p', null,
        h('span', { className: 'font-semibold' }, 'Answer: '),
        problem.answer
      ),
      h('p', null,
        h('span', { className: 'font-semibold' }, 'Explanation: '),
        problem.explanation
      )
    )
  );
}

window.AssociationRulesAdvancedProblems = [
  {
    id: 'association-rules-advanced-1',
    title: 'Theoretical Questions about Association Rules',
    component: AssociationRulesAdvancedSub1
  }
];
