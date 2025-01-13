import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import OTPPage from "../pages/OTPPage";
import HosterRegister from "../Page_components/Register/HosterRegister";
import UserHomeLayout from "../pages/UserPages/Layouts/UserHomeLayout";
import Home from "../pages/UserPages/Outlets/Home";
import Categories from "@/pages/UserPages/Outlets/Categories";
import EventList from "@/pages/UserPages/Outlets/EventList";
import DataProvider from "@/ContextFiles/DataProvider";
import EventDetails from "@/pages/UserPages/Outlets/EventDetails";
import EventsDataProvider from "@/ContextFiles/EventsDataProvider";
import TicketBooking from "@/pages/UserPages/Outlets/TicketBooking";
import EventDetailsProvider from "@/ContextFiles/EventDetailsProvider";
import SuccessBooking from "@/pages/UserPages/Outlets/SuccessBooking";
import ForgotPassword from "@/pages/ForgotPassword";
import NewPassword from "@/pages/NewPassword";
import Chat from "@/Page_components/Common/Chat";
import AdminRegister from "@/Page_components/Register/Admin";
import ProfileUser from "@/pages/UserPages/Outlets/ProfileUser";
import ProfileDataProvider from "@/ContextFiles/ProfileAnalyticsDataProvider";
import BookedEventList from "@/pages/UserPages/Outlets/BookedEventList";
import ProfileAnalyticsDataProvider from "@/ContextFiles/ProfileAnalyticsDataProvider";
import UserTicketHistoryDataProvider from "@/ContextFiles/UserTicketHistoryDataContext";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/hoster_register" element={<HosterRegister />} />
      <Route path="/admin_register" element={<AdminRegister />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp_verification" element={<OTPPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/new-password" element={<NewPassword />} />

      <Route path="/" element={<UserHomeLayout />}>
        <Route
          path="/"
          element={
            <EventsDataProvider>
              <Home />
            </EventsDataProvider>
          }
        ></Route>

        <Route
          path="categories"
          element={
            <DataProvider>
              <Categories />
            </DataProvider>
          }
        ></Route>

        <Route path="/catgory/:category_name" element={<EventList />}></Route>
        <Route
          path="/catgory/:category_name/:type_name/:event_id/"
          element={<EventDetails />}
        ></Route>

        <Route
          path="/catgory/:category_name/:type_name/:event_id/ticket_registration"
          element={
            <EventDetailsProvider>
              <TicketBooking />
            </EventDetailsProvider>
          }
        ></Route>

        <Route path="/payment-success" element={<SuccessBooking />} />
        <Route path="/chat/" element={<Chat />} />
        <Route path="/chat/:reciever_id" element={<Chat />} />

        <Route
          path="profile"
          element={
            <ProfileAnalyticsDataProvider>
              <ProfileUser />
            </ProfileAnalyticsDataProvider>
          }
        />

        <Route
          path="ticket_history"
          element={
            <UserTicketHistoryDataProvider>
              <BookedEventList />
            </UserTicketHistoryDataProvider>
          }
        />
      </Route>
    </Routes>
  );
}

export default UserRoutes;
