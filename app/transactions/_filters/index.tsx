"use client";

import {
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/app/_constants/transaction";
import TransactionTypeBadge from "../_components/type-badge";
import { TransactionType } from "@prisma/client";
import SelectFilter from "@/app/_components/_molecules/SelectFilter";
import { useAccounts } from "@/app/_contexts/AccountsContext";
import { AccountOption } from "@/app/_components/_molecules/SelectOptions";
import InputFilter from "@/app/_components/_molecules/InputFilter";
import TimeSelect from "@/app/_components/_molecules/TimeSelect";

const TransactionFilters = () => {
  const { accounts } = useAccounts();

  return (
    <div className="flex space-x-4">
      <InputFilter paramKey="name" placeholder="Nome" />

      <SelectFilter
        paramKey="type"
        options={TRANSACTION_TYPE_OPTIONS.map((option) => ({
          value: option.value,
          label: (
            <TransactionTypeBadge type={option.value as TransactionType} />
          ),
        }))}
        placeholder="Tipo"
      />

      <SelectFilter
        paramKey="paymentMethod"
        options={TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        placeholder="Método"
      />

      <SelectFilter
        paramKey="accountId"
        options={accounts.map((account) => ({
          value: account.id,
          label: <AccountOption name={account.name} bank={account.bank} />,
        }))}
        placeholder="Conta"
      />

      <TimeSelect />
    </div>
  );
};

export default TransactionFilters;
