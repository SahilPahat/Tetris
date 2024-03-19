import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {COLUMNS, ROWS} from './Board';
import Cell, {CELL_SIZE} from './Component/Cell';
import {allShapes} from './Component/shapes/allShapes';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const MovingBlocks = ({
  currentColor,
  currentShape,
  setCurrentShape,
  setCurrentPosition,
}: any) => {
  const move = useRef(new Animated.ValueXY()).current;
  const rotateRef = useRef<any>(new Animated.Value(0)).current;
  function transposeArray(array: any) {
    return array[0].map((_: any, columnIndex: number) =>
      array.map((row: any) => row[columnIndex]),
    );
  }
  function isSquare(shape: []) {
    // Check if the shape has the same number of rows and columns
    return shape === transposeArray(shape);
  }
  // console.log(currentShape)
  function rotateShape(currentShape: any, angle: number) {
    // Define constants for angles
    const ANGLE_90 = 90;
    const ANGLE_180 = 180;
    const ANGLE_270 = 270;
    // Transpose the current shape
    let rotatedShape;
    switch (angle) {
      case ANGLE_90:
        rotatedShape = transposeArray(currentShape.slice()).map((row: any) =>
          row.reverse(),
        );
        break;
      case ANGLE_180:
        rotatedShape = transposeArray(
          transposeArray(currentShape.slice()).map((row: any) => row.reverse()),
        ).map((row: any) => row.reverse());
        break;
      case ANGLE_270:
        rotatedShape = transposeArray(
          transposeArray(
            transposeArray(currentShape.slice()).map((row: any) =>
              row.reverse(),
            ),
          ).map((row: any) => row.reverse()),
        ).map((row: any) => row.reverse());
        break;
      default:
        // No rotation needed
        rotatedShape = currentShape;
        break;
    }

    return rotatedShape;
  }

  const rotation = () => {
    const newValue = rotateRef._value + 90;
    const rotate = rotateShape(currentShape, newValue);
    setCurrentShape(rotate);
    Animated.timing(rotateRef, {
      toValue: newValue >= 360 ? 0 : newValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
    rotateRef.setValue(newValue >= 360 ? 0 : newValue);
  };
  let newX, newY;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // onPanResponderMove: Animated.event([null, {dx: move.x, dy: move.y}], {
      //   useNativeDriver: false,
      // }),
      onPanResponderMove: (evt, gestureState) => {
        // Calculate the new positions
        newX = gestureState.dx;
        newY = gestureState.dy;

        // Boundary checks
        const leftBoundary = 0;
        const rightBoundary = Dimensions.get('window').width - CELL_SIZE; // Assuming you have a BLOCK_WIDTH constant
        const topBoundary = 0;
        const bottomBoundary = Dimensions.get('window').height - CELL_SIZE; // Assuming BLOCK_HEIGHT

        // Constrain newX and newY within the boundaries
        newX = Math.max(leftBoundary, Math.min(newX, rightBoundary));
        newY = Math.max(topBoundary, Math.min(newY, bottomBoundary));

        // Now, update the position with the constrained values
        Animated.event([null, {dx: move.x, dy: move.y}], {
          useNativeDriver: false,
        })(evt, {dx: newX, dy: newY});
      },

      onPanResponderRelease(e, gestureState) {
        setCurrentPosition({x: newX, y: newY});
        console.log('move.y._value', move.y, move.x);
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [
            {translateY: move.y},
            {translateX: move.x},
            {
              rotate: rotateRef.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}>
      <View onTouchStart={rotation} style={{flex: 1}}>
        {currentShape.map((item: [], index: number) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {item.map((cell: number, cellIndex: number) => {
                if (cell == 0) return;
                return <Cell bac={currentColor} key={cellIndex} text={cell} />;
              })}
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default MovingBlocks;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: 'skyblue',
    borderRadius: 10,
    padding: 5,
    zIndex: 1,
    // paddingBottom: 12
  },
});
