<template>
  <div>
    <h1>Home</h1>
    <p>{{ userStore.userData?.email }}</p>

    <add-form>
    </add-form>

    <p v-if="databaseStore.loadingDoc">Cargando documentos...</p>

    <a-space direction="vertical" style="width: 100%" v-if="!databaseStore.loadingDoc">
      <a-card v-for="item of databaseStore.documents" :key="item.id" :title="item.short">

        <template #extra>

          <a-space>
            <a-button @click="router.push(`/editar/${item.id}`)">Editar</a-button>

            <a-popconfirm title="¿Estás seguro que deseas eliminar la URL?" ok-text="Sí" cancel-text="No"
              @confirm="confirm(item.id)" @cancel="cancel">
              <a-button danger :loading="databaseStore.loading" :disabled="databaseStore.loading">Eliminar</a-button>
            </a-popconfirm>
          </a-space>

        </template>

        <p>{{ item.name }}</p>

      </a-card>

    </a-space>

  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useDatabaseStore } from '../stores/database';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const userStore = useUserStore()
const databaseStore = useDatabaseStore()
const router = useRouter()

databaseStore.getUrls()

const confirm = async (id) => {
    const error = await databaseStore.deleteUrl(id);
    if (!error) return message.success("Eliminado");
    return message.error(error);
};

const cancel = () => {
  message.error('Operación cancelada')
}
</script>