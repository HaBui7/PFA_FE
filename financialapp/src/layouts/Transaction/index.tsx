import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import Transaction from "@/sample_data/transaction_data.json";
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import ReactPaginate from "react-paginate";

const handlePageClick = () => {};
const TransactionPage = () => {
  return (
    <div>
      <div className="flex flex-col items-center py-10">
        <p className="text-2xl font-bold">Good Morning, RMIT</p>
        <p className="py-5">Welcome back !</p>
      </div>
      <div className="space-y-4 m-auto flex flex-col w-4/12">
        {Transaction.map((transaction, index) => (
          <Card key={index}>
            <CardContent className="flex justify-between pt-6 ">
              <div className="">
                <p className="font-bold  ">{transaction.name}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(transaction.date).toDateString()}
                </p>
              </div>
              <p
                className={`font-bold  ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}$
                {Math.abs(transaction.amount).toFixed(2)}
              </p>
              <div>
                <button className="pr-5">
                  <Pencil />
                </button>
                <button>
                  <Trash2 />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="flex flex-col items-center">
          <ReactPaginate
            className="flex items-center space-x-2 bg-white shadow-md rounded-lg p-4 border border-gray-300"
            nextLabel="Next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            marginPagesDisplayed={4}
            pageCount={5}
            previousLabel="< Previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
