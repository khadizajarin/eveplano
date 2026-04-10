import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  ToastAndroid,
} from 'react-native';

import app, { db } from '../hooks/firebase.config';
import {
  collection,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';

import { MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';
import AddReview from '../../components/AddReviews';
import useAuthentication from '../hooks/useAuthentication';

type CommentType = {
  email: string;
  commentText: string;
};

type ReviewType = {
  id: string;
  email: string;
  reviewtext: string;
  likedEmail: string[];
  comments: CommentType[];
};

const NAV   = '#041e4b';
const CREAM = '#fffefd';

const Reviews = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});
  const { user } = useAuthentication(app);

  console.log('Authenticated user:', user.email);

  useEffect(() => {
  const unsub = onSnapshot(collection(db, 'reviews'), (snap) => {
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      likedEmail: doc.data().likedEmail || [],
      comments: doc.data().comments || [],
    }));

    setReviews(data);
    setLoading(false);
  });

  return () => unsub(); 
}, []);

  const toggleComments = (index: number) => {
    setShowComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleLike = async (review: ReviewType) => {
    try {
      const ref = doc(db, 'reviews', review.id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        const likedEmail = data.likedEmail || [];

        if (!likedEmail.includes(user.email)) {
          await updateDoc(ref, {
            likedEmail: [...likedEmail, user.email],
          });

          ToastAndroid.show('Liked!', ToastAndroid.SHORT);
          // fetchReviews();
        } else {
          ToastAndroid.show('Already liked', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostComment = async (review: ReviewType, index: number) => {
    const text = commentTexts[index];
    if (!text) return;

    try {
      const ref = doc(db, 'reviews', review.id);

      const newComments = [
        ...(review.comments || []),
        { email: user.email, commentText: text },
      ];

      await updateDoc(ref, { comments: newComments });

      ToastAndroid.show('Comment posted', ToastAndroid.SHORT);

      setCommentTexts((prev) => ({ ...prev, [index]: '' }));
      // fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" color={NAV} />
        <Text style={styles.loaderLabel}>Loading reviews…</Text>
      </View>
    );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerAccent} />
          <View>
            <Text style={styles.eyebrow}>CLIENT FEEDBACK</Text>
            <Text style={styles.headerTitle}>See What Our Clients Say!</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* {user && ( */}
          <View style={styles.stickyAddReview}>
            <AddReview />
          </View>
          {/* ) } */}

        {/* ── Review Cards ── */}
        {reviews.map((review, index) => (
          <View key={review.id} style={styles.reviewWrapper}>

            {/* REVIEW CARD */}
            <View style={styles.card}>

              {/* Quote mark */}
              <Text style={styles.quoteMark}>&quot;</Text>

              <Text style={styles.reviewText}>
                {review.reviewtext}
              </Text>

              {/* Accent line + email */}
              <View style={styles.authorRow}>
                <View style={styles.authorLine} />
                <Text style={styles.emailText}>{review.email}</Text>
              </View>

              {/* ACTIONS */}
              <View style={styles.actionsRow}>
                {/* LIKE */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    review.likedEmail?.includes(user.email) && styles.actionBtnActive,
                  ]}
                  onPress={() => handleLike(review)}
                >
                  <MaterialCommunityIcons
                    name={
                      review.likedEmail?.includes(user.email)
                        ? 'cards-heart'
                        : 'cards-heart-outline'
                    }
                    size={17}
                     color={review.likedEmail?.includes(user.email)
                       ? CREAM : NAV}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      review.likedEmail?.includes(user.email)
                       && styles.actionTextActive,
                    ]}
                  >
                    {review.likedEmail?.length || 0}
                  </Text>
                </TouchableOpacity>

                {/* COMMENTS TOGGLE */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    showComments[index] && styles.actionBtnActive,
                  ]}
                  onPress={() => toggleComments(index)}
                >
                  <Fontisto
                    name="comments"
                    size={15}
                    color={showComments[index] ? CREAM : NAV}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      showComments[index] && styles.actionTextActive,
                    ]}
                  >
                    {review.comments?.length || 0}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── COMMENTS SECTION ── */}
            {showComments[index] && (
              <View style={styles.commentsSection}>

                {/* Thread line */}
                <View style={styles.threadLine} />

                <View style={styles.commentsInner}>
                  {review.comments?.map((c, i) => (
                    <View key={i} style={styles.commentBubble}>
                      <Text style={styles.commentText}>{c.commentText}</Text>
                      <Text style={styles.commentEmail}>— {c.email}</Text>
                    </View>
                  ))}

                  {/* ADD COMMENT */}
                  <View style={styles.inputRow}>
                    <TextInput
                      placeholder="Write a comment…"
                      placeholderTextColor="rgba(4,30,75,0.35)"
                      value={commentTexts[index] || ''}
                      onChangeText={(t) =>
                        setCommentTexts((prev) => ({ ...prev, [index]: t }))
                      }
                      style={styles.input}
                    />
                    <TouchableOpacity
                      style={styles.postBtn}
                      activeOpacity={0.82}
                      onPress={() => handlePostComment(review, index)}
                    >
                      <Text style={styles.postBtnText}>Post</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}

      </View>
    </ScrollView>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  /* ── Screen ── */
  scroll: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  loaderScreen: {
    flex: 1,
    backgroundColor: CREAM,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderLabel: {
    fontSize: 13,
    color: 'rgba(4,30,75,0.50)',
    fontWeight: '500',
    letterSpacing: 0.3,
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
    height: 62,
    backgroundColor: NAV,
    borderRadius: 2,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(4,30,75,0.45)',
    letterSpacing: 3,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: NAV,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(4,30,75,0.10)',
    marginBottom: 24,
  },

  /* ── Review Card ── */
  reviewWrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: CREAM,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.10)',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 6,
  },
  quoteMark: {
    fontSize: 52,
    lineHeight: 44,
    color: 'rgba(4,30,75,0.08)',
    fontWeight: '900',
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: NAV,
    lineHeight: 24,
    letterSpacing: 0.1,
    marginBottom: 14,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  authorLine: {
    width: 24,
    height: 2,
    backgroundColor: NAV,
    borderRadius: 1,
  },
  emailText: {
    fontSize: 12,
    color: 'rgba(4,30,75,0.55)',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  /* ── Action Buttons ── */
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(4,30,75,0.20)',
    backgroundColor: 'transparent',
  },
  actionBtnActive: {
    backgroundColor: NAV,
    borderColor: NAV,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: NAV,
    letterSpacing: 0.2,
  },
  actionTextActive: {
    color: CREAM,
  },

  /* ── Comments Section ── */
  commentsSection: {
    flexDirection: 'row',
    marginTop: 4,
    paddingLeft: 10,
  },
  threadLine: {
    width: 2,
    backgroundColor: 'rgba(4,30,75,0.12)',
    borderRadius: 1,
    marginRight: 14,
    marginTop: 6,
    marginBottom: 6,
  },
  commentsInner: {
    flex: 1,
    gap: 8,
  },
  commentBubble: {
    backgroundColor: 'rgba(4,30,75,0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.08)',
  },
  commentText: {
    fontSize: 14,
    color: NAV,
    lineHeight: 20,
    fontWeight: '500',
  },
  commentEmail: {
    fontSize: 11,
    color: 'rgba(4,30,75,0.45)',
    fontWeight: '600',
    marginTop: 5,
    letterSpacing: 0.2,
  },

  /* ── Comment Input ── */
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(4,30,75,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(4,30,75,0.12)',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
    color: NAV,
  },
  postBtn: {
    backgroundColor: NAV,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    justifyContent: 'center',
    shadowColor: NAV,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  postBtnText: {
    color: CREAM,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});