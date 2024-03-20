import {
  Alert,
  BackHandler,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import Board from './Board';
import {useBoard} from './hooks/useBoard';
import {usePlayer} from './hooks/usePlayer';
import {useGameStats} from './hooks/useGameStats';
import GameController from './GameController';
import GameStats from './GameStats';
import {COLORS, COLUMNS, ROWS, SCREEN_HEIGHT, SCREEN_WIDTH} from './Constants';
import Header from './Component/Header';
import {useDropTime} from './hooks/useDropTime';

export const useGameOver = () => {
  const [gameOver, setGameOver] = useState(true);

  const resetGameOver = useCallback(() => {
    setGameOver(false);
  }, []);

  return [gameOver, setGameOver, resetGameOver];
};

const PauseMenu = ({pause, setPause}: any) => {
  const [gameOver, setGameOver, resetGameOver] = useGameOver();
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };
  return (
    <Modal visible={pause} transparent animationType="slide">
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: COLORS.PURPLELIGHT,
            width: SCREEN_WIDTH * 0.8,
            height: SCREEN_HEIGHT * 0.4,
            elevation: 5,
            borderRadius: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 50,
              marginTop: 5,
            }}>
            <View style={{width: 30}} />
            <Text style={[styles.text, {fontFamily: '700'}]}>Pause Menu</Text>
            <Text onPress={() => setPause(!pause)} style={styles.close}>
              X
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setPause(!pause)}>
              <Text style={styles.text}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => resetGameOver()}>
              <Text style={styles.text}>Start New Game</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.text}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={backAction}>
              <Text style={styles.text}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Game = () => {
  const [pause, setPause] = useState(false);
  const [gameStats, addLinesCleared] = useGameStats();
  const [player, setPlayer, resetPlayer] = usePlayer();
  const [board] = useBoard({
    rows: ROWS,
    columns: COLUMNS,
    player,
    resetPlayer,
    addLinesCleared,
  });
  const [gameOver, setGameOver, resetGameOver] = useGameOver();

  useEffect(() => {
    if (gameOver) {
      Alert.alert('GameOver');
    }
    setPause(true);
  }, [gameOver]);

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <Header
        header="TETRIS"
        onPause={() => setPause(!pause)}
        pauseButton={pause}
      />
      <GameStats gameStats={gameStats} />
      <Board board={board} />
      <GameController
        board={board}
        gameStats={gameStats}
        player={player}
        setGameOver={setGameOver}
        setPlayer={setPlayer}
        pause={pause}
      />
      <PauseMenu pause={pause} setPause={setPause} />
    </SafeAreaView>
  );
};

export default Game;

const styles = StyleSheet.create({
  close: {
    fontSize: 20,
    color: COLORS.RED,
    fontWeight: '500',
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    color: COLORS.BLACK,
    fontWeight: '500',
  },
  menuButton: {
    backgroundColor: COLORS.PINK,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    elevation: 3,
  },
});
