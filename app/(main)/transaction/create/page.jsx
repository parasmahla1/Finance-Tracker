import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-violet-50/50 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-violet-950/20"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-700/50 mb-6">
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
               {editId ? "Update" : "New"} Transaction
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-title mb-4">
            {editId ? "Edit" : "Add"} Transaction
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {editId 
              ? "Update the details of your transaction to keep your records accurate."
              : "Keep track of your finances by adding income and expenses to your accounts."
            }
          </p>
        </div>
        
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl p-8 md:p-12">
          <AddTransactionForm
            accounts={accounts}
            categories={defaultCategories}
            editMode={!!editId}
            initialData={initialData} 
          />
        </div>
      </div>
    </div>
  );
}
