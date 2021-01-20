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
  setState((state) => ({
    color: state.backgroundColor,
    backgroundColor: state.color,
  }));
};

const { useContext, useContextActions } = ContextFactory(initialState, {
  revertStyle,
});

const RevertStyleComponent = () => {
  const { color, backgroundColor } = useContext();
  const { revertStyle } = useContextActions();

  console.log('this component should be rendered only when pressed');

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

  console.log(
    'This component will be rendered as the button is pressed like',
    counter.value,
  );

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

  console.log('this should not be rendered more than one time');

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
