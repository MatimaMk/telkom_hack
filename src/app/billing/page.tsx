"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  Download,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  Receipt,
  Building,
  Smartphone,
  Wifi,
} from "lucide-react";
import styles from "./billing.module.css";

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

interface BillItem {
  id: string;
  service: string;
  description: string;
  amount: number;
  icon: JSX.Element;
}

interface Bill {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "due" | "overdue";
  items: BillItem[];
}

const Billing: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [billHistory, setBillHistory] = useState<Bill[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const savedUser = sessionStorage.getItem("telkom_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      loadBillingData();
    } else {
      // Redirect to home if not logged in
      router.push("/");
    }
    setIsLoading(false);
  }, [router]);

  const loadBillingData = () => {
    // Mock current bill data
    const mockCurrentBill: Bill = {
      id: "BILL-2025-001",
      date: "2025-01-01",
      dueDate: "2025-01-25",
      amount: 299.00,
      status: "due",
      items: [
        {
          id: "1",
          service: "Fiber Internet",
          description: "100Mbps Uncapped Fiber",
          amount: 199.00,
          icon: <Wifi size={20} />
        },
        {
          id: "2",
          service: "Mobile Plan",
          description: "FreeMe 5GB Package",
          amount: 100.00,
          icon: <Smartphone size={20} />
        }
      ]
    };

    // Mock bill history
    const mockBillHistory: Bill[] = [
      {
        id: "BILL-2024-012",
        date: "2024-12-01",
        dueDate: "2024-12-25",
        amount: 299.00,
        status: "paid",
        items: [
          {
            id: "1",
            service: "Fiber Internet",
            description: "100Mbps Uncapped Fiber",
            amount: 199.00,
            icon: <Wifi size={20} />
          },
          {
            id: "2",
            service: "Mobile Plan",
            description: "FreeMe 5GB Package",
            amount: 100.00,
            icon: <Smartphone size={20} />
          }
        ]
      },
      {
        id: "BILL-2024-011",
        date: "2024-11-01",
        dueDate: "2024-11-25",
        amount: 299.00,
        status: "paid",
        items: [
          {
            id: "1",
            service: "Fiber Internet",
            description: "100Mbps Uncapped Fiber",
            amount: 199.00,
            icon: <Wifi size={20} />
          },
          {
            id: "2",
            service: "Mobile Plan",
            description: "FreeMe 5GB Package",
            amount: 100.00,
            icon: <Smartphone size={20} />
          }
        ]
      },
      {
        id: "BILL-2024-010",
        date: "2024-10-01",
        dueDate: "2024-10-25",
        amount: 299.00,
        status: "paid",
        items: [
          {
            id: "1",
            service: "Fiber Internet",
            description: "100Mbps Uncapped Fiber",
            amount: 199.00,
            icon: <Wifi size={20} />
          },
          {
            id: "2",
            service: "Mobile Plan",
            description: "FreeMe 5GB Package",
            amount: 100.00,
            icon: <Smartphone size={20} />
          }
        ]
      }
    ];

    setCurrentBill(mockCurrentBill);
    setBillHistory(mockBillHistory);
  };

  const goBack = () => {
    router.push("/dashboard");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return styles.statusPaid;
      case "due":
        return styles.statusDue;
      case "overdue":
        return styles.statusOverdue;
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle size={16} />;
      case "due":
        return <Clock size={16} />;
      case "overdue":
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  const handlePayNow = () => {
    // Simulate payment processing
    alert("Payment functionality would be integrated with a payment gateway like PayFast or Peach Payments in a real application.");
  };

  const handleDownloadBill = (billId: string) => {
    alert(`Downloading bill ${billId}. In a real application, this would generate and download a PDF invoice.`);
  };

  if (isLoading) {
    return (
      <div className={styles.billing}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your billing information...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className={styles.billing}>
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
            <h1>Billing & Payments</h1>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.accountInfo}>
              Account: {currentUser.accountNumber}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Current Bill Section */}
          {currentBill && (
            <div className={styles.currentBillSection}>
              <div className={styles.currentBill}>
                <div className={styles.billHeader}>
                  <div className={styles.billInfo}>
                    <h2>Current Bill</h2>
                    <p className={styles.billId}>Bill ID: {currentBill.id}</p>
                    <p className={styles.billDate}>
                      Issued: {new Date(currentBill.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.billAmount}>
                    <span className={styles.currency}>R</span>
                    <span className={styles.amount}>{currentBill.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className={styles.billStatus}>
                  <span className={`${styles.status} ${getStatusColor(currentBill.status)}`}>
                    {getStatusIcon(currentBill.status)}
                    {currentBill.status === "due" ? `Due ${new Date(currentBill.dueDate).toLocaleDateString()}` : currentBill.status}
                  </span>
                </div>

                <div className={styles.billItems}>
                  <h3>Bill Breakdown</h3>
                  {currentBill.items.map((item) => (
                    <div key={item.id} className={styles.billItem}>
                      <div className={styles.itemIcon}>{item.icon}</div>
                      <div className={styles.itemDetails}>
                        <p className={styles.itemService}>{item.service}</p>
                        <p className={styles.itemDescription}>{item.description}</p>
                      </div>
                      <div className={styles.itemAmount}>R{item.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className={styles.billActions}>
                  <button onClick={handlePayNow} className={styles.payBtn}>
                    <CreditCard size={18} />
                    Pay Now
                  </button>
                  <button
                    onClick={() => handleDownloadBill(currentBill.id)}
                    className={styles.downloadBtn}
                  >
                    <Download size={18} />
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className={styles.paymentMethods}>
                <h3>Payment Options</h3>
                <div className={styles.paymentOptions}>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPaymentMethod === "card"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <div className={styles.optionContent}>
                      <CreditCard size={24} />
                      <div>
                        <p>Credit/Debit Card</p>
                        <span>Secure online payment</span>
                      </div>
                    </div>
                  </label>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="payment"
                      value="eft"
                      checked={selectedPaymentMethod === "eft"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <div className={styles.optionContent}>
                      <Building size={24} />
                      <div>
                        <p>Bank Transfer (EFT)</p>
                        <span>Direct bank payment</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Bill History */}
          <div className={styles.billHistory}>
            <div className={styles.historyHeader}>
              <h2>
                <Receipt size={24} />
                Bill History
              </h2>
            </div>
            <div className={styles.historyList}>
              {billHistory.map((bill) => (
                <div key={bill.id} className={styles.historyItem}>
                  <div className={styles.historyInfo}>
                    <div className={styles.historyDetails}>
                      <p className={styles.historyId}>{bill.id}</p>
                      <p className={styles.historyDate}>
                        {new Date(bill.date).toLocaleDateString()} - {new Date(bill.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={styles.historyAmount}>
                      R{bill.amount.toFixed(2)}
                    </div>
                    <div className={`${styles.historyStatus} ${getStatusColor(bill.status)}`}>
                      {getStatusIcon(bill.status)}
                      {bill.status}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadBill(bill.id)}
                    className={styles.downloadBtnSmall}
                  >
                    <Download size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;