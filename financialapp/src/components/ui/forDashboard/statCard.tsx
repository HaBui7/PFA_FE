import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  backgroundColor: string;
  icon: LucideIcon;
  percentage: string;
  title: string;
  amount: string;
  percentageColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  backgroundColor,
  icon: Icon,
  percentage,
  title,
  amount,
  percentageColor,
}) => {
  return (
    <div className="">
      <Card className={`rounded-lg p-4 ${backgroundColor} `}>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <span
                className={`text-sm font-semibold bg-white p-2 rounded-full ${percentageColor}`}
              >
                {percentage}
              </span>
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
