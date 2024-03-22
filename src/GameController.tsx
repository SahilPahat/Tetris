import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {rotate} from './Component/Tetrominoes';
import {hasCollision, isWithinBoard} from './hooks/useBoard';
import {useDropTime, useInterval} from './hooks/useDropTime';
export const Action = {
  Left: 'Left',
  FastDrop: 'FastDrop',
  Pause: 'Pause',
  Quit: 'Quit',
  Right: 'Right',
  Rotate: 'Rotate',
  SlowDrop: 'SlowDrop',
};

export const Key = {
  Rotate: Action.Rotate,
  ArrowDown: Action.SlowDrop,
  Left: Action.Left,
  Right: Action.Right,
  KeyQ: Action.Quit,
  Pause: Action.Pause,
  FastDrop: Action.FastDrop,
};

export const actionIsDrop = (action: any) =>
  [Action.SlowDrop, Action.FastDrop].includes(action);

export const actionForKey = (keyCode: any) => Key[keyCode];

const attemptRotation = ({board, player, setPlayer}: any) => {
  const shape = rotate({
    piece: player.tetromino.shape,
    direction: 1,
  });

  const position = player.position;
  const isValidRotation =
    isWithinBoard({board, position, shape}) &&
    !hasCollision({board, position, shape});

  if (isValidRotation) {
    setPlayer({
      ...player,
      tetromino: {
        ...player.tetromino,
        shape,
      },
    });
  } else {
    return false;
  }
};

export const movePlayer = ({delta, position, shape, board}: any) => {
  const desiredNextPosition = {
    row: position.row + delta.row,
    column: position.column + delta.column,
  };

  const collided = hasCollision({
    board,
    position: desiredNextPosition,
    shape,
  });

  const isOnBoard = isWithinBoard({
    board,
    position: desiredNextPosition,
    shape,
  });

  const preventMove = !isOnBoard || (isOnBoard && collided);
  const nextPosition = preventMove ? position : desiredNextPosition;

  const isMovingDown = delta.row > 0;
  const isHit = isMovingDown && (collided || !isOnBoard);

  return {collided: isHit, nextPosition};
};

const attemptMovement = ({
  board,
  action,
  player,
  setPlayer,
  setGameOver,
  swipe,
}: any) => {
  const delta = {row: 0, column: 0};
  let isFastDropping = false;
  // console.log('SnextPositionDes', player.position);
  if (swipe != null || swipe != undefined) {
    if (action === Action.Left || action === Action.Right) {
      delta.column += Math.round(swipe / 30);
    }
    else if (action === Action.FastDrop) 
      isFastDropping = true;
  } else {
    if (action === Action.FastDrop) {
      isFastDropping = true;
    } else if (action === Action.SlowDrop) {
      delta.row += 1;
    } else if (action === Action.Left) {
      delta.column -= 1;
    } else if (action === Action.Right) {
      delta.column += 1;
    }
  }
  const {collided, nextPosition} = movePlayer({
    delta,
    position: player.position,
    shape: player.tetromino.shape,
    board,
  });
  // Did we collide immediately? If so, game over, man!
  const isGameOver = collided && player.position.row === 0;
  if (isGameOver) {
    setGameOver(isGameOver);
  }

  setPlayer({
    ...player,
    collided,
    isFastDropping,
    position: nextPosition,
  });
};

export const playerController = ({
  action,
  board,
  player,
  setPlayer,
  setGameOver,
  swipe,
}: any) => {
  if (!action) return;

  if (action === Action.Rotate) {
    attemptRotation({board, player, setPlayer});
  } else {
    attemptMovement({board, player, setPlayer, action, setGameOver, swipe});
  }
};

const GameController = ({
  board,
  gameStats,
  player,
  setGameOver,
  setPlayer,
  pause,
  swipeStart,
}: any) => {
  const [dropTime, pauseDropTime, resumeDropTime] = useDropTime({
    gameStats,
  });

  useInterval(() => {
    !swipeStart ? null : handleInput({action: Action.SlowDrop});
    pause ? null : handleInput({action: Action.SlowDrop});
  }, dropTime);

  const onKeyUp = code => {
    const action = actionForKey(code);
    if (actionIsDrop(action)) resumeDropTime();
  };

  const onKeyDown = code => {
    const action = actionForKey(code);
    console.log('CODE', code, action);
    if (action === Action.Pause) {
      if (dropTime) {
        pauseDropTime();
      } else {
        resumeDropTime();
      }
    } else if (action === Action.Quit) {
      setGameOver(true);
    } else {
      if (actionIsDrop(action)) pauseDropTime();
      if (!dropTime) {
        return;
      }
      handleInput({action});
    }
  };

  const handleInput = ({action}: any) => {
    playerController({
      action,
      board,
      player,
      setPlayer,
      setGameOver,
      swipe: null,
    });
  };

  return (
    <View style={{}}>
      {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => onKeyDown(Action.Rotate)}>
          <Text style={styles.text}>Rotate</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default GameController;
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
    color: 'white',
    fontSize: 25,
    fontWeight: '700',
  },
});
