import { ref } from "vue"
export const selectStatusIcon = (status) => {
        switch (status) {
            case 'pendente':
                return 'mdi mdi-timer-sand'
            case 'em estoque':
                return 'mdi mdi-check-circle'
            case 'com defeito':
                return 'mdi mdi mdi-alert'
            case 'em transporte':
                return 'mdi mdi-truck-fast'
                
        }
    }

export const options = ref([
    {name: 'Lotes Pendentes', value: 'pendentes'},
    {name: 'Em Estoque', value: 'em estoque'},
    {name: 'Com Defeito', value: 'com defeito'},
    {name: 'Em Transporte', value: 'em transporte'}
])