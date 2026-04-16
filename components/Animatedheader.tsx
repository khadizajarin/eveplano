import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Easing,
} from 'react-native';

const NAV   = '#041e4b';
const CREAM = '#fffefd';
const BG    = '#03183a'; // muted navy


// ── Floating shape type ──
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
    // stronger vertical float
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -26,
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


    // gentle rotation — only squares
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


    // stronger pulse — only rings
    if (shape === 'ring') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.25,
            duration: duration * 0.7,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: duration * 0.7,
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
      // shadow for depth
      shadowColor: NAV,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
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
    // circles — a bit more opacity
    { shape: 'circle', size: 8,  x: 30,  y: 30,  duration: 2800, delay: 0,    opacity: 0.24 },
    { shape: 'circle', size: 5,  x: 80,  y: 80,  duration: 3200, delay: 400,  opacity: 0.18 },
    { shape: 'circle', size: 10, x: 160, y: 20,  duration: 2600, delay: 200,  opacity: 0.22 },
    { shape: 'circle', size: 6,  x: 240, y: 90,  duration: 3400, delay: 800,  opacity: 0.16 },
    { shape: 'circle', size: 12, x: 300, y: 40,  duration: 3000, delay: 600,  opacity: 0.20 },
    { shape: 'circle', size: 4,  x: 340, y: 130, duration: 2400, delay: 100,  opacity: 0.18 },


    // squares (rotating)
    { shape: 'square', size: 7,  x: 60,  y: 110, duration: 3600, delay: 300,  opacity: 0.16 },
    { shape: 'square', size: 10, x: 190, y: 100, duration: 4000, delay: 700,  opacity: 0.14 },
    { shape: 'square', size: 6,  x: 270, y: 60,  duration: 3200, delay: 500,  opacity: 0.18 },
    { shape: 'square', size: 9,  x: 120, y: 50,  duration: 3800, delay: 200,  opacity: 0.15 },


    // rings (pulsing)
    { shape: 'ring',   size: 20, x: 50,  y: 50,  duration: 3000, delay: 0,    opacity: 0.20 },
    { shape: 'ring',   size: 28, x: 210, y: 55,  duration: 3600, delay: 400,  opacity: 0.16 },
    { shape: 'ring',   size: 16, x: 310, y: 90,  duration: 2800, delay: 900,  opacity: 0.22 },
    { shape: 'ring',   size: 22, x: 140, y: 120, duration: 4000, delay: 200,  opacity: 0.14 },
  ];


  // calendar icon motion — more pronounced
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
    outputRange: [0, -14], // stronger bob
  });
  const calOpacity = calendarAnim.interpolate({
    inputRange:  [0, 0.5, 1],
    outputRange: [0.16, 0.24, 0.16],
  });


  return (
    <View style={styles.container}>
      {/* Floating shapes — more visible */}
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}


      {/* Calendar motif — more prominent */}
      <Animated.View
        style={[
          styles.calendar,
          { transform: [{ translateY: calY }], opacity: calOpacity },
        ]}
      >
        {/* top bar of calendar */}
        <View style={styles.calTop} />
        {/* grid dots */}
        <View style={styles.calGrid}>
          {[...Array(9)].map((_, i) => (
            <View key={i} style={styles.calDot} />
          ))}
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
    backgroundColor: BG,
  },
  shape: {
    position: 'absolute',
  },


  /* ── Calendar motif ── */
  calendar: {
    position: 'absolute',
    right: 28,
    bottom: 24,
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: CREAM,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.42,
    shadowRadius: 12,
    elevation: 12,
  },
  calTop: {
    height: 16,
    backgroundColor: CREAM,
    opacity: 0.92,
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
    opacity: 0.78,
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