import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme } from 'react-native';
import AppContent from './AppContent';
import HomeScreen from './HomeScreen';
// import SplashScreen from 'react-native-splash-screen'; // 필요 시 사용

const Stack = createStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // 앱 준비가 끝나면 Splash 화면 숨김
    // SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={AppContent} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

  useEffect(() => {
    SplashScreen.hide(); // 앱 준비가 끝나면 Splash 화면 숨김
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const gradientAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.timing(gradientAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: false,
      })
    ).start();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    ).start();
  }, [gradientAnim, shimmerAnim]);

  const color1 = gradientAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['#FF5722', '#FFC107', '#4CAF50', '#2196F3', '#9C27B0'],
  });

  const color2 = gradientAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['#FFC107', '#4CAF50', '#2196F3', '#9C27B0', '#FF5722'],
  });

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ flex: 1 }}>
      <LinearGradient colors={[color1.__getValue(), color2.__getValue()]} style={styles.container}>
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={[styles.logoBox, pressed && styles.logoBoxPressed]}>
              <Text style={styles.logoText}>SCALP_ENGINE</Text>
              <Animated.View
                style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
                  style={styles.shimmer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>
          </Animated.View>
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoBox: { paddingVertical: 20, paddingHorizontal: 40, borderRadius: 12, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.3)' },
  logoBoxPressed: { backgroundColor: 'rgba(0,0,0,0.6)' },
  logoText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  shimmer: { flex: 1 },
});

export default App;