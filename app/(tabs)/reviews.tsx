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

import { db } from '../hooks/firebase.config';
import {
  collection,
  updateDoc,
  doc,
  getDocs,
  getDoc,
} from 'firebase/firestore';

import { MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';

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

const Reviews = () => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});

  // 👉 fake user (replace with auth later)
  const user = { email: 'test@gmail.com' };

  const fetchReviews = async () => {
    try {
      const snap = await getDocs(collection(db, 'reviews'));

      const data: ReviewType[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ReviewType, 'id'>),
        likedEmail: doc.data().likedEmail || [],
        comments: doc.data().comments || [],
      }));

      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
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
          fetchReviews();
        } else {
          ToastAndroid.show('Already liked', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostComment = async (
    review: ReviewType,
    index: number
  ) => {
    const text = commentTexts[index];

    if (!text) return;

    try {
      const ref = doc(db, 'reviews', review.id);

      const newComments = [
        ...(review.comments || []),
        {
          email: user.email,
          commentText: text,
        },
      ];

      await updateDoc(ref, {
        comments: newComments,
      });

      ToastAndroid.show('Comment posted', ToastAndroid.SHORT);

      setCommentTexts((prev) => ({
        ...prev,
        [index]: '',
      }));

      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <ScrollView>
      <View style={styles.container}>

        <Text style={styles.header}>
          See What Our Clients Say!
        </Text>

        {reviews.map((review, index) => (
          <View key={review.id}>

            {/* REVIEW */}
            <View style={styles.card}>
              <Text style={styles.review}>
                "{review.reviewtext}"
              </Text>

              <Text style={styles.email}>
                — {review.email}
              </Text>

              {/* ACTIONS */}
              <View style={styles.row}>

                {/* LIKE */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLike(review)}
                >
                  <Text style={styles.btnText}>
                    {review.likedEmail?.length || 0}{' '}
                    <MaterialCommunityIcons
                      name={
                        review.likedEmail?.includes(user.email)
                          ? 'cards-heart'
                          : 'cards-heart-outline'
                      }
                      size={18}
                      color="#AB8C56"
                    />
                  </Text>
                </TouchableOpacity>

                {/* COMMENTS COUNT */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => toggleComments(index)}
                >
                  <Text style={styles.btnText}>
                    {review.comments?.length || 0}{' '}
                    <Fontisto name="comments" size={16} color="#AB8C56" />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* COMMENTS */}
            {showComments[index] && (
              <View style={{ marginLeft: 10 }}>

                {review.comments?.map((c, i) => (
                  <View key={i} style={styles.commentBox}>
                    <Text>{c.commentText}</Text>
                    <Text style={styles.commentEmail}>
                      — {c.email}
                    </Text>
                  </View>
                ))}

                {/* ADD COMMENT */}
                <View style={styles.commentInputRow}>
                  <TextInput
                    placeholder="Write comment..."
                    value={commentTexts[index] || ''}
                    onChangeText={(t) =>
                      setCommentTexts((prev) => ({
                        ...prev,
                        [index]: t,
                      }))
                    }
                    style={styles.input}
                  />

                  <TouchableOpacity
                    style={styles.postBtn}
                    onPress={() =>
                      handlePostComment(review, index)
                    }
                  >
                    <Text style={styles.btnText}>Post</Text>
                  </TouchableOpacity>
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
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  card: {
    backgroundColor: 'rgba(201,170,116,0.3)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  review: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  email: {
    marginTop: 5,
    fontStyle: 'italic',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  button: {
    backgroundColor: '#3A3D42',
    padding: 10,
    borderRadius: 5,
  },

  btnText: {
    color: '#AB8C56',
    fontWeight: 'bold',
  },

  commentBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f1f2f6',
    borderRadius: 6,
  },

  commentEmail: {
    fontSize: 12,
    color: '#777',
  },

  commentInputRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 5,
  },

  input: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    padding: 8,
    borderRadius: 5,
  },

  postBtn: {
    backgroundColor: '#3A3D42',
    padding: 10,
    borderRadius: 5,
  },
});