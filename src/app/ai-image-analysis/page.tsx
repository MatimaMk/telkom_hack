"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ArrowLeft,
  Upload,
  Camera,
  Loader2,
  CheckCircle,
  XCircle,
  Smartphone,
  Wifi,
  Settings,
  DollarSign,
  Zap,
  Shield,
  Info,
} from "lucide-react";
import styles from "./style/ai-image.module.css";

interface AnalysisResult {
  deviceType: string;
  deviceName: string;
  specifications?: {
    brand?: string;
    model?: string;
    processor?: string;
    ram?: string;
    storage?: string;
    display?: string;
    camera?: string;
    battery?: string;
  };
  telkomRecommendations: {
    plans: Array<{
      name: string;
      price: string;
      description: string;
      features: string[];
    }>;
    accessories?: Array<{
      name: string;
      price: string;
      description: string;
    }>;
    services?: Array<{
      name: string;
      description: string;
      benefits: string[];
    }>;
  };
  configurationTips?: string[];
  compatibilityNotes?: string[];
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyBxM9lp3-3_mifpdppt66AlhWAPcLUd90k");

const AIImageAnalysis: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setError(null);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to convert file to Gemini format
  const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type,
      },
    } as const;
  };

  const analyzeImage = async () => {
    if (!selectedImage || !selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Use Gemini 2.0 Flash model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `Analyze this device image and provide detailed information in JSON format. Identify the device type, brand, model, and specifications if possible. Then provide Telkom South Africa specific recommendations including suitable mobile plans, accessories, and services. Structure your response as a JSON object with the following format:

{
  "deviceType": "smartphone|tablet|router|laptop|other",
  "deviceName": "Full device name",
  "specifications": {
    "brand": "Device brand",
    "model": "Device model",
    "processor": "Processor info if visible/identifiable",
    "ram": "RAM amount if identifiable",
    "storage": "Storage capacity if identifiable",
    "display": "Display info if identifiable",
    "camera": "Camera info if identifiable",
    "battery": "Battery info if identifiable"
  },
  "telkomRecommendations": {
    "plans": [
      {
        "name": "Plan name",
        "price": "R[amount]/month",
        "description": "Plan description tailored to this device",
        "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
      }
    ],
    "accessories": [
      {
        "name": "Accessory name",
        "price": "R[amount]",
        "description": "Accessory description"
      }
    ],
    "services": [
      {
        "name": "Service name",
        "description": "Service description",
        "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"]
      }
    ]
  },
  "configurationTips": [
    "Tip 1 for optimal Telkom network usage",
    "Tip 2 for device configuration",
    "Tip 3 for best performance"
  ],
  "compatibilityNotes": [
    "Compatibility note 1",
    "Compatibility note 2",
    "Compatibility note 3"
  ]
}

Please provide realistic Telkom South Africa plans and pricing. Focus on current market offerings and ensure recommendations are relevant to the identified device type.`;

      // Convert file to format Gemini can process
      const imagePart = await fileToGenerativePart(selectedFile);

      // Generate response
      const result = await model.generateContent([prompt, imagePart as any]);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse AI response");
      }

      const analysisData = JSON.parse(jsonMatch[0]);
      setAnalysisResult(analysisData);
    } catch (err) {
      console.error("Gemini API error:", err);
      setError("Failed to analyze image with AI. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={20} />
            Back
          </button>
          <div className={styles.headerTitle}>
            <h1>AI Image Analysis</h1>
            <p>Upload an image to get Telkom recommendations and insights</p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Upload Section */}
        {!selectedImage && (
          <div className={styles.uploadSection}>
            <div className={styles.uploadArea}>
              <div className={styles.uploadIcon}>
                <Camera size={48} />
              </div>
              <h2>Upload Device Image</h2>
              <p>
                Take a photo or upload an image of your device for AI analysis
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className={styles.hiddenInput}
                aria-label="Upload device image"
              />

              <div className={styles.uploadActions}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.uploadBtn}
                >
                  <Upload size={20} />
                  Choose Image
                </button>
              </div>

              <div className={styles.uploadHint}>
                <p>Supported formats: JPG, PNG, WebP (Max 10MB)</p>
                <p>Best results with clear, well-lit images</p>
              </div>
            </div>

            {/* Info Cards */}
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Smartphone size={24} />
                </div>
                <h3>Device Recognition</h3>
                <p>
                  Identifies smartphones, tablets, routers, and other tech
                  devices
                </p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <DollarSign size={24} />
                </div>
                <h3>Price Matching</h3>
                <p>Get current Telkom pricing and plan recommendations</p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <Settings size={24} />
                </div>
                <h3>Configuration Help</h3>
                <p>Step-by-step setup guides for optimal performance</p>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview & Analysis */}
        {selectedImage && (
          <div className={styles.analysisSection}>
            <div className={styles.imagePreview}>
              <img
                src={selectedImage}
                alt="Uploaded device"
                className={styles.previewImage}
              />
              <div className={styles.imageActions}>
                <button onClick={resetAnalysis} className={styles.changeBtn}>
                  Change Image
                </button>
                {!analysisResult && !isAnalyzing && (
                  <button onClick={analyzeImage} className={styles.analyzeBtn}>
                    <Zap size={20} />
                    Analyze Image
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isAnalyzing && (
              <div className={styles.loadingState}>
                <div className={styles.loadingIcon}>
                  <Loader2 size={32} className={styles.spinning} />
                </div>
                <h3>Analyzing Your Image...</h3>
                <p>
                  Our AI is identifying the device and finding the best Telkom
                  options for you
                </p>
                <div className={styles.loadingSteps}>
                  <div className={styles.loadingStep}>
                    <CheckCircle size={16} className={styles.completed} />
                    Device recognition
                  </div>
                  <div className={styles.loadingStep}>
                    <CheckCircle size={16} className={styles.completed} />
                    Specification analysis
                  </div>
                  <div className={styles.loadingStep}>
                    <Loader2 size={16} className={styles.spinning} />
                    Telkom recommendations
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className={styles.errorState}>
                <XCircle size={32} className={styles.errorIcon} />
                <h3>Analysis Failed</h3>
                <p>{error}</p>
                <button onClick={analyzeImage} className={styles.retryBtn}>
                  Try Again
                </button>
              </div>
            )}

            {/* Results */}
            {analysisResult && (
              <div className={styles.resultsSection}>
                <div className={styles.resultsHeader}>
                  <CheckCircle size={32} className={styles.successIcon} />
                  <div>
                    <h2>Analysis Complete!</h2>
                    <p>
                      We've identified your device and found the perfect Telkom
                      solutions
                    </p>
                  </div>
                </div>

                {/* Device Info */}
                <div className={styles.deviceCard}>
                  <div className={styles.deviceHeader}>
                    <Smartphone size={24} />
                    <div>
                      <h3>{analysisResult.deviceName}</h3>
                      <p>
                        {analysisResult.deviceType.charAt(0).toUpperCase() +
                          analysisResult.deviceType.slice(1)}
                      </p>
                    </div>
                  </div>

                  {analysisResult.specifications && (
                    <div className={styles.specsGrid}>
                      {Object.entries(analysisResult.specifications).map(
                        ([key, value]) => (
                          <div key={key} className={styles.specItem}>
                            <span className={styles.specLabel}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <span className={styles.specValue}>{value}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Telkom Plans */}
                <div className={styles.recommendationsSection}>
                  <h3>Recommended Telkom Plans</h3>
                  <div className={styles.plansGrid}>
                    {analysisResult.telkomRecommendations.plans.map(
                      (plan, index) => (
                        <div key={index} className={styles.planCard}>
                          <div className={styles.planHeader}>
                            <h4>{plan.name}</h4>
                            <span className={styles.planPrice}>
                              {plan.price}
                            </span>
                          </div>
                          <p className={styles.planDescription}>
                            {plan.description}
                          </p>
                          <ul className={styles.planFeatures}>
                            {plan.features.map((feature, idx) => (
                              <li key={idx}>
                                <CheckCircle size={14} />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button className={styles.selectPlanBtn}>
                            Select Plan
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Accessories */}
                {analysisResult.telkomRecommendations.accessories && (
                  <div className={styles.accessoriesSection}>
                    <h3>Recommended Accessories</h3>
                    <div className={styles.accessoriesGrid}>
                      {analysisResult.telkomRecommendations.accessories.map(
                        (accessory, index) => (
                          <div key={index} className={styles.accessoryCard}>
                            <div className={styles.accessoryHeader}>
                              <h4>{accessory.name}</h4>
                              <span className={styles.accessoryPrice}>
                                {accessory.price}
                              </span>
                            </div>
                            <p>{accessory.description}</p>
                            <button className={styles.addToCartBtn}>
                              Add to Cart
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Configuration Tips */}
                {analysisResult.configurationTips && (
                  <div className={styles.tipsSection}>
                    <h3>
                      <Settings size={20} />
                      Configuration Tips
                    </h3>
                    <div className={styles.tipsList}>
                      {analysisResult.configurationTips.map((tip, index) => (
                        <div key={index} className={styles.tipItem}>
                          <Info size={16} />
                          <p>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compatibility Notes */}
                {analysisResult.compatibilityNotes && (
                  <div className={styles.compatibilitySection}>
                    <h3>
                      <Shield size={20} />
                      Compatibility Notes
                    </h3>
                    <div className={styles.compatibilityList}>
                      {analysisResult.compatibilityNotes.map((note, index) => (
                        <div key={index} className={styles.compatibilityItem}>
                          <CheckCircle size={16} />
                          <p>{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className={styles.actionsSection}>
                  <button
                    onClick={resetAnalysis}
                    className={styles.newAnalysisBtn}
                  >
                    Analyze Another Image
                  </button>
                  <button className={styles.contactBtn}>
                    Contact Sales Team
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AIImageAnalysis;
