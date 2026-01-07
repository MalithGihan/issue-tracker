import { useState } from "react";
import { Zap, Users, Building2 } from "lucide-react";
import SubTitle from "../../components/Home/SubTitle";
import PricingCard from "../../components/Pricing/PricingCard";
import BottomButtonSet from "../../components/Home/BottomButtonSet";
import TopTitle from "../../components/Common/TopTitle";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  const plans = [
    {
      plan: "Starter",
      price: billingPeriod === "monthly" ? "0" : "0",
      period: "month",
      description: "Perfect for individuals and small teams getting started",
      icon: Zap,
      buttonText: "Get Started Free",
      buttonVariant: "secondary",
      isPopular: false,
      features: [
        "Up to 10 issues per month",
        "Basic issue tracking",
        "2 team members",
        "Email support",
        "Mobile app access",
        "Basic analytics",
      ],
    },
    {
      plan: "Professional",
      price: billingPeriod === "monthly" ? "29" : "290",
      period: billingPeriod === "monthly" ? "month" : "year",
      description: "For growing teams that need advanced features",
      icon: Users,
      buttonText: "Start Free Trial",
      buttonVariant: "primary",
      isPopular: true,
      features: [
        "Unlimited issues",
        "Advanced issue tracking",
        "Up to 20 team members",
        "Priority email & chat support",
        "Custom workflows",
        "Advanced analytics & reports",
        "API access",
        "Integration with 50+ tools",
      ],
    },
    {
      plan: "Enterprise",
      price: billingPeriod === "monthly" ? "99" : "990",
      period: billingPeriod === "monthly" ? "month" : "year",
      description: "For large organizations with custom needs",
      icon: Building2,
      buttonText: "Contact Sales",
      buttonVariant: "secondary",
      isPopular: false,
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Dedicated account manager",
        "24/7 phone & email support",
        "Custom integrations",
        "Advanced security features",
        "SLA guarantee",
        "On-premise deployment option",
        "Custom training & onboarding",
      ],
    },
  ];

  return (
    <div className="p-8 pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <TopTitle
          title="Pricing"
          subTitle="Simple & Easy"
          description="Choose the perfect plan for your team. All plans include a 14-day free trial."
        />

        <div className="flex items-center justify-center gap-4 my-20">
          <span
            className={`text-sm font-medium ${
              billingPeriod === "monthly" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingPeriod(
                billingPeriod === "monthly" ? "yearly" : "monthly"
              )
            }
            className="relative w-14 h-7 bg-gray-300 rounded-full transition-colors hover:bg-gray-400"
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                billingPeriod === "yearly" ? "translate-x-7" : ""
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              billingPeriod === "yearly" ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Yearly
          </span>
          {billingPeriod === "yearly" && (
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Save 17%
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-20">
          <SubTitle
            title1="Frequently Asked"
            title2="Questions"
            description="Everything you need to explore with issue tracker"
          />
          <div className="space-y-6">
            <div className="pb-4">
              <h4 className="font-semibold mb-2">
                Can I switch plans at any time?
              </h4>
              <p className="text-sm text-gray-600 pl-3">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="pb-4">
              <h4 className="font-semibold mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-sm text-gray-600 pl-3">
                We accept all major credit cards, PayPal, and bank transfers for
                Enterprise plans.
              </p>
            </div>
            <div className="pb-4">
              <h4 className="font-semibold mb-2">Is there a setup fee?</h4>
              <p className="text-sm text-gray-600 pl-3">
                No, there are no setup fees. You only pay for your chosen plan.
              </p>
            </div>
          </div>
        </div>

        <BottomButtonSet
          topic={"Ready to get started?"}
          description={
            "Join thousands of teams already using our issue tracker to streamline their workflow and boost productivity."
          }
          button1Title={"Start Free Trial"}
          button2Title={"Contact Sales"}
        />
      </div>
    </div>
  );
}
