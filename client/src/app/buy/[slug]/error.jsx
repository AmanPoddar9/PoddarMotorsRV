'use client' // Error components must be Client Components
import { useRouter } from 'next/navigation'

export default function Error({ error, reset }) {
  const router = useRouter()

  const resetLink = () => {
    // Redirect to the home page
    router.replace('/buy')
  }

  return (
    <div style={styles.container}>
      <h2>Something went wrong! Maybe you entered the wrong car slug?</h2>
      <button onClick={resetLink} style={styles.button}>
        Go back to buy page
      </button>
    </div>
  )
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
    marginBottom: '50px',
  },
  button: {
    padding: '10px 20px',
    marginTop: '20px',
    backgroundColor: '#e6d800',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
}
