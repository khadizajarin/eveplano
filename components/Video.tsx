import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import YouTubePlayer from 'react-native-youtube-iframe';

const NAV   = '#041e4b';
const CREAM = '#fffefd';

const Video = () => {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('Video finished');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>BEHIND THE SCENES</Text>
          <Text style={styles.title}>How EvePlano Works</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ── Video Card ── */}
      <View style={styles.card}>

        {/* Description */}
        <Text style={styles.description}>
          Want to know more about the working process of EvePlano? Watch this video!
        </Text>

        {/* Player */}
        <View style={styles.playerWrapper}>
          <YouTubePlayer
            height={210}
            play={playing}
            videoId="I-XjdcpfXoI"
            onChangeState={onStateChange}
          />
        </View>

      </View>

    </View>
  );
};

export default Video;

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
    // backgroundColor: CREAM,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  headerAccent: {
    width: 4,
    height: 50,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  eyebrow: {
    fontFamily: 'BJCree-Regular',
    fontSize: 10,
    // fontWeight: '700',
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
    marginBottom: 5,
  },
  title: {
    fontFamily: 'BJCree-Bold',
    fontSize: 22,
    // fontWeight: '800',
    color: NAV,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
    marginBottom: 24,
  },

  /* ── Card ── */
  card: {
    backgroundColor: CREAM,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.10)',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 8,
  },
  description: {
    fontFamily: 'BJCree-Regular',
    fontSize: 14,
    color: 'rgba(4,30,75,0.62)',
    lineHeight: 22,
    letterSpacing: 0.1,
    marginBottom: 16,
  },

  /* ── Player ── */
  playerWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    // marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.08)',
  },

  /* ── Button ── */
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: NAV,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    elevation: 8,
  },
  buttonPause: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: NAV,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonIcon: {
    fontSize: 14,
    color: CREAM,
  },
  buttonText: {
    color: CREAM,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.8,
  },
});