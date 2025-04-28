import React, { useEffect, useState } from "react";
import { Transaction } from "../types/finance.ts";
import apiClient from "../api/axiosConfig.ts";
import { Alert, Container, Spinner, Table } from "react-bootstrap";
import axios from "axios";

export const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorState(null);
      try {
        const response = await apiClient.get<Transaction[]>("/transactions");
        setTransactions(response.data);
        console.log("Fetched transactions:", response.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        let errorMessage = "Failed to fetch transactions.";

        if (axios.isAxiosError(err)) {
          if (err.response) {
            errorMessage = `Error ${err.response.data}: ${JSON.stringify(err.response.data)}`;
          } else if (err.request) {
            errorMessage = "No response received from server.";
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setErrorState(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Container className={"text-center mt-5"}>
        <Spinner animation={"border"} role={"status"}>
          <span className={"visually-hidden"}>Loading...</span>
        </Spinner>
        <p>Loading Transactions...</p>
      </Container>
    );
  }

  if (errorState) {
    return (
      <Container className={"mt-3"}>
        <Alert variant={"danger"}>
          Error loading transactions: {errorState}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className={"mt-3"}>
      <h3>Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <Table striped bordered hover responsive size={"sm"}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Payee/Payer</th>
              <th>Category</th>
              <th>Account</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                {/* TODO: format date - consider using a library like date-fns or moment */}
                <td>{new Date(tx.date_time).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td>{tx.payee_payer}</td>
                <td>{tx.category || "N/A"}</td>
                <td>{tx.account}</td>
                {/* TODO: Consider currency formatting */}
                <td
                  style={{
                    color:
                      tx.transaction_type === "INCOME"
                        ? "green"
                        : tx.transaction_type === "EXPENSE"
                          ? "red"
                          : "inherit",
                  }}
                >
                  {tx.amount}
                </td>
                <td>{tx.transaction_type}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};
