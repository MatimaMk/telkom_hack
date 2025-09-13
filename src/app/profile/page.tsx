"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  ArrowLeft,
  Shield,
  MapPin,
  CreditCard,
} from "lucide-react";
import styles from "./profile.module.css";

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  plan: string;
  accountNumber: string;
  registeredAt: string;
}

interface ProfileData extends UserData {
  address?: string;
  city?: string;
  postalCode?: string;
  idNumber?: string;
  dateOfBirth?: string;
}

const Profile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const savedUser = sessionStorage.getItem("telkom_current_user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Add some additional mock data for profile
      const profileData: ProfileData = {
        ...userData,
        address: "123 Main Street",
        city: "Johannesburg",
        postalCode: "2001",
        idNumber: "8901015800083",
        dateOfBirth: "1989-01-01",
      };
      setCurrentUser(profileData);
      setEditForm(profileData);
    } else {
      // Redirect to home if not logged in
      router.push("/");
    }
    setIsLoading(false);
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(currentUser);
  };

  const handleSave = () => {
    if (editForm) {
      setCurrentUser(editForm);
      // Update session storage with new data
      const { address, city, postalCode, idNumber, dateOfBirth, ...userData } = editForm;
      sessionStorage.setItem("telkom_current_user", JSON.stringify(userData));
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const goBack = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className={styles.profile}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.profile}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button onClick={goBack} className={styles.backBtn}>
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <div className={styles.headerCenter}>
            <h1>My Profile</h1>
          </div>
          <div className={styles.headerRight}>
            {!isEditing ? (
              <button onClick={handleEdit} className={styles.editBtn}>
                <Edit3 size={18} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className={styles.editActions}>
                <button onClick={handleSave} className={styles.saveBtn}>
                  <Save size={18} />
                  <span>Save</span>
                </button>
                <button onClick={handleCancel} className={styles.cancelBtn}>
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              <User size={48} />
            </div>
            <div className={styles.profileInfo}>
              <h2>{currentUser.firstName} {currentUser.lastName}</h2>
              <p className={styles.accountNumber}>Account: {currentUser.accountNumber}</p>
              <p className={styles.memberSince}>
                Member since {new Date(currentUser.registeredAt).toLocaleDateString()}
              </p>
            </div>
            <div className={styles.planBadge}>
              <Shield size={16} />
              <span>{currentUser.plan}</span>
            </div>
          </div>

          {/* Profile Sections */}
          <div className={styles.profileGrid}>
            {/* Personal Information */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>
                  <User size={20} />
                  Personal Information
                </h3>
              </div>
              <div className={styles.sectionContent}>
                <div className={styles.field}>
                  <label>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm?.firstName || ""}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p>{currentUser.firstName}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label>Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm?.lastName || ""}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p>{currentUser.lastName}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label>ID Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm?.idNumber || ""}
                      onChange={(e) => handleInputChange("idNumber", e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p>{currentUser.idNumber}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label>Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editForm?.dateOfBirth || ""}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p>{currentUser.dateOfBirth ? new Date(currentUser.dateOfBirth).toLocaleDateString() : "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>
                  <Mail size={20} />
                  Contact Information
                </h3>
              </div>
              <div className={styles.sectionContent}>
                <div className={styles.field}>
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm?.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p>{currentUser.email}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm?.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p>{currentUser.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>
                  <MapPin size={20} />
                  Address Information
                </h3>
              </div>
              <div className={styles.sectionContent}>
                <div className={styles.field}>
                  <label>Street Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm?.address || ""}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p>{currentUser.address}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label>City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm?.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p>{currentUser.city}</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label>Postal Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm?.postalCode || ""}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p>{currentUser.postalCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>
                  <CreditCard size={20} />
                  Account Information
                </h3>
              </div>
              <div className={styles.sectionContent}>
                <div className={styles.field}>
                  <label>Account Number</label>
                  <p>{currentUser.accountNumber}</p>
                </div>
                <div className={styles.field}>
                  <label>Current Plan</label>
                  <p>{currentUser.plan}</p>
                </div>
                <div className={styles.field}>
                  <label>Member Since</label>
                  <p>{new Date(currentUser.registeredAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;