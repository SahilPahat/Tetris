import {Dimensions, StyleSheet, Text, View, ViewProps} from 'react-native';
import React from 'react';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
type CellProps = ViewProps & {
  bac?: string;
  text?: number
};
export const CELL_SIZE = width * 0.095
const Cell = (props: CellProps) => (
  <View
    style={{
      height: CELL_SIZE,
      width: CELL_SIZE,
      backgroundColor: typeof props.bac == 'string' ? props.bac : 'lightgrey',
      borderRadius: 5,
      margin: 1,
    }}><Text>{props.text}</Text></View>
);

export default Cell;

const styles = StyleSheet.create({});
