<template>
    <h1 class="text-center">Perfil de Usuario</h1>
    <a-row>

        <a-col :xs="{ span: 24 }" :sm="{ span: 12, offset: 6 }">

            <div class="text-center mb">
                <a-avatar :src="userStore.userData.photoURL" :size="125"></a-avatar>
            </div>

            <a-form name="basicPerfil" autocomplete="off" layout="vertical" :model="userStore.userData" @finish="onFinish">

                <!--Correo-->
                <a-form-item n ame="email" label="Correo" :rules="[{
                    required: true,
                    whitespace: true,
                    type: 'email',
                    message: 'Email',
                }]">
                    <a-input disabled v-model:value="userStore.userData.email"></a-input>
                </a-form-item>

                <!--Nickname-->
                <a-form-item name="displayName" label="Ingrese su Nickname" :rules="[{
                    required: true,
                    whitespace: true,
                    message: 'Ingresa un Nickname válido',
                }]">
                    <a-input v-model:value="userStore.userData.displayName"></a-input>
                </a-form-item>

                <!--Foto de Perfil-->
                <a-upload v-model:file-list="fileList" list-type="picture" :before-upload="beforeUpload" :max-count="1"
                    @change="handleChange">
                    <a-button>Subir Imágen</a-button>
                </a-upload>
                <!--Guardar Cambios-->
                <a-form-item class="mt">
                    <a-button type="primary" html-type="submit" :disabled="userStore.loadingUser"
                        :loading="userStore.loadingUser">Guardar Cambios
                    </a-button>
                </a-form-item>

            </a-form>

        </a-col>

    </a-row>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { message } from 'ant-design-vue';
import { ref } from 'vue';

const userStore = useUserStore();
const fileList = ref([])

const beforeUpload = (file) => {
    fileList.value = [...fileList.value, file];
    return false;
}

const handleRemove = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
}

const handleChange = (info) => {
    //Validar formato imagen
    if (info.file.status !== "uploading") {

        //console.log(info.file, fileList)

        const isJpgOrPng = info.file.type === "image/jpeg" || info.file.type === "image/png";

        if (!isJpgOrPng) {
            message.error('Subir imágenes en formato JPG o PNG')
            handleRemove(info.file);
            return;
        }

        const isLt2M = info.file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Tamaño max. 2 MB')
            handleRemove(info.file);
            return;
        }
    }

    //Sólo una imagen
    let resFileList = [...info.fileList];
    resFileList = resFileList.slice(-1);

    resFileList = resFileList.map(file => {
        if (file.response) {
            file.url = file.response.url;
        } return file
    })

    fileList.value = resFileList
}

const onFinish = async () => {
    console.log(fileList.value[0])
    const error = await userStore.updateUser(userStore.userData.displayName)

    if (fileList.value[0]) {
        const error = await userStore.updateImg(fileList.value[0])
        if (error) {
            return message.error("Error al subir la imagen")
        } message.success("Se actualizó tu imagen")
    }

    if (!error) {
        return message.success("Se actualizó su Nickname")
    }
    message.error("Error")
}
</script>