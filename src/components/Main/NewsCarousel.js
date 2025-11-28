import React, { useEffect, useRef, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { getNews } from '../../services/newsService';
import NewsBanner from './NewsBanner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AUTO_SCROLL_INTERVAL = 5000;

const NewsCarousel = () => {
  const { theme } = useContext(ThemeContext);

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);

  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNews(data || []);
      } catch (err) {
        setError('No se pudieron cargar las novedades');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (!news || news.length <= 1 || !containerWidth) {
      return;
    }

    intervalRef.current && clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % news.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            x: nextIndex * containerWidth,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [news, containerWidth]);

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = containerWidth ? Math.round(offsetX / containerWidth) : 0;
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  if (error || !news || news.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          {error || 'No hay novedades disponibles en este momento.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Novedades</Text>
      <View
        style={styles.carouselContainer}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          if (width && width !== containerWidth) {
            setContainerWidth(width);
          }
        }}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        >
          {news.map((item) => (
            <View
              key={item.id}
              style={{
                width: containerWidth,
              }}
            >
              <NewsBanner
                title={item.titulo}
                description={item.descripcion}
                imageUrl={item.img_url}
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.dotsContainer}>
          {news.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  container: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  carouselContainer: {
    width: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#007bff',
  },
  dotInactive: {
    backgroundColor: '#cccccc',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default NewsCarousel;
