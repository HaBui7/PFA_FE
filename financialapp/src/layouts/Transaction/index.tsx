<<<<<<< Updated upstream
import Transactionlist from "@/components/ui/transactionlist";
import PieTransaction from "@/components/ui/pie-transaction";
=======
import Transactionlist from "@/components/ui/forTransaction/transactionlist";
import { PieTransaction } from "@/components/ui/forTransaction/pie-transaction";
>>>>>>> Stashed changes
const TransactionPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center py-10">
        <div className="text-center">
          <span className="font-bold text-2xl">Welcome back,</span>{" "}
          <span>RMIT</span>
        </div>

        <p className="py-5">Welcome back !</p>
      </div>
      <PieTransaction></PieTransaction>
      <div className="pb-10 flex flex-col items-center w-6/12 mx-auto"></div>
      <Transactionlist></Transactionlist>
    </div>
  );
};

export default TransactionPage;
