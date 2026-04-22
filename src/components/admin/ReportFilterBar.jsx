import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {colors} from '../../theme/colors';
import {DUTY_STATUS} from '../../constants/dutyStatus';
import {AIRPORTS} from '../../constants/dutyFormFields';

const FilterChip = ({label, active, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, active && styles.chipActive]}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const ReportFilterBar = ({filters, onChange}) => (
  <View style={styles.container}>
    <Text style={styles.label}>Status</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
      <FilterChip label="All" active={!filters.status} onPress={() => onChange({status: null})} />
      {Object.values(DUTY_STATUS).map(s => (
        <FilterChip key={s} label={s} active={filters.status === s} onPress={() => onChange({status: s})} />
      ))}
    </ScrollView>
    <Text style={styles.label}>Airport</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
      <FilterChip label="All" active={!filters.airport} onPress={() => onChange({airport: null})} />
      {AIRPORTS.map(a => (
        <FilterChip key={a} label={a} active={filters.airport === a} onPress={() => onChange({airport: a})} />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border},
  label: {fontSize: 11, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase'},
  row: {marginBottom: 10},
  chip: {paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginRight: 8, backgroundColor: colors.white},
  chipActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  chipText: {fontSize: 12, color: colors.textSecondary},
  chipTextActive: {color: colors.white, fontWeight: '600'},
});

export default ReportFilterBar;
