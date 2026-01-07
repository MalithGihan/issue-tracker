import { ArrowRight, Check } from "lucide-react";
import type { ComponentType } from "react";

type PricingCardProps = {
    plan: string;
    price:string;
    period:string;
    description:string;
    features:string[];
    isPopular:boolean;
    icon:  ComponentType<{ className?: string }>; 
    buttonText:string;
    buttonVariant:string;
}

export default function PricingCard ({ plan, price, period, description, features, isPopular, icon: Icon, buttonText, buttonVariant }: PricingCardProps) {
  return (
    <div className={`relative bg-white/10 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-all hover:shadow-xl ${isPopular ? 'border-2 border-cyan-200 scale-105' : 'border border-gray-200'}`}>
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-linear-to-r from-cyan-400 to-green-300 text-white text-center py-2 text-sm font-semibold">
          Most Popular
        </div>
      )}
      
      <div className={`p-8 ${isPopular ? 'pt-14' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-gray-900" />
          </div>
          <h3 className="text-2xl font-bold">{plan}</h3>
        </div>
        
        <p className="text-gray-600 text-xs mb-6">{description}</p>
        
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">${price}</span>
            <span className="text-gray-600">/{period}</span>
          </div>
        </div>
        
        <button className={`w-full py-3 px-6 rounded-lg text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 group ${
          buttonVariant === 'primary' 
            ? 'bg-gray-900 text-white hover:bg-gray-800' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}>
          {buttonText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <div className="mt-8 space-y-4">
          <p className="text-sm font-semibold text-gray-900">What's included:</p>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};