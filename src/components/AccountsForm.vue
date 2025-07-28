<template>
  <v-container>
    <v-form @submit.prevent>
      <v-row justify="space-between">
        <v-col cols="auto">
          <h2>Учетные записи</h2>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" @click="addAccount">+</v-btn>
        </v-col>
      </v-row>

      <v-alert type="info" class="my-3">
        Для указания нескольких меток используйте разделитель ;
      </v-alert>

      <v-card v-for="account in accounts" :key="account.id" class="pa-3 my-2">
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="labelInput[account.id]"
              label="Метки"
              placeholder="Метка1; Метка2"
              maxlength="50"
              @blur="saveLabels(account)"
              @keyup.enter="$event.target.blur()"
              @input="onInputBlur($event)"
            />
          </v-col>
          <v-col cols="2">
            <v-select
              :items="['Локальная', 'LDAP']"
              v-model="account.type"
              label="Тип записи"
              @update:modelValue="updateAccount(account)"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="account.login"
              label="Логин"
              maxlength="100"
              :error="!account.login"
              @blur="updateAccount(account)"
              @keyup.enter="$event.target.blur()"
              @input="onInputBlur($event)"
            />
          </v-col>
          <v-col cols="3" v-if="account.type === 'Локальная'">
            <v-text-field
              v-model="account.password"
              label="Пароль"
              maxlength="100"
              :type="showPassword[account.id] ? 'text' : 'password'"
              :error="!account.password"
              @blur="updateAccount(account)"
              append-inner-icon="mdi-eye"
              @click:append-inner="togglePassword(account.id)"
              @keyup.enter="$event.target.blur()"
              @input="onInputBlur($event)"
            />
          </v-col>
          <v-col cols="1" class="d-flex align-center">
            <v-btn
              icon="mdi-delete"
              color="error"
              @click="deleteAccount(account.id)"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { useAccountsStore, type Account } from "@/store/accounts";
import { storeToRefs } from "pinia";

const store = useAccountsStore();
const { accounts } = storeToRefs(store);

const labelInput = reactive<{ [key: number]: string }>({});
const showPassword = reactive<{ [key: number]: boolean }>({});

onMounted(() => {
  accounts.value.forEach((acc) => {
    labelInput[acc.id] = acc.labels.map((l) => l.text).join("; ");
    showPassword[acc.id] = false;
  });
});

const addAccount = () => {
  store.addAccount();
};

const saveLabels = (account: Account) => {
  account.labels = labelInput[account.id]
    .split(";")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => ({ text: l }));
  store.updateAccount(account);
};

const updateAccount = (account: Account) => {
  if (!account.login) return;
  if (account.type === "Локальная" && !account.password) return;
  store.updateAccount(account);
};

const deleteAccount = (id: number) => {
  store.deleteAccount(id);
};

const togglePassword = (id: number) => {
  showPassword[id] = !showPassword[id];
};

let typingTimer: number | undefined;

const onInputBlur = (e: Event) => {
  clearTimeout(typingTimer);
  typingTimer = window.setTimeout(() => {
    (e.target as HTMLInputElement).blur();
  }, 800);
};
</script>
