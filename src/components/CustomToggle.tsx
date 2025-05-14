import React from 'react';
import {TouchableOpacity, StyleSheet, Animated} from 'react-native';

type Props = {
  isEnabled: boolean;
  onToggle: () => void;
};

const CustomToggle: React.FC<Props> = ({isEnabled, onToggle}) => {
  return (
    <TouchableOpacity
      style={[
        styles.toggleContainer,
        isEnabled ? styles.enabled : styles.disabled,
      ]}
      onPress={onToggle}
      activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.circle,
          {alignSelf: isEnabled ? 'flex-end' : 'flex-start'},
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  enabled: {
    backgroundColor: '#4cd137',
  },
  disabled: {
    backgroundColor: '#dcdde1',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
});

export default CustomToggle;
