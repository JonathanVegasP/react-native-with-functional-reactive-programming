import { Obx, ContextFactory, useObservable } from './src/observable';
import React, { useCallback } from 'react';
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

const App = () => {
  const counter = useObservable(0);

  const obxComponent = useCallback(() => {
    counter.value;
    return <CounterComponent counter={counter} />;
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Obx>{obxComponent}</Obx>
          <RevertStyleComponent />
        </ScrollView>
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
