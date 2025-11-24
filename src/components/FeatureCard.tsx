import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: string;
}

const FeatureCard = ({ icon: Icon, title, description, delay = '0ms' }: FeatureCardProps) => {
  return (
    <div
      className="bg-card rounded-3xl p-8 shadow-md card-hover animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-6">
          <Icon className="text-primary-foreground" size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
