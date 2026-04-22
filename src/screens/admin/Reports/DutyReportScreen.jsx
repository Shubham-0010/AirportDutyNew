import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {fetchReportStart, fetchDutyReportSuccess, fetchReportFailure} from '../../../store/slices/reportSlice';
import {getDutyReport} from '../../../api/reportApi';
import ReportFilterBar from '../../../components/admin/ReportFilterBar';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import {colors} from '../../../theme/colors';
import {formatDate} from '../../../utils/dateUtils';
import {isIncentiveEligible} from '../../../utils/incentiveUtils';

const DutyReportScreen = () => {
  const dispatch = useDispatch();
  const {dutyReport, isLoading} = useSelector(state => state.reports);
  const [filters, setFilters] = useState({status: null, airport: null});

  useEffect(() => {
    const load = async () => {
      dispatch(fetchReportStart());
      try {
        const res = await getDutyReport(filters);
        dispatch(fetchDutyReportSuccess(res.data));
      } catch (e) {
        dispatch(fetchReportFailure(e?.message));
      }
    };
    load();
  }, [filters]);

  const handleExport = () => Alert.alert('Export', 'Export functionality requires react-native-share & react-native-fs setup');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Duty Report</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={handleExport}>
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>
      <ReportFilterBar filters={filters} onChange={f => setFilters(prev => ({...prev, ...f}))} />
      <FlatList
        data={dutyReport}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({item, index}) => (
          <View style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
            <Text style={[styles.cell, {flex: 0.5}]}>{item.srNo || index + 1}</Text>
            <Text style={[styles.cell, {flex: 1.5}]}>{item.officerName}</Text>
            <Text style={[styles.cell, {flex: 1}]}>{formatDate(item.date, 'DD/MM')}</Text>
            <Text style={[styles.cell, {flex: 0.8}]}>{item.airport}</Text>
            <StatusBadge status={item.status} small />
            {isIncentiveEligible(item.officeType) && <Text style={styles.incentive}>₹500</Text>}
          </View>
        )}
        ListHeaderComponent={
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.headerCell, {flex: 0.5}]}>#</Text>
            <Text style={[styles.headerCell, {flex: 1.5}]}>Officer</Text>
            <Text style={[styles.headerCell, {flex: 1}]}>Date</Text>
            <Text style={[styles.headerCell, {flex: 0.8}]}>Airport</Text>
            <Text style={[styles.headerCell, {flex: 1}]}>Status</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={() => setFilters({...filters})}
        ListEmptyComponent={<EmptyState icon="📊" title="No report data" subtitle="Adjust filters to view duties" />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border},
  title: {fontSize: 20, fontWeight: '700', color: colors.text},
  exportBtn: {backgroundColor: colors.secondary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8},
  exportText: {color: colors.white, fontWeight: '600', fontSize: 13},
  list: {padding: 12},
  tableHeader: {backgroundColor: colors.primary},
  tableRow: {flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 6, marginBottom: 2},
  tableRowAlt: {backgroundColor: '#F9FAFB'},
  cell: {fontSize: 12, color: colors.text},
  headerCell: {fontSize: 11, fontWeight: '700', color: colors.white},
  incentive: {fontSize: 10, fontWeight: '700', color: '#92400E', backgroundColor: '#FEF3C7', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4},
});

export default DutyReportScreen;
