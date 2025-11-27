import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const NewsBanner = ({ title, description, imageUrl }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: imageUrl }}
        style={styles.image}
        imageStyle={styles.imageBorderRadius}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 180,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageBorderRadius: {
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    color: '#f5f5f5',
  },
});

export default NewsBanner;
