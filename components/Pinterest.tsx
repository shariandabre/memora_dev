import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const PinterestLayout = ({ children, type }) => {
  const [numColumns, setNumColumns] = useState(2);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const { width } = dimensions;

    if (width < 480) {
      setNumColumns(2); // Mobile portrait
    } else if (width < 768) {
      setNumColumns(3); // Mobile landscape / Small tablet
    } else if (width < 1024) {
      setNumColumns(4); // Tablet
    } else if (width < 1280) {
      setNumColumns(5); // Desktop or large tablets
    } else {
      setNumColumns(6); // Desktop or large tablet
    }
  }, [dimensions]);

  const renderColumns = () => {
    const columns = Array(numColumns)
      .fill()
      .map(() => []);

    React.Children.forEach(children, (child, index) => {
      const columnIndex = index % numColumns;
      columns[columnIndex].push(child);
    });

    return columns.map((columnItems, columnIndex) => (
      <View key={`column-${columnIndex}`} style={styles.column}>
        {columnItems}
      </View>
    ));
  };

  return <View style={[styles.container, styles[type]]}>{renderColumns()}</View>;
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
  },
  notes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  folders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
});

export default PinterestLayout;
