import axios, { Axios } from "axios";

export const endpoints = {
    'doctor': '/doctor/',
    'medicine':'/medicines/',
    'medicineDetail':(id) => `/medicines/${id}/`,
    'login':'/o/token/',
    'current_user':'/user/current_user/',
    'department':'/department/',
    'signup': '/user/',

    'appointment':'/appointment/',  
    'appointment_detail':(id) =>`/appointment/${id}`,   
    'appointment_confirm': (id) => `/appointment/${id}/confirm/`,
    'appointment_cancel': (id) => `/appointment/${id}/cancel/`,
    'appointment_currentPatient_recent':'/appointment/current_patient_recent/',
    'appointment_currentPatient_sucess':'/appointment/current_patient_sucess/',
    'appointment_currentPatient_canceled':'/appointment/current_patient_canceled/',

    'health_record':'/health_record/',
    'my_health_record':'/health_record/my_health_record/',
    'health_record_detail': (id)=>`/health_record/${id}/`, 
    'health_record_medicine':(id)=> `/health_record/${id}/medicines/`,
    'health_record_makereceipt':(id)=> `/health_record/${id}/make_receipt/`,
    'health_record_getreceipt':(id)=> `/health_record/${id}/receipt/`,

    'patient':'/patient/',
    'patient_detail': (id)=>`/patient/${id}`,  
     
    'statHr_by_Month': '/stat/stat_hr_by_month/',
    'statHr_by_Quarter': '/stat/stat_hr_by_quarter/',
    'statPrenue_by_Month':'/stat/stat_prenue_by_month/',
    'statPrenue_by_Quarter':'/stat/stat_prenue_by_quarter/',

    'my_receipt': '/receipt/my_receipt/',
    'my_receipt_detail': (id)=>`/receipt/${id}/`,

    'receipt_paid': (id)=>`/receipt/${id}/paid/`,
    'schedule': '/schedule/'
}

export const authApi = (accessToken) => 
    axios.create({
        baseURL:"https://hphat03.pythonanywhere.com",
        headers:{
            "Authorization": `Bearer ${accessToken}`
        }
    })


export default axios.create({
    baseURL:"https://hphat03.pythonanywhere.com",
})