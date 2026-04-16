import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../hooks/firebase.config";
import useAuthentication from "../hooks/useAuthentication";

const NAV = "#041e4b";
const CREAM = "#fffefd";

type UserType = {
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role?: string;
  country?: CountryState;
  division?: DivisionState;
  city?: CityState;
};

const LOCATIONS = {
  BD: {
    name: "Bangladesh",
    divisions: {
      DHAKA: {
        name: "Dhaka Division",
        cities: ["Dhaka", "Narsingdi", "Gazipur", "Narayanganj"],
      },
      CHITTAGONG: {
        name: "Chittagong Division",
        cities: ["Chittagong", "Cox's Bazar"],
      },
      KHULNA: {
        name: "Khulna Division",
        cities: ["Khulna", "Jessore", "Kushtia"],
      },
      RAJSHAHI: {
        name: "Rajshahi Division",
        cities: ["Rajshahi", "Rangpur"],
      },
      BARISHAL: {
        name: "Barishal Division",
        cities: ["Barishal"],
      },
      SYLHET: {
        name: "Sylhet Division",
        cities: ["Sylhet", "Sunamganj"],
      },
    },
  },
  IND: {
    name: "India",
    divisions: {
      WB: {
        name: "West Bengal",
        cities: ["Kolkata", "Siliguri", "Darjeeling"],
      },
      MAH: {
        name: "Maharashtra",
        cities: ["Mumbai", "Pune"],
      },
      TLNG: {
        name: "Telangana",
        cities: ["Hyderabad"],
      },
      TN: {
        name: "Tamil Nadu",
        cities: ["Chennai"],
      },
    },
  },
  NPR: {
    name: "Nepal",
    divisions: {
      KTM: {
        name: "Kathmandu Valley",
        cities: ["Kathmandu", "Bhaktapur", "Lalitpur"],
      },
      POKHARA: {
        name: "Pokhara Zone",
        cities: ["Pokhara"],
      },
      RUPANDEHI: {
        name: "Rupandehi",
        cities: ["Butwal", "Bhairahawa"],
      },
    },
  },
} as const;

type LOCATIONS_TYPE = typeof LOCATIONS;

type CountryKey = keyof LOCATIONS_TYPE;

type DivisionKey = keyof (typeof LOCATIONS)[CountryKey]["divisions"];

type CountryState = CountryKey | null;
type DivisionState = DivisionKey | null;
type CityState = string | null;
const COUNTRY_KEYS = Object.keys(LOCATIONS) as CountryKey[];

export default function Profile() {
  const { user, auth } = useAuthentication();

  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // form fields
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [country, setCountry] = useState<CountryState>(null);
  const [division, setDivision] = useState<DivisionState>(null);
  const [city, setCity] = useState<CityState>(null);

  const [showCountryList, setShowCountryList] = useState(false);
  const [showDivisionList, setShowDivisionList] = useState(false);
  const [showCityList, setShowCityList] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      const q = query(
        collection(db, "users"),
        where("email", "==", user.email),
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const data: UserType = snap.docs[0].data() as UserType;
        setUserData(data);

        if (data.country && data.country in LOCATIONS) {
          setCountry(data.country as CountryKey);
        }
        if (data.division && data.country) {
          const c = data.country as CountryKey;
          if (data.division in LOCATIONS[c].divisions) {
            setDivision(data.division as DivisionKey);
          }
        }
        setCity(data.city || null);
      } else {
        const minimal: UserType = {
          email: user.email,
          role: "user",
        };
        setUserData(minimal);
      }

      setIsLoading(false);
    };

    fetchUser();
  }, [user]);

  const handleLogOut = async () => {
    await signOut(auth);
    await AsyncStorage.clear();
    router.replace("/login");
    ToastAndroid.show("Logged out", ToastAndroid.SHORT);
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled) setPhotoURL(res.assets[0].uri);
  };

  const handleUpdateProfile = async () => {
    if (!user || !userData) return;

    const updated: UserType = {
      email: user.email!,
      displayName: displayName || userData.displayName,
      phoneNumber: phoneNumber || userData.phoneNumber,
      photoURL: photoURL || userData.photoURL,
      role: userData.role,
      country,
      division,
      city,
    };

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    await updateDoc(ref, updated);

    setUserData(updated);
    setShowUpdateForm(false);
    ToastAndroid.show("Profile updated", ToastAndroid.SHORT);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" color={NAV} />
        <Text style={styles.loaderText}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View>
          <Text style={styles.eyebrow}>ACCOUNT</Text>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* ── Avatar Block ── */}
      <View style={styles.avatarBlock}>
        <View style={styles.avatarRing}>
          {userData?.photoURL ? (
            <Image
              source={{ uri: userData.photoURL }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <AntDesign name="user" size={68} color="rgba(4,30,75,0.28)" />
            </View>
          )}
        </View>
        <Text style={styles.avatarName}>
          {userData?.displayName || "No Name Set"}
        </Text>
        <Text style={styles.avatarEmail}>{userData?.email || ""}</Text>
      </View>

      {/* ── Info Card ── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.accentLine} />
          <Text style={styles.cardLabel}>Profile Info</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NAME</Text>
          <Text style={styles.infoValue}>{userData?.displayName || "—"}</Text>
        </View>
        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>EMAIL</Text>
          <Text style={styles.infoValue}>{userData?.email || "—"}</Text>
        </View>
        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>PHONE</Text>
          <Text style={styles.infoValue}>{userData?.phoneNumber || "—"}</Text>
        </View>
        <View style={styles.infoDivider} />
         <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ROLE</Text>
          <Text style={styles.infoValue}>{userData?.role || "—"}</Text>
        </View>
        <View style={styles.infoDivider} />

        {userData?.country && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>COUNTRY</Text>
              <Text style={styles.infoValue}>
                {LOCATIONS[userData.country].name}
              </Text>
            </View>
            <View style={styles.infoDivider} />
          </>
        )}

        {userData?.country && userData?.division && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>DIVISION</Text>
              <Text style={styles.infoValue}>
                {LOCATIONS[userData.country].divisions[userData.division].name}
              </Text>
            </View>
            <View style={styles.infoDivider} />
          </>
        )}

        {userData?.city && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CITY</Text>
            <Text style={styles.infoValue}>{userData.city}</Text>
          </View>
        )}
      </View>

      {/* ── Buttons ── */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setShowUpdateForm(true)}
        activeOpacity={0.82}
      >
        <Text style={styles.primaryButtonText}>Edit Profile</Text>
        <Text style={styles.buttonArrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.outlineButton}
        onPress={handleLogOut}
        activeOpacity={0.75}
      >
        <Text style={styles.outlineButtonText}>Log Out</Text>
      </TouchableOpacity>

      {/* ── UPDATE MODAL ── */}
      <Modal visible={showUpdateForm} animationType="slide">
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerAccent} />
            <View>
              <Text style={styles.eyebrow}>ACCOUNT</Text>
              <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Fields Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.accentLine} />
              <Text style={styles.cardLabel}>Update Details</Text>
            </View>

            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Display Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="rgba(4,30,75,0.30)"
                defaultValue={userData?.displayName || ""}
                onChangeText={setDisplayName}
              />
            </View>

            {/* Phone */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="rgba(4,30,75,0.30)"
                defaultValue={userData?.phoneNumber || ""}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            {/* Photo URL */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Photo URL</Text>
              <TextInput
                style={styles.input}
                placeholder="Paste image URL"
                placeholderTextColor="rgba(4,30,75,0.30)"
                defaultValue={userData?.photoURL || ""}
                onChangeText={setPhotoURL}
              />
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={pickImage}
                activeOpacity={0.75}
              >
                <Text style={styles.outlineButtonText}>Pick from Gallery</Text>
              </TouchableOpacity>
            </View>

            {/* LOCATION: 3‑level dropdown */}
            {/* Country */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Country</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowCountryList((prev) => !prev)}
              >
                <Text style={styles.dropdownValue}>
                  {country ? LOCATIONS[country].name : "Select Country"}
                </Text>
                <Text style={styles.dropdownIcon}>
                  {showCountryList ? "˄" : "˅"}
                </Text>
              </TouchableOpacity>

              {showCountryList && (
                <View style={styles.dropdownListContainer}>
                  {COUNTRY_KEYS.map((key) => (
                    <TouchableOpacity
                      key={key}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCountry(key);
                        setDivision(null);
                        setCity(null);
                        setShowCountryList(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>
                        {LOCATIONS[key].name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Division */}
            {country && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Division</Text>
                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setShowDivisionList((prev) => !prev)}
                >
                  <Text style={styles.dropdownValue}>
                    {division
                      ? LOCATIONS[country].divisions[division].name
                      : "Select Division"}
                  </Text>
                  <Text style={styles.dropdownIcon}>
                    {showDivisionList ? "˄" : "˅"}
                  </Text>
                </TouchableOpacity>

                {showDivisionList && (
                  <View style={styles.dropdownListContainer}>
                    {Object.keys(LOCATIONS[country].divisions).map((key) => (
                      <TouchableOpacity
                        key={key}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setDivision(key as DivisionKey);
                          setCity(null);
                          setShowDivisionList(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          {LOCATIONS[country].divisions[key].name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* city */}

            {country && division && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>City</Text>
                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setShowCityList((prev) => !prev)}
                >
                  <Text style={styles.dropdownValue}>
                    {city || "Select City"}
                  </Text>
                  <Text style={styles.dropdownIcon}>
                    {showCityList ? "˄" : "˅"}
                  </Text>
                </TouchableOpacity>

                {showCityList && (
                  <View style={styles.dropdownListContainer}>
                    {LOCATIONS[country].divisions[division].cities.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setCity(c);
                          setShowCityList(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleUpdateProfile}
            activeOpacity={0.82}
          >
            <Text style={styles.primaryButtonText}>Save Changes</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.ghostButton}
            onPress={() => setShowUpdateForm(false)}
            activeOpacity={0.75}
          >
            <Text style={styles.ghostButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>


      {/* ── Header ── */}
      <View style={styles.AdminHeader}>
        <View style={styles.headerAccent} />
        <View>
          <Text style={styles.eyebrow}>ADMIN</Text>
          <Text style={styles.headerTitle}>Management</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Admin-only button */}
      {userData?.role === "admin" && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/admin/adminUsers")}
          activeOpacity={0.82}
        >
          <Text style={styles.primaryButtonText}>Manage Users</Text>
        </TouchableOpacity>
      )}
      {userData?.role === "admin" && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/admin/adminBookings")}
          activeOpacity={0.82}
        >
          <Text style={styles.primaryButtonText}>Manage Bookings</Text>
        </TouchableOpacity>
      )}

            
    </ScrollView>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 48,
  },

  /* ── Loader ── */
  loaderScreen: {
    flex: 1,
    backgroundColor: CREAM,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loaderText: {
    fontFamily: "BJCree-Regular",
    fontSize: 13,
    color: "rgba(4,30,75,0.50)",
    letterSpacing: 0.3,
  },

  /* ── Header ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  AdminHeader: {
    paddingTop:60,
    flexDirection: "row",
    alignItems: "center",
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
    fontFamily: "BJCree-Bold",
    fontSize: 10,
    color: "rgba(4,30,75,0.45)",
    letterSpacing: 3,
    marginBottom: 5,
  },
  headerTitle: {
    fontFamily: "BJCree-Bold",
    fontSize: 30,
    color: NAV,
    letterSpacing: -0.7,
    lineHeight: 36,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(4,30,75,0.10)",
    marginBottom: 28,
  },

  /* ── Avatar ── */
  avatarBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: NAV,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    overflow: "hidden",
    backgroundColor: "rgba(4,30,75,0.05)",
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarName: {
    fontFamily: "BJCree-Bold",
    fontSize: 20,
    color: NAV,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  avatarEmail: {
    fontFamily: "BJCree-Regular",
    fontSize: 13,
    color: "rgba(4,30,75,0.50)",
    letterSpacing: 0.2,
  },

  /* ── Info Card ── */
  card: {
    backgroundColor: CREAM,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(4,30,75,0.10)",
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 6,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  accentLine: {
    width: 4,
    height: 20,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  cardLabel: {
    fontFamily: "BJCree-Bold",
    fontSize: 12,
    color: "rgba(4,30,75,0.55)",
    letterSpacing: 1.5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
  },
  infoDivider: {
    height: 1,
    backgroundColor: "rgba(4,30,75,0.07)",
  },
  infoLabel: {
    fontFamily: "BJCree-Bold",
    fontSize: 10,
    color: "rgba(4,30,75,0.40)",
    letterSpacing: 2,
  },
  infoValue: {
    fontFamily: "BJCree-Regular",
    fontSize: 14,
    color: NAV,
    letterSpacing: 0.1,
    maxWidth: "65%",
    textAlign: "right",
  },

  /* ── Buttons ── */
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: NAV,
    paddingVertical: 15,
    borderRadius: 50,
    marginBottom: 12,
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryButtonText: {
    fontFamily: "BJCree-Bold",
    color: CREAM,
    fontSize: 14,
    letterSpacing: 0.8,
  },
  buttonArrow: {
    color: CREAM,
    fontSize: 16,
    fontWeight: "700",
    opacity: 0.65,
  },
  outlineButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "rgba(4,30,75,0.25)",
    marginBottom: 12,
    marginTop: 10,
  },
  outlineButtonText: {
    fontFamily: "BJCree-Bold",
    color: NAV,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  ghostButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  ghostButtonText: {
    fontFamily: "BJCree-Regular",
    color: "rgba(4,30,75,0.40)",
    fontSize: 13,
    letterSpacing: 0.3,
  },

  /* ── Modal Fields ── */
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: "BJCree-Bold",
    fontSize: 11,
    color: "rgba(4,30,75,0.55)",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    fontFamily: "BJCree-Regular",
    backgroundColor: "rgba(4,30,75,0.05)",
    borderWidth: 1,
    borderColor: "rgba(4,30,75,0.12)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: NAV,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(4,30,75,0.05)",
    borderWidth: 1,
    borderColor: "rgba(4,30,75,0.12)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 4,
  },
  dropdownLabel: {
    fontFamily: "BJCree-Regular",
    fontSize: 14,
    color: NAV,
    opacity: 0.9,
  },
  dropdownChevron: {
    paddingHorizontal: 8,
  },
  dropdownArrow: {
    fontFamily: "BJCree-Bold",
    fontSize: 16,
    color: NAV,
  },

  bookingsContainer: {
    marginTop: 16,
  },

  dropdownField: {
    marginBottom: 14,
  },
  dropdownInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(4,30,75,0.05)",
    borderWidth: 1,
    borderColor: "rgba(4,30,75,0.12)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownValue: {
    fontFamily: "BJCree-Regular",
    fontSize: 14,
    color: NAV,
  },
  dropdownIcon: {
    fontFamily: "BJCree-Bold",
    color: "rgba(4,30,75,0.40)",
    fontSize: 12,
  },
  dropdownListContainer: {
    maxHeight: 200,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(4,30,75,0.12)",
    marginTop: 4,
    shadowColor: "rgba(4,30,75,0.12)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(4,30,75,0.08)",
  },
  dropdownItemText: {
    fontFamily: "BJCree-Regular",
    fontSize: 14,
    color: NAV,
  },
  
});
