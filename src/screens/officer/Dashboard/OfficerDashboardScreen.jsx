import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useDuties} from '../../../hooks/useDuties';
import {useNotifications} from '../../../hooks/useNotifications';
import DutyCard from '../../../components/common/DutyCard';
import EmptyState from '../../../components/common/EmptyState';
import {colors} from '../../../theme/colors';
import {shadows} from '../../../theme/spacing';
import {DUTY_STATUS} from '../../../constants/dutyStatus';
import {getTodayISO} from '../../../utils/dateUtils';

const OfficerDashboardScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const {list: duties, fetchDuties, isLoading} = useDuties();
  useNotifications();

  const todayDuties = duties.filter(d => d.date === getTodayISO());
  const upcoming = duties.filter(d => d.status === DUTY_STATUS.UPCOMING).length;
  const completed = duties.filter(d => d.status === DUTY_STATUS.COMPLETED).length;
  const cancelled = duties.filter(d => d.status === DUTY_STATUS.CANCELLED).length;

  useEffect(() => {
    fetchDuties({officerId: user?.id});
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || 'Officer'} ✈️</Text>
        </View>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'O'}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Upcoming" value={upcoming} color={colors.warning} />
        <StatCard label="Completed" value={completed} color={colors.success} />
        <StatCard label="Cancelled" value={cancelled} color={colors.error} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Duties</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyDuties')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {todayDuties.length === 0
          ? <EmptyState icon="✈️" title="No duties today" subtitle="Enjoy your day off!" />
          : todayDuties.map(d => (
              <DutyCard key={d.id} duty={d} onPress={() => navigation.navigate('MyDuties', {screen: 'DutyDetail', params: {dutyId: d.id}})} />
            ))
        }
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({label, value, color}) => (
  <View style={[styles.statCard, {borderTopColor: color}]}>
    <Text style={[styles.statValue, {color}]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  topBar: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: colors.primary},
  greeting: {fontSize: 13, color: 'rgba(255,255,255,0.7)'},
  name: {fontSize: 18, fontWeight: '700', color: colors.white},
  avatarBox: {width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center'},
  avatarText: {color: colors.white, fontSize: 16, fontWeight: '700'},
  statsRow: {flexDirection: 'row', padding: 12, gap: 8, backgroundColor: colors.primary, paddingBottom: 20},
  statCard: {flex: 1, backgroundColor: colors.white, borderRadius: 10, padding: 12, alignItems: 'center', borderTopWidth: 3, ...shadows.sm},
  statValue: {fontSize: 22, fontWeight: '700'},
  statLabel: {fontSize: 11, color: colors.textSecondary, marginTop: 2},
  scroll: {padding: 16},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12},
  sectionTitle: {fontSize: 16, fontWeight: '700', color: colors.text},
  seeAll: {fontSize: 13, color: colors.primary, fontWeight: '500'},
});

export default OfficerDashboardScreen;
