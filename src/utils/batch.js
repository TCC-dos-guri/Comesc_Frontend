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