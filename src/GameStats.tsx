import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const GameStats = ({gameStats}: any) => {
  const {level, points, linesCompleted, linesPerLevel} = gameStats;
  const linesToLevel = linesPerLevel - linesCompleted;
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', }}>
        <Text style={styles.text}>Points: </Text>
        <Text style={styles.text}>{points}</Text>
      </View>
    </View>
  );
};

export default GameStats;

const styles = StyleSheet.create({
  buttons: {
    backgroundColor: 'skyblue',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 15,
    fontWeight: '700',
  },
});
