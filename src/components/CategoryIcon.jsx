import React from 'react';
import {
  Fuel,
  ShoppingCart,
  Utensils,
  Car,
  Zap,
  Home,
  HeartPulse,
  Smartphone,
  Gamepad2,
  Layers,
  Briefcase,
  Store,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle,
  HelpCircle,
  CreditCard,
  Banknote,
  ArrowRightLeft
} from 'lucide-react';

const ICON_MAP = {
  Fuel,
  ShoppingCart,
  Utensils,
  Car,
  Zap,
  Home,
  HeartPulse,
  Smartphone,
  Gamepad2,
  Layers,
  Briefcase,
  Store,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle,
  CreditCard,
  Banknote,
  ArrowRightLeft
};

export default function CategoryIcon({ name, size = 18, className = '', color = 'currentColor' }) {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent size={size} className={className} color={color} />;
}
