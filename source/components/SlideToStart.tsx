import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface SlideToStartProps {
  onSlideComplete: () => void;
  width?: number;
  height?: number;
  disabled?: boolean;
}

const SlideToStart: React.FC<SlideToStartProps> = ({ 
  onSlideComplete, 
  width = Dimensions.get('window').width - 40,
  height = 60,
  disabled = false 
}) => {
  const [sliderWidth] = useState(width);
  const [sliderHeight] = useState(height);
  const buttonWidth = sliderHeight - 10;
  const translation = useRef(new Animated.Value(0)).current;
  const [complete, setComplete] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gestureState) => {
        const newValue = Math.max(0, Math.min(gestureState.dx, sliderWidth - buttonWidth));
        translation.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= sliderWidth - buttonWidth - 50) {
          Animated.timing(translation, {
            toValue: sliderWidth - buttonWidth,
            duration: 100,
            useNativeDriver: true,
          }).start(() => {
            setComplete(true);
            onSlideComplete();
          });
        } else {
          Animated.timing(translation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View
      style={[
        styles.container,
        {
          width: sliderWidth,
          height: sliderHeight,
          opacity: disabled ? 0.5 : 1
        }
      ]}
    >
      <View style={styles.track}>
        <Text style={styles.text}>DESLIZA PARA COMENZAR</Text>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.button,
          {
            width: buttonWidth,
            height: buttonWidth,
            transform: [{ translateX: translation }],
          },
        ]}
      >
        <Ionicons size={24} color="white" name='chevron-forward-circle' />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.textSelection,
    borderRadius: 10,
    overflow: 'hidden',
  },
  track: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.textSelection,
    borderRadius: 10,
    position: 'absolute',
    top: 4,
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.textSelection,
    fontSize: 16,
    fontWeight: 'regular',
  },
});

export default SlideToStart;

