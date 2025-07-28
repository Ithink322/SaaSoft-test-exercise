import { defineStore } from "pinia";

export interface Account {
  id: number;
  labels: { text: string }[];
  type: "Локальная" | "LDAP";
  login: string;
  password: string | null;
}

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount() {
      this.accounts.push({
        id: Date.now(),
        labels: [],
        type: "Локальная",
        login: "",
        password: "",
      });
    },
    updateAccount(updated: Account) {
      const index = this.accounts.findIndex((a) => a.id === updated.id);
      if (index !== -1) this.accounts[index] = updated;
    },
    deleteAccount(id: number) {
      this.accounts = this.accounts.filter((a) => a.id !== id);
    },
  },
  persist: true,
});
