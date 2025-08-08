import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { bankingService } from "../services/bankingService";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import type { Account } from "../types/Banking";

const Deposit: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    const accountParam = searchParams.get("account");
    if (accountParam && accounts.length > 0) {
      setSelectedAccount(accountParam);
    } else if (accounts.length > 0) {
      setSelectedAccount(accounts[0].accountNumber);
    }
  }, [accounts, searchParams]);

  const loadAccounts = async () => {
    try {
      const userAccounts = await bankingService.getAccounts();
      setAccounts(userAccounts);
    } catch (err) {
      setError("Failed to load accounts");
      console.error("Error loading accounts:", err);
    }
  };

  const validateForm = (): boolean => {
    if (!selectedAccount) {
      setError("Please select an account");
      return false;
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return false;
    }

    if (numAmount > 1000000) {
      setError("Deposit amount cannot exceed $1,000,000");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const numAmount = parseFloat(amount);
      const response = await bankingService.deposit(numAmount);

      setSuccess(
        `Successfully deposited ${bankingService.formatCurrency(
          numAmount
        )}. New balance: ${bankingService.formatCurrency(
          response.accountFromBalance
        )}`
      );
      setAmount("");

      // Reload accounts to get updated balances
      await loadAccounts();
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string }; status?: number };
      };
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to process deposit. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedAccountData = accounts.find(
    (acc) => acc.accountNumber === selectedAccount
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="mr-4"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Deposit Money
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card title="Make a Deposit" subtitle="Add money to your account">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Account
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {accounts.map((account) => (
                    <option
                      key={account.accountNumber}
                      value={account.accountNumber}
                    >
                      {bankingService.formatAccountNumber(
                        account.accountNumber
                      )}{" "}
                      - {bankingService.formatCurrency(account.balance)}
                    </option>
                  ))}
                </select>
                {selectedAccountData && (
                  <p className="mt-1 text-sm text-gray-500">
                    Current balance:{" "}
                    {bankingService.formatCurrency(selectedAccountData.balance)}
                  </p>
                )}
              </div>

              {/* Amount Input */}
              <Input
                label="Deposit Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                leftIcon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                }
                step="0.01"
                min="0.01"
                max="1000000"
                required
              />

              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Amounts
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 25, 50, 100, 250, 500].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount.toString())}
                      className="justify-center"
                    >
                      ${quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
                disabled={!selectedAccount || !amount}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                Deposit Money
              </Button>
            </form>
          </Card>

          {/* Information Card */}
          <Card title="Deposit Information" className="mt-6">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <svg
                  className="w-4 h-4 mr-2 mt-0.5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Deposits are processed immediately and reflected in your
                  account balance.
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  className="w-4 h-4 mr-2 mt-0.5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Maximum deposit amount is $1,000,000 per transaction.
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  className="w-4 h-4 mr-2 mt-0.5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  All deposits are secure and encrypted for your protection.
                </span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Deposit;
