const h = React.createElement;

function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function BagOfWords({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const documents = [
    'the cat sat on the mat',
    'the dog sat on the log',
    'cats and dogs play together'
  ];
  
  const allWords = new Set();
  const docWords = documents.map(doc => {
    const words = doc.split(' ');
    words.forEach(w => allWords.add(w));
    return words;
  });
  
  const vocab = Array.from(allWords).sort();
  
  const vectors = docWords.map(words => {
    const counts = {};
    vocab.forEach(w => counts[w] = 0);
    words.forEach(w => counts[w]++);
    return vocab.map(w => counts[w]);
  });
  
  const doc1 = 0;
  const doc2 = 1;
  
  const dotProduct = vectors[doc1].reduce((sum, val, i) => sum + val * vectors[doc2][i], 0);
  const norm1 = Math.sqrt(vectors[doc1].reduce((sum, val) => sum + val * val, 0));
  const norm2 = Math.sqrt(vectors[doc2].reduce((sum, val) => sum + val * val, 0));
  const cosineSim = dotProduct / (norm1 * norm2);
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Calculate cosine similarity between documents using bag-of-words:`),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        ...documents.map((doc, i) =>
          h('div', { key: i, className: 'font-mono text-sm mb-1' }, `Doc ${i + 1}: "${doc}"`)
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Create vocabulary'),
        h('p', { className: 'font-mono text-sm' }, vocab.join(', ')),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Create vectors'),
        h('div', { className: 'bg-blue-50 p-4 rounded text-sm overflow-x-auto' },
          ...vectors.map((vec, i) =>
            h('div', { key: i, className: 'font-mono' }, 
              `Doc ${i + 1}: [${vec.join(', ')}]`
            )
          )
        ),
        h('p', { className: 'font-semibold mt-3' }, `Step 3: Calculate cosine similarity (Doc 1 vs Doc 2)`),
        h('p', null, `Dot product = ${dotProduct}`),
        h('p', null, `||Doc1|| = ${norm1.toFixed(3)}, ||Doc2|| = ${norm2.toFixed(3)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold' }, `Cosine Similarity = ${cosineSim.toFixed(4)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: Bag-of-words ignores order. Cosine similarity = 1 (identical), 0 (orthogonal), -1 (opposite).'
        )
      )
    )
  );
}

export function NGrams({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const text = 'data science';
  const n = Math.floor(rng() * 2) + 2;
  
  const ngrams = [];
  for (let i = 0; i <= text.length - n; i++) {
    ngrams.push(text.substring(i, i + n));
  }
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Generate all ${n}-grams from the text:`),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono' }, `"${text}"`)
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, `${n}-grams:`),
        h('div', { className: 'bg-green-50 p-4 rounded' },
          h('div', { className: 'font-mono text-sm space-y-1' },
            ...ngrams.map((gram, i) => h('div', { key: i }, `"${gram}"`))
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          `Explanation: n-grams are contiguous sequences of n characters. Used for text analysis and similarity.`
        )
      )
    )
  );
}

export function KSkipNGrams({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const text = 'abcdef';
  const n = 2;
  const k = Math.floor(rng() * 2) + 1;
  
  const kskipngrams = [];
  for (let i = 0; i < text.length; i++) {
    for (let skip = 0; skip <= k; skip++) {
      const pos2 = i + 1 + skip;
      if (pos2 < text.length) {
        kskipngrams.push(text[i] + text[pos2]);
      }
    }
  }
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Generate all ${k}-skip-${n}-grams from:`),
      h('div', { className: 'bg-gray-100 p-4 rounded font-mono' }, `"${text}"`)
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, `${k}-skip-${n}-grams:`),
        h('div', { className: 'bg-green-50 p-4 rounded' },
          h('div', { className: 'font-mono text-sm space-y-1' },
            ...kskipngrams.map((gram, i) => h('div', { key: i }, `"${gram}"`))
          )
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          `Explanation: k-skip-n-grams allow up to k characters to be skipped between n-gram elements. Captures non-contiguous patterns.`
        )
      )
    )
  );
}

export function TfIdf({ showSolution, seed }) {
  let rng = () => { seed++; return seededRandom(seed); };
  
  const documents = [
    'the cat sat on the mat'.split(' '),
    'the dog sat on the log'.split(' '),
    'cats and dogs are animals'.split(' ')
  ];
  
  const queryWord = rng() > 0.5 ? 'cat' : 'the';
  const docIndex = Math.floor(rng() * documents.length);
  
  const tf = documents[docIndex].filter(w => w === queryWord).length / documents[docIndex].length;
  
  const docsWithWord = documents.filter(doc => doc.includes(queryWord)).length;
  const idf = Math.log(documents.length / docsWithWord);
  
  const tfidf = tf * idf;
  
  return h('div', { className: 'space-y-4' },
    h('div', null,
      h('h3', { className: 'text-lg font-semibold mb-2' }, 'Problem'),
      h('p', { className: 'mb-2' }, `Calculate TF-IDF for word "${queryWord}" in document ${docIndex + 1}:`),
      h('div', { className: 'bg-gray-100 p-4 rounded' },
        ...documents.map((doc, i) =>
          h('div', { key: i, className: 'font-mono text-sm mb-1' }, 
            `Doc ${i + 1}: ${doc.join(' ')}`
          )
        )
      )
    ),
    showSolution && h('div', { className: 'border-t pt-4' },
      h('h3', { className: 'text-lg font-semibold mb-2 text-green-700' }, 'Solution'),
      h('div', { className: 'space-y-2' },
        h('p', { className: 'font-semibold' }, 'Step 1: Calculate TF (Term Frequency)'),
        h('p', null, `Word "${queryWord}" appears ${documents[docIndex].filter(w => w === queryWord).length} times in doc ${docIndex + 1}`),
        h('p', null, `Doc ${docIndex + 1} has ${documents[docIndex].length} words`),
        h('p', null, `TF = ${documents[docIndex].filter(w => w === queryWord).length}/${documents[docIndex].length} = ${tf.toFixed(3)}`),
        h('p', { className: 'font-semibold mt-3' }, 'Step 2: Calculate IDF (Inverse Document Frequency)'),
        h('p', null, `Word "${queryWord}" appears in ${docsWithWord} of ${documents.length} documents`),
        h('p', null, `IDF = log(N/df) = log(${documents.length}/${docsWithWord}) = ${idf.toFixed(3)}`),
        h('div', { className: 'bg-green-50 p-4 rounded mt-4' },
          h('p', { className: 'font-semibold mb-2' }, 'Result:'),
          h('p', null, `TF-IDF = TF × IDF = ${tf.toFixed(3)} × ${idf.toFixed(3)} = ${tfidf.toFixed(4)}`)
        ),
        h('p', { className: 'mt-2 text-sm text-gray-700' }, 
          'Explanation: TF-IDF measures word importance. High if word is frequent in document but rare across documents.'
        )
      )
    )
  );
}
