import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {useDuties} from '../../../hooks/useDuties';
import DutyCard from '../../../components/common/DutyCard';
import EmptyState from '../../../components/common/EmptyState';
import {colors} from '../../../theme/colors';
import {shadows} from '../../../theme/spacing';
import {getTodayISO} from '../../../utils/dateUtils';
import {DUTY_STATUS} from '../../../constants/dutyStatus';

const StatCard = ({label, value, color, icon}) => (
  <View style={[styles.statCard, {borderTopColor: color}]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, {color}]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const officers = useSelector(state => state.officers.list);
  const {list: duties, fetchDuties, isLoading} = useDuties();

  const todayDuties = duties.filter(d => d.date === getTodayISO());
  const upcoming = duties.filter(d => d.status === DUTY_STATUS.UPCOMING).length;
  const completed = duties.filter(d => d.status === DUTY_STATUS.COMPLETED).length;
  const cancelled = duties.filter(d => d.status === DUTY_STATUS.CANCELLED).length;

  useEffect(() => {fetchDuties();}, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.name}>{user?.name || 'Admin'} 👋</Text>
          </View>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Upcoming" value={upcoming} color={colors.warning} icon="⏳" />
          <StatCard label="Completed" value={completed} color={colors.success} icon="✅" />
          <StatCard label="Cancelled" value={cancelled} color={colors.error} icon="❌" />
          <StatCard label="Officers" value={officers.length} color={colors.primary} icon="👮" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Duties</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Duties')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {todayDuties.length === 0
          ? <EmptyState icon="📋" title="No duties today" subtitle="All clear for today" />
          : todayDuties.map(d => (
              <DutyCard key={d.id} duty={d} onPress={() => navigation.navigate('Duties', {screen: 'DutyDetail', params: {dutyId: d.id}})} />
            ))
        }

        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Duties', {screen: 'CreateDuty'})}>
          <Text style={styles.fabText}>+ Create Duty</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  topBar: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: colors.primary},
  greeting: {fontSize: 13, color: 'rgba(255,255,255,0.7)'},
  name: {fontSize: 18, fontWeight: '700', color: colors.white},
  avatarBox: {width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center'},
  avatarText: {color: colors.white, fontSize: 16, fontWeight: '700'},
  statsRow: {flexDirection: 'row', padding: 12, gap: 8, backgroundColor: colors.primary, paddingBottom: 20},
  statCard: {flex: 1, backgroundColor: colors.white, borderRadius: 10, padding: 12, alignItems: 'center', borderTopWidth: 3, ...shadows.sm},
  statIcon: {fontSize: 18, marginBottom: 4},
  statValue: {fontSize: 20, fontWeight: '700'},
  statLabel: {fontSize: 10, color: colors.textSecondary, marginTop: 2, textAlign: 'center'},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14},
  sectionTitle: {fontSize: 16, fontWeight: '700', color: colors.text},
  seeAll: {fontSize: 13, color: colors.primary, fontWeight: '500'},
  fab: {margin: 16, backgroundColor: colors.primary, borderRadius: 10, padding: 15, alignItems: 'center'},
  fabText: {color: colors.white, fontWeight: '600', fontSize: 15},
});

export default AdminDashboardScreen;
