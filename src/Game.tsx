import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Board from './Board'

const Game = () => {
  console.log('readsa')
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <View style={{height: '10%'}} />
        <Board />
    </SafeAreaView>
  )
}

export default Game

const styles = StyleSheet.create({})