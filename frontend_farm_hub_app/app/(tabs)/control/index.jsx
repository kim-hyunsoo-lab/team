import axios from 'axios'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PYTHOM_URL } from '../../../constants/appConst'

const ControlScreen = () => {

  //조회된 지정 데이터를 저장할 state 변수
  const [sensorData, setSensorData] = useState({
    'temp' : null,
    'air' : null,
    'ill' : null
  });

  const router = useRouter();

  //컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    axios.get(`${PYTHOM_URL}/selectAllData`)
    .then(res => {
      setSensorData(res.data);
      console.log(res.data);
    })
    .catch(e => console.log(e));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>축사 기기 제어</Text>

      <View style={styles.control}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/fanControl')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>환기 팬</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>ON</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>현재 지정 온도</Text>
              <Text style={styles.value}>{sensorData.temp}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.label}>현재 지정 공기질</Text>
              <Text style={styles.value}>{sensorData.air}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push('/ledControl')}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>LED</Text>
            <View style={[styles.statusBadge, styles.statusBadgeOff]}>
              <Text style={styles.statusText}>OFF</Text>
            </View>
          </View>
          <View style={styles.cardContentCentered}>
            <View style={styles.infoRowSpaced}>
              <Text style={styles.label}>현재 지정 조도</Text>
              <Text style={styles.value}>{sensorData.ill}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ControlScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  control: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  statusBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeOff: {
    backgroundColor: '#9e9e9e',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 20,
  },
  cardContentCentered: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    gap : 8
  },
  infoRowSpaced: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: 4,
  },
})