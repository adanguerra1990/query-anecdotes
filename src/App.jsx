import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, uppdateAnecdote } from './services/anecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {
  const queryClient = useQueryClient

  const updateAnecdoteMutation = useMutation({
    mutationFn: uppdateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const handleVote = anecdote => {
    const updateAnecdoteVote = { ...anecdote, votes: (anecdote.votes += 1) }
    updateAnecdoteMutation.mutate(updateAnecdoteVote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
  })

  if (result.isLoading) {
    return <div>Loading... </div>
  }

  if (result.isError) {
    return <div>Anecdote services not available due to problems in server</div>
  }

  // console.log(JSON.parse(JSON.stringify(result)))

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
