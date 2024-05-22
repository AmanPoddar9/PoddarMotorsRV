export const formatAmount = (amount) => {
  // Convert the amount to a number
  const num = parseFloat(amount)

  // Divide the amount by 100,000 to convert to lakhs
  const lakhs = num / 100000

  // Format the lakhs amount with commas
  const formattedAmount = lakhs.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })

  // Return the formatted amount with 'Lakh' appended
  return `₹${formattedAmount} Lakh`
}

export const EMICalcLite = (principal, rate, tenure) => {
  const principalAmount = parseFloat(principal)
  const rateOfInterest = parseFloat(rate)
  const tenureMonths = parseFloat(tenure)

  if (principalAmount && rateOfInterest && tenureMonths) {
    const rate = rateOfInterest / 100 / 12
    const emi =
      (principalAmount * rate * Math.pow(1 + rate, tenureMonths)) /
      (Math.pow(1 + rate, tenureMonths) - 1)

    return Math.round(emi)
  }
}

export function AmountWithCommas(original) {
  var originalNumber = parseFloat(original)

  // Skip formatting if it's not a numeric value
  if (!isFinite(originalNumber)) {
    return original
  }

  return _formatAfterCleanup(originalNumber)
}

function _formatAfterCleanup(originalNumber) {
  var originalMag
  var negative

  if (originalNumber < 0) {
    originalMag = -1 * originalNumber
    negative = true
  } else {
    originalMag = originalNumber
    negative = false
  }

  var arr = String(originalMag).split('').reverse()
  var start = arr.indexOf('.') + 1 // start of full part
  var i // source index
  var result = [] // array holder of the result

  // copy the fractional part and the decimal if present
  for (i = 0; i < start; i++) {
    result.push(arr[i])
  }

  // main loop
  var c = 0 // digit counter
  for (i = start; i < arr.length; i++) {
    result.push(arr[i])
    c++
    if ((c === 3 || c === 5 || c === 7) && i < arr.length - 1) {
      result.push(',')
    }
    if (c === 7) {
      c = 0
    }
  }

  if (negative) {
    result.push('-')
  }

  return result.reverse().join('')
}

export function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

export const getOwnerShipSuffix = (owner) => {
  switch (owner) {
    case 1:
      return '1st Owner'
    case 2:
      return '2nd Owner'
    case 3:
      return '3rd Owner'
    case 4:
      return '4th Owner'
  }
}
