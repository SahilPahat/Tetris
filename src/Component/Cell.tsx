import {Dimensions, StyleSheet, Text, View, ViewProps} from 'react-native';
import React from 'react';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
type CellProps = ViewProps & {
  bac?: string;
  text?: number;
  occupied: boolean | false;
};
export const CELL_SIZE = width * 0.06;
const Cell = (props: CellProps) => (
  <View
    style={{
      height: CELL_SIZE,
      width: CELL_SIZE,
      backgroundColor: props.occupied
        ? props.bac
        : props.bac
        ? props.bac
        : 'rgba(222, 237, 255, 1)',
      borderRadius: 5,
      margin: 1,
    }}>
    {/* <Text>{props.bac}</Text> */}
  </View>
);

export default Cell;

const styles = StyleSheet.create({});
