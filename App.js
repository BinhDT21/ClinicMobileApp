import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text, View } from 'react-native';
import { AntDesign, Entypo, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import MyContext from './configs/MyContext';
import { useReducer, useState } from 'react';
import MyUserReducer from './reducers/MyUserReducer';
import ProfileScreen from './components/profile/ProfileScreen';
import Signup from './components/user/Signup';
import Appointment from './components/appointment/Appointment';
import WelcomeScreen from './components/home/WelcomeScreen';
import Login from './components/user/Login';
import Home from './components/home/Home';
import Medicine from './components/medicine/Medicine';
import ApppointmentList from './components/appointment/AppointmentList';
import Appointment_Current from './components/appointment/Appointment_Current';
import Create_health_record from './health_record/create_health_record';
import Create_health_record_medicines from './health_record/health_record_medicines';
import HealthrecordDetail from './health_record/HealthrecordDetail';
import Receipt from './health_record/health_record_getReceipt';
import MedicineDetail from './components/medicine/MedicineDetail';
import MyHealthRecord from './health_record/my_healthRecord';
import Manage from './components/admin/Manage';
import AppointmentDetail from './components/appointment/Appointment_Detail';
import Stat from './components/admin/Stat';
import MyReceipt from './components/receipt/receipt_getMyReceipt';
import MyDetailReceipt from './components/receipt/receipt_detail';
import Schedule from './components/schedule/schedule';

const Tab = createBottomTabNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: true,
  tabBarStyle: { borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: "orange" },
  tabBarHideOnKeyboard: true,
  tabBarItemStyle: {},


}


const App = ({ }) => {
  const [user, dispatch] = useReducer(MyUserReducer, null)
  const [accessTk, setAccessTk] = useState('')

  return (

    <>
      <MyContext.Provider value={[user, dispatch, accessTk, setAccessTk]}>
        <NavigationContainer>
          <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="WelcomeScreen" component={WelcomeScreen} options={{
              title: 'PB Clinic',
              headerShown: false,
              tabBarStyle: { display: "none" },
              tabBarItemStyle: { display: "none" },

            }}
            />

            <Tab.Screen name="Home" component={Home} options={{
              tabBarIcon: ({ focused }) => {
                return (
                  <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Entypo name="home" size={25} color={focused ? "white" : "gray"} />
                    <Text style={{ fontSize: 14, color: "gray" }}>home</Text>
                  </View>
                )
              },
              title: 'PB Clinic'
            }} />


            <Tab.Screen name="Login" component={Login} options={{
              tabBarItemStyle: { display: "flex" },
              title: 'PB Clinic',
              tabBarItemStyle: { display: "none" },
              tabBarStyle: { display: "none" }
            }} />


            {user &&
              (<Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{
                tabBarIcon: ({ focused }) => {
                  return (
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                      <FontAwesome name="user" size={25} color={focused ? "white" : "gray"} />
                      <Text style={{ fontSize: 14, color: "gray" }}>Người dùng</Text>
                    </View>
                  )
                },
              }} />)
            }
            <Tab.Screen name="Signup" component={Signup} options={{
              tabBarItemStyle: { display: "none" },
              tabBarStyle: { display: "none" }
            }} />
            {user && (
              <Tab.Screen name="Appointment" component={Appointment} options={{
                tabBarItemStyle: { display: "none" },
                title: 'PB Clinic'
              }} />
            )}
            <Tab.Screen name="Medicine" component={Medicine} options={{
              title: 'PB Clinic',
              tabBarItemStyle: { display: "none" }
            }}
            />
            <Tab.Screen name="ApppointmentList" component={ApppointmentList} options={{
              title: 'PB Clinic',
              tabBarItemStyle: { display: "none" }
            }}
            />
            {(user !== null && user.user_info.role === 3) && (
              <Tab.Screen name="Appointment_Current" component={Appointment_Current} options={{
                tabBarIcon: ({ focused }) => {
                  return (
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                      <Entypo name="calendar" size={25} color={focused ? "white" : "gray"} />
                      <Text style={{ fontSize: 14, color: "gray" }}>Lịch khám của tôi</Text>
                    </View>
                  )
                },
                title: 'PB Clinic',
                tabBarItemStyle: { display: "flex" }
              }}
              />
            )}


            {(user !== null && user.user_info.role === 0) && (
              <Tab.Screen name="Create_health_record" component={Create_health_record} options={{
                tabBarIcon: ({ focused }) => {
                  return (
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                      <FontAwesome5 name="edit" size={25} color={focused ? "white" : "gray"} />
                      <Text style={{ fontSize: 14, color: "gray" }}>Tạo bệnh án</Text>
                    </View>
                  )
                },
                title: 'PB Clinic',
                tabBarItemStyle: { display: "flex" },
              }}
              />
            )}


            <Tab.Screen name="Create_health_record_medicines" component={Create_health_record_medicines} options={{
              title: 'PB Clinic',
              tabBarItemStyle: { display: "none" },
            }}
            />


            <Tab.Screen name="HealthrecordDetail" component={HealthrecordDetail} options={{
              title: 'PB Clinic',
              tabBarItemStyle: { display: "none" },
            }}
            />

            <Tab.Screen name="Receipt" component={Receipt} options={{
              title: 'PB Clinic',
              tabBarItemStyle: { display: "none" },
            }}
            />

            <Tab.Screen name="MedicineDetail" component={MedicineDetail} options={{
              title: 'PB Clinic',
              tabBarItemStyle: { display: "none" },
              headerShown: false
            }}
            />

            {user && (
              <Tab.Screen name="MyHealthRecord" component={MyHealthRecord} options={{
                title: 'PB Clinic',
                tabBarItemStyle: { display: "none" },
                headerShown: false
              }}
              />
            )}

            <Tab.Screen name="Manage" component={Manage} options={{
              title: 'PB Clinic',
              tabBarItemStyle: { display: "none" },
              headerShown: true
            }}
            />

            <Tab.Screen name="AppointmentDetail" component={AppointmentDetail} options={{
              title: 'PB Clinic',
              tabBarItemStyle: { display: "none" },
              headerShown: false
            }}
            />


            {(user !== null && user.user_info.role === 2) && (
              <Tab.Screen name="Stat" component={Stat} options={{
                title: 'PB Clinic',
                tabBarItemStyle: { display: "none" },
                headerShown: false
              }}
              />
            )}

            {(user !== null && user.user_info.role === 3) && (
              <Tab.Screen name="MyReceipt" component={MyReceipt} options={{
                title: 'PB Clinic',
                tabBarItemStyle: { display: "none" },
                headerShown: false
              }}
              />
            )}

            {user && (
              <Tab.Screen name="MyDetailReceipt" component={MyDetailReceipt} options={{
                title: 'PB Clinic',
                tabBarItemStyle: { display: "none" },
                headerShown: false
              }}
              />
            )}

            {user && (
              <Tab.Screen name="Schedule" component={Schedule} options={{
                title: 'PB Clinic',
                tabBarItemStyle: { display: "none"},
                headerShown: false
              }}
              />
            )}

          </Tab.Navigator>
        </NavigationContainer>
      </MyContext.Provider>
    </>
  );
}



export default App