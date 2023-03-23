import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Button } from 'react-native';

const commentsArr = [
  {
    comment: 'This is a very useful comment about the code.',
  },
  {
    comment: 'This comment provides additional context for the code.',
  },
  {
    comment: 'This comment explains potential issues with the code.',
  },
  {
    comment: 'This comment suggests possible improvements to the code.',
  },
  {
    comment: 'This comment summarizes the purpose of the code.',
  },
];

const RNTesterApp = () => {
  const [selectedComments, setSelectedComments] = useState([]);

  const [comments, setComments] = useState(commentsArr);

  const handleScroll = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent)) {
      // Load more comments
    }
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const handleCommentPress = (index) => {
    const newSelectedComments = [...selectedComments];
    newSelectedComments[index] = !newSelectedComments[index];
    setSelectedComments(newSelectedComments);
  };

  const handleAddComment = () => {
    const newComments = [...comments];
    newComments.push({
      comment: 'This is a new comment.',
    });
    setComments(newComments);

  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView onScroll={handleScroll}>
        {comments.map((_, index) => (
          <TouchableOpacity key={`comment-${index}`} onPress={() => handleCommentPress(index)} activeOpacity={1}>
            <View style={[styles.card, selectedComments[index] ? { backgroundColor: 'yellow' } : null, {
              flexDirection: 'row'
            }]}>
              {comments[index].comment.split(' ').map((word) => (
                <Text key={`word-${index}`}>{word} </Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Add Comment" onPress={handleAddComment} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    padding: 10,
  },
  buttonContainer: {
    margin: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default RNTesterApp;

