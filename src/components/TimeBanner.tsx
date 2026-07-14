import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const twoDigits = (value: number) => value.toString().padStart(2, '0');
const CLOCK_LINE_HEIGHT = 19;

const formatDateTime = (date: Date) => ({
  day: twoDigits(date.getDate()),
  hours: twoDigits(date.getHours()),
  minutes: twoDigits(date.getMinutes()),
  month: twoDigits(date.getMonth() + 1),
  seconds: twoDigits(date.getSeconds()),
});

type RollingTokenProps = {
  value: string;
};

function RollingToken({ value }: RollingTokenProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const rollProgress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (value === currentValue) {
      return;
    }

    setPreviousValue(currentValue);
    setCurrentValue(value);
    rollProgress.setValue(0);

    Animated.timing(rollProgress, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [currentValue, rollProgress, value]);

  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.rollingToken}>
      <Text style={[styles.text, styles.measureText]}>{currentValue}</Text>
      <Animated.Text
        style={[
          styles.text,
          styles.rollingText,
          {
            opacity: rollProgress.interpolate({
              inputRange: [0, 0.82, 1],
              outputRange: [1, 0.18, 0],
            }),
            transform: [
              {
                translateY: rollProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -CLOCK_LINE_HEIGHT],
                }),
              },
            ],
          },
        ]}
      >
        {previousValue}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.text,
          styles.rollingText,
          {
            opacity: rollProgress.interpolate({
              inputRange: [0, 0.18, 1],
              outputRange: [0, 0.82, 1],
            }),
            transform: [
              {
                translateY: rollProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [CLOCK_LINE_HEIGHT, 0],
                }),
              },
            ],
          },
        ]}
      >
        {currentValue}
      </Animated.Text>
    </View>
  );
}

export function TimeBanner() {
  const [now, setNow] = useState(() => new Date());
  const [bannerWidth, setBannerWidth] = useState(350);
  const shimmerProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerProgress, {
          duration: 1000,
          easing: Easing.linear,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.delay(60),
      ]),
    );

    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerProgress]);

  const displayParts = useMemo(() => formatDateTime(now), [now]);
  const displayValue = `${displayParts.month}月${displayParts.day}日  ${displayParts.hours}:${displayParts.minutes}:${displayParts.seconds}`;

  return (
    <View
      accessibilityLabel={`Current date and time: ${displayValue}`}
      onLayout={(event) => setBannerWidth(event.nativeEvent.layout.width)}
      style={styles.shell}
    >
      <LinearGradient
        colors={['#43CB3D', '#58D64D', '#79DB62']}
        end={{ x: 1, y: 0.5 }}
        start={{ x: 0, y: 0.5 }}
        style={styles.gradient}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.shimmer,
            {
              transform: [
                {
                  translateX: shimmerProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, bannerWidth + 360],
                  }),
                },
                { skewX: '-16deg' },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.20)', 'rgba(255,255,255,0.82)', 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0)']}
            end={{ x: 1, y: 0.5 }}
            start={{ x: 0, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <View style={styles.clockRow}>
          <RollingToken value={displayParts.month} />
          <Text style={styles.text}>月</Text>
          <RollingToken value={displayParts.day} />
          <Text style={styles.text}>日</Text>
          <View style={styles.dateTimeGap} />
          <RollingToken value={displayParts.hours} />
          <Text style={styles.text}>:</Text>
          <RollingToken value={displayParts.minutes} />
          <Text style={styles.text}>:</Text>
          <RollingToken value={displayParts.seconds} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderColor: 'rgba(15, 18, 20, 0.38)',
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 3,
    width: '100%',
  },
  gradient: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  clockRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: CLOCK_LINE_HEIGHT,
  },
  dateTimeGap: {
    width: 8,
  },
  measureText: {
    opacity: 0,
  },
  rollingText: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  rollingToken: {
    height: CLOCK_LINE_HEIGHT,
    overflow: 'hidden',
  },
  shimmer: {
    bottom: 0,
    left: -180,
    position: 'absolute',
    top: 0,
    width: 180,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
    letterSpacing: 1.6,
    lineHeight: 19,
  },
});
