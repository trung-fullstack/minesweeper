import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import SessionControl from './session/SessionControl'
import Board from './board/Board'

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ bgcolor: '#e4f0e2', height: '100vh' }}>
        <SessionControl />
        <Board />
      </Box>
    </Container>
  )
}

export default App
