import { Obx, ContextFactory, useObservable } from './src/observable';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';

import { ContextActionsProps } from './src/observable/interfaces/contextActionsProps';
import { Observable } from './src/observable/interfaces/observable';
import { DataTable, DataTableProps } from './src/components/DataTable';

const initialState = { color: '#000', backgroundColor: '#fff' };

const revertStyle = ({
  setState,
}: ContextActionsProps<typeof initialState>) => () => {
  setState((state) => {
    return { backgroundColor: state.color, color: state.backgroundColor };
  });
};

const { useContext, useContextActions } = ContextFactory(initialState, {
  revertStyle,
});

const RevertStyleComponent = () => {
  const { color, backgroundColor } = useContext();
  const { revertStyle } = useContextActions();

  return (
    <TouchableWithoutFeedback onPress={revertStyle}>
      <View style={{ ...styles.buttonStyle, backgroundColor }}>
        <Text style={{ color }}>Revert Style with a Reactive Context</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const CounterComponent = ({ counter }: { counter: Observable<number> }) => {
  const increment = useCallback(() => {
    counter.value!++;
  }, []);

  return (
    <TouchableWithoutFeedback onPress={increment}>
      <View style={styles.buttonStyle}>
        <Text>A counter with a Reactive Functional Component</Text>
        <Text>Counter: {counter.value!}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const RenderCell = React.memo(
  ({ extraData }: { extraData: Observable<number> }) => (
    <Text>{`${extraData}`}</Text>
  ),
  (prev, actual) => prev.extraData === actual.extraData,
);

const App = () => {
  const counter = useObservable(0);
  const stream = useObservable(0);

  const obxComponent = useCallback(() => {
    counter.value;
    return <CounterComponent counter={counter} />;
  }, []);

  const _columns = useRef<DataTableProps>();

  if (_columns.current == null) {
    _columns.current = {
      columns: [
        {
          component: ({ extraData }) => <RenderCell extraData={extraData} />,
          key: '',
          name: 'Item',
        },
        {
          component: ({ extraData }) => <RenderCell extraData={extraData} />,
          key: '',
          name: 'Item',
        },
        {
          component: ({ extraData }) => <RenderCell extraData={extraData} />,
          key: '',
          name: 'Item',
        },
        {
          component: ({ extraData }) => <RenderCell extraData={extraData} />,
          key: '',
          name: 'Item',
        },
        {
          component: ({ extraData }) => <RenderCell extraData={extraData} />,
          key: '',
          name: 'Item',
        },
        {
          component: ({ extraData }) => <RenderCell extraData={extraData} />,
          key: '',
          name: 'Item',
        },
      ],
      data: (() => {
        const data = [];
        for (let i = 0; i < 200; i++) {
          data.push(i);
        }
        return data;
      })(),
    };
  }

  const columns = _columns.current!;

  const render = useCallback(
    () => (
      <DataTable
        columns={columns.columns}
        data={columns.data}
        extraData={stream.value}
      />
    ),
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => stream.value!++, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Obx>{obxComponent}</Obx>
        <RevertStyleComponent />
        <Obx>{render}</Obx>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
  },
});

export default App;
