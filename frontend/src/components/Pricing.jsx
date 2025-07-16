// src/components/Pricing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./pricing.css";

const Pricing = ({ user }) => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      id: 1,
      name: "Basic",
      price: "Free",
      duration: "Always",
      features: [
        "Access to 3 free courses",
        "Basic course materials",
        "Community forum access",
        "Certificate of completion"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      id: 2,
      name: "Premium",
      price: "$29",
      duration: "per month",
      features: [
        "Access to all courses",
        "Premium course materials",
        "Priority support",
        "Advanced certificates",
        "Downloadable resources",
        "Live Q&A sessions"
      ],
      buttonText: "Choose Premium",
      popular: true
    },
    {
      id: 3,
      name: "Enterprise",
      price: "$99",
      duration: "per month",
      features: [
        "Everything in Premium",
        "Custom learning paths",
        "Team management",
        "Advanced analytics",
        "Dedicated account manager",
        "Custom integrations"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  const handlePlanSelect = (planName) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (planName === "Enterprise") {
      // Handle enterprise contact
      alert("Enterprise plan selected! Contact sales for more information.");
    } else {
      // Handle subscription logic
      alert(`${planName} plan selected! Redirecting to payment...`);
    }
  };

  return (
    <div className="pricing-page">
      <header className="pricing-header">
        <h1>Choose Your Learning Plan</h1>
        <p>Select the perfect plan that fits your learning goals and budget.</p>
      </header>

      <section className="pricing-section">
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="price-amount">{plan.price}</span>
                  {plan.duration !== "Always" && (
                    <span className="price-duration">/{plan.duration}</span>
                  )}
                </div>
              </div>

              <ul className="features-list">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="checkmark">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`btn plan-btn ${plan.popular ? 'popular-btn' : ''}`}
                onClick={() => handlePlanSelect(plan.name)}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Can I change my plan anytime?</h4>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          <div className="faq-item">
            <h4>Is there a free trial?</h4>
            <p>Yes! Our Basic plan is completely free and gives you access to 3 courses to get started.</p>
          </div>
          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
          </div>
          <div className="faq-item">
            <h4>Do you offer refunds?</h4>
            <p>Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;