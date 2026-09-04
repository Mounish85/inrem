import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usersApi } from "../api/users";
import { progressApi } from "../api/progress";
import { enrollmentsApi } from "../api/enrollments";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";
import LoadingState from "../components/LoadingState";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

export const Profile = () => {
  const { user, refreshProfile, logout } = useAuth();
  const userId = user?.id || user?._id;

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    organization: "",
    designation: "",
    location: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [progressSummary, setProgressSummary] = useState(null);
  const [enrollmentsCount, setEnrollmentsCount] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        organization: user.organization || "",
        designation: user.designation || "",
        location: user.location || "",
      });
    }

    const fetchSummary = async () => {
      if (!userId) return;
      try {
        const prog = await progressApi.getUserProgress(userId).catch(() => null);
        setProgressSummary(prog);

        const enr = await enrollmentsApi.getUserEnrollments(userId).catch(() => ({ count: 0 }));
        setEnrollmentsCount(enr.count || enr.enrollments?.length || 0);
      } catch (err) {
        console.warn("Profile summary fetch error:", err);
      }
    };

    fetchSummary();
  }, [user, userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setSaving(true);
      await usersApi.updateUser(userId, formData);
      await refreshProfile();
      setSaveSuccess(true);
      setEditMode(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save profile error:", err);
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LoadingState message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-2 border-[#09090B] bg-[#FFFFFF] rounded-[16px] p-6 md:p-8 shadow-[4px_4px_0_#09090B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#D2E823] border-2 border-[#09090B] rounded-[12px] shadow-[3px_3px_0_#09090B] flex items-center justify-center font-heading text-2xl text-[#09090B]">
              {user.name ? user.name.charAt(0).toUpperCase() : "W"}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-heading text-2xl uppercase text-[#09090B]">
                  {user.name}
                </h1>
                <Badge variant="acid" size="sm">
                  CHAMPION
                </Badge>
              </div>
              <p className="font-mono text-xs text-[#71717A] mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <div>
            <Button
              variant={editMode ? "secondary" : "acid"}
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel Editing" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0_#09090B] flex items-center space-x-2 text-xs font-mono font-bold text-[#09090B]">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Details Card */}
      <Card variant="default" shadow="normal" rounded="brutal" className="p-6 md:p-8">
        <div className="flex items-center space-x-2 border-b-2 border-[#09090B] pb-3 mb-6">
          <User className="w-5 h-5 text-[#09090B]" />
          <h2 className="font-heading text-lg uppercase text-[#09090B]">
            AUTHENTICATED WQC DETAILS
          </h2>
        </div>

        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase font-bold mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] text-sm focus:outline-none focus:bg-[#FFFFFF]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] text-sm focus:outline-none focus:bg-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Location / District
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] text-sm focus:outline-none focus:bg-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] text-sm focus:outline-none focus:bg-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase font-bold mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[8px] text-sm focus:outline-none focus:bg-[#FFFFFF]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                icon={Save}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="bg-[#F8F4E8] border-2 border-[#09090B] p-4 rounded-[10px] space-y-1">
              <span className="text-[#71717A] uppercase flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1" /> Email Address
              </span>
              <span className="font-bold text-sm text-[#09090B] block">
                {user.email}
              </span>
            </div>

            <div className="bg-[#F8F4E8] border-2 border-[#09090B] p-4 rounded-[10px] space-y-1">
              <span className="text-[#71717A] uppercase flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1" /> Phone
              </span>
              <span className="font-bold text-sm text-[#09090B] block">
                {user.phone || "Not provided"}
              </span>
            </div>

            <div className="bg-[#F8F4E8] border-2 border-[#09090B] p-4 rounded-[10px] space-y-1">
              <span className="text-[#71717A] uppercase flex items-center">
                <Building className="w-3.5 h-3.5 mr-1" /> Organization
              </span>
              <span className="font-bold text-sm text-[#09090B] block">
                {user.organization || "Not provided"}
              </span>
            </div>

            <div className="bg-[#F8F4E8] border-2 border-[#09090B] p-4 rounded-[10px] space-y-1">
              <span className="text-[#71717A] uppercase flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1" /> Designation
              </span>
              <span className="font-bold text-sm text-[#09090B] block">
                {user.designation || "Not provided"}
              </span>
            </div>

            <div className="bg-[#F8F4E8] border-2 border-[#09090B] p-4 rounded-[10px] space-y-1">
              <span className="text-[#71717A] uppercase flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" /> Location
              </span>
              <span className="font-bold text-sm text-[#09090B] block">
                {user.location || "Not provided"}
              </span>
            </div>

            <div className="bg-[#F8F4E8] border-2 border-[#09090B] p-4 rounded-[10px] space-y-1">
              <span className="text-[#71717A] uppercase flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" /> Member Since
              </span>
              <span className="font-bold text-sm text-[#09090B] block">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Active"}
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Progress Summary Card */}
      <Card variant="default" shadow="normal" rounded="brutal" className="p-6 md:p-8">
        <div className="flex items-center space-x-2 border-b-2 border-[#09090B] pb-3 mb-6">
          <BookOpen className="w-5 h-5 text-[#09090B]" />
          <h2 className="font-heading text-lg uppercase text-[#09090B]">
            CURRICULUM STATS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
          <div className="border-2 border-[#09090B] bg-[#F8F4E8] p-4 rounded-[10px] shadow-[2px_2px_0_#09090B]">
            <div className="font-heading text-2xl text-[#09090B]">
              {enrollmentsCount}
            </div>
            <div className="text-xs uppercase text-[#71717A] mt-1">
              Enrolled Courses
            </div>
          </div>

          <div className="border-2 border-[#09090B] bg-[#D2E823] p-4 rounded-[10px] shadow-[2px_2px_0_#09090B]">
            <div className="font-heading text-2xl text-[#09090B]">
              {progressSummary?.completedSessions || 0}
            </div>
            <div className="text-xs uppercase text-[#09090B] font-bold mt-1">
              Completed Sessions
            </div>
          </div>

          <div className="border-2 border-[#09090B] bg-[#F8F4E8] p-4 rounded-[10px] shadow-[2px_2px_0_#09090B]">
            <div className="font-heading text-2xl text-[#09090B]">
              {progressSummary?.progressPercentage || 0}%
            </div>
            <div className="text-xs uppercase text-[#71717A] mt-1">
              Overall Progress
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;

