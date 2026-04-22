import React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors} from '../theme/colors';
import AdminDashboardScreen from '../screens/admin/Dashboard/AdminDashboardScreen';
import AllDutiesScreen from '../screens/admin/Duties/AllDutiesScreen';
import CreateDutyScreen from '../screens/admin/Duties/CreateDutyScreen';
import DutyDetailScreen from '../screens/admin/Duties/DutyDetailScreen';
import OfficerListScreen from '../screens/admin/Officers/OfficerListScreen';
import AddOfficerScreen from '../screens/admin/Officers/AddOfficerScreen';
import EditOfficerScreen from '../screens/admin/Officers/EditOfficerScreen';
import DutyReportScreen from '../screens/admin/Reports/DutyReportScreen';
import SubordinateReportScreen from '../screens/admin/Reports/SubordinateReportScreen';

const Tab = createBottomTabNavigator();
const DutyStack = createNativeStackNavigator();
const OfficerStack = createNativeStackNavigator();
const ReportStack = createNativeStackNavigator();

const DutiesNavigator = () => (
  <DutyStack.Navigator screenOptions={{headerShown: false}}>
    <DutyStack.Screen name="AllDuties" component={AllDutiesScreen} />
    <DutyStack.Screen name="CreateDuty" component={CreateDutyScreen} />
    <DutyStack.Screen name="DutyDetail" component={DutyDetailScreen} />
  </DutyStack.Navigator>
);

const OfficersNavigator = () => (
  <OfficerStack.Navigator screenOptions={{headerShown: false}}>
    <OfficerStack.Screen name="OfficerList" component={OfficerListScreen} />
    <OfficerStack.Screen name="AddOfficer" component={AddOfficerScreen} />
    <OfficerStack.Screen name="EditOfficer" component={EditOfficerScreen} />
  </OfficerStack.Navigator>
);

const ReportsNavigator = () => (
  <ReportStack.Navigator screenOptions={{headerShown: false}}>
    <ReportStack.Screen name="DutyReport" component={DutyReportScreen} />
    <ReportStack.Screen name="SubordinateReport" component={SubordinateReportScreen} />
  </ReportStack.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarStyle: {backgroundColor: colors.white, borderTopColor: colors.border, height: 60, paddingBottom: 8},
    }}>
    <Tab.Screen name="Dashboard" component={AdminDashboardScreen}
      options={{tabBarIcon: () => <Text style={{fontSize: 20}}>🏠</Text>}} />
    <Tab.Screen name="Duties" component={DutiesNavigator}
      options={{tabBarIcon: () => <Text style={{fontSize: 20}}>📋</Text>}} />
    <Tab.Screen name="Officers" component={OfficersNavigator}
      options={{tabBarIcon: () => <Text style={{fontSize: 20}}>👮</Text>}} />
    <Tab.Screen name="Reports" component={ReportsNavigator}
      options={{tabBarIcon: () => <Text style={{fontSize: 20}}>📊</Text>}} />
  </Tab.Navigator>
);

export default AdminTabs;
