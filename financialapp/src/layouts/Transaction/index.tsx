import TransactionList from "@/components/ui/forTransaction/transactionlist";
import { PieTransaction } from "@/components/ui/forTransaction/pie-transaction";
import { PieTotal } from "@/components/ui/pie-total";
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
      <div className="flex"></div>
      <PieTransaction></PieTransaction>
      <PieTotal></PieTotal>
      <div className="pb-10 flex flex-col items-center w-6/12 mx-auto"></div>
      <TransactionList></TransactionList>
    </div>
  );
};

export default TransactionPage;
