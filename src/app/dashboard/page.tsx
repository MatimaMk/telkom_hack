"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  CreditCard,
  Wifi,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Download,
  Upload,
  Calendar,
  DollarSign,
} from "lucide-react";
import styles from "./style/dash.module.css";

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

const Dashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const savedUser = sessionStorage.getItem("telkom_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Redirect to home if not logged in
      router.push("/");
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("telkom_current_user");
    sessionStorage.removeItem("telkom_session_start");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div
        className={styles.dashboard}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e0e0e0",
              borderTop: "4px solid #0078d4",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles["dashboard-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-logo"]}>
            <div className={styles["logo-icon"]}>T</div>
            <span className={styles["logo-text"]}>Telkom</span>
          </div>
          <div className={styles["header-right"]}>
            <button
              className={styles["notification-btn"]}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            <div className={styles["user-menu"]}>
              <div className={styles["user-info"]}>
                <p className={styles["user-name"]}>
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className={styles["user-email"]}>{currentUser.email}</p>
                <p className={styles["account-number"]}>
                  Account: {currentUser.accountNumber}
                </p>
              </div>
              <button onClick={handleLogout} className={styles["logout-btn"]}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles["dashboard-main"]}>
        <div className={styles["dashboard-content"]}>
          {/* Welcome Section */}
          <div className={styles["welcome-section"]}>
            <h1>Welcome back, {currentUser.firstName}!</h1>
            <p>Here's your account overview and recent activity.</p>
          </div>

          {/* Stats Cards */}
          <div className={styles["stats-grid"]}>
            <div className={styles["stat-card"]}>
              <div className={styles["stat-content"]}>
                <div className={styles["stat-info"]}>
                  <h3>Current Plan</h3>
                  <p className={styles["stat-value"]}>{currentUser.plan}</p>
                  <p className={styles["stat-subtitle"]}>Active</p>
                </div>
                <div className={`${styles["stat-icon"]} ${styles.green}`}>
                  <Wifi size={24} />
                </div>
              </div>
            </div>

            <div className={styles["stat-card"]}>
              <div className={styles["stat-content"]}>
                <div className={styles["stat-info"]}>
                  <h3>Data Usage</h3>
                  <p className={styles["stat-value"]}>45.2 GB</p>
                  <p className={styles["stat-subtitle"]}>This month</p>
                </div>
                <div className={`${styles["stat-icon"]} ${styles.cyan}`}>
                  <Download size={24} />
                </div>
              </div>
            </div>

            <div className={styles["stat-card"]}>
              <div className={styles["stat-content"]}>
                <div className={styles["stat-info"]}>
                  <h3>Current Bill</h3>
                  <p className={styles["stat-value"]}>R 299.00</p>
                  <p className={styles["stat-subtitle"]}>Due: Jan 25</p>
                </div>
                <div className={`${styles["stat-icon"]} ${styles.green}`}>
                  <DollarSign size={24} />
                </div>
              </div>
            </div>

            <div className={styles["stat-card"]}>
              <div className={styles["stat-content"]}>
                <div className={styles["stat-info"]}>
                  <h3>Connection</h3>
                  <p className={styles["stat-value"]}>100 Mbps</p>
                  <p className={styles["stat-subtitle"]}>Stable</p>
                </div>
                <div className={`${styles["stat-icon"]} ${styles.cyan}`}>
                  <Upload size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className={styles["dashboard-grid"]}>
            {/* Left Column */}
            <div className={styles["dashboard-left"]}>
              {/* Analytics Card */}
              <div className={styles["analytics-card"]}>
                <div className={styles["card-header"]}>
                  <h2>
                    <BarChart3 size={20} />
                    Usage Analytics
                  </h2>
                </div>
                <div className={styles["analytics-grid"]}>
                  <div className={styles["chart-section"]}>
                    <h3>Weekly Data Usage</h3>
                    <div className={styles["bar-chart"]}>
                      <div className={styles["bar-item"]}>
                        <div
                          className={`${styles.bar} ${styles["bar-blue"]}`}
                          style={{ height: "60%" }}
                        ></div>
                        <div className={styles["bar-label"]}>Mon</div>
                      </div>
                      <div className={styles["bar-item"]}>
                        <div
                          className={`${styles.bar} ${styles["bar-green"]}`}
                          style={{ height: "80%" }}
                        ></div>
                        <div className={styles["bar-label"]}>Tue</div>
                      </div>
                      <div className={styles["bar-item"]}>
                        <div
                          className={`${styles.bar} ${styles["bar-purple"]}`}
                          style={{ height: "45%" }}
                        ></div>
                        <div className={styles["bar-label"]}>Wed</div>
                      </div>
                      <div className={styles["bar-item"]}>
                        <div
                          className={`${styles.bar} ${styles["bar-blue"]}`}
                          style={{ height: "90%" }}
                        ></div>
                        <div className={styles["bar-label"]}>Thu</div>
                      </div>
                      <div className={styles["bar-item"]}>
                        <div
                          className={`${styles.bar} ${styles["bar-green"]}`}
                          style={{ height: "70%" }}
                        ></div>
                        <div className={styles["bar-label"]}>Fri</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Card */}
              <div className={styles["activity-card"]}>
                <div className={styles["card-header"]}>
                  <h2>Recent Activity</h2>
                </div>
                <div className={styles["activity-list"]}>
                  <div className={`${styles["activity-item"]} ${styles.data}`}>
                    <div className={styles["activity-icon"]}>
                      <Download size={16} />
                    </div>
                    <div className={styles["activity-content"]}>
                      <p className={styles["activity-description"]}>
                        Data usage spike detected
                      </p>
                      <p className={styles["activity-time"]}>2 hours ago</p>
                    </div>
                    <div className={styles["activity-value"]}>2.3 GB</div>
                  </div>
                  <div className={`${styles["activity-item"]} ${styles.call}`}>
                    <div className={styles["activity-icon"]}>
                      <Phone size={16} />
                    </div>
                    <div className={styles["activity-content"]}>
                      <p className={styles["activity-description"]}>
                        Voice call - Premium rate
                      </p>
                      <p className={styles["activity-time"]}>5 hours ago</p>
                    </div>
                    <div className={styles["activity-value"]}>45 min</div>
                  </div>
                  <div
                    className={`${styles["activity-item"]} ${styles.payment}`}
                  >
                    <div className={styles["activity-icon"]}>
                      <CreditCard size={16} />
                    </div>
                    <div className={styles["activity-content"]}>
                      <p className={styles["activity-description"]}>
                        Bill payment received
                      </p>
                      <p className={styles["activity-time"]}>1 day ago</p>
                    </div>
                    <div className={styles["activity-value"]}>R299</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles["dashboard-right"]}>
              {/* Quick Actions */}
              <div className={styles["actions-card"]}>
                <div className={styles["card-header"]}>
                  <h2>Quick Actions</h2>
                </div>
                <div className={styles["actions-grid"]}>
                  <button className={`${styles["action-btn"]} ${styles.blue}`}>
                    <CreditCard size={20} />
                    <span>Pay Bill</span>
                  </button>
                  <button className={`${styles["action-btn"]} ${styles.green}`}>
                    <Wifi size={20} />
                    <span>Upgrade</span>
                  </button>
                  <button
                    className={`${styles["action-btn"]} ${styles.purple}`}
                  >
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                  <button
                    className={`${styles["action-btn"]} ${styles.yellow}`}
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </button>
                </div>
              </div>

              {/* Plan Card */}
              <div className={styles["plan-card"]}>
                <div className={styles["card-header"]}>
                  <h2>Current Plan</h2>
                </div>
                <div className={styles["plan-details"]}>
                  <div className={styles["plan-header"]}>
                    <h3>{currentUser.plan}</h3>
                    <span className={styles["plan-status"]}>Active</span>
                  </div>
                  <div className={styles["plan-info"]}>
                    <div className={styles["plan-row"]}>
                      <span>Monthly Fee</span>
                      <span className="value">R299.00</span>
                    </div>
                    <div className={styles["plan-row"]}>
                      <span>Data Allowance</span>
                      <span className="value">100GB</span>
                    </div>
                    <div className={styles["plan-row"]}>
                      <span>Speed</span>
                      <span className="value">100 Mbps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
