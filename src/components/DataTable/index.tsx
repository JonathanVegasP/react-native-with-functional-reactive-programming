import { ReactElement, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

interface DataTableProps<T> {
  columns: {
    name: string;
    headerComponent?: (props: T) => ReactElement;
    component: (props: T) => ReactElement;
    key: string;
  }[];

  data: T[];
  extraData: any;
}

interface DataTabelRenderItem<T> {
  item: T;
  index: number;
  columns: DataTableProps<T>['columns'];
}

const DataTabelRenderItem = <T,>({
  index,
  item,
  columns,
}: DataTabelRenderItem<T>): ReactElement => {
  return <View style={{}}></View>;
};

const DataTable = <T,>({
  data,
  extraData,
  columns,
}: DataTableProps<T>): ReactElement => {
  return useMemo(
    () => (
      <FlatList
        data={data}
        renderItem={({ item }) => columns.map()}
        extraData={extraData}
      />
    ),
    [data],
  );
};

export {};
