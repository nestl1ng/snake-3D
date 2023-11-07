import { configureStore } from '@reduxjs/toolkit'
import gameReducer from '../../components/features/gameSlice'

export default configureStore({
  reducer: {
    initGame: gameReducer
  }
})