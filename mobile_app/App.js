import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default function App() {
  useEffect(() => {
    // 알림 권한 요청
    messaging().requestPermission();

    // FCM 토큰 가져오기
    messaging().getToken().then(token => {
      console.log("FCM Token:", token);
      // 서버에 토큰 저장 -> 특정 사용자에게 알림 전송 가능
    });

    // 포그라운드 메시지 수신
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("푸시 알림 수신:", remoteMessage);
      alert(`알림: ${remoteMessage.notification.title}`);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <Text>SCALP_ENGINE 앱 - 푸시 알림 준비 완료</Text>
    </View>
  );
}