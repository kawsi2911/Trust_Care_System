import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import UserType from "./components/UserType.jsx";
import ServiceProvider1 from "./components/ServiceProvider1.jsx";
import ServiceProvider2 from "./components/ServiceProvider2.jsx";
import ServiceProvider3 from "./components/ServiceProvider3.jsx";
import ServiceProviderLogin from "./Provider-Login/ServiceProviderLogin.jsx";
import ServiceProviderDashboard from "./Provider-Login/ServiceProviderDashboard.jsx";
import ServiceProviderLoginPage from "./Provider-Login/ServiceProviderLoginPage.jsx";
import ServicesDashboard from "./Provider-Login/ServicesDashboard.jsx";
import NotificationDashboard from "./Provider-Login/NotificationDashboard.jsx";
import ActivityDashboard from "./Provider-Login/ActivityDashboard.jsx";
import ProfileDashboard from "./Provider-Login/ProfileDashboard.jsx";
import FamilyRegister from "./family-components/FamilyRegister.jsx";
import ServiceTaken from "./family-components/serviceTaken.jsx";
import FamilyLogin from "./family-components/Familylogin.jsx";
import FamilyHome from "./Family-Dashboard/familyhome.jsx";
import FamilyServices from "./Family-Dashboard/familyservices.jsx";
import FamilyServiceRequest from "./Family-Dashboard/FamilyServiceRequest.jsx";
import FamilyServiceRequest2 from "./Family-Dashboard/FamilyServiceRequest2.jsx";
import FindingCareGiver from "./Family-Dashboard/FindingCaregiver.jsx";
import Availableprovider from "./Family-Dashboard/Availableprovider.jsx";
import CareGiver from "./Family-Dashboard/caregiver.jsx";
import Booking from "./Family-Dashboard/Booking.jsx";
import BookingConfirm from "./Family-Dashboard/BookingConfirm.jsx";
import FamilyNotification from "./Family-Dashboard/FamilyNotification.jsx";
import FamilyActivity from "./Family-Dashboard/FamilyActivity.jsx";
import MakePayment from "./Family-Dashboard/MakePayment.jsx";
import Rate from "./Family-Dashboard/Rate.jsx";
import FamilyProfile from "./Family-Dashboard/familyprofile.jsx";
import ServiceProviderForget from "./Provider-Login/ServiceProviderForget.jsx";
import ServiceProviderProfileEdit from "./Provider-Login/ServiceProviderEdit.jsx";
import Familyforget from "./family-components/familyforget.jsx";
import FamilyProfieEdit from "./family-components/FamilyProfieEdit.jsx";
// Admin imports
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
// Payment pages
import PaymentSuccess from "./Family-Dashboard/PaymentSuccess.jsx";
import PaymentCancel from "./Family-Dashboard/PaymentCancel.jsx";
// email varification
//import EmailVerified from "./components/EmailVerified.jsx";



function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path = "/" element = {<Home />} />

        {/*service Provider register screen*/}
        <Route path = "/usertype" element = {<UserType />} />
        <Route path = "/serviceprovider1" element = {<ServiceProvider1 />} />
        <Route path = "/serviceprovider2" element = {<ServiceProvider2 /> } />
        <Route path = "/serviceprovider3" element = {<ServiceProvider3 /> } />
        <Route path = "/serviceproviderlogin" element = {<ServiceProviderLogin/>}/>

        {/*service Provider login screen*/}
        <Route path = "/serviceproviderloginpage" element = {<ServiceProviderLoginPage />}/>
        <Route path = "/serviceproviderforget" element = {<ServiceProviderForget/>}/>

        {/*service Provider Dashboard */}
        <Route path = "/serviceproviderdashboard" element = {<ServiceProviderDashboard />}/>
        <Route path = "/servicesdashboard" element = { <ServicesDashboard/>}/>
        <Route path = "/notificationdashboard" element = {<NotificationDashboard/>}/>
        <Route path = "/activitydashboard" element = {<ActivityDashboard/>}/>
        <Route path = "/profiledashboard" element = {<ProfileDashboard/>}/>
        <Route path = "/serviceproviderprofileedit" element = {<ServiceProviderProfileEdit/>}/>

        {/*service taken register screen*/}
        <Route path = "/familyregister" element = {<FamilyRegister/>}/>
        
        {/*service taken options screen*/}
        <Route path = "/servicetaken" element = {<ServiceTaken/>}/>
        <Route path = "/familylogin" element = {<FamilyLogin/>}/>
        <Route path = "/familyhome" element = {<FamilyHome/>}/>
        <Route path = "/familyservice" element = {<FamilyServices/>}/>
        <Route path = "/familyservicerequest" element = {<FamilyServiceRequest/>}/>
        <Route path = "/familyservicerequest2" element = {<FamilyServiceRequest2/>}/>
        <Route path = "/findingcareprovider" element = {<FindingCareGiver/>}/>
        <Route path = "/availableprovider" element = {<Availableprovider/>}/>
        <Route path = "/caregiver" element ={<CareGiver/>}/>
        <Route path = "/booking" element = {<Booking/>}/>
        <Route path = "/bookingconfirm" element = {<BookingConfirm/>}/>
        <Route path = "/familynotification" element = {<FamilyNotification/>}/>
        <Route path = "/familyactivity" element = {<FamilyActivity/>}/>
        <Route path = "/makepayment" element = { <MakePayment/>}/>
        <Route path = "/rate" element = {<Rate/>}/>
        <Route path = "/familyprofiles" element ={<FamilyProfile/>}/>
        <Route path = "/familyforget" element ={<Familyforget/>}/>
        <Route path = "/familyprofieedit" element = {<FamilyProfieEdit/>}/>

        {/* Payment result pages */}
        <Route path = "/payment-success" element = {<PaymentSuccess/>}/>
        <Route path = "/payment-cancel" element = {<PaymentCancel/>}/>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
         {/* Email routes 
        <Route path="/email-verified" element={<EmailVerified />} />*/}

      </Routes>
      
    </BrowserRouter>
  );
}

export default App;