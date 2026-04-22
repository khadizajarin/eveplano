import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedView } from '@/components/themed-view';
import { AntDesign,Ionicons  } from '@expo/vector-icons';

const NAV   = '#041e4b';
const CREAM = '#fffefd';
const BG    = '#f8f9fa'; 

export default function Contact() {
  const handleSend = () => {
    alert('Message sent!');
  };


  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerAccent} />
          <View>
            <Text style={styles.eyebrow}>CONTACT</Text>
            <Text style={styles.headerTitle}>Get in Touch</Text>
          </View>
        </View>
        <View style={styles.divider} />

        <ThemedView style={styles.contentCard}>
          <View style={styles.infoBlock}>
            <Text style={styles.subtitle}>
              Have questions or feedback about EvePlano? We’d love to hear from you.
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="rgba(4,30,75,0.40)"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="rgba(4,30,75,0.40)"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Write your message here..."
              placeholderTextColor="rgba(4,30,75,0.40)"
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSend}
            activeOpacity={0.82}
          >
            <Text style={styles.primaryButtonText}>Send Message</Text>
          </TouchableOpacity>

         <View style={styles.footerInfo}>
          <Text style={styles.stayText}>Stay connected with us</Text>

          <View style={styles.footerRow}>
            <Ionicons name="mail" size={16} color="rgba(4,30,75,0.60)" />
            <Text style={styles.footerItem}>eveplano@example.com</Text>
          </View>

          <View style={styles.footerRow}>
            <Ionicons name="call" size={16} color="rgba(4,30,75,0.60)" />
            <Text style={styles.footerItem}>+880 1712 345678</Text>
          </View>

          <View style={styles.footerRow}>
            <Ionicons name="earth" size={16} color="rgba(4,30,75,0.60)" />
            <Text style={styles.footerItem}>www.eveplano.com</Text>
          </View>

          <View style={styles.footerRow}>
            <Ionicons name="logo-facebook" size={16} color="rgba(61,89,152,1)" />
            <Text style={styles.footerItem}>facebook.com/eveplano</Text>
          </View>

          <View style={styles.footerRow}>
            <Ionicons name="logo-instagram" size={16} color="rgba(212,75,126,1)" />
            <Text style={styles.footerItem}>instagram.com/eveplano</Text>
          </View>

          <View style={styles.footerRow}>
            <Ionicons name="logo-pinterest" size={16} color="#bd081c" />
            <Text style={styles.footerItem}>pinterest.com/eveplano</Text>
          </View>
        </View>
        </ThemedView>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 48,
  },
  infoBlock: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'BJCree-Bold',
    fontSize: 28,
    color: NAV,
    letterSpacing: -0.6,
    lineHeight: 34,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'BJCree-Regular',
    fontSize: 13,
    color: 'rgba(4,30,75,0.62)',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontFamily: 'BJCree-Bold',
    fontSize: 11,
    color: 'rgba(4,30,75,0.55)',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  input: {
    fontFamily: 'BJCree-Regular',
    fontSize: 14,
    color: NAV,
    backgroundColor: 'rgba(4,30,75,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.12)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 50,
    backgroundColor: NAV,
    marginVertical: 18,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryButtonText: {
    fontFamily: 'BJCree-Bold',
    color: CREAM,
    fontSize: 15,
    letterSpacing: 0.8,
  },

  footerInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  stayText: {
    fontFamily: 'BJCree-Regular',
    fontSize: 13,
    color: 'rgba(4,30,75,0.55)',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  mailText: {
    fontFamily: 'BJCree-Bold',
    fontSize: 14,
    color: NAV,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  headerAccent: {
    width: 4,
    height: 52,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  eyebrow: {
    fontFamily: 'BJCree-Bold',
    fontSize: 10,
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
    marginBottom: 5,
  },
  headerTitle: {
    fontFamily: 'BJCree-Bold',
    fontSize: 28,
    color: NAV,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
    marginBottom: 18,
  },

  contentCard: {
    backgroundColor: CREAM,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.10)',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 6,
  },
 
footerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginVertical: 4,
},
footerItem: {
  fontFamily: 'BJCree-Regular',
  fontSize: 12,
  color: 'rgba(4,30,75,0.60)',
  letterSpacing: 0.2,
},
});