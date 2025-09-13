"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import {
  LogIn,
  User,
  X,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Shield,
  Zap,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Menu,
  Wifi,
  Smartphone,
  Globe,
  HeadphonesIcon,
  Clock,
  Award,
} from "lucide-react";
import styles from "./AuthComponent.module.css";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthComponentProps {
  onAuthSuccess: (user: any, action: "login" | "register") => void;
  onClose: () => void;
}

const TelkomLandingPage: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = sessionStorage.getItem("telkom_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      // Redirect to dashboard if already logged in
      router.push('/dashboard');
    }
  }, [router]);

  const handleAuthSuccess = (user: any, action: "login" | "register") => {
    setCurrentUser(user);
    setShowAuth(false);
    // Redirect to dashboard after successful login/register
    router.push('/dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem("telkom_current_user");
    sessionStorage.removeItem("telkom_session_start");
    setCurrentUser(null);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navLogo}>
            <div className={styles.logoIcon}>T</div>
            <span className={styles.logoText}>Telkom</span>
          </div>

          <div
            className={`${styles.navMenu} ${
              mobileMenuOpen ? styles.navMenuOpen : ""
            }`}
          >
            <a href="#home" className={styles.navLink}>
              Home
            </a>
            <a href="#services" className={styles.navLink}>
              Services
            </a>
            <a href="#about" className={styles.navLink}>
              About
            </a>
            <a href="#contact" className={styles.navLink}>
              Contact
            </a>
          </div>

          <div className={styles.navActions}>
            {currentUser ? (
              <div className={styles.userMenu}>
                <span className={styles.welcomeText}>
                  Welcome, {currentUser.firstName}
                </span>
                <button onClick={() => router.push('/dashboard')} className={styles.dashboardBtn}>
                  Dashboard
                </button>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className={styles.loginBtn}
              >
                <LogIn size={18} />
                Login
              </button>
            )}

            <button
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Open navigation menu"
              aria-label="Open navigation menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Connect to Excellence with
              <span className={styles.heroHighlight}> Telkom</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Experience premium telecommunications services with cutting-edge
              technology, reliable connectivity, and exceptional customer
              support that keeps you connected to what matters most.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.heroPrimaryBtn}>
                Get Started
                <ArrowRight size={20} />
              </button>
              <button className={styles.heroSecondaryBtn}>Learn More</button>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardIcon}>
                <Zap size={40} />
              </div>
              <h3>Ultra-Fast Speed</h3>
              <p>Up to 1Gbps fiber connection</p>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroCardIcon}>
                <Shield size={40} />
              </div>
              <h3>Secure Network</h3>
              <p>Enterprise-grade security</p>
            </div>
            <div className={styles.heroCard}>
              <div className={styles.heroCardIcon}>
                <Users size={40} />
              </div>
              <h3>24/7 Support</h3>
              <p>Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.services}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Our Premium Services</h2>
            <p>Comprehensive telecommunications solutions for every need</p>
          </div>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Wifi size={32} />
              </div>
              <h3>Fiber Internet</h3>
              <p>
                Lightning-fast fiber optic internet with speeds up to 1Gbps for
                seamless browsing, streaming, and gaming.
              </p>
              <ul className={styles.serviceFeatures}>
                <li>
                  <CheckCircle size={16} /> Unlimited data
                </li>
                <li>
                  <CheckCircle size={16} /> 99.9% uptime guarantee
                </li>
                <li>
                  <CheckCircle size={16} /> Free installation
                </li>
              </ul>
              <button className={styles.serviceBtn}>Learn More</button>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Smartphone size={32} />
              </div>
              <h3>Mobile Plans</h3>
              <p>
                Flexible mobile plans with extensive coverage, unlimited calls,
                and high-speed data across the country.
              </p>
              <ul className={styles.serviceFeatures}>
                <li>
                  <CheckCircle size={16} /> 5G network coverage
                </li>
                <li>
                  <CheckCircle size={16} /> International roaming
                </li>
                <li>
                  <CheckCircle size={16} /> Family plans available
                </li>
              </ul>
              <button className={styles.serviceBtn}>Learn More</button>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Globe size={32} />
              </div>
              <h3>Business Solutions</h3>
              <p>
                Enterprise-grade connectivity and communication solutions
                designed for businesses of all sizes.
              </p>
              <ul className={styles.serviceFeatures}>
                <li>
                  <CheckCircle size={16} /> Dedicated support
                </li>
                <li>
                  <CheckCircle size={16} /> Custom solutions
                </li>
                <li>
                  <CheckCircle size={16} /> Scalable plans
                </li>
              </ul>
              <button className={styles.serviceBtn}>Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>2M+</div>
              <div className={styles.statLabel}>Happy Customers</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>99.9%</div>
              <div className={styles.statLabel}>Network Uptime</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Customer Support</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1000+</div>
              <div className={styles.statLabel}>Service Points</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.about}>
        <div className={styles.container}>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <h2>Leading Telecommunications in South Africa</h2>
              <p>
                For over two decades, Telkom has been at the forefront of South
                Africa's telecommunications revolution. We connect millions of
                people and businesses across the country with reliable,
                innovative, and affordable communication solutions.
              </p>
              <div className={styles.aboutFeatures}>
                <div className={styles.aboutFeature}>
                  <Award size={24} />
                  <div>
                    <h4>Industry Leader</h4>
                    <p>Recognized for excellence in telecommunications</p>
                  </div>
                </div>
                <div className={styles.aboutFeature}>
                  <HeadphonesIcon size={24} />
                  <div>
                    <h4>Customer First</h4>
                    <p>Dedicated support team available 24/7</p>
                  </div>
                </div>
                <div className={styles.aboutFeature}>
                  <Clock size={24} />
                  <div>
                    <h4>Reliable Service</h4>
                    <p>Consistent performance you can count on</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.aboutVisual}>
              <div className={styles.aboutCard}>
                <h3>Our Mission</h3>
                <p>
                  To connect South Africa through innovative telecommunications
                  solutions that empower communities and drive economic growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={styles.contact}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Get in Touch</h2>
            <p>We're here to help you stay connected</p>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4>Call Us</h4>
                  <p>+27 10 200 2000</p>
                  <p>Available 24/7</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4>Email Support</h4>
                  <p>support@telkom.co.za</p>
                  <p>We'll respond within 24 hours</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4>Visit Us</h4>
                  <p>61 Oak Avenue, Highveld Techno Park</p>
                  <p>Centurion, Gauteng, South Africa</p>
                </div>
              </div>
            </div>

            <div className={styles.contactForm}>
              <form className={styles.form}>
                <div className={styles.formRow}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className={styles.formInput}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className={styles.formInput}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className={styles.formInput}
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className={styles.formTextarea}
                ></textarea>
                <button type="submit" className={styles.formSubmitBtn}>
                  Send Message
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <div className={styles.footerLogo}>
                <div className={styles.logoIcon}>T</div>
                <span className={styles.logoText}>Telkom</span>
              </div>
              <p>
                Connecting South Africa with reliable telecommunications
                solutions since 1991.
              </p>
            </div>

            <div className={styles.footerSection}>
              <h4>Services</h4>
              <ul>
                <li>
                  <a href="#">Fiber Internet</a>
                </li>
                <li>
                  <a href="#">Mobile Plans</a>
                </li>
                <li>
                  <a href="#">Business Solutions</a>
                </li>
                <li>
                  <a href="#">Cloud Services</a>
                </li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4>Support</h4>
              <ul>
                <li>
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Technical Support</a>
                </li>
                <li>
                  <a href="#">Network Status</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>

            <div className={styles.footerSection}>
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">News & Media</a>
                </li>
                <li>
                  <a href="#">Investor Relations</a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>&copy; 2025 Telkom. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && (
        <AuthComponent
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
};

// Enhanced Auth Component
const AuthComponent: React.FC<AuthComponentProps> = ({
  onAuthSuccess,
  onClose,
}) => {
  const [currentView, setCurrentView] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // helpers
  const getUsers = () => {
    const users = localStorage.getItem("telkom_users");
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (userData: UserData) => {
    const users = getUsers();
    const newUser = {
      id: Date.now(),
      ...userData,
      registeredAt: new Date().toISOString(),
      plan: "Smart Starter",
      accountNumber: `TEL${Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase()}`,
    };
    users.push(newUser);
    localStorage.setItem("telkom_users", JSON.stringify(users));
    return newUser;
  };

  const setCurrentSession = (user: any) => {
    sessionStorage.setItem("telkom_current_user", JSON.stringify(user));
    sessionStorage.setItem("telkom_session_start", new Date().toISOString());
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (currentView === "register") {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(
        (u: any) =>
          u.email === formData.email && u.password === formData.password
      );
      if (user) {
        setCurrentSession(user);
        onAuthSuccess(user, "login");
      } else {
        setErrors({ general: "Invalid email or password" });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const existingUser = users.find((u: any) => u.email === formData.email);
      if (existingUser) {
        setErrors({ general: "Email already exists" });
        setIsLoading(false);
        return;
      }
      const newUser = saveUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      setCurrentSession(newUser);
      onAuthSuccess(newUser, "register");
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      confirmPassword: "",
    });
    setErrors({});
  }, [currentView]);

  return (
    <div className={styles.authOverlay}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <div className={styles.authLogo}>
            <div className={styles.logoIcon}>T</div>
            <span className={styles.logoText}>Telkom</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.authContent}>
          <div className={styles.authTabs}>
            <button
              className={`${styles.tab} ${
                currentView === "login" ? styles.active : ""
              }`}
              onClick={() => setCurrentView("login")}
            >
              <LogIn size={20} />
              Login
            </button>
            <button
              className={`${styles.tab} ${
                currentView === "register" ? styles.active : ""
              }`}
              onClick={() => setCurrentView("register")}
            >
              <User size={20} />
              Register
            </button>
          </div>

          {errors.general && (
            <div className={`${styles.errorMessage} ${styles.generalError}`}>
              {errors.general}
            </div>
          )}

          {currentView === "login" ? (
            <form onSubmit={handleLogin} className={styles.authForm}>
              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? styles.error : ""}
                  />
                </div>
                {errors.email && (
                  <div className={styles.errorText}>{errors.email}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div className={styles.errorText}>{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className={`${styles.authBtn} ${styles.primary}`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className={styles.authForm}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? styles.error : ""}
                />
                {errors.firstName && (
                  <div className={styles.errorText}>{errors.firstName}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? styles.error : ""}
                />
                {errors.lastName && (
                  <div className={styles.errorText}>{errors.lastName}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? styles.error : ""}
                />
                {errors.phone && (
                  <div className={styles.errorText}>{errors.phone}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? styles.error : ""}
                />
                {errors.email && (
                  <div className={styles.errorText}>{errors.email}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? styles.error : ""}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div className={styles.errorText}>{errors.password}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? styles.error : ""}
                />
                {errors.confirmPassword && (
                  <div className={styles.errorText}>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`${styles.authBtn} ${styles.primary}`}
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelkomLandingPage;
