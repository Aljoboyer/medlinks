import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileTabScreenHeader from '../components/header/profileTabScreenHeader'
import { useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';

export default function Notifications() {

    const allNotifications = useSelector((state) => state.globalSettingStore.allNotifications);
    const UnseenNotifcation = allNotifications?.filter((item) => item?.status == 'Unseen')

    const NotificationViewHandler = async (notification) => {

        const QUERY_CLICKED_NOTIFICATION = {
            query: `mutation MyMutation {
              updateNotificationSeen(nID: ${notification?.nID}) {
                description
                nID
                status
                title
                redirectTo
              }
            }
          `
        }

        gqlquery(QUERY_CLICKED_NOTIFICATION, null)
            .then((res) => res.json())
            .then((datas) => {
                dispatchAction(getUserNotifications())
                handleNotificationRedirect(notification);
            })
    } 

    const handleNotificationRedirect = (param) => {
        const NotifyUrlArr = param?.redirectTo?.split('/');

        switch (param?.redirectTo) {
            case "PhoneVerification":
                navigation.navigate('AccountInfo')
                break;
            case "EmailNotVerified":
                navigation.navigate('AccountInfo')
                break;
            case "InactiveUser":
                navigation.navigate('Home')
                break;
            case "ProfilePicNotUploaded":
                navigation.navigate('Settings')
                break;
            case "ResumeNotUploaded":
                navigation.navigate('CareerDetails')
                break;
            case "ResumeUpload":
                navigation.navigate('CareerDetails')
                break;
            case "RecommendedJobs":
                navigation.navigate('RecommendationJobs')
                break;
            case "ProfileStrength":
                navigation.navigate('Profile')
                break;
            default:
                dispatchAction(setJobVacancyID(NotifyUrlArr[3]))
                navigation.navigate('SingleJobLogin', { vacancyID: NotifyUrlArr[3] })
        }
    };

    const markAllAsReadHandler = async () => {

        const newToken = await tokenRefresher();
        tokenRef.current = newToken;

        const QUERY_CLICKED_ALL_NOTIFICATION = {
            query: `mutation MyMutation {
            updateNotficationSeenAll {
              description
              nID
              status
              title
              redirectTo
            }
          }
        `
        }

        gqlquery(QUERY_CLICKED_ALL_NOTIFICATION, null)
            .then((res) => res.json())
            .then((datas) => {
                dispatchAction(getUserNotifications())
            })
    };

  return (
   <SafeAreaView style={{flex: 1}}>
      {/* ----------------Header------------------ */}
      <ProfileTabScreenHeader title={'Notifications'} deleteBtn={false} />
        <ScrollView contentContainerStyle={{flex: 1}}>
            <View style={{ paddingHorizontal: wp('5%'), marginTop: 6, paddingBottom: 10 }}>
                {
                allNotifications?.length > 0 ?
                <View>
                    {
                        allNotifications?.map((item,index) => (
                            <View key={index} style={[styles.notificationView, { backgroundColor: item?.status == 'Seen' ? 'white' : '#E4EEF5' }]}>
                                {/* <Image
                        source={require("../assest/NotificationImg.png")}
                        style={{
                            height: 47,
                            width: 48
                            }}
                        /> */}
                                <View style={styles.notifyContentView}>
                                    <View style={styles.titleView}>
                                        <View style={{ display: "flex", flexDirection: 'row', }}>
                                            <Text style={{ color: 'black', fontSize: 14, lineHeight: 21, fontFamily: "Poppins-SemiBold", }}>{item?.title}</Text>
                                            <Text style={[styles.notifyRegularTxt, { fontSize: 10 }]}> {moment(item?.createdAt).startOf("day").fromNow()}</Text>
                                        </View>
                                        {/* <TouchableOpacity><Image
                                source={require("../assest/ThreeDots.png")}
                                style={{
                                    height: 24,
                                    width: 24
                                    }}
                                /></TouchableOpacity> */}
                                        {item?.status == 'Unseen' && <View style={styles.emptyDot}></View>}
                                    </View>

                                    <Text style={[styles.notifyRegularTxt, { marginVertical: 10 }]}>{item?.description}</Text>

                                    {/* <TouchableOpacity style={styles.scheduleBtn}><Text style={[styles.notifyRegularTxt, {fontWeight: "500", color: "#395987"}]}>Interview Scheduled</Text></TouchableOpacity>  */}
                                    <TouchableOpacity onPress={() => {
                                        NotificationViewHandler(item)
                                    }} style={styles.viewJobBtn}><Text style={[styles.notifyRegularTxt, { fontWeight: "700", color: "white" }]}>View</Text></TouchableOpacity>
                                </View>
                            </View>
                        ))
                    }
                </View> : <View>
                    <Text style={{ color: 'gray', fontSize: 14, lineHeight: 18, fontFamily: "Poppins-Regular", alignSelf: 'center' }}>No new notification for now, sit back and relax!</Text>
                </View>
                }
            </View>
        </ScrollView>
   </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    button: {
        borderRadius: 13,
        height: 44,
        borderWidth: 1,
        width: 150,
        borderColor: 'white',
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        marginHorizontal: 10,
    },
    title: {
        fontWeight: "500",
        fontSize: 15,
        color: "#395987",
    },
    saveButton: {
        borderRadius: 15,
        height: 34,
        borderWidth: 1,
        width: 85,
        borderColor: "#fff",
        backgroundColor: '#395987',
        justifyContent: "center",
        alignItems: "center",
        // marginBottom: 16,
        marginHorizontal: 10,
    },
    button2: {
        borderRadius: 15,
        height: 34,
        borderWidth: 1,
        width: 85,
        borderColor: '#395987',
        // backgroundColor: COLORS.skyBlue,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        marginHorizontal: 10,
    },
    notificationView: {
        borderColor: '#E4EEF5',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,

    },
    notifyContentView: {
        marginLeft: 10,
    },
    viewJobBtn: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: 37,
        width: 100,
        backgroundColor: '#395987'
    },
    notifyRegularTxt: { color: 'gray', fontSize: 12, lineHeight: 21, fontFamily: "Poppins-Regular", },
    scheduleBtn: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: 50,
        width: 250,
        backgroundColor: '#E4EEF5',
    },
    titleView: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 310
    },
    markAllAsReadBtn: {
        borderColor: '#6F7482',
        borderWidth: 1,
        borderRadius: 5,
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 150,

    },
    emptyDot: { backgroundColor: '#2F80F7', height: 10, width: 10, borderRadius: 100, },
    imojiView: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        textAlignVertical: "top",
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#395987',
        color: 'black', fontFamily: 'Poppins-Regular', fontSize: 14,
    },
    feedBackBtn: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#395987',
        height: 46,
        width: 190,
        borderRadius: 10,
        marginTop: 15,
        alignSelf: 'center'
    },
    feedBackemptyView: {
        height: 10,
        borderRadius: 15,
        backgroundColor: "#D9D9D9",
        width: 70,
        alignSelf: 'center',
        marginTop: 5
    }
})