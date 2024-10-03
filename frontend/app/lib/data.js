export const fetchReceipts = async() => {
  try {
    const response = await fetch('http://localhost:3001/api/receipts')
    return response.json()
  }
  catch(error) {
    console.error('Error fetching receipt:', error)
  }
}