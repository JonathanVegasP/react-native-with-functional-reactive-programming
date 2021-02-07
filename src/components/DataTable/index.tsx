import React, { ReactElement, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    flex: 1,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 2,
  },
});

interface DataTableProps<T = unknown> {
  columns: {
    name: string;
    headerComponent?: () => ReactElement;
    component: (props: { item: T; extraData: any }) => ReactElement;
    key: string;
  }[];

  data: T[];
  extraData?: any;
}

export type { DataTableProps };

interface DataTableHeaderProps<T> {
  columns: DataTableProps<T>['columns'];
}

const DataTableHeaderCell = React.memo(
  <T,>({ headerComponent, name }: DataTableProps<T>['columns'][0]) => {
    return (
      <View style={styles.cell}>
        {headerComponent ? headerComponent() : <Text>{name}</Text>}
      </View>
    );
  },
  (prev, actual) =>
    (actual.headerComponent != null &&
      prev.headerComponent === actual.headerComponent) ||
    prev.name === actual.name,
);

const DataTableHeader = React.memo(
  <T,>({ columns }: DataTableHeaderProps<T>) => {
    return (
      <View style={styles.row}>
        {columns.map((item, i) => (
          <DataTableHeaderCell {...(item as any)} key={`${i}`} />
        ))}
      </View>
    );
  },
  (prev, actual) => prev.columns === actual.columns,
);

interface DataTableRenderItemProps<T> {
  item: T;
  index: number;
  columns: DataTableProps<T>['columns'];
  extraData: any;
}

interface DataTableCellProps<T> {
  item: T;
  column: DataTableProps<T>['columns'][0];
  extraData: any;
}
const DataTableCell = React.memo(
  <T,>({ column: { component }, item, extraData }: DataTableCellProps<T>) => {
    return <View style={styles.cell}>{component({ item, extraData })}</View>;
  },
  (prev, actual) =>
    prev.column === actual.column &&
    prev.extraData === actual.extraData &&
    prev.item === actual.item,
);

const DataTableRenderItem = React.memo(
  <T,>({ item, columns, extraData }: DataTableRenderItemProps<T>) => {
    return (
      <View style={styles.row}>
        {columns.map((props, i) => (
          <DataTableCell
            extraData={extraData}
            column={props as any}
            item={item}
            key={`${i}`}
          />
        ))}
      </View>
    );
  },
  (prev, actual) =>
    prev.columns === actual.columns &&
    prev.item === actual.item &&
    prev.extraData === actual.extraData,
);

const DataTable = React.memo(
  <T,>({ data, extraData, columns }: DataTableProps<T>): ReactElement => {
    const renderItem = useCallback<ListRenderItem<T>>(
      (props) => (
        <DataTableRenderItem
          {...props}
          extraData={extraData}
          columns={columns as any}
        />
      ),
      [columns, extraData],
    );
    const keyExtactor = useCallback((_, index) => `${index}`, []);

    return (
      <FlatList
        data={data}
        ListHeaderComponent={<DataTableHeader columns={columns as any} />}
        renderItem={renderItem}
        extraData={extraData}
        keyExtractor={keyExtactor}
      />
    );
  },
  (prev, actual) =>
    prev.extraData === actual.extraData &&
    prev.data === actual.data &&
    prev.columns === actual.columns,
);

export { DataTable };
