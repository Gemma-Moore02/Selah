// Converts a positive integer to its English cardinal name.
// Covers 1–150 (sufficient for all Bible chapter counts, including Psalms 150).
// Examples: 4 → "Four", 21 → "Twenty-One", 119 → "One Hundred Nineteen"

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
]

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
  'Sixty', 'Seventy', 'Eighty', 'Ninety',
]

export function numberToWords(n) {
  if (n < 20)  return ONES[n]
  if (n < 100) {
    const t = Math.floor(n / 10)
    const o = n % 10
    return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`
  }
  // 100–150 range for Psalms
  const remainder = n % 100
  return remainder === 0
    ? 'One Hundred'
    : `One Hundred ${numberToWords(remainder)}`
}
