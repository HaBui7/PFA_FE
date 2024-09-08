import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  backgroundColor: string;
  icon: LucideIcon;

  title: string;
  amount: string;
}

const StatCard: React.FC<StatCardProps> = ({
  backgroundColor,
  icon: Icon,

  title,
  amount,
}) => {
  return (
    <div className="">
      <Card className={`rounded-lg p-4 ${backgroundColor} `}>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl mt-2">{title}</CardTitle>
            </div>
            <div>
              <Icon size={30} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xl font-bold">{amount}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCard;
