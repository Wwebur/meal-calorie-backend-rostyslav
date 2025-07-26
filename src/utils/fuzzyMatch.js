// Simple fuzzy match: find food with highest overlap of words
export default function fuzzyMatch(query, foods) {
  const queryWords = query.toLowerCase().split(/\s+/);
  let bestScore = 0;
  let bestFood = null;
  for (const food of foods) {
    const foodWords = food.description.toLowerCase().split(/\s+/);
    const score = queryWords.filter((w) => foodWords.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      bestFood = food;
    }
  }
  return bestFood || foods[0];
}
