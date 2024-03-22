import { View, Text } from 'react-native'
import React from 'react'
import Game from './src/GameCore/Game'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import Board from './src/Board'
import Cell from './src/Component/Cell'
const App = () => {
  const navigationRef = createNavigationContainerRef()
  return (
    <NavigationContainer
      ref={navigationRef}
      >
      <Game />
    </NavigationContainer>
  )
}

export default App