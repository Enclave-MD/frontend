// Add this at the top of your main.jsx to enable debugging

// Monitor localStorage changes
const originalSetItem = localStorage.setItem
localStorage.setItem = function(key, value) {
  console.log('💾 [localStorage] SET:', key, '=', value?.substring(0, 50) + '...')
  originalSetItem.apply(this, arguments)
}

const originalRemoveItem = localStorage.removeItem
localStorage.removeItem = function(key) {
  console.log('🗑️  [localStorage] REMOVE:', key)
  console.trace('Remove called from:')
  originalRemoveItem.apply(this, arguments)
}

const originalClear = localStorage.clear
localStorage.clear = function() {
  console.log('🗑️  [localStorage] CLEAR ALL')
  console.trace('Clear called from:')
  originalClear.apply(this, arguments)
}

console.log('🔍 Debug monitoring enabled')
