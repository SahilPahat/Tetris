import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Cell from '../Component/Cell';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../Constants';
import {buildBoard} from '../hooks/useBoard';
import {transferToBoard} from '../Component/Tetrominoes';

const NextBox = ({tetrominoes}: any) => {
  const {shape, color} = tetrominoes;
  const board = buildBoard({rows: 4, columns: 4});
  board.rows = transferToBoard({
    color,
    isOccupied: false,
    position: {row: 0, column: 0},
    rows: board.rows,
    shape,
  });
  return (
    <View
      style={{
        flex: 1,
        top: SCREEN_HEIGHT * 0.1,
        marginRight: -SCREEN_WIDTH * 0.1,
      }}>
      {board.rows.map((row: [], index: number) => {
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {row.map((cell: any, x) => {
              return <Cell occupied={cell.occupied} key={x} bac={cell.color} />;
            })}
          </View>
        );
      })}
    </View>
  );
};

export default NextBox;

const styles = StyleSheet.create({});
