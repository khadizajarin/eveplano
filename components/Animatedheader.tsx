import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Easing } from 'react-native';

const CREAM = '#fffefd';

// ── Individual floating shape ──
type ShapeProps = {
  size: number;
  shape: 'circle' | 'square' | 'ring';
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
};

const FloatingShape: React.FC<ShapeProps> = ({
  size, shape, x, y, duration, delay, opacity,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate     = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Float up and down
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -14,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gentle rotation (squares only)
    if (shape === 'square') {
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: duration * 3,
          delay,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }

    // Gentle pulse (rings only)
    if (shape === 'ring') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.15,
            duration: duration * 0.8,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: duration * 0.8,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shapeStyle = [
    styles.shape,
    {
      width: size,
      height: size,
      left: x,
      top: y,
      opacity,
      borderRadius:
        shape === 'circle' ? size / 2
        : shape === 'ring'  ? size / 2
        : 4,
      backgroundColor:
        shape === 'ring' ? 'transparent' : CREAM,
      borderWidth:  shape === 'ring' ? 1.5 : 0,
      borderColor:  shape === 'ring' ? CREAM : 'transparent',
    },
  ];

  return (
    <Animated.View
      style={[
        ...shapeStyle,
        {
          transform: [
            { translateY },
            { rotate: shape === 'square' ? rotateInterpolate : '0deg' },
            { scale: shape === 'ring' ? scale : 1 },
          ],
        },
      ]}
    />
  );
};

// ── Main animated header ──
const AnimatedHeader: React.FC = () => {
  const shapes: ShapeProps[] = [
    // circles
    { shape: 'circle', size: 8,  x: 30,  y: 30,  duration: 2800, delay: 0,    opacity: 0.18 },
    { shape: 'circle', size: 5,  x: 80,  y: 80,  duration: 3200, delay: 400,  opacity: 0.12 },
    { shape: 'circle', size: 10, x: 160, y: 20,  duration: 2600, delay: 200,  opacity: 0.15 },
    { shape: 'circle', size: 6,  x: 240, y: 90,  duration: 3400, delay: 800,  opacity: 0.10 },
    { shape: 'circle', size: 12, x: 300, y: 40,  duration: 3000, delay: 600,  opacity: 0.14 },
    { shape: 'circle', size: 4,  x: 340, y: 130, duration: 2400, delay: 100,  opacity: 0.12 },

    // squares (rotating)
    { shape: 'square', size: 7,  x: 60,  y: 110, duration: 3600, delay: 300,  opacity: 0.10 },
    { shape: 'square', size: 10, x: 190, y: 100, duration: 4000, delay: 700,  opacity: 0.08 },
    { shape: 'square', size: 6,  x: 270, y: 60,  duration: 3200, delay: 500,  opacity: 0.12 },
    { shape: 'square', size: 9,  x: 120, y: 50,  duration: 3800, delay: 200,  opacity: 0.09 },

    // rings (pulsing)
    { shape: 'ring',   size: 20, x: 50,  y: 50,  duration: 3000, delay: 0,    opacity: 0.12 },
    { shape: 'ring',   size: 28, x: 210, y: 55,  duration: 3600, delay: 400,  opacity: 0.10 },
    { shape: 'ring',   size: 16, x: 310, y: 90,  duration: 2800, delay: 900,  opacity: 0.13 },
    { shape: 'ring',   size: 22, x: 140, y: 120, duration: 4000, delay: 200,  opacity: 0.08 },
  ];

  // Calendar icon lines — subtle event-management motif
  const calendarAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(calendarAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(calendarAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const calY = calendarAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, -10],
  });
  const calOpacity = calendarAnim.interpolate({
    inputRange:  [0, 0.5, 1],
    outputRange: [0.12, 0.20, 0.12],
  });

  return (
    <View style={styles.container}>
      {/* Floating shapes */}
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}

      {/* Calendar motif — center */}
      <Animated.View
        style={[
          styles.calendar,
          { transform: [{ translateY: calY }], opacity: calOpacity },
        ]}
      >
        {/* outer box */}
        <View style={styles.calBox}>
          {/* top bar */}
          <View style={styles.calTop} />
          {/* grid dots */}
          <View style={styles.calGrid}>
            {[...Array(9)].map((_, i) => (
              <View key={i} style={styles.calDot} />
            ))}
          </View>
        </View>
        {/* binding hooks */}
        <View style={[styles.calHook, { left: 14 }]} />
        <View style={[styles.calHook, { right: 14 }]} />
      </Animated.View>
    </View>
  );
};

export default AnimatedHeader;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  shape: {
    position: 'absolute',
  },

  /* ── Calendar motif ── */
  calendar: {
    position: 'absolute',
    right: 28,
    bottom: 24,
    width: 64,
    height: 64,
  },
  calBox: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: CREAM,
    overflow: 'hidden',
  },
  calTop: {
    height: 16,
    backgroundColor: CREAM,
    opacity: 0.9,
  },
  calGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 6,
    gap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calDot: {
    width: 6,
    height: 6,
    borderRadius: 2,
    backgroundColor: CREAM,
    opacity: 0.7,
  },
  calHook: {
    position: 'absolute',
    top: -6,
    width: 4,
    height: 10,
    borderRadius: 2,
    backgroundColor: CREAM,
    opacity: 0.7,
  },
});