import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {addOfficerSchema} from '../../../utils/validationSchemas';
import {addOfficer as addOfficerApi} from '../../../api/officerApi';
import {addOfficer} from '../../../store/slices/officerSlice';
import AppInput from '../../../components/common/AppInput';
import AppButton from '../../../components/common/AppButton';
import {colors} from '../../../theme/colors';

const AddOfficerScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm({
    resolver: yupResolver(addOfficerSchema),
    defaultValues: {name: '', phone: '', email: '', employeeId: ''},
  });

  const onSubmit = async data => {
    try {
      const res = await addOfficerApi({...data, isEnabled: true});
      dispatch(addOfficer(res.data));
      Toast.show({type: 'success', text1: 'Officer Added', text2: `${data.name} has been added successfully`});
      navigation.goBack();
    } catch (err) {
      Toast.show({type: 'error', text1: 'Error', text2: err?.message || 'Failed to add officer'});
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Add Officer</Text>
        <View style={{width: 60}} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Controller control={control} name="name" render={({field: {onChange, value}}) => (
          <AppInput label="Full Name" value={value} onChangeText={onChange} placeholder="Enter full name" autoCapitalize="words" error={errors.name?.message} />
        )} />
        <Controller control={control} name="employeeId" render={({field: {onChange, value}}) => (
          <AppInput label="Employee ID" value={value} onChangeText={onChange} placeholder="e.g. EMP001" error={errors.employeeId?.message} />
        )} />
        <Controller control={control} name="phone" render={({field: {onChange, value}}) => (
          <AppInput label="Phone Number" value={value} onChangeText={onChange} placeholder="10-digit mobile number" keyboardType="phone-pad" error={errors.phone?.message} />
        )} />
        <Controller control={control} name="email" render={({field: {onChange, value}}) => (
          <AppInput label="Email" value={value} onChangeText={onChange} placeholder="officer@gttdata.ai" keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
        )} />
        <AppButton title="Add Officer" onPress={handleSubmit(onSubmit)} loading={isSubmitting} style={styles.btn} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border},
  back: {color: colors.primary, fontSize: 15},
  title: {fontSize: 18, fontWeight: '700', color: colors.text},
  content: {padding: 16},
  btn: {marginTop: 8},
});

export default AddOfficerScreen;
