import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Cell, {CELL_SIZE} from './Component/Cell';
import Block from './MovingBlock';
import {allShapes} from './Component/shapes/allShapes';
import {Square} from './Component/shapes/Square';
import { L } from './Component/shapes/L';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
export const ROWS = 9,
  COLUMNS = 15;
const getRandom = () => {
  const random = Math.floor(Math.random() * allShapes.length);
  return allShapes[random];
};
const RandomColor = ['pink', 'green', 'purple', 'orange', 'cyan'];
let Arr = [];

// Assuming ROWS and COLUMNS are defined somewhere
for (let row = 0; row < COLUMNS; row++) {
  Arr[row] = []; // Initialize each row with an empty array
  for (let col = 0; col < ROWS; col++) {
    Arr[row][col] = row * ROWS + col; // Assign a unique value to each cell
  }
}
const Board = () => {
  const [fixedBlocks, setFixedBlocks] = useState(
    Arr,
    // Array(COLUMNS).fill(Array(ROWS).fill(null)),
  );
  const positions = useRef(new Animated.Value(height * 0.1)).current;
  const [currentShape, setCurrentShape] = useState(getRandom());
  const [currentPosition, setCurrentPosition] = useState({x: 0, y: 0});
  const [currentColor, setCurrentColor] = useState(
    RandomColor[Math.floor(Math.random() * RandomColor.length) || 0],
  );

  useEffect(() => {
    const fallAnimation = Animated.timing(positions, {
      toValue: height * 0.785 - (currentShape.length * CELL_SIZE) / 2,
      duration: 4000,
      useNativeDriver: false,
    });

    fallAnimation.start(({finished}) => {
      if (finished) {
        const newBlock = [...fixedBlocks];

        // Assuming you have a way to track the x and y position of the currentShape
        let baseX = Math.round(currentPosition.x / CELL_SIZE); // Convert to grid coordinates
        let baseY = Math.round(currentPosition.y / CELL_SIZE); // Convert to grid coordinates
        console.log(baseX, 'baseY');
        fixedBlocks.forEach((row, rowIndex) => {
          if (
            rowIndex < currentShape.length
            // typeof row[rowIndex] != 'string'
          ) {
            row.forEach((cell, cellIndex) => {
              if (
                cellIndex >
                currentShape[rowIndex].length - 1
                // typeof cell == 'string'
              )
                return;
              console.log(
                'cellIndex',
                cellIndex,
                'rowIndex',
                rowIndex,
                'baseY',
                baseY,
                baseX,
                'baseX',
                currentShape[rowIndex][cellIndex],
              );
              let targetX = baseX + cellIndex;
              let targetY = baseY + rowIndex;

              // console.log('targetX', targetX, targetY);
              // Make sure we're within the bounds of the grid
              if (
                targetX >= 0 &&
                targetX < newBlock[0].length &&
                targetY >= 0 &&
                targetY < newBlock.length &&
                currentShape[rowIndex][cellIndex]
              ) {
                // Update the color of the block that the shape occupies
                newBlock[targetY][targetX] = currentColor;
                // console.log(newBlock);
              }
              // console.log('newBlock',newBlock[targetY][targetX])
            });
          }
        });

        // Check for full rows and remove them
        const fullRows = newBlock.filter(row =>
          row.every(cell => typeof cell == 'string'),
        );
        if (fullRows.length > 0) {
          // newBlock
          for (let index = 0; index < fullRows.length; index++) {
            for (let i = 0; i < newBlock[0].length; i++) {
              newBlock[index][i] = newBlock[index][i+1];
            }
          }
        }
        setFixedBlocks(newBlock);

        setCurrentPosition({x: currentPosition.x, y: 0});
        positions.setValue(0); // Reset position for the next shape
        setCurrentShape(getRandom()); // Assuming you have a function to get the next shape
        setCurrentColor(
          RandomColor[Math.floor(Math.random() * RandomColor.length) || 0],
        ); // Assuming you have a function to pick a random color
      }
    });

    console.log(currentPosition);
    return () => {
      fallAnimation.stop(); // Stop animation if component unmounts
    };
  }, [currentShape, currentPosition]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'skyblue',
        borderRadius: 10,
        flexDirection: 'column-reverse',
        width: width * 0.9,
        height: height * 0.8,
        overflow: 'hidden',
        padding: 5,
        paddingBottom: 0,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'grey',
      }}>
      {fixedBlocks.map((item: [], index) => {
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Text>{item}</Text> */}
            {item.map((cell, index) => (
              <Cell bac={cell || index} key={index} text={cell} />
            ))}
          </View>
        );
      })}
      <Animated.View
        style={{
          // alignSelf: 'center',
          top: positions,
          position: 'absolute',
        }}>
        <Block
          currentShape={currentShape}
          currentColor={currentColor}
          setCurrentPosition={setCurrentPosition}
          setCurrentShape={setCurrentShape}
        />
      </Animated.View>
    </View>
  );
};

export default Board;

const styles = StyleSheet.create({});
