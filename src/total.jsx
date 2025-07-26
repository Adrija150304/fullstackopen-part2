const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => {
    console.log('adding', sum, '+', part.exercises) // optional debug
    return sum + part.exercises
  }, 0)

  return (
    <p><strong>total of {total} exercises</strong></p>
  )
}

export default Total
