import AdminHomeLayout from "@/pages/AdminPages/Layouts/AdminHomeLayout";
import CategoryDetails from "@/pages/AdminPages/Outlets/CategoryDetails";
import CategoryList from "@/pages/AdminPages/Outlets/CategoryList";
import DashBoard from "@/pages/AdminPages/Outlets/Dashboard";
import React from "react";
import { Routes, Route } from "react-router-dom";
import DataProvider from "@/ContextFiles/DataProvider";
import EventList from "@/pages/AdminPages/Outlets/EventList";
import EventsDataProvider from "@/ContextFiles/EventsDataProvider";
import EventDetails from "@/pages/AdminPages/Outlets/EventDetails";
import AnalyticsAdminProvider from "@/ContextFiles/AnalyticsAdminProvider";
import ProfileAdmin from "@/pages/AdminPages/Outlets/Profile";
import ProfileDataProvider from "@/ContextFiles/ProfileDataProvider";
import HosterListing from "@/pages/AdminPages/Outlets/HosterListing";
import HosterListDataProvider from "@/ContextFiles/HosterListDataContext";
import UserListing from "@/pages/AdminPages/Outlets/UserListing";
import UserListDataProvider from "@/ContextFiles/UserListDataContext";
import UserDetailsDataProvider from "@/ContextFiles/UserDetails";
import UserProfile from "@/pages/AdminPages/Outlets/UserProfile";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminHomeLayout />}>
        <Route
          path="dashboard"
          element={
            <AnalyticsAdminProvider>
              <EventsDataProvider>
                <DashBoard />
              </EventsDataProvider>
            </AnalyticsAdminProvider>
          }
        />
        <Route
          path="events"
          element={
            <EventsDataProvider>
              <EventList />
            </EventsDataProvider>
          }
        />
        <Route path="/events/event/:event_id" element={<EventDetails />} />
        
        <Route
          path="hoster_list"
          element={
            <HosterListDataProvider>
              <HosterListing />
            </HosterListDataProvider>
          }
        />

        <Route
          path="user_list"
          element={
            <UserListDataProvider>
              <UserListing />
            </UserListDataProvider>
          }
        />

        <Route
          path=":user_id"
          element={
            <UserDetailsDataProvider>
              <UserProfile/>
            </UserDetailsDataProvider>
          }
        />

        <Route
          path="catgories"
          element={
            <DataProvider>
              <CategoryList />
            </DataProvider>
          }
        />

        <Route path="/catgory/:category_name" element={<CategoryDetails />} />

        <Route
          path="profile"
          element={
            <ProfileDataProvider>
              <ProfileAdmin />
            </ProfileDataProvider>
          }
        />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
