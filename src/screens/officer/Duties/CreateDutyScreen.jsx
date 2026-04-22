// Officer's CreateDuty — same form as admin but officer is pre-filled
import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import {dutySchema} from '../../../utils/validationSchemas';
import {useDuties} from '../../../hooks/useDuties';
import AppInput from '../../../components/common/AppInput';
import AppButton from '../../../components/common/AppButton';
import {colors} from '../../../theme/colors';
import {AIRPORTS, OFFICE_TYPES, ARRIVAL_DEPARTURE, CITIES} from '../../../constants/dutyFormFields';
import {getDayFromDate, toAPIDate, toAPITime} from '../../../utils/dateUtils';
import moment from 'moment';

const OfficerCreateDutyScreen = () => {
  const navigation = useNavigation();
  const {addDuty} = useDuties();
  const {user} = useSelector(state => state.auth);
  const officers = useSelector(state => state.officers.list);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReportingTimePicker, setShowReportingTimePicker] = useState(false);
  const [showFlightTimePicker, setShowFlightTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportingTime, setReportingTime] = useState(new Date());
  const [flightTime, setFlightTime] = useState(new Date());

  const [officeTypeOpen, setOfficeTypeOpen] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [arrDepOpen, setArrDepOpen] = useState(false);
  const [airportOpen, setAirportOpen] = useState(false);

  const {control, handleSubmit, setValue, watch, formState: {errors, isSubmitting}} = useForm({
    resolver: yupResolver(dutySchema),
    defaultValues: {
      officerId: user?.id?.toString() || '',
      date: toAPIDate(new Date()), reportingTime: '',
      officeType: '', from: '', to: '', flightNo: '', flightTime: '',
      officerName: user?.name || '', arrivalDeparture: '', airport: '',
    },
  });

  const dateValue = watch('date');
  const dayValue = dateValue ? getDayFromDate(dateValue) : '';

  const cityItems = CITIES.map(c => ({label: c, value: c}));

  const onSubmit = async data => {
    const result = await addDuty(data);
    if (result) navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.title}>Create Duty</Text></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" nestedScrollEnabled>

        <AppInput
          label="Subordinate Name"
          value={user?.name || ''}
          editable={false}
          style={styles.readOnly}
        />

        <Text style={styles.lbl}>Date & Day</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.dateBtn, {flex: 2}]} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateBtnText}>{moment(selectedDate).format('DD MMM YYYY')}</Text>
          </TouchableOpacity>
          <View style={[styles.dayBox, {flex: 1}]}><Text style={styles.dayText}>{dayValue}</Text></View>
        </View>
        {showDatePicker && <DateTimePicker value={selectedDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(_, d) => {setShowDatePicker(false); if (d) {setSelectedDate(d); setValue('date', toAPIDate(d));}}} />}

        <Text style={styles.lbl}>Reporting Time</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowReportingTimePicker(true)}>
          <Text style={styles.dateBtnText}>{moment(reportingTime).format('hh:mm A')}</Text>
        </TouchableOpacity>
        {showReportingTimePicker && <DateTimePicker value={reportingTime} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(_, t) => {setShowReportingTimePicker(false); if (t) {setReportingTime(t); setValue('reportingTime', toAPITime(t));}}} />}

        <Text style={styles.lbl}>Office / Holiday Type</Text>
        <Controller control={control} name="officeType" render={({field: {onChange, value}}) => (
          <DropDownPicker open={officeTypeOpen} setOpen={setOfficeTypeOpen} value={value} setValue={cb => onChange(cb(value))} items={OFFICE_TYPES} placeholder="Select Type" style={styles.dropdown} dropDownContainerStyle={styles.dropdownList} zIndex={5000} listMode="SCROLLVIEW" />
        )} />
        {errors.officeType && <Text style={styles.err}>{errors.officeType.message}</Text>}

        <Text style={styles.lbl}>From</Text>
        <Controller control={control} name="from" render={({field: {onChange, value}}) => (
          <DropDownPicker open={fromOpen} setOpen={setFromOpen} value={value} setValue={cb => onChange(cb(value))} items={cityItems} placeholder="Select From City" style={styles.dropdown} searchable dropDownContainerStyle={styles.dropdownList} zIndex={4000} listMode="SCROLLVIEW" />
        )} />
        {errors.from && <Text style={styles.err}>{errors.from.message}</Text>}

        <Text style={styles.lbl}>To</Text>
        <Controller control={control} name="to" render={({field: {onChange, value}}) => (
          <DropDownPicker open={toOpen} setOpen={setToOpen} value={value} setValue={cb => onChange(cb(value))} items={cityItems} placeholder="Select To City" style={styles.dropdown} searchable dropDownContainerStyle={styles.dropdownList} zIndex={3000} listMode="SCROLLVIEW" />
        )} />
        {errors.to && <Text style={styles.err}>{errors.to.message}</Text>}

        <Controller control={control} name="flightNo" render={({field: {onChange, value}}) => (
          <AppInput label="Flight No" value={value} onChangeText={onChange} placeholder="e.g. 6E 201" autoCapitalize="characters" error={errors.flightNo?.message} />
        )} />

        <Text style={styles.lbl}>Flight Time</Text>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowFlightTimePicker(true)}>
          <Text style={styles.dateBtnText}>{moment(flightTime).format('hh:mm A')}</Text>
        </TouchableOpacity>
        {showFlightTimePicker && <DateTimePicker value={flightTime} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(_, t) => {setShowFlightTimePicker(false); if (t) {setFlightTime(t); setValue('flightTime', toAPITime(t));}}} />}

        <Controller control={control} name="officerName" render={({field: {value}}) => (
          <AppInput label="Name of Officer" value={value} editable={false} style={styles.readOnly} />
        )} />

        <Text style={styles.lbl}>Arrival / Departure</Text>
        <Controller control={control} name="arrivalDeparture" render={({field: {onChange, value}}) => (
          <DropDownPicker open={arrDepOpen} setOpen={setArrDepOpen} value={value} setValue={cb => onChange(cb(value))} items={ARRIVAL_DEPARTURE} placeholder="Select" style={styles.dropdown} dropDownContainerStyle={styles.dropdownList} zIndex={2000} listMode="SCROLLVIEW" />
        )} />
        {errors.arrivalDeparture && <Text style={styles.err}>{errors.arrivalDeparture.message}</Text>}

        <Text style={styles.lbl}>Airport</Text>
        <Controller control={control} name="airport" render={({field: {onChange, value}}) => (
          <DropDownPicker open={airportOpen} setOpen={setAirportOpen} value={value} setValue={cb => onChange(cb(value))} items={AIRPORTS.map(a => ({label: a, value: a}))} placeholder="Select Airport" style={styles.dropdown} dropDownContainerStyle={styles.dropdownList} zIndex={1000} listMode="SCROLLVIEW" />
        )} />
        {errors.airport && <Text style={styles.err}>{errors.airport.message}</Text>}

        <AppButton title="Submit Duty" onPress={handleSubmit(onSubmit)} loading={isSubmitting} style={styles.btn} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  header: {padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border},
  title: {fontSize: 20, fontWeight: '700', color: colors.text},
  content: {padding: 16, paddingBottom: 40},
  lbl: {fontSize: 13, fontWeight: '500', color: colors.textSecondary, marginBottom: 5, marginTop: 8},
  row: {flexDirection: 'row', gap: 10, marginBottom: 8},
  dateBtn: {borderWidth: 1.5, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 11, backgroundColor: colors.surface, marginBottom: 8},
  dateBtnText: {fontSize: 15, color: colors.text},
  dayBox: {borderWidth: 1.5, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 11, backgroundColor: colors.background, justifyContent: 'center'},
  dayText: {fontSize: 14, color: colors.textSecondary},
  dropdown: {borderColor: colors.border, borderRadius: 8, backgroundColor: colors.surface, marginBottom: 4},
  dropdownList: {borderColor: colors.border},
  err: {fontSize: 11, color: colors.error, marginBottom: 8},
  readOnly: {backgroundColor: '#F3F4F6', color: '#6B7280'},
  btn: {marginTop: 16},
});

export default OfficerCreateDutyScreen;
